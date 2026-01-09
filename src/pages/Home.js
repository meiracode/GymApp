import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faChartLine, faTrophy } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import ProgressCircle from "../components/ProgressCircle";

//build PRs per exercise
function calculatePRsFromSets(setRows) {
  const prs = {};

  for (const row of setRows) {
    const exerciseName = row?.exercises?.name;
    const weight = Number(row?.weight);
    const reps = row?.reps;
    const performedAt = row?.workouts?.performed_at;

    if (!exerciseName || !weight) continue;

    if (!prs[exerciseName] || weight > prs[exerciseName].weight) {
      prs[exerciseName] = { weight, reps, performedAt };
    }
  }

  return prs;
}

//days in current month
function getDaysInMonth() {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
}

//start/end of current month
function getMonthRange() {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth(), 1);
  const end = new Date(now.getFullYear(), now.getMonth() + 1, 1);
  return { startISO: start.toISOString(), endISO: end.toISOString() };
}

export default function Home() {
  const navigate = useNavigate();

  //month progress
  const [workoutsThisMonth, setWorkoutsThisMonth] = useState(0);

  //loading state
  const [loading, setLoading] = useState(true);

  //sets used for PRs
  const [setRows, setSetRows] = useState([]);

  //calc goal once (no need for state)
  const daysInMonth = useMemo(() => getDaysInMonth(), []);

  //PRs map
  const prs = useMemo(() => calculatePRsFromSets(setRows), [setRows]);

  //top 5 PRs
  const topPRs = useMemo(() => {
    return Object.entries(prs)
      .sort((a, b) => b[1].weight - a[1].weight)
      .slice(0, 5);
  }, [prs]);

  //load home data
  useEffect(() => {
    async function loadHome() {
      setLoading(true);

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setLoading(false);
        return;
      }

      const { startISO, endISO } = getMonthRange();

      //count unique workout days this month
      const { data: rows } = await supabase
        .from("workouts")
        .select("performed_at")
        .eq("user_id", user.id)
        .gte("performed_at", startISO)
        .lt("performed_at", endISO);

      const uniqueDays = new Set(
        (rows || []).map((r) => new Date(r.performed_at).toISOString().slice(0, 10))
      );

      setWorkoutsThisMonth(uniqueDays.size);

      //load all sets for PRs
      const { data: sets, error } = await supabase
        .from("workout_sets")
        .select(`
          weight,
          reps,
          workouts!inner ( performed_at ),
          exercises!inner ( name )
        `)
        .eq("user_id", user.id);

      if (!error) setSetRows(sets || []);

      setLoading(false);
    }

    loadHome();
  }, []);

  return (
    <div>
      <div className="title-span">
        <FontAwesomeIcon icon={faChartLine} className="title-icon chart-icon" />
        <h1>Progress Overview</h1>
      </div>

      <div className="home-main-row">
        <div className="home-left">
          <div className="whole-card">
            <button className="big-action-card" onClick={() => navigate("/add-workout")}>
              <FontAwesomeIcon icon={faPlus} className="big-action-icon" />
            </button>
            <p className="big-action-sub">Add New Workout</p>
          </div>

          <div className="prs-section">
            <div className="pr-title-span title-span">
              <FontAwesomeIcon icon={faTrophy} className="title-icon goals-title" />
              <h2 className="goals-set">Personal Records</h2>
            </div>

            <div className="prs-list">
              {topPRs.map(([exercise, pr]) => (
                <div key={exercise} className="pr-row">
                  <div className="pr-left">
                    <div className="pr-exercise">{exercise}</div>
                    <div className="pr-date">
                      {pr.performedAt ? new Date(pr.performedAt).toLocaleDateString() : ""}
                    </div>
                  </div>

                  <div className="pr-right">
                    <div className="pr-main">
                      {pr.weight} <span className="pr-unit">lbs</span>
                    </div>
                    <div className="pr-sub">
                      × {pr.reps}
                      <span className="pr-reps"> reps</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>

        <div className="home-right">
          <div className="prog-circle">
            {loading ? (
              <p>Loading...</p>
            ) : (
              <ProgressCircle value={workoutsThisMonth} max={daysInMonth} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
