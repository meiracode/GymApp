//notes textarea
export default function NotesSection({ value, onChange, label }) {
  return (
    <>
      {/* optional label */}
      {label && <label className="workout-label">{label}</label>}

      <textarea
        className="workout-textarea"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder=" "
        rows={4}
      />
    </>
  );
}
