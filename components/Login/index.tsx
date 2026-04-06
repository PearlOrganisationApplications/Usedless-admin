"use client";

import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import logo from "../../assets/via_green_logo3.png";
import { useRouter } from "next/navigation";
import { handle_Auth } from "@/api/controller/auth";

interface LoginProps {
  setIsAuthenticated: (value: boolean) => void;
}

const Login: React.FC<LoginProps> = ({ setIsAuthenticated }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const router = useRouter();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const handleLogin = async () => {
    // Basic Validation
    if (!email.trim() || !password.trim()) {
      alert("Please fill in all fields.");
      return;
    }

    if (!emailRegex.test(email)) {
      alert("Please enter a valid email address.");
      return;
    }

    try {
      setLoading(true);

      const rs = await handle_Auth.login({ email, password });

      console.log("FINAL LOGIN RESPONSE:", rs);

      // Check if status is success
      if (!rs || rs.status === false) {
        alert(rs?.message || "Invalid email or password.");
        return;
      }

      const token = rs?.token;
      
      /** 
       * DATA MAPPING
       * Admin API returns data inside 'data'
       * Collector API returns data inside 'user'
       **/
      const userData = rs?.data || rs?.user;

      /**
       * ROLE DETECTION
       * Admin: rs.data.role.name
       * Collector: rs.user.role_name
       **/
      const role =
        rs?.data?.role?.name ||     // Admin path
        rs?.user?.role_name ||      // Collector path
        (rs.loginType === 'admin' ? 'admin' : 'collector');

      if (token && userData) {
        // 1. Store Token
        localStorage.setItem("access_token", token);
        
        // 2. Store User Data
        localStorage.setItem("user", JSON.stringify(userData));

        // 3. Store Role (Normalized to lowercase)
        localStorage.setItem("role", role.toLowerCase());

        // 4. Client/Collector Specific Store
        if (userData?.first_name) {
          localStorage.setItem("client_name", userData.first_name);
        }

        setIsAuthenticated(true);
        
        // Redirect to Dashboard
        router.push("/");
      } else {
        alert("Authentication succeeded but user data is missing.");
      }

    } catch (error: any) {
      console.error("CRITICAL LOGIN ERROR:", error);
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center p-6 overflow-hidden">
      {/* Background Video */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover z-0"
      >
        <source src="/bg_video/back_gr.mp4" type="video/mp4" />
      </video>

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/40 z-10"></div>

      <Card className="relative z-20 w-full max-w-md bg-white/10 backdrop-blur-2xl border-white/20 shadow-2xl">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-3">
            <Image src={logo} alt="Logo" className="h-12 w-48 object-contain" />
          </div>
          <p className="text-white/70 text-sm">Universal Login (Admin & Collector)</p>
        </CardHeader>

        <CardContent className="space-y-5">
          {/* Email Field */}
          <div className="space-y-2">
            <Label htmlFor="email" className="text-white text-xs font-semibold uppercase tracking-wider">
              Email Address
            </Label>
            <Input
              id="email"
              type="email"
              className="bg-white/10 text-white border-white/20 placeholder:text-gray-400 h-11 focus:ring-yellow-500/50"
              placeholder="name@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {/* Password Field */}
          <div className="space-y-2">
            <Label htmlFor="password" className="text-white text-xs font-semibold uppercase tracking-wider">
              Password
            </Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                className="bg-white/10 text-white border-white/20 placeholder:text-gray-400 h-11 pr-12 focus:ring-yellow-500/50"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition-colors"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Login Button */}
          <Button
            onClick={handleLogin}
            disabled={loading}
            className="w-full h-11 bg-yellow-600 hover:bg-yellow-700 text-white font-bold rounded-lg transition-all duration-300 shadow-lg shadow-yellow-900/20 disabled:opacity-70"
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                Authenticating...
              </div>
            ) : (
              "Login to Dashboard"
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;