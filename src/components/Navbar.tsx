import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { signOut, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const displayName = user?.user_metadata.user_name || user?.email;

  const isActive = (path: string) => {
    if (path === "/find-group") {
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
    <nav className="fixed top-0 w-full z-40 bg-[rgba(10,10,10,0.8)] backdrop-blur-lg border-b border-white/10 shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="font-mono text-xl font-bold text-white">
            Study<span className="text-purple-500">Buddy</span>
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className={linkClass("/")}>
              Home
            </Link>
            <Link to="/create-group" className={linkClass("/create-group")}>
              Create Group
            </Link>
            <Link to="/find-group" className={linkClass("/find-group")}>
              Groups
            </Link>
            <Link to="/discussion/create" className={linkClass("/discussion/create")}>
              Create Discussion
            </Link>
            <Link to="/discussions" className={linkClass("/discussions")}>
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
                <span className="text-gray-300">{displayName}</span>
                <button
                  onClick={signOut}
                  className="bg-red-500 px-3 py-1 rounded"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <button
                onClick={() => navigate("/login")}
                className="bg-blue-500 px-3 py-1 rounded"
              >
                Log In
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setMenuOpen((prev) => !prev)}
              className="text-gray-300 focus:outline-none"
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
      <div className="md:hidden bg-[rgba(10,10,10,0.9)]">
        <div className="px-2 pt-2 pb-3 space-y-1 flex flex-col">
          <Link to="/" className={linkClass("/") + " w-full text-center"}>
            Home
          </Link>
          <Link to="/create-group" className={linkClass("/create-group") + " w-full text-center"}>
            Create Group
          </Link>
          <Link to="/find-group" className={linkClass("/find-group") + " w-full text-center"}>
            Groups
          </Link>
          <Link to="/discussion/create" className={linkClass("/discussion/create") + " w-full text-center"}>
            Create Discussion
          </Link>
          <Link to="/discussions" className={linkClass("/discussions") + " w-full text-center"}>
            Discussions
          </Link>
          {!user && (
            <Link
              to="/login"
              className="block px-3 py-2 rounded-md text-base font-medium text-white bg-blue-500 hover:bg-blue-600 text-center w-full"
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