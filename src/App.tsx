import "./App.css";
import React from "react";
import Starfield from "react-starfield";
import NavBar from "./components/NavBar";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./components/HomePage";
import TransactionPage from "./components/TransactionPage";

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
          <Route path="/transactionPage" element={<TransactionPage />} />
        </Routes>
      </Router>
    </>
  );
};

export default App;
