
import requests
import json


MODEL = "gemini-3.8-flash"

URL = (
    f"https://generativelanguage.googleapis.com/v1beta/"
    f"models/{MODEL}:generateContent"
)


def get_suggestions(api_key, income, expenses):

    if not api_key:
        return {"success": False, "error": "API key is missing"}

    if not isinstance(expenses, dict) or not expenses:
        return {"success": False, "error": "Invalid expense data"}

    if not isinstance(income, (int, float)) or income < 0:
        return {"success": False, "error": "Invalid income"}

    prompt = f"""
    You are an AI financial budgeting assistant.

    Monthly income: Rs. {income}

    Monthly expenses:
    {json.dumps(expenses, indent=2)}

    Provide:
    1. Spending analysis.
    2. Areas where money can be saved.
    3. Practical budgeting suggestions.
    4. A realistic monthly savings target.

    Use simple language and realistic suggestions.
    Do not invent missing financial information.
    """

    headers = {
        "Content-Type": "application/json",
        "x-goog-api-key": api_key
    }

    body = {
        "contents": [
            {
                "parts": [
                    {"text": prompt}
                ]
            }
        ]
    }

    try:
        response = requests.post(
            URL,
            headers=headers,
            json=body,
            timeout=120
        )

        response.raise_for_status()

        data = response.json()

        suggestions = data["candidates"][0]["content"]["parts"][0]["text"]

        return {
            "success": True,
            "suggestions": suggestions
        }

    except requests.exceptions.Timeout:
        return {
            "success": False,
            "error": "Gemini took too long to respond. Please try again."
        }

    except requests.exceptions.HTTPError:
        return {
            "success": False,
            "error": f"API error {response.status_code}: {response.text}"
        }

    except requests.exceptions.RequestException as error:
        return {
            "success": False,
            "error": f"Connection error: {error}"
        }

    except (KeyError, IndexError, TypeError, ValueError):
        return {
            "success": False,
            "error": "Could not process Gemini's response"
        }


from groq import Groq

client = Groq(api_key="api")

response = client.chat.completions.create(
    model="openai/gpt-oss-20b",
    messages=[
        {
            "role": "user",
            "content": "Explain Python functions simply."
        }
    ]
)

print(response.choices[0].message.content)