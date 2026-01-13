import { useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { useNavigate } from "react-router-dom";

export default function Login() {
  // redirect the user after login
  const navigate = useNavigate();

  // form fields
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  //login/sign up states
  const [mode, setMode] = useState("login");

  // used to disable buttons and show loading while request is being processed
  const [loading, setLoading] = useState(false);

  // message shown under the form (errors or success)
  const [msg, setMsg] = useState("");

  const handleAuth = async (e) => {
    e.preventDefault();

    // basic input validation before we hit supabase
    const cleanEmail = email.trim();

    if (!cleanEmail || !password) {
      setMsg("Please enter an email and password.");
      return;
    }

    setLoading(true);
    setMsg("");

    try {
      if (mode === "signup") {
        // create a new user account in supabase auth
        const { error } = await supabase.auth.signUp({
          email: cleanEmail,
          password,
        });

        // supabase returns "error" instead of throwing
        if (error) throw error;

        // if email confirmations are enabled, user may need to confirm before login works
        setMsg("Account created. If prompted, check your email to confirm.");
        setMode("login");
      } else {
        // sign in an existing user
        const { error } = await supabase.auth.signInWithPassword({
          email: cleanEmail,
          password,
        });

        if (error) throw error;

        // take them to home
        navigate("/", { replace: true });
      }
    } catch (err) {
      // show a friendly error message in the UI
      setMsg(err?.message || "Something went wrong.");
    } finally {
      // always stop loading even if there was an error
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      {/* only show create account when we're in login mode */}
      {mode === "login" && (
        <button
          className="create-acc"
          onClick={() => setMode("signup")}
          disabled={loading}
          type="button"
        >
          Create account
        </button>
      )}

      <div className="login-card">
        <h2 className="login-title">
          {mode === "signup" ? "Create account" : "Sign in"}
        </h2>

        <p className="login-subtitle">
          {mode === "signup"
            ? "Make an account to start tracking workouts and goals."
            : "Log in to view your dashboard and progress."}
        </p>

        {/* submit runs handleAuth which talks to supabase auth */}
        <form onSubmit={handleAuth} className="login-form">
          <input
            className="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            type="email"
            disabled={loading}
          />

          <input
            className="pw"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            autoComplete={mode === "signup" ? "new-password" : "current-password"}
            disabled={loading}
          />

          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? "Loading..." : mode === "signup" ? "Sign up" : "Log in"}
          </button>
        </form>

        {/* shows errors/success messages */}
        {msg && <p className="login-msg">{msg}</p>}

        
      </div>

      {mode === "signup" && (
  <button
    className="create-acc"
    onClick={() => setMode("login")}
    disabled={loading}
    type="button"
  >
    Back to sign in
  </button>
)}
    </div>
  );

  
}

