import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { useNavigate, Link } from "react-router-dom";

export const LoginPage = () => {
  const navigate = useNavigate();
  const [checkingSession, setCheckingSession] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) {
        navigate("/"); // Redirect to home if already logged in
      } else {
        setCheckingSession(false); // Show login options
      }
    });
  }, [navigate]);

  const handleLoginWithGitHub = async () => {
    const { error } = await supabase.auth.signInWithOAuth({ provider: "github" });
    if (error) console.error("GitHub login error:", error.message);
  };

  const handleLoginWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({ provider: "google" });
    if (error) console.error("Google login error:", error.message);
  };

  const handleLoginWithEmail = async () => {
    const email = prompt("Enter your email:");
    const password = prompt("Enter your password:");
    if (email && password) {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        console.error("Email login error:", error.message);
        alert("Login failed. Please check your email and password.");
      } else {
        alert("Login successful!");
        navigate("/dashboard"); // Redirect to dashboard
      }
    }
  };

  if (checkingSession) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-600">Checking authentication…</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-500 flex items-center justify-center px-4">
      <div className="absolute top-8 left-8">
        <Link to="/" className="text-white underline hover:text-indigo-200">
          &larr; Back
        </Link>
      </div>
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-8">
        <h2 className="text-3xl font-semibold text-gray-800 mb-6 text-center">
          Log In 
        </h2>
        <div className="flex flex-col space-y-4">
          <button
            onClick={handleLoginWithGitHub}
            className="w-full py-3 bg-gray-700 hover:bg-gray-800 text-white font-semibold rounded-lg transition"
          >
            Continue with GitHub
          </button>
          <button
            onClick={handleLoginWithGoogle}
            className="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition"
          >
            Continue with Google
          </button>
          <button
            onClick={handleLoginWithEmail}
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition"
          >
            Continue with Email
          </button>
        </div>
        <div className="mt-6 text-center text-gray-600">
          New user?{" "}
          <Link to="/signup" className="text-indigo-600 hover:underline font-semibold">
            Sign Up
          </Link>
        </div>
      </div>
    </div>
  );
};