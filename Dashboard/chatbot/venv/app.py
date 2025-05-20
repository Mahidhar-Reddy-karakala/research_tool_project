from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import requests
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
CORS(app)

API_KEY = os.getenv("GEMINI_API_KEY")
GEMINI_URL = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key={API_KEY}"

@app.route("/chat", methods=["POST"])
def chat():
    try:
        user_message = request.json.get("message")
        print("User message received:", user_message)

        if not user_message:
            return jsonify({"reply": "No message received."}), 400

        payload = {
            "contents": [
                {
                    "role": "user",
                    "parts": [
                        {
                            "text": (
                                f"You are a financial AI assistant. Format your response in Markdown. "
                                f"User query: {user_message}"
                            )
                        }
                    ]
                }
            ]
        }

        response = requests.post(GEMINI_URL, json=payload, timeout=10)

        response.raise_for_status()
        data = response.json()
        ai_message = data["candidates"][0]["content"]["parts"][0]["text"]

        return jsonify({"reply": ai_message})

    except requests.exceptions.RequestException as req_err:
        print("Request error:", req_err)
        return jsonify({"reply": "Failed to contact Gemini API."}), 502

    except Exception as e:
        print("Server error:", e)
        return jsonify({"reply": "Something went wrong on the server."}), 500

if __name__ == "__main__":
    app.run(debug=True, port=8000)
