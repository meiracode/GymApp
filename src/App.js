import { Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "./lib/supabaseClient";

import Layout from "./components/Layout";
import Login from "./components/Login";

import Home from "./pages/Home";
import AddNewWorkout from "./pages/AddNewWorkout";
import Exercises from "./pages/Exercises";
import Goals from "./pages/Goals";
import HealthStats from "./pages/HealthStats";
import Push from "./pages/Push";
import Pull from "./pages/Pull";
import Legs from "./pages/Legs";

import "./App.css";

function App() {
  const [session, setSession] = useState(undefined);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
    });

    const { data: sub } = supabase.auth.onAuthStateChange(
      (_event, session) => setSession(session)
    );

    return () => sub.subscription.unsubscribe();
  }, []);

  if (session === undefined) return null;

  if (!session) {
    return <Login />;
  }

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Navigate to="/" replace />} />
        <Route path="/add-workout" element={<AddNewWorkout />} />
        <Route path="/exercises" element={<Exercises />} />
        <Route path="/goals" element={<Goals />} />
        <Route path="/health-stats" element={<HealthStats />} />
        <Route path="/push" element={<Push />} />
        <Route path="/pull" element={<Pull />} />
        <Route path="/legs" element={<Legs />} />
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
  );
}

export default App;
