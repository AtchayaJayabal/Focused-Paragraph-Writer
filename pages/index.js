import { useState } from "react";
import { saveAs } from "file-saver";
import { Document, Packer, Paragraph } from "docx";

export default function Home() {
  const [blogText, setBlogText] = useState("");
  const [paragraphs, setParagraphs] = useState([]);
  const [responses, setResponses] = useState([]);
  const [index, setIndex] = useState(0);
  const [started, setStarted] = useState(false);
  const [fullOutput, setFullOutput] = useState([]);

  const handleStart = () => {
    const words = blogText.trim().split(/\s+/);
    if (words.length > 2000) {
      alert("Please limit your input to 2000 words.");
      return;
    }

    const splitParas = blogText
      .split(/\n\s*\n/)
      .map(p => p.trim())
      .filter(p => p.length > 0);

    setParagraphs(splitParas);
    setResponses(Array(splitParas.length).fill(""));
    setFullOutput([]);
    setStarted(true);
  };

  const handleChange = (e) => {
    const updated = [...responses];
    updated[index] = e.target.value;
    setResponses(updated);
  };

  const copyToClipboard = () => {
    const currentText = responses[index] || "";
    navigator.clipboard.writeText(currentText);
    alert("Copied!");

    const updatedOutput = [...fullOutput];
    updatedOutput[index] = currentText;
    setFullOutput(updatedOutput);
  };

  const copyAllToClipboard = () => {
    const full = fullOutput.filter(r => r?.trim() !== "").join("\n\n");
    navigator.clipboard.writeText(full);
    alert("Entire blog copied!");
  };

  const downloadAsTxt = () => {
    const full = fullOutput.filter(r => r?.trim() !== "").join("\n\n");
    const blob = new Blob([full], { type: "text/plain;charset=utf-8" });
    saveAs(blob, "my_rewritten_blog.txt");
  };

  const downloadAsDocx = async () => {
    const doc = new Document({
      sections: [
        {
          children: fullOutput
            .filter(r => r?.trim() !== "")
            .map(p => new Paragraph(p)),
        },
      ],
    });

    const blob = await Packer.toBlob(doc);
    saveAs(blob, "my_rewritten_blog.docx");
  };

  const nextParagraph = () => {
    if (index < paragraphs.length - 1) setIndex(index + 1);
  };

  const prevParagraph = () => {
    if (index > 0) setIndex(index - 1);
  };

  if (!started) {
    return (
      <div style={{ maxWidth: "700px", margin: "40px auto", padding: "20px", fontFamily: "Arial" }}>
        <h2>Paste Your Blog (max 2000 words)</h2>
        <textarea
          rows={15}
          value={blogText}
          onChange={(e) => setBlogText(e.target.value)}
          placeholder="Paste your full blog here..."
          style={{
            width: "100%",
            padding: "10px",
            fontSize: "16px",
            lineHeight: "1.6",
            borderRadius: "8px",
            border: "1px solid #ccc",
            fontFamily: "Arial",
          }}
        />
        <button onClick={handleStart} style={{ marginTop: "20px", padding: "10px 20px" }}>Start Writing</button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: "700px", margin: "40px auto", padding: "20px", fontFamily: "Arial" }}>
      <div style={{ border: "1px solid #ddd", padding: "20px", borderRadius: "8px", marginBottom: "20px" }}>
        <h3>Reference Paragraph</h3>
        <div
          style={{ whiteSpace: "pre-wrap", fontFamily: "Arial", lineHeight: "1.6" }}
          dangerouslySetInnerHTML={{ __html: paragraphs[index].replace(/\n/g, "<br />") }}
        />
      </div>

      <textarea
        rows={8}
        value={responses[index]}
        onChange={handleChange}
        placeholder="Write your version here..."
        style={{
          width: "100%",
          padding: "10px",
          fontSize: "16px",
          lineHeight: "1.6",
          borderRadius: "8px",
          border: "1px solid #ccc",
          fontFamily: "Arial",
        }}
      />

      <div style={{ marginTop: "10px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <button onClick={prevParagraph} disabled={index === 0}>← Previous</button>
        <span>Paragraph {index + 1} of {paragraphs.length}</span>
        <button onClick={nextParagraph} disabled={index === paragraphs.length - 1}>Next →</button>
      </div>

      {/* Pagination Buttons */}
      <div style={{ marginTop: "20px", display: "flex", flexWrap: "wrap", gap: "8px", justifyContent: "center" }}>
        {paragraphs.map((_, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            style={{
              padding: "6px 10px",
              backgroundColor: index === i ? "#007bff" : "#f0f0f0",
              color: index === i ? "#fff" : "#333",
              border: "1px solid #ccc",
              borderRadius: "4px",
              cursor: "pointer",
              minWidth: "32px",
            }}
          >
            {i + 1}
          </button>
        ))}
      </div>

      <button onClick={copyToClipboard} style={{ marginTop: "20px", padding: "10px 20px" }}>
        📋 Copy My Version
      </button>

      <div style={{ marginTop: "40px" }}>
        <h4>🧾 Final Blog Tools</h4>
        <button onClick={copyAllToClipboard} style={{ marginRight: "10px" }}>📄 Copy Entire Blog</button>
        <button onClick={downloadAsTxt} style={{ marginRight: "10px" }}>⬇️ Download as .txt</button>
        <button onClick={downloadAsDocx}>⬇️ Download as .docx</button>
      </div>

      <div style={{ marginTop: "40px", padding: "20px", border: "1px solid #aaa", borderRadius: "10px", background: "#f9f9f9" }}>
        <h4>📝 Full Rewritten Output</h4>
        <div style={{ whiteSpace: "pre-wrap", fontFamily: "Arial", lineHeight: "1.6" }}>
          {fullOutput.map((p, i) =>
            p?.trim() !== "" ? <p key={i}>{p}</p> : null
          )}
        </div>
      </div>
    </div>
  );
}
