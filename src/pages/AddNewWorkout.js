import { useEffect, useState } from "react"; //state + effects
import { supabase } from "../lib/supabaseClient";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDumbbell } from "@fortawesome/free-solid-svg-icons";

//normalize for exercise uniqueness
function normalizeExerciseName(name) {
  return name.trim().replace(/\s+/g, " ").toLowerCase();
}

//group sets for display
function groupSetsByExercise(sets) {
  return (sets || []).reduce((acc, s) => {
    const key = s.exercise_name || "Exercise";
    (acc[key] ||= []).push(s);
    return acc;
  }, {});
}

//iso -> yyyy-mm-dd
function toDateInputValue(isoString) {
  if (!isoString) return "";
  const d = new Date(isoString);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export default function AddNewWorkout() {
  //strength input
  const [exercise, setExercise] = useState("");

  //edit date state
  const [editingId, setEditingId] = useState(null);
  const [editDate, setEditDate] = useState("");

  //sets input
  const [sets, setSets] = useState([{ weight: "", reps: "" }]);

  //cardio input
  const [cardioExercise, setCardioExercise] = useState("");
  const [cardioMinutes, setCardioMinutes] = useState("");

  //notes input
  const [notes, setNotes] = useState("");

  //saved workouts
  const [workouts, setWorkouts] = useState([]);

  //load workouts once
  useEffect(() => {
    async function loadWorkouts() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: workoutRows, error: wErr } = await supabase
        .from("workouts")
        .select("id, performed_at, title, notes")
        .order("performed_at", { ascending: false });

      if (wErr) return;

      if (!workoutRows || workoutRows.length === 0) {
        setWorkouts([]);
        return;
      }

      const workoutIds = workoutRows.map((w) => w.id);

      const { data: setRows, error: sErr } = await supabase
        .from("workout_sets")
        .select("id, workout_id, exercise_id, set_index, weight, reps")
        .in("workout_id", workoutIds)
        .order("set_index", { ascending: true });

      if (sErr) return;

      const exerciseIds = Array.from(new Set((setRows || []).map((s) => s.exercise_id)));

      let exerciseNameById = {};
      if (exerciseIds.length > 0) {
        const { data: exerciseRows, error: eErr } = await supabase
          .from("exercises")
          .select("id, name")
          .in("id", exerciseIds);

        if (eErr) return;

        exerciseNameById = Object.fromEntries((exerciseRows || []).map((e) => [e.id, e.name]));
      }

      const setsByWorkoutId = {};
      for (const s of setRows || []) {
        const withName = { ...s, exercise_name: exerciseNameById[s.exercise_id] || "Exercise" };
        (setsByWorkoutId[s.workout_id] ||= []).push(withName);
      }

      const merged = workoutRows.map((w) => ({
        ...w,
        sets: setsByWorkoutId[w.id] || [],
      }));

      setWorkouts(merged);
    }

    loadWorkouts();
  }, []);

  //start editing date
  function startEditDate(workout) {
    setEditingId(workout.id);
    setEditDate(toDateInputValue(workout.performed_at));
  }

  //cancel date edit
  function cancelEditDate() {
    setEditingId(null);
    setEditDate("");
  }

  //save edited date
  async function saveEditDate(workoutId) {
    if (!editDate) return;

    const newPerformedAt = new Date(`${editDate}T12:00:00`).toISOString();

    setWorkouts((prev) =>
      prev.map((w) => (w.id === workoutId ? { ...w, performed_at: newPerformedAt } : w))
    );

    const { error } = await supabase
      .from("workouts")
      .update({ performed_at: newPerformedAt })
      .eq("id", workoutId);

    if (error) console.log("supabase update date error:", error);

    cancelEditDate();
  }

  //delete workout
  async function handleDelete(workoutId) {
    if (editingId === workoutId) cancelEditDate();

    setWorkouts((prev) => prev.filter((w) => w.id !== workoutId));

    const { error } = await supabase
      .from("workouts")
      .delete()
      .eq("id", workoutId);

    if (error) console.log("supabase delete error:", error);
  }

  //set helpers
  function addSet() {
    setSets((prev) => [...prev, { weight: "", reps: "" }]);
  }

  function removeSet(index) {
    setSets((prev) => prev.filter((_, i) => i !== index));
  }

  function updateSet(index, field, value) {
    setSets((prev) =>
      prev.map((s, i) => (i === index ? { ...s, [field]: value } : s))
    );
  }

  //save workout
  async function handleSave() {
    const hasStrength = exercise.trim().length > 0;
    const hasCardio = cardioExercise.trim().length > 0 || cardioMinutes !== "";
    const hasNotes = notes.trim().length > 0;

    if (!hasStrength && !hasCardio && !hasNotes) return;

    const cleanedSets = sets
      .map((s) => ({
        weight: s.weight === "" ? null : Number(s.weight),
        reps: s.reps === "" ? null : Number(s.reps),
      }))
      .filter((s) => s.weight != null || s.reps != null);

    let combinedNotes = notes.trim() || "";

    //append cardio to notes
    if (hasCardio) {
      const cardioLine = `${cardioExercise.trim() || "Cardio"}${
        cardioMinutes !== "" ? ` - ${Number(cardioMinutes)} min` : ""
      }`;
      combinedNotes = combinedNotes ? `${combinedNotes}\n${cardioLine}` : cardioLine;
    }

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const title = hasStrength ? exercise.trim() : (cardioExercise.trim() || "Workout");

    const { data: workoutRow, error: workoutErr } = await supabase
      .from("workouts")
      .insert({
        user_id: user.id,
        performed_at: new Date().toISOString(),
        title,
        notes: combinedNotes || null,
      })
      .select("id, performed_at, title, notes")
      .single();

    if (workoutErr) {
      console.log("supabase workout insert error:", workoutErr);
      return;
    }

    let insertedSetsWithExerciseName = [];

    if (hasStrength) {
      const rawName = exercise.trim();
      const normalized = normalizeExerciseName(rawName);

      const { data: exerciseRow, error: exerciseErr } = await supabase
        .from("exercises")
        .upsert(
          {
            user_id: user.id,
            name: rawName,
            name_normalized: normalized,
          },
          { onConflict: "user_id,name_normalized" }
        )
        .select("id, name")
        .single();

      if (exerciseErr) {
        console.log("supabase exercise upsert error:", exerciseErr);
        return;
      }

      if (cleanedSets.length > 0) {
        const rows = cleanedSets.map((s, idx) => ({
          user_id: user.id,
          workout_id: workoutRow.id,
          exercise_id: exerciseRow.id,
          set_index: idx + 1,
          reps: s.reps,
          weight: s.weight,
        }));

        const { data: insertedSetRows, error: setsErr } = await supabase
          .from("workout_sets")
          .insert(rows)
          .select("id, workout_id, exercise_id, set_index, weight, reps");

        if (setsErr) {
          await supabase.from("workouts").delete().eq("id", workoutRow.id);
          console.log("supabase sets insert error:", setsErr);
          return;
        }

        insertedSetsWithExerciseName = (insertedSetRows || []).map((s) => ({
          ...s,
          exercise_name: exerciseRow.name,
        }));
      }
    }

    setWorkouts((prev) => [
      {
        id: workoutRow.id,
        performed_at: workoutRow.performed_at,
        title: workoutRow.title,
        notes: workoutRow.notes,
        sets: insertedSetsWithExerciseName,
      },
      ...prev,
    ]);

    //reset inputs
    setExercise("");
    setSets([{ weight: "", reps: "" }]);
    setCardioExercise("");
    setCardioMinutes("");
    setNotes("");
  }

  return (
    <div className="workout-page">
      <div className="title-span">
        <FontAwesomeIcon icon={faDumbbell} className="title-icon add-workout-title" />
        <h1>Add Workout</h1>
      </div>

      <div className="workout-card">
        <div style={{ display: "grid", gap: 10, width: "100%", maxWidth: 520 }}>
          <label className="workout-label">Strength Exercise</label>
          <input
            className="workout-input"
            value={exercise}
            onChange={(e) => setExercise(e.target.value)}
            placeholder="Exercise"
          />

          <label className="workout-label">Sets</label>

          {sets.map((s, i) => (
            <div className="set-row" key={i}>
              <input
                className="workout-input"
                type="number"
                value={s.weight}
                onChange={(e) => updateSet(i, "weight", e.target.value)}
                placeholder="Weight (lbs)"
              />
              <input
                className="workout-input"
                type="number"
                value={s.reps}
                onChange={(e) => updateSet(i, "reps", e.target.value)}
                placeholder="Reps"
              />
              <button
                className="mini-btn"
                type="button"
                onClick={() => removeSet(i)}
                disabled={sets.length === 1}
              >
                - Remove
              </button>
            </div>
          ))}

          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <button className="mini-btn" type="button" onClick={addSet}>
              + Add Set
            </button>
          </div>

          {/* kept ONE save button (removed the duplicate below) */}
          <button className="workout-btn" type="button" onClick={handleSave}>
            Save
          </button>

          <div className="divider" />

          <label className="workout-label">Cardio</label>
          <div className="set-row">
            <input
              className="workout-input"
              value={cardioExercise}
              onChange={(e) => setCardioExercise(e.target.value)}
              placeholder="Cardio exercise"
            />
            <input
              className="workout-input"
              type="number"
              value={cardioMinutes}
              onChange={(e) => setCardioMinutes(e.target.value)}
              placeholder="Minutes"
            />
            <div />
          </div>

          <label className="workout-label">Notes</label>
          <textarea
            className="workout-textarea"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder=" "
            rows={4}
          />

          {/* deleted redundant second Save button here */}
        </div>
      </div>

      <h2 style={{ marginTop: 20 }}>Workout Log:</h2>
      {workouts.length === 0 ? (
        <p>No workouts saved</p>
      ) : (
        <ul className="workout-list">
          {workouts.map((w) => (
            <li key={w.id} className="workout-item">
              <div>
                <div className="workout-date">
                  {editingId === w.id ? (
                    <input
                      className="workout-input"
                      type="date"
                      value={editDate}
                      onChange={(e) => setEditDate(e.target.value)}
                    />
                  ) : (
                    <div>{toDateInputValue(w.performed_at)}</div>
                  )}
                </div>

                {w.sets && w.sets.length > 0 ? (
                  <>
                    {Object.entries(groupSetsByExercise(w.sets)).map(([exName, exSets]) => (
                      <div key={exName}>
                        <div className="exercise-title">{exName}</div>
                        <div className="sets-table">
                          {exSets.map((s) => (
                            <div key={s.id} className="set-row-display">
                              <div>
                                {s.weight ?? "-"} x {s.reps ?? "-"}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </>
                ) : (
                  <div className="exercise-title">{w.title || "Workout"}</div>
                )}

                {w.notes ? <div className="notes-log">Notes: {w.notes}</div> : null}
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 10, alignItems: "center" }}>
                {editingId === w.id ? (
                  <>
                    <button className="mini-btn" type="button" onClick={() => saveEditDate(w.id)}>
                      Save
                    </button>
                    <button className="mini-btn" type="button" onClick={cancelEditDate}>
                      Cancel
                    </button>
                  </>
                ) : (
                  <button className="delete-btn edit-btn" type="button" onClick={() => startEditDate(w)}>
                    Edit Date
                  </button>
                )}

                <button className="delete-btn" type="button" onClick={() => handleDelete(w.id)}>
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
