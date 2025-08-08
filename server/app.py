# Importing required libraries
from flask import Flask, request, jsonify
from flask_cors import CORS
import requests

# Creating the Flask app
app = Flask(__name__)
CORS(app)  # Enabling CORS so the frontend can call this API

# Endpoint to receive code and return test cases
@app.route('/generate-test-cases', methods=['POST'])
def generate_test_cases():
    data = request.get_json()

    # Extracting code and language from the request body
    code = data.get('code')
    language = data.get('language')

    if not code or not language:
        return jsonify({'error': 'Code or language missing'}), 400

    # Constructing the prompt for the local AI model (Ollama)
    prompt = f"Generate some useful and minimal test cases for the following {language} function:\n\n{code}"

    # Sending the prompt to the Ollama API running locally
    try:
        ollama_response = requests.post(
            'http://localhost:11434/api/generate',
            json={
                "model": "codellama",
                "prompt": prompt,
                "stream": False  # We want the full output, not chunks
            }
        )

        if ollama_response.status_code == 200:
            response_json = ollama_response.json()
            return jsonify({'testCases': response_json.get('response', 'No response received')})
        else:
            return jsonify({'error': 'Failed to get response from Ollama'}), 500

    except Exception as e:
        print("Exception while generating test cases:", e)
        return jsonify({'error': 'Something went wrong while calling Ollama'}), 500

# Starting the Flask server
if __name__ == '__main__':
    app.run(debug=True)
