import React, { useState } from "react";
import "./App.css";

function App() {
  // State hooks for input fields and output
  const [code, setCode] = useState("");
  const [description, setDescription] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(true); // for theme toggle

  // Function to handle button click and send data to backend
  const generateTestCases = async () => {
    setLoading(true);  // Show loading state
    setOutput("");     // Clear previous output

    try {
      const response = await fetch("http://localhost:5000/generate-testcases", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ code, description })
      });

      const data = await response.json();

      if (data.output) {
        setOutput(data.output);
      } else {
        setOutput("Error: " + (data.error || "No output received"));
      }
    } catch (error) {
      setOutput("Fetch Error: " + error.message);
    } finally {
      setLoading(false);  // Done loading
    }
  };

  return (
    <div className={darkMode ? "app dark" : "app light"}>
      <h1>Test Case Generator</h1>

      <textarea
        placeholder="Paste your code here..."
        value={code}
        onChange={(e) => setCode(e.target.value)}
      />

      <textarea
        placeholder="Write a brief description of the function or code..."
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <button onClick={generateTestCases} disabled={loading}>
        {loading ? "Generating..." : "Generate Test Cases"}
      </button>

      <button onClick={() => setDarkMode(!darkMode)} className="toggle-btn">
        Switch to {darkMode ? "Light" : "Dark"} Mode
      </button>

      <pre className="output-box">{output}</pre>
    </div>
  );
}

export default App;
