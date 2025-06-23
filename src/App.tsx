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

function App() {
  return (
    <div>
      <Navbar />
      <div>
        <Routes>
          <Route path="/landing-page" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/" element={<Home />} />
          <Route path="/create-group" element={<CreateGroupPage />} />
          <Route path="/find-group" element={<FindGroupPage />} />
          <Route path="/record-study-time" element={<TimerPage />} /> {/* TimerPage route */}
          <Route path="/calendar" element={<CalendarPage />} /> {/* CalendarPage route */}
          <Route path="/todo" element={<ToDoPage />} /> {/* ToDoPage route */}
        </Routes>
      </div>
    </div>
  );
}

export default App;