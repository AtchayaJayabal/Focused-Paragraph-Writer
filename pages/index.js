import { useState } from "react";

const paragraphs = [
  "Paragraph 1: Blogging is a powerful way to share your ideas with the world, but getting started can be intimidating.",
  "Paragraph 2: One method to ease into writing is to work paragraph by paragraph, focusing only on a small piece at a time.",
  "Paragraph 3: This approach helps reduce overwhelm and encourages more thoughtful writing."
];

export default function Home() {
  const [index, setIndex] = useState(0);
  const [responses, setResponses] = useState(Array(paragraphs.length).fill(""));

  const handleChange = (e) => {
    const updated = [...responses];
    updated[index] = e.target.value;
    setResponses(updated);
  };

  const nextParagraph = () => {
    if (index < paragraphs.length - 1) setIndex(index + 1);
  };

  const prevParagraph = () => {
    if (index > 0) setIndex(index - 1);
  };

  return (
    <div style={{ maxWidth: "600px", margin: "40px auto", padding: "20px", fontFamily: "sans-serif" }}>
      <div style={{ border: "1px solid #ddd", padding: "20px", borderRadius: "8px", marginBottom: "20px" }}>
        <h2>Reference</h2>
        <p>{paragraphs[index]}</p>
      </div>

      <textarea
        rows={8}
        value={responses[index]}
        onChange={handleChange}
        placeholder="Write your version here..."
        style={{ width: "100%", padding: "10px", fontSize: "16px", borderRadius: "8px", border: "1px solid #ccc" }}
      />

      <div style={{ marginTop: "20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <button onClick={prevParagraph} disabled={index === 0}>Previous</button>
        <span>Paragraph {index + 1} of {paragraphs.length}</span>
        <button onClick={nextParagraph} disabled={index === paragraphs.length - 1}>Next</button>
      </div>
    </div>
  );
}
