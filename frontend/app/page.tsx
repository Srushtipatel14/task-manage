"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Task from "../components/task/task";
import { API_AUTH_URL } from "@/utils/config";
import axios from "axios";

export default function HomePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  const getUser = () => {
    const cached = localStorage.getItem('logged_user');
    if (!cached) return null;
    return JSON.parse(cached); 
  };

  const initAuth = async () => {
    const cached = getUser();
    if (!cached) {
      router.push("/signin");
      return;
    }

    const res = await axios.get(`${API_AUTH_URL}/me`, { withCredentials:true });

    if (!res.data.success) {
      localStorage.removeItem('logged_user'); 
      router.push("/signin");
      return;
    }
    localStorage.setItem('logged_user', JSON.stringify(res.data.data));
    setLoading(false);
  };


  useEffect(() => {
    initAuth();
  }, []);

  if (loading) {
    return (
      <div className="loader-container">
        <div className="loader"></div>
      </div>
    );
  }

  return <Task />;
}