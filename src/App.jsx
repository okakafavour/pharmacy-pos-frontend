import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import "./App.css";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Medicines from "./pages/Medicines";
import Customers from "./pages/Customers";
import Sales from "./pages/Sales";
import Supplier from "./pages/Supplier";
import Reports from "./pages/Reports";
import Restocks from "./pages/Restock";
import Users from "./pages/Users";

import DashboardLayout from "./layouts/DashboardLayout";

import ProtectedRoute from "./components/ProtectedRoutes";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route
          path="/"
          element={<Login />}
        />

        <Route
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >

          <Route
            path="/dashboard"
            element={<Dashboard />}
          />

          <Route
            path="/medicines"
            element={
              <ProtectedRoute
                allowedRoles={[
                  "admin",
                  "pharmacist",
                ]}
              >
                <Medicines />
              </ProtectedRoute>
            }
          />

          <Route
            path="/customers"
            element={
              <ProtectedRoute
                allowedRoles={[
                  "admin",
                  "cashier",
                ]}
              >
                <Customers />
              </ProtectedRoute>
            }
          />

          <Route
            path="/sales"
            element={
              <ProtectedRoute
                allowedRoles={[
                  "admin",
                  "cashier",
                ]}
              >
                <Sales />
              </ProtectedRoute>
            }
          />

          <Route
            path="/suppliers"
            element={
              <ProtectedRoute
                allowedRoles={[
                  "admin",
                  "manager",
                ]}
              >
                <Supplier />
              </ProtectedRoute>
            }
          />

          <Route
            path="/restocks"
            element={
              <ProtectedRoute
                allowedRoles={[
                  "admin",
                  "manager",
                  "pharmacist",
                ]}
              >
                <Restocks />
              </ProtectedRoute>
            }
          />

          <Route
            path="/reports"
            element={
              <ProtectedRoute
                allowedRoles={[
                  "admin",
                  "manager",
                ]}
              >
                <Reports />
              </ProtectedRoute>
            }
          />

          <Route
            path="/users"
            element={
              <ProtectedRoute
                allowedRoles={[
                  "admin",
                ]}
              >
                <Users />
              </ProtectedRoute>
            }
          />

        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App;