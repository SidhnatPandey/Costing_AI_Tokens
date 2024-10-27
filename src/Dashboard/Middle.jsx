import React, { useState } from "react";
import axios from "axios";
import "./Middle.css";

const Middle = () => {
  const [promptValue, setPromptValue] = useState("");
  const [geminiTokens, setgeminiTokens] = useState("");
  const [cost, setCost] = useState(0);


  const handleChange = (e) => {
    setPromptValue(e.target.value);
  };

  const generateGeminiToken = async () => {
    try {
      const key = process.env.REACT_APP_API_KEY;
      const response = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${key}`,
        {
          contents: [
            {
              parts: [
                {
                  text: promptValue,
                },
              ],
            },
          ],
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const tokens = response?.data?.usageMetadata?.totalTokenCount;
      setgeminiTokens(tokens);
      setCost((tokens*0.00035)/1000)
      
    } catch (error) {
      console.error(
        "Error making API request:",
        error.response?.data || error.message
      );
    }
  };

  return (
    <div className="middle-container">
      <div className="input-container">
        <input
          type="text"
          id="input-box"
          className="input-box"
          placeholder="Input your prompt"
          value={promptValue}
          onChange={handleChange}
          required
        />
        <button className="generate-button" onClick={generateGeminiToken}>
          Generate
        </button>
      </div>
      {geminiTokens && (
        <div className="results-container">
          <div className="result-row">
            <span className="label">Gemini Tokens:</span>
            <span className="value">{geminiTokens}</span>
          </div>
          <div className="result-row">
            <span className="label">Cost:</span>
            <span className="value">{`${cost}$`}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default Middle;
