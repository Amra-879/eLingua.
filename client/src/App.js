import './App.css';
import { Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import Home from "./components/Home";
import Login from "./pages/login/Login";
import Register from "./pages/register/Register";
import About from "./components/About";
import AdminPrompts from "./pages/admin/prompts";
import LanguageSelect from "./pages/student/LanguageSelect";
import PromptList from './pages/student/PromptList';
import EssaySubmission from "./pages/student/EssaySubmission";
import AudioEssaySubmission from "./pages/student/AudioEssaySubmission";
import MyEssays from "./pages/student/MyEssays";
import EssayDetail from "./pages/student/EssayDetail";
import Pending from "./pages/professor/PendingEssays";
import Graded from "./pages/professor/GradedEssays";
import ReviewSubmission from "./pages/professor/ReviewSubmission";
import AdminProfessors from "./pages/admin/Professors";
import AdminDashboard from "./pages/admin/Dashboard";
import ProfessorDashboard from "./pages/professor/Dashboard";







function App() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-white to-gray-50 text-gray-900">
      
      <Navbar />

      <div className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/admin/prompts" element={<AdminPrompts />} />
          <Route path="/prompts" element={<LanguageSelect />} />
          <Route path="/prompts/:languageId" element={<PromptList />} />
          <Route path="/essay/:promptId" element={<EssaySubmission />} /> 
          <Route path="/audio/:promptId" element={<AudioEssaySubmission />} />
          <Route path="/my-essays" element={<MyEssays />} />
          <Route path="/my-essays/:id" element={<EssayDetail />} />
          <Route path="/about" element={<About />} />
          <Route path="/professor/pending" element={<Pending />} />
          <Route path="/professor/graded" element={<Graded />} />
          <Route path="/professor/review/:id" element={<ReviewSubmission />} />
          <Route path="/admin/professors" element={<AdminProfessors />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/professor/dashboard" element={<ProfessorDashboard />} />

        </Routes>
      </div>

      <Footer />
    </div>
  );
}

export default App;
