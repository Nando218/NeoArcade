import { useState } from "react";
import { useAuth } from "@/lib/auth";
import { Input } from "@/components/ui/input";
import { ArcadeButton } from "@/components/ui/arcade-button";

import { AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login, isLoading } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please complete all fields");
      return;
    }

    try {
      console.log("Trying to log in with:", { email });

      if (email === "admin@arcade.com" || email === "user@arcade.com") {
        console.log("Using predefined account:", email);
      }

      const trimmedEmail = email.trim();
      const trimmedPassword = password.trim();

      console.log("Sending credentials to server:", {
        email: trimmedEmail,
        passwordLength: trimmedPassword.length,
      });

      const success = await login(trimmedEmail, trimmedPassword);

      if (!success) {
        console.log("Login failed without specific error");
        setError(
          "Email or password are incorrect. For predefined accounts: admin@arcade.com/admin123 or user@arcade.com/user123"
        );
      } else {
        console.log("Login completed successfully from the form");
        toast({
          title: "Login successful",
          description: "Welcome back to Rewind Arcade!",
          variant: "default",
        });

        navigate("/home");
      }
    } catch (err) {
      console.error("Error in login form:", err);
      console.error("Response details:", err.response?.data);

      if (err.response?.status === 401) {
        setError(
          "Email or password are incorrect. For predefined accounts: admin@arcade.com/admin123 or user@arcade.com/user123"
        );
      } else if (err.code === "ECONNABORTED" || !err.response) {
        const errorMessage =
          "Connection error with the server. Make sure the backend is running on http://localhost:3001";
        setError(errorMessage);
        toast({
          title: "Connection error",
          description: errorMessage,
          variant: "destructive",
        });
      } else {
        const errorMessage = `Login error: ${
          err.response?.data?.message || err.message || "Unknown error"
        }`;
        setError(errorMessage);
        toast({
          title: "Authentication error",
          description: errorMessage,
          variant: "destructive",
        });
      }
    }
  };

  return (
    <div className="w-full max-w-md">
      <form
        onSubmit={handleSubmit}
        className="space-y-6 bg-arcade-dark p-8 rounded-lg border-2 border-arcade-neon-blue shadow-[0_0_20px_rgba(0,255,255,0.3)]"
      >
        {error && (
          <div className="flex items-center gap-2 bg-red-900/30 border border-red-500 p-3 rounded text-red-300">
            <AlertCircle size={16} className="text-red-400" />
            <p className="text-sm font-medium">{error}</p>
          </div>
        )}

        <div className="space-y-4">
          <div className="space-y-2">
            <label
              className="text-sm font-medium font-pixel text-gray-300"
              htmlFor="email"
            >
              Email
            </label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="example@email.com"
              className="bg-black border-arcade-neon-blue/50 focus:border-arcade-neon-blue text-white"
              required
            />
          </div>

          <div className="space-y-2">
            <label
              className="text-sm font-medium font-pixel text-gray-300"
              htmlFor="password"
            >
              Password
            </label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="bg-black border-arcade-neon-blue/50 focus:border-arcade-neon-blue text-white"
              required
            />
          </div>
        </div>

        <ArcadeButton type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "LOADING..." : "LOGIN"}
        </ArcadeButton>
      </form>
    </div>
  );
}
