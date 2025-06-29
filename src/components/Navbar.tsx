import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import logo from "../assets/logo.jpg";

export const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { signOut, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const displayName = user?.user_metadata.user_name || user?.email;

  const isActive = (path: string) => {
    if (path === "/find-group/1") {
      return location.pathname.startsWith("/find-group");
    }
    if (path === "/discussion/create") {
      return location.pathname === "/discussion/create";
    }
    if (path === "/discussions") {
      return location.pathname === "/discussions";
    }
    if (path === "/create-group") {
      return location.pathname === "/create-group";
    }
    if (path === "/") {
      return location.pathname === "/";
    }
    return location.pathname === path;
  };

  const linkClass = (path: string) =>
    "transition-colors px-3 py-2 rounded-md whitespace-nowrap " +
    (isActive(path)
      ? "border-b-4 border-purple-500 text-white"
      : "text-gray-300 hover:text-white hover:border-b-4 hover:border-purple-500 border-b-4 border-transparent");

  return (
    <nav className="fixed top-0 w-full z-40 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 backdrop-blur-lg border-b border-white/10 shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="font-mono text-xl font-bold text-white">
            <div className="navbar-branding flex items-center">
              <img
                src={logo}
                alt="Study Buddy Logo"
                className="w-8 h-8 object-contain mr-2 rounded-full"
              />
              <span className="navbar-text">
                Study<span className="text-yellow-400"> Buddy</span>
              </span>
            </div>
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className={linkClass("/") + " text-white hover:text-yellow-400"}>
              Home
            </Link>
            <Link to="/create-group" className={linkClass("/create-group") + " text-white hover:text-yellow-400"}>
              Create Group
            </Link>
            <Link to="/find-group/1" className={linkClass("/find-group/1") + " text-white hover:text-yellow-400"}>
              Groups
            </Link>
            <Link to="/record-study-time" className={linkClass("/record-study-time") + " text-white hover:text-yellow-400"}>
              Record
            </Link>
            <Link to="/discussion/create" className={linkClass("/discussion/create") + " text-white hover:text-yellow-400"}>
              Create Discussion
            </Link>
            <Link to="/discussions" className={linkClass("/discussions") + " text-white hover:text-yellow-400"}>
              Discussions
            </Link>
          </div>

          {/* Desktop Auth */}
          <div className="hidden md:flex items-center">
            {user ? (
              <div className="flex items-center space-x-4">
                {user.user_metadata?.avatar_url && (
                  <img
                    src={user.user_metadata.avatar_url}
                    alt="User Avatar"
                    className="w-8 h-8 rounded-full object-cover"
                  />
                )}
                <span className="text-white">{displayName}</span>
                <button
                  onClick={signOut}
                  className="bg-red-500 px-3 py-1 rounded hover:bg-red-600 transition-colors"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <button
                onClick={() => navigate("/login")}
                className="bg-yellow-400 px-3 py-1 rounded text-black hover:bg-yellow-500 transition-colors"
              >
                Log In
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setMenuOpen((prev) => !prev)}
              className="text-white focus:outline-none"
              aria-label="Toggle menu"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                {menuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <Link to="/" className={linkClass("/") + " text-white hover:text-yellow-400"}>
              Home
            </Link>
            <Link
              to="/create"
              className="block px-3 py-2 rounded-md text-base font-medium text-white hover:text-yellow-400"
            >
              Create Group
            </Link>
            <Link
              to="/communities"
              className="block px-3 py-2 rounded-md text-base font-medium text-white hover:text-yellow-400"
            >
              Find Group
            </Link>
            <Link
              to="/community/create"
              className="block px-3 py-2 rounded-md text-base font-medium text-white hover:text-yellow-400"
            >
              Communities
            </Link>
            <Link
              to="/record-study-time"
              className="block px-3 py-2 rounded-md text-base font-medium text-white hover:text-yellow-400"
            >
              Record
            </Link>
            {!user && (
              <Link
                to="/login"
                className="block px-3 py-2 rounded-md text-base font-medium text-black bg-yellow-400 hover:bg-yellow-500 text-center transition-colors"
              >
                Log In
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};