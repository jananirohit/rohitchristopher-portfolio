import { Route, Routes } from "react-router-dom";
import { Layout } from "./components/Layout";
import { RequireAuth } from "./components/RequireAuth";
import { Dashboard } from "./pages/Dashboard";
import { Home } from "./pages/Home";
import { Login } from "./pages/Login";
import { Notifications } from "./pages/Notifications";
import { Uploads } from "./pages/Uploads";

export function App() {
  return (
    <Routes>
      {/* The landing page renders STANDALONE — not inside <Layout>. It ships its own
          header, so nesting it in the app shell stacks two headers on `/`. Every
          AUTHENTICATED route belongs inside <Layout> below. */}
      <Route path="/" element={<Home destination="home" />} />
      <Route path="/about" element={<Home destination="about" />} />
      <Route path="/journey" element={<Home destination="journey" />} />
      <Route path="/impact" element={<Home destination="impact" />} />
      <Route path="/expertise" element={<Home destination="expertise" />} />
      <Route path="/projects" element={<Home destination="projects" />} />
      <Route path="/experience" element={<Home destination="experience" />} />
      <Route path="/whats-next" element={<Home destination="next" />} />
      <Route path="/contact" element={<Home destination="contact" />} />

      <Route element={<Layout />}>
        <Route path="/login" element={<Login />} />
        <Route
          path="/dashboard"
          element={
            <RequireAuth>
              <Dashboard />
            </RequireAuth>
          }
        />
        <Route
          path="/uploads"
          element={
            <RequireAuth>
              <Uploads />
            </RequireAuth>
          }
        />
        <Route
          path="/notifications"
          element={
            <RequireAuth>
              <Notifications />
            </RequireAuth>
          }
        />
      </Route>
    </Routes>
  );
}
