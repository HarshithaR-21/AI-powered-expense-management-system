import { BrowserRouter, Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import SignUpPage from "./pages/SignUp";
import LoginPage from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import OpenPlan from "./pages/OpenPlan";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage/>} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/open-plan/:planId" element={<OpenPlan />} />
      </Routes>
    </BrowserRouter>
  )
}
export default App;