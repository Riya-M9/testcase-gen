import openai

   # Set your OpenAI API key
openai.api_key = 'YOUR_API_KEY'

@app.route('/api/generate_test_cases', methods=['POST'])
def generate_test_cases():
    files = request.json['files']
    # Generate test cases using OpenAI
    test_case_summaries = []
    for file in files:
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "user", "content": f"Generate test cases for the following code: {file}"}
            ]
        )
        test_case_summaries.append(response['choices'][0]['message']['content'])
    return jsonify(test_case_summaries)
   