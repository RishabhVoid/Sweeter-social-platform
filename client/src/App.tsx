import { BrowserRouter, Routes, Route } from "react-router-dom";
import StartupPage from "./pages/StartupPage";
import UriCheckPage from "./pages/UriCheckPage";
import SignUpPage from "./pages/SignUpPage";
import LogInPage from "./pages/LogInPage";
import DashboardPage from "./pages/DashboardPage";
import DmPage from "./pages/DmPage";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<StartupPage />} />
        <Route path="/auth">
          <Route path="uri_check" element={<UriCheckPage />} />
          <Route path="sign_up" element={<SignUpPage />} />
          <Route path="log_in" element={<LogInPage />} />
        </Route>
        <Route path="/app">
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="dms/:email" element={<DmPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
