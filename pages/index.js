import { useState } from "react";

export default function Home() {
  const [blogText, setBlogText] = useState("");
  const [paragraphs, setParagraphs] = useState([]);
  const [responses, setResponses] = useState([]);
  const [index, setIndex] = useState(0);
  const [started, setStarted] = useState(false);

  const handleStart = () => {
    const words = blogText.trim().split(/\s+/);
    if (words.length > 2000) {
      alert("Please limit your input to 2000 words.");
      return;
    }

    const splitParas = blogText
      .split(/\n\s*\n/) // splits on blank lines
      .map(p => p.trim())
      .filter(p => p.length > 0);

    setParagraphs(splitParas);
    setResponses(Array(splitParas.length).fill(""));
    setStarted(true);
  };

  const handleChange = (e) => {
    const updated = [...responses];
    updated[index] = e.target.value;
    setResponses(updated);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(responses[index] || "");
    alert("Copied!");
  };

  const nextParagraph = () => {
    if (index < paragraphs.length - 1) setIndex(index + 1);
  };

  const prevParagraph = () => {
    if (index > 0) setIndex(index - 1);
  };

  if (!started) {
    return (
      <div style={{ maxWidth: "700px", margin: "40px auto", padding: "20px", fontFamily: "sans-serif" }}>
        <h2>Paste Your Blog (max 2000 words)</h2>
        <textarea
          rows={15}
          value={blogText}
          onChange={(e) => setBlogText(e.target.value)}
          placeholder="Paste your full blog here..."
          style={{ width: "100%", padding: "10px", fontSize: "16px", borderRadius: "8px", border: "1px solid #ccc" }}
        />
        <button onClick={handleStart} style={{ marginTop: "20px", padding: "10px 20px" }}>Start Writing</button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: "700px", margin: "40px auto", padding: "20px", fontFamily: "sans-serif" }}>
      <div style={{ border: "1px solid #ddd", padding: "20px", borderRadius: "8px", marginBottom: "20px" }}>
        <h3>Reference Paragraph</h3>
        <p>{paragraphs[index]}</p>
      </div>

      <textarea
        rows={8}
        value={responses[index]}
        onChange={handleChange}
        placeholder="Write your version here..."
        style={{ width: "100%", padding: "10px", fontSize: "16px", borderRadius: "8px", border: "1px solid #ccc" }}
      />

      <div style={{ marginTop: "10px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <button onClick={prevParagraph} disabled={index === 0}>← Previous</button>
        <span>Paragraph {index + 1} of {paragraphs.length}</span>
        <button onClick={nextParagraph} disabled={index === paragraphs.length - 1}>Next →</button>
      </div>

      <button onClick={copyToClipboard} style={{ marginTop: "20px", padding: "10px 20px" }}>
        📋 Copy My Version
      </button>
    </div>
  );
}
