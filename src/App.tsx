import "./App.css";
import React from "react";
import Starfield from "react-starfield";
import NavBar from "./components/NavBar";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./components/HomePage";
import TransactionPage from "./components/TransactionPage";
// import ProtectedRoute from "./components/middleware/ProtectedRoute";
// import { AuthProvider } from "./components/middleware/AuthContext";

const App: React.FC = () => {
  return (
    <>
      <Router>
        <Starfield
          speedFactor={0.02}
          starCount={5500}
          backgroundColor="black"
          starColor={[255, 255, 255]}
        />
        <NavBar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          {/* <Route
              path="/TransactionPage"
              element={<ProtectedRoute element={<TransactionPage />} />}
            /> */}
          <Route path="/TransactionPage" element={<TransactionPage />} />
        </Routes>
      </Router>
    </>
  );
};

export default App;
