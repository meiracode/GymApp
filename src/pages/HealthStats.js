import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeartPulse } from "@fortawesome/free-solid-svg-icons";
import { supabase } from "../lib/supabaseClient";

export default function HealthStats() {
  //inputs
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");

  //saved logs
  const [statsLog, setStatsLog] = useState([]);

  //loading state
  const [loading, setLoading] = useState(true);

  //load last 30 days
  useEffect(() => {
    async function loadHealthLogs() {
      setLoading(true);

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("health_logs")
        .select("id, log_date, weight_lbs, height_text")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) {
        console.log("load health logs error:", error);
        setLoading(false);
        return;
      }

      setStatsLog(
        (data || []).map((e) => ({
          id: e.id,
          date: e.log_date,
          weight: e.weight_lbs != null ? String(e.weight_lbs) : null,
          height: e.height_text || null,
        }))
      );

      setLoading(false);
    }

    loadHealthLogs();
  }, []);

  //save stat
  async function handleSaveStat() {
    const w = weight.trim();
    const h = height.trim();

    if (!w && !h) return;

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const today = new Date().toISOString().slice(0, 10);

    const weightNumber = w === "" ? null : Number(w);
    const weightValue = Number.isFinite(weightNumber) ? weightNumber : null;

    const { data: row, error } = await supabase
      .from("health_logs")
      .insert({
        user_id: user.id,
        log_date: today,
        weight_lbs: weightValue,
        height_text: h || null,
      })
      .select("id, log_date, weight_lbs, height_text")
      .single();

    if (error) {
      console.log("save health stat error:", error);
      return;
    }

    //update UI
    setStatsLog((prev) => [
      {
        id: row.id,
        date: row.log_date,
        weight: row.weight_lbs != null ? String(row.weight_lbs) : null,
        height: row.height_text || null,
      },
      ...prev,
    ]);

    setWeight("");
    setHeight("");
  }

  //delete stat
  async function handleDeleteStat(id) {
    setStatsLog((prev) => prev.filter((e) => e.id !== id));
    const { error } = await supabase.from("health_logs").delete().eq("id", id);
    if (error) console.log("delete health stat error:", error);
  }

  return (
    <div className="workout-page health-page">
      <div className="title-span">
        <FontAwesomeIcon icon={faHeartPulse} className="title-icon health-stats-title" />
        <h1>Health Statistics</h1>
      </div>

      <p>Log your health, and see your progress in real time.</p>

      <div className="workout-card">
        <div className="health-inputs">
          <div>
            <label className="workout-label">Weight</label>
            <input
              className="weight"
              placeholder="Weight (lbs)"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
            />
          </div>

          <div>
            <label className="workout-label">Height</label>
            <input
              className="height"
              placeholder="Height (ft/in)"
              value={height}
              onChange={(e) => setHeight(e.target.value)}
            />
          </div>

          <button className="workout-btn" type="button" onClick={handleSaveStat}>
            Save
          </button>
        </div>
      </div>


      {loading ? (
        <p>Loading...</p>
      ) : statsLog.length === 0 ? (
        <p>No entries</p>
      ) : (
        <ul className="workout-list">
          {statsLog.map((e) => (
            <li key={e.id} className="workout-item">
              <div>
                <div className="workout-date">{e.date}</div>
                <div className="notes-log">
                  {e.weight ? (
                    <div>
                      <b>Weight:</b> {e.weight} lbs
                    </div>
                  ) : null}
                  {e.height ? (
                    <div>
                      <b>Height:</b> {e.height}
                    </div>
                  ) : null}
                </div>
              </div>

              <button className="delete-btn" type="button" onClick={() => handleDeleteStat(e.id)}>
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
