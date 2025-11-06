import React, { useState, useContext, useEffect, useRef } from "react";
import { AuthContext } from "../context/AuthContext.jsx";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import AnimatedButton from "../components/AnimatedButton.jsx";
import Loader from "../components/Loader.jsx";

/**
 * Login.jsx
 * - User login: email, password
 * - Animated form, accessible, with error/resume states
 * - Role-based dashboard redirection (admin, seller, buyer)
 * - Professional look, easy extension for OAuth/social etc.
 */

const loginAnimations = {
  initial: { opacity: 0, y: 25 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 25 }
};

export default function Login() {
  // Destructure all needed values from AuthContext ONCE at top level
  const { login, user, authError, clearAuthError } = useContext(AuthContext);
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: "", password: "" });
  const [showPwd, setShowPwd] = useState(false);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState("");
  const [forgot, setForgot] = useState(false);
  const emailInput = useRef();

  useEffect(() => {
    emailInput.current && emailInput.current.focus();
    clearAuthError();
    setToast("");
  }, [clearAuthError]);

  // Validation
  const errors = {};
  if (!form.email || !form.email.includes("@")) errors.email = "Valid email required";
  if (!form.password) errors.password = "Enter password";

  // Submit handler with role-based redirection
  async function onSubmit(e) {
    e.preventDefault();
    clearAuthError();
    if (Object.keys(errors).length) return setToast("Please fix highlighted fields.");
    setSaving(true);
    
    // login now returns the user object (or null)
    const loggedUser = await login(form.email, form.password);
    setSaving(false);
    
    if (loggedUser) {
      setToast("Login successful! Redirecting…");
      setTimeout(() => {
        // ✅ CORRECTED ROUTES - Match your App.jsx
        if (loggedUser.role === "admin") {
          navigate("/admin-dashboard");  // ✅ New admin dashboard
        } else if (loggedUser.role === "seller" || loggedUser.role === "farmer") {
          navigate("/seller-dashboard");  // ✅ Seller dashboard
        } else if (loggedUser.role === "buyer") {
          navigate("/buyer-dashboard");  // ✅ Buyer dashboard
        } else {
          navigate("/");  // Fallback for unknown roles
        }
      }, 950);
    } else {
      setToast("Invalid login details.");
    }
  }

  // Forgot password simulation
  function handleForgot(e) {
    e.preventDefault();
    setForgot(true);
    setTimeout(() => {
      setToast("Password reset link sent to your email (simulation)");
      setForgot(false);
    }, 2100);
  }

  //---------------------------

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#d7fff6] to-[#ebffef] px-3 pt-12">
      <motion.form
        className="w-full max-w-md bg-white/90 rounded-3xl shadow-2xl p-10 flex flex-col gap-5"
        {...loginAnimations}
        onSubmit={onSubmit}
        aria-label="Login Form"
      >
        <h2 className="text-2xl md:text-3xl font-extrabold text-green-900 mb-1">Sign In</h2>
        
        <label>
          Email
          <input
            ref={emailInput}
            className={errors.email ? "error" : ""}
            type="email"
            value={form.email}
            onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
            autoComplete="email"
            disabled={forgot}
          />
          {errors.email && <div className="form-error">{errors.email}</div>}
        </label>

        <label>
          Password
          <input
            className={errors.password ? "error" : ""}
            type={showPwd ? "text" : "password"}
            value={form.password}
            onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
            autoComplete="current-password"
            disabled={forgot}
          />
          {errors.password && <div className="form-error">{errors.password}</div>}
        </label>

        <button
          type="button"
          className="text-xs underline text-right text-green-800 hover:text-orange-600 mb-2 select-none"
          onClick={() => setShowPwd(v => !v)}
        >
          {showPwd ? "Hide" : "Show"} Password
        </button>

        <div className="flex gap-4 items-center mt-2 mb-1">
          <AnimatedButton
  type="submit"
  color="success"
  loading={saving}
  disabled={forgot}
  className="bg-green-600 hover:bg-green-700 text-white font-bold"
>
  Login
</AnimatedButton>

          <button
            type="button"
            onClick={handleForgot}
            className="text-xs underline text-green-900 decoration-dotted hover:text-orange-500"
            disabled={forgot}
          >
            Forgot password?
          </button>
        </div>

        <div className="text-center pt-1 text-sm">
          New user? <Link to="/register" className="underline text-blue-700">Create an account</Link>
        </div>
      </motion.form>

      {/* Toast/feedback for login */}
      <AnimatePresence>
        {(toast || authError || forgot) && (
          <motion.div className="toast" {...loginAnimations}>
            {forgot ? <Loader label="Sending reset email..." /> : (toast || authError)}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
