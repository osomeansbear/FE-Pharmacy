"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { loginUser } from "../../../api/auth.api";
import { useAuthStore } from "../../../stores/authStore";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const login = useAuthStore((state) => state.login);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }

    try {
      const res = await loginUser(email, password);
      localStorage.setItem("token", res.token);
      login(
        {
          id: res.id,
          email: res.email,
          fullName: res.fullName,
          phone: res.phone,
          role: res.role,
          isActive: res.isActive,
        },
        res.token,
      );

      if (res.role === "ADMIN") {
        router.push("/admin/products");
        return;
      }
      router.push("/shop");
    } catch {
      setError("Login failed. Please check your credentials.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-secondary">
      <div className="bg-white p-8 rounded-lg border border-border w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Login</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-success"
              placeholder="Enter your email"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-success"
              placeholder="Enter your password"
            />
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            type="submit"
            className="w-full bg-success text-white py-2 rounded-lg font-medium hover:bg-success/90 transition"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
