import "./App.css";
import Login from "./pages/Auth/login";
import Register from "./pages/Auth/register";
import Dashboard from "./pages/Dashboard";
import { Route, Routes, Navigate } from "react-router-dom";
import { AuthContext, AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import GuestRoute from "./components/GuestRoute";
import NotFoundPage from "./pages/404";

function App() {

  return (
    <div className="App dark:text-white  transition-all">
      <AuthProvider>
        <AuthContext.Consumer>
          {({ loading }) => {
            return (
              <div>
                {/* <div className="fixed right-0 top-0 mr-2 mt-2 md:mr-4 md:mt-4">
                  <Toggle />
                </div> */}
                {!loading && (
                  <Routes>
                     <Route path='*' element={<NotFoundPage />} />
                    <Route
                      path="/"
                      exact
                      element={<Navigate replace to="/login" />}
                    />
                    <Route
                      path="/login"
                      element={
                        <GuestRoute>
                          <Login />
                        </GuestRoute>
                      }
                    />
                    <Route
                      path="/register"
                      element={
                        <GuestRoute>
                          <Register />
                        </GuestRoute>
                      }
                    />
                    <Route
                      path="/dashboard/*"
                      element={
                        <ProtectedRoute>
                          <Dashboard />
                        </ProtectedRoute>
                      }
                    />
                  </Routes>
                )}
                {loading && <p>Loading State</p>}
              </div>
            );
          }}
        </AuthContext.Consumer>
      </AuthProvider>
    </div>
  );
}

export default App;
