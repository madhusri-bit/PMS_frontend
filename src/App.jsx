import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider, CssBaseline } from "@mui/material";
import theme from "./theme";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import RoleProtectedRoute from "./components/RoleProtectedRoute";

// Pages
import Login from "./pages/Login";
import Home from "./pages/Home";
import Products from "./pages/Products";
import Categories from "./pages/Categories";
import Suppliers from "./pages/Suppliers";

// Inventory Pages
import InventoryDashboard from "./pages/InventoryDashboard";
import AdjustInventory from "./pages/AdjustInventory";
import InventoryHistory from "./pages/InventoryHistory";
import AdminUsers from "./pages/AdminUsers";

const App = () => (
  <BrowserRouter>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Navbar />
        <Routes>
          {/* Public */}
          <Route path="/login" element={<Login />} />

          {/* Protected Home */}
          <Route
            path="/"
            element={
                <Home />
            }
          />

          {/* Products */}
          <Route
            path="/products"
            element={
              <RoleProtectedRoute allowed={["ADMIN", "MANAGER"]}>
                <Products />
              </RoleProtectedRoute>
            }
          />

          {/* Categories */}
          <Route
            path="/categories"
            element={
              <RoleProtectedRoute allowed={["ADMIN", "MANAGER"]}>
                <Categories />
              </RoleProtectedRoute>
            }
          />

          {/* Suppliers */}
          <Route
            path="/suppliers"
            element={
              <RoleProtectedRoute allowed={["ADMIN", "MANAGER"]}>
                <Suppliers />
              </RoleProtectedRoute>
            }
          />

          {/* Inventory Dashboard */}
          <Route
            path="/inventory"
            element={
              <RoleProtectedRoute allowed={["ADMIN", "MANAGER", "EMPLOYEE"]}>
                <InventoryDashboard />
              </RoleProtectedRoute>
            }
          />

          {/* Adjust Stock Page */}
          <Route
            path="/inventory/:id/adjust"
            element={
              <RoleProtectedRoute allowed={["ADMIN", "MANAGER", "EMPLOYEE"]}>
                <AdjustInventory />
              </RoleProtectedRoute>
            }
          />
          <Route
            path="/admin/users"
            element={
              <RoleProtectedRoute allowed={["ADMIN"]}>
                <AdminUsers />
              </RoleProtectedRoute>
            }
          />

          {/* Inventory History */}
          <Route
            path="/inventory/:id/history"
            element={
              <RoleProtectedRoute allowed={["ADMIN", "MANAGER", "EMPLOYEE"]}>
                <InventoryHistory />
              </RoleProtectedRoute>
            }
          />
        </Routes>
      </AuthProvider>
    </ThemeProvider>
  </BrowserRouter>
);

export default App;
