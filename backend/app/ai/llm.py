import json
import re
from groq import Groq, BadRequestError
from sqlalchemy.orm import Session
from app.core.config import settings
from app.ai.prompts import SYSTEM_PROMPT
from app.ai import tools as tool_functions

client = Groq(api_key=settings.GROQ_API_KEY)

TOOLS = [
    {
        "type": "function",
        "function": {
            "name": "search_events",
            "description": "Search for events by category and/or location. Only pass parameters you actually have values for.",
            "parameters": {
                "type": "object",
                "properties": {
                    "category": {"type": "string", "description": "Event category, e.g. Music, Sports"},
                    "location": {"type": "string", "description": "City or location"}
                }
            }
        }
    },
    {
        "type": "function",
        "function": {
            "name": "get_event_details",
            "description": "Get full details of a specific event by its ID",
            "parameters": {
                "type": "object",
                "properties": {
                    "event_id": {"type": "integer", "description": "The event ID"}
                },
                "required": ["event_id"]
            }
        }
    },
    {
        "type": "function",
        "function": {
            "name": "get_my_bookings",
            "description": "Get the current user's booking history",
            "parameters": {"type": "object", "properties": {}}
        }
    }
]

def run_tool(tool_name: str, tool_input: dict, db: Session, user_id: int):
    tool_input = tool_input or {}
    if tool_name == "search_events":
        category = tool_input.get("category") or None
        location = tool_input.get("location") or None
        return tool_functions.search_events(db, category, location)
    elif tool_name == "get_event_details":
        return tool_functions.get_event_details(db, tool_input.get("event_id"))
    elif tool_name == "get_my_bookings":
        return tool_functions.get_my_bookings(db, user_id)
    return "Unknown tool"

def parse_malformed_function_call(text: str):
    """Parses Groq/Llama's malformed <function=name{...}</function> format as fallback."""
    match = re.search(r'<function=(\w+)\s*(\{.*?\})\s*</function>', text)
    if not match:
        return None, None
    func_name = match.group(1)
    try:
        func_args = json.loads(match.group(2))
    except json.JSONDecodeError:
        func_args = {}
    return func_name, func_args

def chat_with_bot(db: Session, user_id: int, user_message: str):
    messages = [
        {"role": "system", "content": SYSTEM_PROMPT},
        {"role": "user", "content": user_message}
    ]

    for _ in range(5):
        try:
            response = client.chat.completions.create(
                model="llama-3.3-70b-versatile",
                messages=messages,
                tools=TOOLS,
                max_tokens=1024,
                temperature=0
            )
        except BadRequestError as e:
            error_body = e.body if hasattr(e, "body") else {}
            failed_gen = error_body.get("error", {}).get("failed_generation", "") if isinstance(error_body, dict) else ""

            tool_name, tool_input = parse_malformed_function_call(failed_gen)
            if tool_name:
                result = run_tool(tool_name, tool_input, db, user_id)

                # Feed the tool result back to the model as plain context, no tools this time,
                # so it replies in natural language instead of us returning raw JSON.
                messages.append({"role": "assistant", "content": failed_gen})
                messages.append({
                    "role": "user",
                    "content": f"[Tool result for {tool_name}]: {json.dumps(result) if not isinstance(result, str) else result}\n\nPlease answer my original question using this data, in a friendly conversational way."
                })

                try:
                    followup = client.chat.completions.create(
                        model="llama-3.3-70b-versatile",
                        messages=messages,
                        max_tokens=1024,
                        temperature=0
                    )
                    return followup.choices[0].message.content
                except BadRequestError:
                    return f"{result}" if isinstance(result, str) else json.dumps(result)

            print(f"Groq API Error: {e}")
            return "Sorry, I had trouble understanding that. Could you rephrase your question?"

        reply_message = response.choices[0].message

        if not reply_message.tool_calls:
            return reply_message.content

        messages.append(reply_message)

        for tool_call in reply_message.tool_calls:
            tool_name = tool_call.function.name
            try:
                tool_input = json.loads(tool_call.function.arguments)
            except json.JSONDecodeError:
                tool_input = {}
            result = run_tool(tool_name, tool_input, db, user_id)

            messages.append({
                "role": "tool",
                "tool_call_id": tool_call.id,
                "content": str(result)
            })

        try:
            response = client.chat.completions.create(
                model="llama-3.3-70b-versatile",
                messages=messages,
                tools=TOOLS,
                max_tokens=1024,
                temperature=0
            )
        except BadRequestError:
            return "Sorry, I had trouble processing that. Could you try again?"

        reply_message = response.choices[0].message

    return "Sorry, I couldn't process that request."
    messages = [
        {"role": "system", "content": SYSTEM_PROMPT},
        {"role": "user", "content": user_message}
    ]

    for _ in range(5):
        try:
            response = client.chat.completions.create(
                model="llama-3.3-70b-versatile",
                messages=messages,
                tools=TOOLS,
                max_tokens=1024,
                temperature=0
            )
        except BadRequestError as e:
            error_body = e.body if hasattr(e, "body") else {}
            failed_gen = error_body.get("error", {}).get("failed_generation", "") if isinstance(error_body, dict) else ""

            tool_name, tool_input = parse_malformed_function_call(failed_gen)
            if tool_name:
                result = run_tool(tool_name, tool_input, db, user_id)
                return f"{result}" if isinstance(result, str) else json.dumps(result)

            print(f"Groq API Error: {e}")
            return "Sorry, I had trouble understanding that. Could you rephrase your question?"

        reply_message = response.choices[0].message

        if not reply_message.tool_calls:
            return reply_message.content

        messages.append(reply_message)

        for tool_call in reply_message.tool_calls:
            tool_name = tool_call.function.name
            try:
                tool_input = json.loads(tool_call.function.arguments)
            except json.JSONDecodeError:
                tool_input = {}
            result = run_tool(tool_name, tool_input, db, user_id)

            messages.append({
                "role": "tool",
                "tool_call_id": tool_call.id,
                "content": str(result)
            })

    return "Sorry, I couldn't process that request."