import Navbar from "./components/Navbar";
import JobListingsPage from "./pages/JobListingsPage";
import JobDetailPage from "./pages/JobDetailPage";
import UserProfilePage from "./pages/UserProfilePage"; // Added import
import { BrowserRouter, Routes, Route } from "react-router";
import "./App.css";
import AdminDashboard from "./pages/AdminDashboard";

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Navbar />
        <Routes>
          <Route path="/" element={<JobListingsPage />} />
          <Route path="/jobs/:jobId" element={<JobDetailPage />} />
          <Route path="/profile" element={<UserProfilePage />} />{" "}
          {/* Added profile route */}
          <Route path="/admin" element={<AdminDashboard />} />{" "}
          {/* Added admin route */}
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
