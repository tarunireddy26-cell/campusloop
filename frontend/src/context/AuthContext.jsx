import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [student, setStudent] = useState(() => {
    try {
      const stored = localStorage.getItem("student");
      return stored ? JSON.parse(stored) : null;
    } catch (e) {
      console.error("Failed to parse stored student", e);
      return null;
    }
  });

  const [token, setToken] = useState(() => {
    return localStorage.getItem("token") || null;
  });

  const login = (studentData, authToken) => {
    const studentInfo = {
      id: studentData.id,
      name: studentData.name,
      email: studentData.email
    };
    setStudent(studentInfo);
    localStorage.setItem("student", JSON.stringify(studentInfo));

    if (authToken) {
      setToken(authToken);
      localStorage.setItem("token", authToken);
    }
  };

  const logout = () => {
    setStudent(null);
    setToken(null);
    localStorage.removeItem("student");
    localStorage.removeItem("token");
  };

  const updateStudent = (updatedData) => {
    setStudent((prev) => {
      const updated = { ...prev, ...updatedData };
      localStorage.setItem("student", JSON.stringify(updated));
      return updated;
    });
  };

  return (
    <AuthContext.Provider
      value={{
        student,
        token,
        isAuthenticated: !!student,
        login,
        logout,
        updateStudent
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
