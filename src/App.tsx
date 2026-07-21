import { Routes, Route } from "react-router-dom";

import Layout from "./components/Layout";
import Landing from "./pages/Landing";
import Check from "./pages/Check";
import Result from "./pages/Result";
import Community from "./pages/Community";
import Organizations from "./pages/Organizations";
import VerifyProfile from "./pages/VerifyProfile";
import ForOrganizations from "./pages/ForOrganizations";
import Register from "./pages/Register";
import About from "./pages/About";
import Privacy from "./pages/Privacy";
import ApiDocs from "./pages/ApiDocs";
import Dashboard from "./pages/app/Dashboard";
import Admin from "./pages/Admin";
import NotFound from "./pages/NotFound";

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Landing />} />
        <Route path="/check" element={<Check />} />
        <Route path="/result/:id" element={<Result />} />
        <Route path="/community" element={<Community />} />
        <Route path="/organizations" element={<Organizations />} />
        <Route path="/verify/:slug" element={<VerifyProfile />} />
        <Route path="/for-organizations" element={<ForOrganizations />} />
        <Route path="/register" element={<Register />} />
        <Route path="/about" element={<About />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/api-docs" element={<ApiDocs />} />
        <Route path="/app/dashboard" element={<Dashboard />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
