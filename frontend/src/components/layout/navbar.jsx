import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

import { useAuth } from "@/lib/auth";

import { Menu, X, User, LogOut, UserCog } from "lucide-react";
import { NeoArcadelogo } from "@/components/ui/neo-arcade-logo";
import { CyberButton } from "@/components/ui/cyber-button";

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    setIsMenuOpen(false);
    navigate("/home");
  };

  return (
    <nav className="bg-arcade-dark border-b-2 border-arcade-neon-blue/50 px-4 py-3">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/home" className="flex items-center gap-2">
          <NeoArcadelogo size="md" className="text-white" />
        </Link>

        {/* Escritorio */}
        <div className="hidden md:flex items-center gap-6">
          <div className="flex gap-4">
            <Link
              to="/leaderboard"
              className="text-gray-300 hover:text-arcade-neon-blue transition-colors font-pixel"
            >
              SCORE
            </Link>
            {isAuthenticated && (
              <Link
                to="/profile"
                className="text-gray-300 hover:text-arcade-neon-blue transition-colors font-pixel"
              >
                PROFILE
              </Link>
            )}
            {user?.role === "admin" && (
              <Link
                to="/admin"
                className="text-gray-300 hover:text-arcade-neon-blue transition-colors font-pixel"
              >
                ADMIN
              </Link>
            )}
          </div>

          {isAuthenticated ? (
            <div className="flex items-center gap-3">
              <span className="text-gray-400 font-pixel">{user?.username}</span>
              <CyberButton
                variant="ghost"
                glowing={false}
                onClick={handleLogout}
              >
                LOGOUT
              </CyberButton>
            </div>
          ) : (
            <div className="flex gap-2">
              {location.pathname !== "/login" && (
                <Link to="/login">
                  <CyberButton>LOGIN</CyberButton>
                </Link>
              )}
              {location.pathname !== "/register" && (
                <Link to="/register">
                  <CyberButton>REGISTER</CyberButton>
                </Link>
              )}
            </div>
          )}
        </div>

        {/* Móvil */}
        <button
          className="md:hidden text-gray-300 hover:text-arcade-neon-blue"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Menú móvil */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-16 left-0 right-0 z-50 bg-arcade-dark border-b-2 border-arcade-neon-blue/50 shadow-lg">
          <div className="container mx-auto py-4 px-6 flex flex-col gap-4">
            <Link
              to="/leaderboard"
              className="flex items-center gap-2 text-gray-300 hover:text-arcade-neon-blue transition-colors font-pixel py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              <span>SCORES</span>
            </Link>

            {isAuthenticated && (
              <>
                <Link
                  to="/profile"
                  className="flex items-center gap-2 text-gray-300 hover:text-arcade-neon-blue transition-colors font-pixel py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <User size={18} />
                  <span>PROFILE</span>
                </Link>

                {user?.role === "admin" && (
                  <Link
                    to="/admin"
                    className="flex items-center gap-2 text-gray-300 hover:text-arcade-neon-blue transition-colors font-pixel py-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <UserCog size={18} />
                    <span>ADMIN</span>
                  </Link>
                )}

                <button
                  className="flex items-center gap-2 text-gray-300 hover:text-red-400 transition-colors font-pixel py-2 w-full text-left"
                  onClick={handleLogout}
                >
                  <LogOut size={18} />
                  <span>LOG OUT</span>
                </button>
              </>
            )}

            {!isAuthenticated && (
              <div className="flex gap-2 pt-2">
                {location.pathname !== "/login" && (
                  <Link to="/login" onClick={() => setIsMenuOpen(false)}>
                    <CyberButton variant="blue" className="w-full">
                      LOGIN
                    </CyberButton>
                  </Link>
                )}
                {location.pathname !== "/register" && (
                  <Link to="/register" onClick={() => setIsMenuOpen(false)}>
                    <CyberButton variant="blue" className="w-full">
                      REGISTER
                    </CyberButton>
                  </Link>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
