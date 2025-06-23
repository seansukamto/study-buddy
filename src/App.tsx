import { Routes, Route } from "react-router-dom";
import { Navbar } from "./components/Navbar";
import { LandingPage } from "./pages/LandingPage";
import { LoginPage } from "./pages/LoginPage";
import { Home } from "./pages/Home";
import { CreateGroupPage } from "./pages/CreateGroupPage";
import { FindGroupPage } from "./pages/FindGroupPage";
import { TimerPage } from "./pages/TimerPage";
import { CalendarPage } from "./pages/CalendarPage";
import { ToDoPage } from "./pages/ToDoPage";
import { CreateCommunityPage } from "./pages/CreateCommunityPage";
import { CommunitiesPage } from "./pages/CommunitiesPage";
import { CommunityPage } from "./pages/CommunityPage";

function App() {
  return (
    <div className="min-h-screen bg-black text-gray-100 transition-opacity duration-700 pt-20">
      <Navbar />
      <div className="container mx-auto px-4 py-6">
        <Routes>
          <Route path="/landing-page" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/" element={<Home />} />
          <Route path="/create-group" element={<CreateGroupPage />} />
          <Route path="/find-group/:id" element={<FindGroupPage />} />
          <Route path="/record-study-time" element={<TimerPage />} />
          <Route path="/calendar" element={<CalendarPage />} /> 
          <Route path="/todo" element={<ToDoPage />} /> 
          <Route path="/community/create" element={<CreateCommunityPage />} /> 
          <Route path="/communities" element={<CommunitiesPage />} />
          <Route path="/community/:id" element={<CommunityPage />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;