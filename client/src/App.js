import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [files, setFiles] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [testCases, setTestCases] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);

  // Toggle dark/light mode
  const toggleDarkMode = () => setDarkMode(!darkMode);

  // Fetch GitHub files from backend
  const fetchFiles = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/github/files');
      setFiles(response.data);
    } catch (error) {
      console.error("Error fetching files:", error);
    }
  };

  // Generate test cases via AI
  const generateTestCases = async () => {
    if (selectedFiles.length === 0) return;
    setIsGenerating(true);
    try {
      const response = await axios.post('http://localhost:5000/api/generate_test_cases', {
        files: selectedFiles.map(file => file.name)
      });
      setTestCases(response.data);
    } catch (error) {
      console.error("AI generation failed:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  // Toggle file selection
  const toggleFileSelection = (file) => {
    setSelectedFiles(prev => 
      prev.some(f => f.id === file.id) 
        ? prev.filter(f => f.id !== file.id) 
        : [...prev, file]
    );
  };

  useEffect(() => { fetchFiles(); }, []);

  return (
    <div className={`App ${darkMode ? 'dark' : ''}`}>
      <header className="App-header">
        <h1>Test Case Generator</h1>
        <button onClick={toggleDarkMode} className="mode-toggle">
          {darkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}
        </button>

        <div className="file-explorer">
          <h2>Select GitHub Files</h2>
          <ul>
            {files.map(file => (
              <li 
                key={file.id} 
                className={selectedFiles.some(f => f.id === file.id) ? 'selected' : ''}
                onClick={() => toggleFileSelection(file)}
              >
                📄 {file.name}
              </li>
            ))}
          </ul>
          <button 
            onClick={generateTestCases} 
            disabled={selectedFiles.length === 0 || isGenerating}
          >
            {isGenerating ? 'Generating...' : 'Generate Test Cases'}
          </button>
        </div>

        {testCases.length > 0 && (
          <div className="test-case-results">
            <h2>Generated Test Cases</h2>
            {testCases.map((testCase, index) => (
              <div key={index} className="test-case">
                <pre>{testCase}</pre>
              </div>
            ))}
          </div>
        )}
      </header>
    </div>
  );
}

export default App;
