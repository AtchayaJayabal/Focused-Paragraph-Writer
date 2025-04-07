import { useState, useEffect } from "react";
import { saveAs } from "file-saver";
import { Document, Packer, Paragraph, TextRun } from "docx";

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
    setFullOutput(Array(splitParas.length).fill(""));
    setStarted(true);
  };

  const handleChange = (e) => {
    const updated = [...responses];
    updated[index] = e.target.value;
    setResponses(updated);
  };

  const copyToClipboard = () => {
    const text = responses[index] || "";
    navigator.clipboard.writeText(text);
    alert("Copied current paragraph!");

    const updatedOutput = [...fullOutput];
    updatedOutput[index] = text;
    setFullOutput(updatedOutput);
  };

  const copyAllToClipboard = () => {
    const full = fullOutput.filter(r => r.trim() !== "").join("\n\n");
    navigator.clipboard.writeText(full);
    alert("Entire blog copied!");
  };

  const downloadAsTxt = () => {
    const full = fullOutput.filter(r => r.trim() !== "").join("\n\n");
    const blob = new Blob([full], { type: "text/plain;charset=utf-8" });
    saveAs(blob, "my_rewritten_blog.txt");
  };

  const downloadAsDocx = async () => {
    const doc = new Document({
      sections: [
        {
          children: fullOutput
            .filter(r => r.trim() !== "")
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

  const sharedStyles = {
    fontFamily: "Arial, sans-serif",
    lineHeight: "1.6",
  };

  if (!started) {
    return (
      <div style={{ ...sharedStyles, maxWidth: "700px", margin: "40px auto", padding: "20px" }}>
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
    <div style={{ ...sharedStyles, maxWidth: "800px", margin: "40px auto", padding: "20px" }}>
      <div style={{ border: "1px solid #ddd", padding: "20px", borderRadius: "8px", marginBottom: "20px" }}>
        <h3>Reference Paragraph</h3>
        <div
          dangerouslySetInnerHTML={{ __html: paragraphs[index].replace(/\n/g, "<br/>") }}
          style={{ whiteSpace: "pre-wrap" }}
        />
      </div>

      <textarea
        rows={8}
        value={responses[index]}
        onChange={handleChange}
        placeholder="Write your version here..."
        style={{ ...sharedStyles, width: "100%", padding: "10px", fontSize: "16px", borderRadius: "8px", border: "1px solid #ccc" }}
      />

      <div style={{ marginTop: "10px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <button onClick={prevParagraph} disabled={index === 0}>← Previous</button>
        <span>Paragraph {index + 1} of {paragraphs.length}</span>
        <button onClick={nextParagraph} disabled={index === paragraphs.length - 1}>Next →</button>
      </div>

      <button onClick={copyToClipboard} style={{ marginTop: "20px", padding: "10px 20px" }}>
        📋 Copy My Version
      </button>

      <div style={{ marginTop: "40px" }}>
        <h4>🧾 Full Rewritten Blog</h4>
        <div
          style={{
            border: "1px solid #ddd",
            padding: "20px",
            borderRadius: "8px",
            backgroundColor: "#fafafa",
            minHeight: "150px",
            whiteSpace: "pre-wrap",
          }}
        >
          {fullOutput.filter(p => p.trim()).join("\n\n") || <i>No content yet.</i>}
        </div>

        <div style={{ marginTop: "20px" }}>
          <button onClick={copyAllToClipboard} style={{ marginRight: "10px" }}>📄 Copy Entire Blog</button>
          <button onClick={downloadAsTxt} style={{ marginRight: "10px" }}>⬇️ Download as .txt</button>
          <button onClick={downloadAsDocx}>⬇️ Download as .docx</button>
        </div>
      </div>
    </div>
  );
}
