import React, { useEffect, useState } from "react";
import { Edit as EditIcon } from "@mui/icons-material";

import api from "../api/axios";
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Table,
  TableHead,
  TableCell,
  TableRow,
  TableBody,
  Box,
  IconButton,
  Snackbar,
  Alert,
  Divider,
  Card,
  CardContent,
  TableContainer,
  Chip,
  Avatar,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
  InputAdornment,
} from "@mui/material";
import {
  Delete as DeleteIcon,
  Add as AddIcon,
  Business as BusinessIcon,
  Person as PersonIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Warning as WarningIcon,
} from "@mui/icons-material";

const Suppliers = () => {
  const [list, setList] = useState([]);
  const [form, setForm] = useState({
    name: "",
    contactPerson: "",
    email: "",
    phoneNumber: "",
  });
  // inside Suppliers component
  const [searchTerm, setSearchTerm] = useState("");

  // filtered list
  const filteredList = list.filter((supplier) => {
    const term = searchTerm.toLowerCase();
    return (
      supplier.name?.toLowerCase().includes(term) ||
      supplier.contactPerson?.toLowerCase().includes(term) ||
      supplier.email?.toLowerCase().includes(term) ||
      supplier.phoneNumber?.toLowerCase().includes(term)
    );
  });

  const [toast, setToast] = useState({ open: false, msg: "", sev: "success" });
  const [deleteDialog, setDeleteDialog] = useState({
    open: false,
    supplier: null,
  });
  const [editDialog, setEditDialog] = useState({
    open: false,
    supplier: null,
    form: { name: "", contactPerson: "", email: "", phoneNumber: "" },
  });

  const [loading, setLoading] = useState(false);
  const [formLoading, setFormLoading] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/suppliers");
      setList(data);
    } catch (error) {
      setToast({
        open: true,
        msg: "Failed to load suppliers",
        sev: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const create = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    try {
      await api.post("/suppliers", form);
      setForm({ name: "", contactPerson: "", email: "", phoneNumber: "" });
      setToast({
        open: true,
        msg: "Supplier added successfully",
        sev: "success",
      });
      load();
    } catch (error) {
      setToast({
        open: true,
        msg: "Failed to add supplier",
        sev: "error",
      });
    } finally {
      setFormLoading(false);
    }
  };

  const handleDeleteClick = (supplier) => {
    setDeleteDialog({ open: true, supplier });
  };

  const confirmDelete = async () => {
    if (!deleteDialog.supplier) return;

    try {
      await api.delete("/suppliers/" + deleteDialog.supplier.id);
      setToast({
        open: true,
        msg: "Supplier deleted successfully",
        sev: "info",
      });
      load();
    } catch (err) {
      const msg =
        err.response?.data?.error ||
        "Cannot delete supplier. Please delete its products first.";
      setToast({ open: true, msg, sev: "warning" });
    } finally {
      setDeleteDialog({ open: false, supplier: null });
    }
  };

  const getInitials = (name) => {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const handleEditClick = (supplier) => {
    setEditDialog({
      open: true,
      supplier,
      form: { ...supplier },
    });
  };
  const confirmEdit = async () => {
    try {
      setFormLoading(true);
      const { supplier, form } = editDialog;
      await api.put(`/suppliers/${supplier.id}`, form);
      setToast({
        open: true,
        msg: "Supplier updated successfully",
        sev: "success",
      });
      setEditDialog({
        open: false,
        supplier: null,
        form: { name: "", contactPerson: "", email: "", phoneNumber: "" },
      });
      load(); // reload supplier list
    } catch (err) {
      setToast({
        open: true,
        msg: err.response?.data?.error || "Failed to update supplier",
        sev: "error",
      });
    } finally {
      setFormLoading(false);
    }
  };
  const cancelEdit = () => {
    setEditDialog({
      open: false,
      supplier: null,
      form: { name: "", contactPerson: "", email: "", phoneNumber: "" },
    });
  };

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      {/* Header Section */}
      <Box sx={{ mb: 4 }}>
        <Typography
          variant="h4"
          component="h1"
          sx={{
            fontWeight: 600,
            color: "primary.main",
            mb: 1,
            display: "flex",
            alignItems: "center",
            gap: 2,
          }}
        >
          <BusinessIcon sx={{ fontSize: 40 }} />
          Supplier Management
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Manage your suppliers and their contact information
        </Typography>
      </Box>

      {/* Add Supplier Form */}
      <Card sx={{ mb: 4, boxShadow: 3 }}>
        <CardContent sx={{ p: 4 }}>
          <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
            <AddIcon sx={{ mr: 1, color: "primary.main" }} />
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Add New Supplier
            </Typography>
          </Box>

          <Divider sx={{ mb: 3 }} />

          <Box
            component="form"
            onSubmit={create}
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
              gap: 3,
            }}
          >
            <TextField
              label="Company Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
              fullWidth
              variant="outlined"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <BusinessIcon sx={{ color: "action.active" }} />
                  </InputAdornment>
                ),
              }}
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
            />

            <TextField
              label="Contact Person"
              value={form.contactPerson}
              onChange={(e) =>
                setForm({ ...form, contactPerson: e.target.value })
              }
              fullWidth
              variant="outlined"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PersonIcon sx={{ color: "action.active" }} />
                  </InputAdornment>
                ),
              }}
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
            />

            <TextField
              label="Email Address"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              type="email"
              fullWidth
              variant="outlined"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailIcon sx={{ color: "action.active" }} />
                  </InputAdornment>
                ),
              }}
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
            />

            <TextField
              label="Phone Number"
              value={form.phoneNumber}
              onChange={(e) =>
                setForm({ ...form, phoneNumber: e.target.value })
              }
              fullWidth
              variant="outlined"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PhoneIcon sx={{ color: "action.active" }} />
                  </InputAdornment>
                ),
              }}
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
            />

            <Box />

            <Button
              type="submit"
              variant="contained"
              size="large"
              disabled={formLoading || !form.name.trim()}
              startIcon={<AddIcon />}
              sx={{
                borderRadius: 2,
                py: 1.5,
                textTransform: "none",
                fontSize: "1rem",
                fontWeight: 600,
              }}
            >
              {formLoading ? "Adding..." : "Add Supplier"}
            </Button>
          </Box>
        </CardContent>
      </Card>

      {/* Suppliers List */}
      <Card sx={{ boxShadow: 3 }}>
        <CardContent sx={{ p: 0 }}>
          <Box sx={{ p: 3, pb: 0 }}>
            <Divider />
          </Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 2,
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Suppliers Directory
            </Typography>

            <TextField
              size="small"
              variant="outlined"
              placeholder="Search suppliers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <BusinessIcon sx={{ color: "action.active" }} />
                  </InputAdornment>
                ),
              }}
              sx={{ width: 280 }}
            />

            <Chip
              label={`${filteredList.length} Supplier${
                filteredList.length !== 1 ? "s" : ""
              }`}
              color="primary"
              variant="outlined"
            />
          </Box>

          <TableContainer>
            <Table sx={{ minWidth: 650 }}>
              <TableHead>
                <TableRow sx={{ backgroundColor: "grey.50" }}>
                  <TableCell sx={{ fontWeight: 600, py: 2 }}>Company</TableCell>
                  <TableCell sx={{ fontWeight: 600, py: 2 }}>
                    Contact Person
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600, py: 2 }}>Email</TableCell>
                  <TableCell sx={{ fontWeight: 600, py: 2 }}>Phone</TableCell>
                  <TableCell
                    sx={{ fontWeight: 600, py: 2, textAlign: "center" }}
                  >
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredList.map((supplier) => (
                  <TableRow
                    key={supplier.id}
                    sx={{
                      "&:hover": { backgroundColor: "grey.50" },
                      "&:last-child td, &:last-child th": { border: 0 },
                    }}
                  >
                    <TableCell sx={{ py: 2 }}>
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 2 }}
                      >
                        <Avatar
                          sx={{
                            bgcolor: "primary.main",
                            width: 36,
                            height: 36,
                            fontSize: "0.9rem",
                          }}
                        >
                          {getInitials(supplier.name)}
                        </Avatar>
                        <Typography
                          variant="subtitle2"
                          sx={{ fontWeight: 600 }}
                        >
                          {supplier.name}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell sx={{ py: 2 }}>
                      <Typography variant="body2">
                        {supplier.contactPerson || "-"}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ py: 2 }}>
                      <Typography variant="body2" color="primary.main">
                        {supplier.email || "-"}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ py: 2 }}>
                      <Typography variant="body2">
                        {supplier.phoneNumber || "-"}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ py: 2, textAlign: "center" }}>
                      <Tooltip title="Edit Supplier">
                        <IconButton
                          onClick={() => handleEditClick(supplier)}
                          color="primary"
                        >
                          <EditIcon />
                        </IconButton>
                      </Tooltip>

                      <Tooltip title="Delete Supplier">
                        <IconButton
                          onClick={() => handleDeleteClick(supplier)}
                          color="error"
                          size="small"
                          sx={{
                            "&:hover": {
                              backgroundColor: "error.light",
                              color: "white",
                            },
                          }}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}

                {filteredList.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} sx={{ textAlign: "center", py: 6 }}>
                      <Box sx={{ color: "text.secondary" }}>
                        <BusinessIcon
                          sx={{ fontSize: 48, mb: 2, opacity: 0.5 }}
                        />
                        <Typography variant="h6" sx={{ mb: 1 }}>
                          No suppliers found
                        </Typography>
                        <Typography variant="body2">
                          Add your first supplier to get started
                        </Typography>
                      </Box>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialog.open}
        onClose={() => setDeleteDialog({ open: false, supplier: null })}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <WarningIcon color="warning" />
          Confirm Deletion
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete "{deleteDialog.supplier?.name}"?
            This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 1 }}>
          <Button
            onClick={() => setDeleteDialog({ open: false, supplier: null })}
            variant="outlined"
            sx={{ textTransform: "none" }}
          >
            Cancel
          </Button>
          <Button
            onClick={confirmDelete}
            color="error"
            variant="contained"
            sx={{ textTransform: "none" }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={editDialog.open} onClose={cancelEdit}>
        <DialogTitle>Edit Supplier</DialogTitle>
        <DialogContent sx={{ display: "grid", gap: 2, mt: 1 }}>
          <TextField
            label="Company Name"
            value={editDialog.form.name}
            onChange={(e) =>
              setEditDialog({
                ...editDialog,
                form: { ...editDialog.form, name: e.target.value },
              })
            }
            fullWidth
          />
          <TextField
            label="Contact Person"
            value={editDialog.form.contactPerson}
            onChange={(e) =>
              setEditDialog({
                ...editDialog,
                form: { ...editDialog.form, contactPerson: e.target.value },
              })
            }
            fullWidth
          />
          <TextField
            label="Email"
            value={editDialog.form.email}
            onChange={(e) =>
              setEditDialog({
                ...editDialog,
                form: { ...editDialog.form, email: e.target.value },
              })
            }
            type="email"
            fullWidth
          />
          <TextField
            label="Phone"
            value={editDialog.form.phoneNumber}
            onChange={(e) =>
              setEditDialog({
                ...editDialog,
                form: { ...editDialog.form, phoneNumber: e.target.value },
              })
            }
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={cancelEdit}>Cancel</Button>
          <Button onClick={confirmEdit} variant="contained" color="primary">
            {formLoading ? "Saving..." : "Save"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Toast Notifications */}
      <Snackbar
        open={toast.open}
        autoHideDuration={4000}
        onClose={() => setToast({ ...toast, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          severity={toast.sev}
          onClose={() => setToast({ ...toast, open: false })}
          sx={{ minWidth: 300 }}
        >
          {toast.msg}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Suppliers;
