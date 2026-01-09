import { useEffect, useState } from "react";
import NotesSection from "../components/NotesSection";
import { supabase } from "../lib/supabaseClient";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrophy } from "@fortawesome/free-solid-svg-icons";

export default function Goals() {
  //input note
  const [notes, setNotes] = useState("");

  //saved notes
  const [notesLog, setNotesLog] = useState([]);

  //loading state
  const [loading, setLoading] = useState(true);

  //load notes once
  useEffect(() => {
    async function loadGoalNotes() {
      setLoading(true);

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("goal_notes")
        .select("id, note_date, text")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) {
        console.log("load goal notes error:", error);
        setLoading(false);
        return;
      }

      setNotesLog(
        (data || []).map((n) => ({
          id: n.id,
          date: n.note_date,
          text: n.text,
        }))
      );

      setLoading(false);
    }

    loadGoalNotes();
  }, []);

  //save note
  async function handleSaveNote() {
    const text = notes.trim();
    if (!text) return;

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const today = new Date().toISOString().slice(0, 10);

    const { data: row, error } = await supabase
      .from("goal_notes")
      .insert({
        user_id: user.id,
        note_date: today,
        text,
      })
      .select("id, note_date, text")
      .single();

    if (error) {
      console.log("save goal note error:", error);
      return;
    }

    //update UI
    setNotesLog((prev) => [
      { id: row.id, date: row.note_date, text: row.text },
      ...prev,
    ]);

    setNotes("");
  }

  //delete note
  async function handleDeleteNote(id) {
    setNotesLog((prev) => prev.filter((n) => n.id !== id));
    const { error } = await supabase.from("goal_notes").delete().eq("id", id);
    if (error) console.log("delete goal note error:", error);
  }

  return (
    <div className="workout-page goals-page">
      <div className="title-span">
        <FontAwesomeIcon icon={faTrophy} className="title-icon goals-title" />
        <h1>Goals</h1>
      </div>

      <p>
        Set a schedule, create a split, or just visualize a general goal for yourself.
        Adjust your goals over time to figure out what works best for you.
      </p>

      <div className="workout-card">
        <div style={{ display: "grid", gap: 10, width: "100%", maxWidth: 520 }}>
          <NotesSection value={notes} onChange={setNotes} label="Goal Notes" />

          <button className="workout-btn" type="button" onClick={handleSaveNote}>
            Save Note
          </button>
        </div>
      </div>

      <h2 className="goal-notes">Goals Set:</h2>

      {loading ? (
        <p>Loading...</p>
      ) : notesLog.length === 0 ? (
        <p>No goals set yet.</p>
      ) : (
        <ul className="workout-list">
          {notesLog.map((n) => (
            <li key={n.id} className="workout-item">
              <div>
                <div className="workout-date">{n.date}</div>
                <div className="notes-log">{n.text}</div>
              </div>

              <button className="delete-btn" type="button" onClick={() => handleDeleteNote(n.id)}>
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
