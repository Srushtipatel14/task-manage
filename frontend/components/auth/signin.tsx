"use client";

import "../../css/auth.css";
import { useRouter } from "next/navigation";
import { API_AUTH_URL } from "../../utils/config";
import { toast, ToastContainer } from "react-toastify";
import { useState } from "react";
import axios from "axios";

const Signin = () => {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const submitForm = async () => {
    try {
      if (!email || !password) {
        return toast.error("All fields are required");
      }

      const payload = { email, password }

      const res = await axios.post(`${API_AUTH_URL}/signin`, payload, { withCredentials: true });

      if (res.data.success) {
        const resVal = res.data.data;
        const val = {
          id:resVal.id,
          email: resVal.email,
          role: resVal.role
        }
        localStorage.setItem("logged_user", JSON.stringify(val));
        router.push("/");
      }
    } catch (err: any) {
      const message = err?.response?.data?.message || err?.message || "Something went wrong";
      toast.error(message);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="auth-title">Welcome Back</h2>

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
          Sign In
        </button>

        <p className="auth-text">
          Don't have an account?{" "}
          <span
            className="auth-link"
            onClick={() => router.push("/signup")}
          >
            Signup
          </span>
        </p>
      </div>

      <ToastContainer />
    </div>
  );
};

export default Signin;