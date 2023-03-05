import Login from "./components/login";
import Home from "./components/home";
import SignUp from "./components/signup";
import EmailVerification from "./components/emailverification";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";

function App() {
  return (
    <div>
      <Router>
        <Routes>
          <Route path="/home" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/verification" element={<EmailVerification />} />
          <Route exact path="/" element={<Login />} />
          {/* <Navigate to="/" /> */}
        </Routes>
      </Router>
    </div>
  );
}

export default App;
