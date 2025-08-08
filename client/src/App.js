// App.js
import React, { useState } from "react";
import "./App.css";

function App() {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [language, setLanguage] = useState("JavaScript");
  const [code, setCode] = useState("");
  const [output, setOutput] = useState("");

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    document.body.className = isDarkMode ? "light-mode" : "dark-mode";
  };

  const handleLanguageChange = (e) => {
    setLanguage(e.target.value);
  };

  const handleCodeChange = (e) => {
    setCode(e.target.value);
  };

  const generateTestCases = async () => {
    try {
      const response = await fetch("http://localhost:5000/generate-testcases", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, language }),
      });

      const data = await response.json();
      setOutput(data.test_cases || "No output received.");
    } catch (err) {
      setOutput("Error: " + err.message);
    }
  };

  return (
    <div className="App">
      <h1>🧪 Offline Test Case Generator</h1>

      <div className="top-bar">
        <div className="language-selector">
          <label>Choose Language:</label>
          <select value={language} onChange={handleLanguageChange}>
            <option value="JavaScript">JavaScript</option>
            <option value="Python">Python</option>
            <option value="Java">Java</option>
          </select>
        </div>

        <button className="toggle-mode" onClick={toggleTheme}>
          {isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
        </button>
      </div>

      <textarea
        placeholder="Paste your function code here..."
        value={code}
        onChange={handleCodeChange}
      />

      <button onClick={generateTestCases}>Generate Test Cases</button>

      <div className="output">
        <h3>Generated Test Cases:</h3>
        <pre>{output}</pre>
      </div>
    </div>
  );
}

export default App;
