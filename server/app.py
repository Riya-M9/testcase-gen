from flask import Flask, request, jsonify
from flask_cors import CORS
import requests

app = Flask(__name__)
CORS(app)  # Allow React frontend to connect to this backend

# This route receives code and description from frontend and uses Ollama to generate test cases
@app.route("/generate-testcases", methods=["POST"])
def generate_testcases():
    try:
        # Get the JSON data sent from frontend
        data = request.get_json()
        code = data.get("code", "")
        description = data.get("description", "")

        # Basic input validation (optional, but helpful)
        if not code or not description:
            return jsonify({"error": "Missing code or description"}), 400

        # Build a prompt for Ollama (you can tweak this)
        prompt = f"Given the following code:\n{code}\n\nAnd the description:\n{description}\n\nGenerate relevant test cases."

        # Send the prompt to your local Ollama server
        ollama_response = requests.post(
            "http://localhost:11434/api/generate",
            json={"model": "llama3", "prompt": prompt, "stream": False}
        )

        # Parse response and return to frontend
        result = ollama_response.json()
        output = result.get("response", "No response from model.")

        return jsonify({"output": output})

    except Exception as e:
        # Return error if anything fails
        return jsonify({"error": str(e)}), 500

# Run the app on port 5000
if __name__ == "__main__":
    app.run(debug=True)
