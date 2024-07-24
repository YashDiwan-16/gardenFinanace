// AuthContext.tsx
import React, { createContext, useContext, useState, useEffect } from "react";
import { ethers } from "ethers";

interface AuthContextType {
  isAuthenticated: boolean;
  login: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkMetaMask = async () => {
      if (window.ethereum) {
        const accounts = await window.ethereum.request({
          method: "eth_accounts",
        });
        if (accounts.length > 0) {
          setIsAuthenticated(true);
        }
      }
    };
    checkMetaMask();
  }, []);

  const login = async () => {
    if (window.ethereum) {
      try {
        await window.ethereum.request({ method: "" });
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        await signer.getAddress();
        setIsAuthenticated(true);
      } catch (error) {
        console.error("Error connecting to MetaMask:", error);
      }
    } else {
      console.error("MetaMask not detected");
      alert("Please install MetaMask to use this application.");
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
