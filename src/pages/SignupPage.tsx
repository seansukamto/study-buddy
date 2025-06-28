import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { useNavigate, Link } from "react-router-dom";

export const SignupPage = () => {
  const navigate = useNavigate();
  const [checkingSession, setCheckingSession] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) {
        navigate("/"); // Redirect to home if already logged in
      } else {
        setCheckingSession(false); // Show sign up options
      }
    });
  }, [navigate]);

  const handleSignUpWithGitHub = async () => {
    const { error } = await supabase.auth.signInWithOAuth({ provider: "github" });
    if (error) console.error("GitHub sign up error:", error.message);
  };

  const handleSignUpWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({ provider: "google" });
    if (error) console.error("Google sign up error:", error.message);
  };

  const handleSignUpWithEmail = async () => {
    const email = prompt("Enter your email:");
    const password = prompt("Enter your password:");
    if (email && password) {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) {
        console.error("Sign-up error:", error.message);
        alert("Sign-up failed. Please try again.");
      } else {
        alert("Sign-up successful! You can now log in.");
        navigate("/login");
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
        <Link to="/login" className="text-white underline hover:text-indigo-200">
          &larr; Back to Log In
        </Link>
      </div>
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-8">
        <h2 className="text-3xl font-semibold text-gray-800 mb-6 text-center">
          Sign Up
        </h2>
        <div className="flex flex-col space-y-4">
          <button
            onClick={handleSignUpWithGitHub}
            className="w-full py-3 bg-gray-800 hover:bg-gray-900 text-white font-semibold rounded-lg transition"
          >
            Sign Up with GitHub
          </button>
          <button
            onClick={handleSignUpWithGoogle}
            className="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition"
          >
            Sign Up with Google
          </button>
          <button
            onClick={handleSignUpWithEmail}
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition"
          >
            Sign Up with Email
          </button>
        </div>
        <div className="mt-6 text-center text-gray-600">
          Already have an account?{" "}
          <Link to="/login" className="text-indigo-600 hover:underline font-semibold">
            Log In
          </Link>
        </div>
      </div>
    </div>
  );
};