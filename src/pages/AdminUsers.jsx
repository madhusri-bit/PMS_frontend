import React, { useEffect, useState } from "react";
import api from "../api/axios";
import {
  Container,
  Paper,
  Typography,
  Button,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Select,
  MenuItem,
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from "@mui/material";

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [toast, setToast] = useState({ open: false, msg: "", sev: "success" });

  const [openForm, setOpenForm] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [form, setForm] = useState({
    username: "",
    name: "",
    email: "",
    password: "",
    role: "ROLE_EMPLOYEE", // default
  });

  const loadUsers = async () => {
    try {
      const { data } = await api.get("/users");
      setUsers(data);
    } catch {
      setToast({ open: true, msg: "Failed to load users", sev: "error" });
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleOpenForm = (user = null) => {
    if (user) {
      setEditingUser(user);
      setForm({
        username: user.username,
        name: user.name,
        email: user.email,
        password: "",
        role: user.role.name, // e.g. "ROLE_EMPLOYEE"
      });
    } else {
      setEditingUser(null);
      setForm({
        username: "",
        name: "",
        email: "",
        password: "",
        role: "ROLE_EMPLOYEE",
      });
    }
    setOpenForm(true);
  };

  const handleSave = async () => {
    try {
      // simple validation before saving
      if (
        !form.username ||
        !form.name ||
        !form.email ||
        (!editingUser && !form.password) ||
        !form.role
      ) {
        setToast({ open: true, msg: "All fields are required", sev: "error" });
        return;
      }

      if (editingUser) {
        await api.put(`/users/${editingUser.id}`, form);
        setToast({ open: true, msg: "User updated", sev: "success" });
      } else {
        await api.post("/users", form);
        setToast({ open: true, msg: "User created", sev: "success" });
      }
      setOpenForm(false);
      loadUsers();
    } catch {
      setToast({ open: true, msg: "Operation failed", sev: "error" });
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/users/${id}`);
      setToast({ open: true, msg: "User deleted", sev: "success" });
      loadUsers();
    } catch {
      setToast({ open: true, msg: "Delete failed", sev: "error" });
    }
  };

  return (
    <Container sx={{ mt: 3 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Manage Users
        </Typography>
        <Button
          variant="contained"
          sx={{ mb: 2 }}
          onClick={() => handleOpenForm()}
        >
          + Add User
        </Button>

        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Username</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((u) => (
              <TableRow key={u.id}>
                <TableCell>{u.id}</TableCell>
                <TableCell>{u.username}</TableCell>
                <TableCell>{u.name}</TableCell>
                <TableCell>{u.email}</TableCell>
                <TableCell>{u.role.name}</TableCell>
                <TableCell>
                  <Button
                    variant="outlined"
                    onClick={() => handleOpenForm(u)}
                    sx={{ mr: 1 }}
                  >
                    Edit
                  </Button>
                  {/* Hide delete for Admins */}
                  {u.role.name !== "ROLE_ADMIN" && (
                    <Button
                      color="error"
                      variant="contained"
                      onClick={() => handleDelete(u.id)}
                    >
                      Delete
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>

      {/* Add/Edit Dialog */}
      <Dialog open={openForm} onClose={() => setOpenForm(false)}>
        <DialogTitle>{editingUser ? "Edit User" : "Add User"}</DialogTitle>
        <DialogContent
          sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}
        >
          <TextField
            required
            label="Username"
            value={form.username}
            onChange={(e) => setForm({ ...form, username: e.target.value })}
          />
          <TextField
            required
            label="Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <TextField
            required
            label="Email"
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
          {!editingUser && (
            <TextField
              required
              label="Password"
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
          )}
          <Select
            required
            value={form.role}
            onChange={(e) => setForm({ ...form, role: e.target.value })}
          >
            {/* No admin option here */}
            <MenuItem value="ROLE_MANAGER">Manager</MenuItem>
            <MenuItem value="ROLE_EMPLOYEE">Employee</MenuItem>
          </Select>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenForm(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSave}>
            {editingUser ? "Update" : "Create"}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={toast.open}
        autoHideDuration={2000}
        onClose={() => setToast({ ...toast, open: false })}
      >
        <Alert severity={toast.sev}>{toast.msg}</Alert>
      </Snackbar>
    </Container>
  );
};

export default AdminUsers;
