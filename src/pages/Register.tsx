import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";

const Register = () => {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement Supabase registration
    console.log("Register attempt:", { email, username, password });
    toast({
      title: "Registration successful",
      description: "Please login with your new account",
    });
    navigate("/login");
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-6 space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Create Account</h1>
          <p className="text-sm text-gray-400">Register to start trading</p>
        </div>
        
        <form onSubmit={handleRegister} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Email</label>
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Username</label>
            <Input
              type="text"
              placeholder="Choose a username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Password</label>
            <Input
              type="password"
              placeholder="Choose a password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <Button type="submit" className="w-full">
            Register
          </Button>
        </form>

        <div className="text-center text-sm">
          <span className="text-gray-400">Already have an account? </span>
          <button
            onClick={() => navigate("/login")}
            className="text-primary hover:underline"
          >
            Login
          </button>
        </div>
      </Card>
    </div>
  );
};

export default Register;