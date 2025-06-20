import { Routes, Route } from "react-router-dom";
import { Navbar } from "./components/Navbar";
import { LandingPage } from "./pages/LandingPage";
import { LoginPage } from "./pages/LoginPage";
import { Home } from "./pages/Home";
import { CreateGroupPage } from "./pages/CreateGroupPage";
import { FindGroupPage } from "./pages/FindGroupPage";

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
        </Routes>
      </div>
    </div>
  );
};

export default App;