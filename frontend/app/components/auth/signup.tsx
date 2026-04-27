"use client";

import "../../css/auth.css";
import { useRouter } from "next/navigation";
import { API_AUTH_URL } from "../../utils/config";
import { toast, ToastContainer } from "react-toastify";
import { useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";

const Signup = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const submitForm = async () => {
    try {
      if (!email || !password) {
        return toast.error("All fields are required");
      }

      const payload = { email, password }

      const res = await axios.post(`${API_AUTH_URL}/signup`, payload);

      if (res.data.success) {
        const resVal = res.data.data;
        const val = {
          id: resVal.id,
          email: resVal.email,
          role: resVal.role
        }
        Cookies.set("logged_user", JSON.stringify(val), { expires: 1 });
        router.push("/");
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Signup failed");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="auth-title">Create Account</h2>

        <input
          type="email"
          placeholder="Enter email"
          className="auth-input"
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Enter password"
          className="auth-input"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button className="auth-button" onClick={submitForm}>
          Sign Up
        </button>

        <p className="auth-text">
          Already have an account?{" "}
          <span
            className="auth-link"
            onClick={() => router.push("/signin")}
          >
            Login
          </span>
        </p>
      </div>

      <ToastContainer />
    </div>
  );
};

export default Signup;