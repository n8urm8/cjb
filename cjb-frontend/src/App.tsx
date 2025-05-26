import Navbar from "./components/Navbar";
import JobListingsPage from "./pages/JobListingsPage";
import JobDetailPage from "./pages/JobDetailPage";
import UserProfilePage from "./pages/UserProfilePage"; // Added import
import { BrowserRouter, Routes, Route } from "react-router";
import "./App.css";
import AdminDashboard from "./pages/AdminDashboard";
import JobAddPage from "./pages/JobAddPage";
import JobEditPage from "./pages/JobEditPage";

function App() {
  return (
    <BrowserRouter>
      <div
        className="App min-h-screen"
        style={{
          background:
            "linear-gradient(135deg, var(--color-white) 0%, var(--color-primary-light) 100%)",
          color: "var(--color-black)",
        }}
      >
        <Navbar />
        <Routes>
          <Route path="/" element={<JobListingsPage />} />
          <Route path="/jobs/add" element={<JobAddPage />} />
          <Route path="/jobs/:jobId/edit" element={<JobEditPage />} />
          <Route path="/jobs/:jobId" element={<JobDetailPage />} />
          <Route path="/profile" element={<UserProfilePage />} />
          {/* Added profile route */}
          <Route path="/admin" element={<AdminDashboard />} />
          {/* Added admin route */}
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
