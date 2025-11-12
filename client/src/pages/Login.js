import React, { useState } from "react";
import API from "../api";
import { useNavigate } from "react-router-dom";

export default function Login(){
  const [form, setForm] = useState({ email:'', password:'' });
  const nav = useNavigate();

  const submit = async () => {
    try {
      const res = await API.post("/auth/login", form);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      nav("/home");
    } catch (err) {
      alert(err.response?.data?.message || err.response?.data?.msg || "Login failed");
    }
  };

  return (
    <main className="page container">
      <div className="card" style={{maxWidth:520,margin:'40px auto'}}>
        <h2>Login</h2>
        <input className="form-input" placeholder="Email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} />
        <input className="form-input" placeholder="Password" type="password" value={form.password} onChange={e=>setForm({...form,password:e.target.value})} />
        <button className="btn" onClick={submit}>Login</button>
      </div>
    </main>
  );
}
