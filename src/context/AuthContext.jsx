import React, { createContext, useContext, useEffect, useState } from "react";

export const AuthContext = createContext();
export function useAuth() {
  return useContext(AuthContext);
}

// Demo users (roles are all lower-case)
const initialUsers = [
  {
    name: "Aditi Sharma",
    email: "admin@farmconnect.com",   // single hardcoded admin
    password: "admin123",
    role: "admin",
    status: "active",
    createdAt: new Date().toISOString(),
    avatarUrl: "https://via.placeholder.com/150?text=Admin",
    profile: {}
  },
  {
    name: "Sana Qureshi",
    email: "buyer@farmconnect.com",
    password: "buyer123",
    role: "buyer",
    status: "active",
    createdAt: new Date().toISOString(),
    avatarUrl: "https://via.placeholder.com/150?text=Buyer",
    profile: {}
  },
  {
    name: "Rajesh Kumar",
    email: "seller@farmconnect.com",
    password: "seller123",
    role: "seller",
    status: "active",
    createdAt: new Date().toISOString(),
    avatarUrl: "https://via.placeholder.com/150?text=Seller",
    profile: {}
  }
];

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [users, setUsers] = useState(initialUsers);
  const [authError, setAuthError] = useState("");
  const [loading, setLoading] = useState(true); // NEW

  // Persist user in localStorage
  useEffect(() => {
    const saved = localStorage.getItem("fc_user");
    if (saved) setUser(JSON.parse(saved));
    setLoading(false); // done restoring
  }, []);

  useEffect(() => {
    if (user) localStorage.setItem("fc_user", JSON.stringify(user));
    else localStorage.removeItem("fc_user");
  }, [user]);

  // Login (case-insensitive, lowercase role and email)
  function login(email, password) {
    setAuthError("");
    if (!email || !password) {
      setAuthError("Email and password required");
      return null;
    }
    const u = users.find(
      u =>
        u.email === email.trim().toLowerCase() &&
        u.password === password &&
        u.status === "active"
    );
    if (!u) {
      setAuthError("Invalid email or password.");
      return null;
    }
    const loggedUser = { ...u };
    setUser(loggedUser);
    return loggedUser; // return user object so login page can redirect by role
  }

  // Logout
  function logout() {
    setUser(null);
    setAuthError("");
  }

  // Register new user (role and email always stored in lowercase)
  function register(newUser) {
    setAuthError("");
    if (!newUser.email || !newUser.password || !newUser.name) {
      setAuthError("All fields required");
      return false;
    }

    const email = newUser.email.trim().toLowerCase();
    const role = (newUser.role || "buyer").toLowerCase();

    // Do NOT allow creating new admins from the UI
    if (role === "admin") {
      setAuthError("Admin accounts cannot be created from registration.");
      return false;
    }

    if (users.find(u => u.email === email)) {
      setAuthError("Email already exists");
      return false;
    }

    const getAvatarUrl = role => {
      switch (role) {
        case "admin":
          return "https://via.placeholder.com/150?text=Admin";
        case "seller":
          return "https://via.placeholder.com/150?text=Seller";
        default:
          return "https://via.placeholder.com/150?text=Buyer";
      }
    };

    const userObj = {
      ...newUser,
      email,
      role,
      status: "active",
      createdAt: new Date().toISOString(),
      avatarUrl: getAvatarUrl(role),
      profile: {}
    };

    setUsers(u => [...u, userObj]);
    setUser(userObj); // auto-login buyer/seller
    return true;
  }

  // Admin user management
  function allUsers() {
    return users;
  }
  function suspendUser(email) {
    setUsers(u =>
      u.map(i =>
        i.email === email.toLowerCase()
          ? { ...i, status: "suspended" }
          : i
      )
    );
    if (user?.email === email.toLowerCase())
      setUser({ ...user, status: "suspended" });
  }
  function activateUser(email) {
    setUsers(u =>
      u.map(i =>
        i.email === email.toLowerCase()
          ? { ...i, status: "active" }
          : i
      )
    );
    if (user?.email === email.toLowerCase())
      setUser({ ...user, status: "active" });
  }
  function clearAuthError() {
    setAuthError("");
  }

  const value = {
    user,
    users,
    authError,
    loading,       // NEW
    login,
    logout,
    register,
    clearAuthError,
    allUsers,
    suspendUser,
    activateUser
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
