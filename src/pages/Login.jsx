import React, { useState } from "react";
import {
  Container,
  Paper,
  Typography,
  Box,
  TextField,
  Button,
  Alert,
} from "@mui/material";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { useLocation, useNavigate } from "react-router-dom";

const Login = () => {
  const [form, setForm] = useState({ username: "", password: "" });
  const [err, setErr] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();
  const loc = useLocation();

  const submit = async (e) => {
    e.preventDefault();
    setErr("");
    try {
      const { data } = await api.post("/auth/login", form); // backend: /api/auth/login
      // data = { token, role: 'ADMIN'|'MANAGER'|'EMPLOYEE', username }
      login({ token: data.token, role: data.role, username: data.username });
      const dest = loc.state?.from?.pathname || "/";
      navigate(dest, { replace: true });
    } catch {
      setErr("Invalid credentials");
    }
  };

  return (
    <Container maxWidth="sm">
      <Paper sx={{ p: 4, mt: 8 }} elevation={4}>
        <Typography variant="h4" align="center" gutterBottom>
          Sign in
        </Typography>
        {err && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {err}
          </Alert>
        )}
        <Box component="form" onSubmit={submit}>
          <TextField
            fullWidth
            margin="normal"
            label="Username"
            value={form.username}
            onChange={(e) => setForm({ ...form, username: e.target.value })}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Password"
            type="password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{ mt: 2, py: 1.2 }}
          >
            Login
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default Login;
