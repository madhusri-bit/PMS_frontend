// import React, { useEffect, useState } from "react";
// import api from "../api/axios";
// import {
//   Container,
//   Paper,
//   Typography,
//   TextField,
//   Button,
//   List,
//   ListItem,
//   ListItemText,
//   Box,
//   IconButton,
//   Snackbar,
//   Alert,
// } from "@mui/material";
// import DeleteIcon from "@mui/icons-material/Delete";

// const Categories = () => {
//   const [list, setList] = useState([]);
//   const [name, setName] = useState("");
//   const [toast, setToast] = useState({ open: false, msg: "", sev: "success" });

//   const load = async () => {
//     const { data } = await api.get("/categories"); // /api/manager/categories
//     setList(data);
//   };

//   useEffect(() => {
//     load();
//   }, []);

//   const add = async (e) => {
//     e.preventDefault();
//     try {
//       await api.post("/categories", { name });
//       setName("");
//       setToast({ open: true, msg: "Category added", sev: "success" });
//       load();
//     } catch (e) {
//       setToast({ open: true, msg: "Failed to add category", sev: "error" });
//     }
//   };

//   const remove = async (id) => {
//     try {
//       await api.delete("/categories/" + id);
//       setToast({ open: true, msg: "Category deleted", sev: "info" });
//       load();
//     } catch (err) {
//       const msg =
//         err.response?.data?.error ||
//         "Cannot delete category. Please delete its products first.";
//       setToast({ open: true, msg, sev: "warning" });
//     }
//   };

//   return (
//     <Container sx={{ mt: 3 }}>
//       <Paper sx={{ p: 3, mb: 3 }} elevation={3}>
//         <Typography variant="h6" gutterBottom sx={{ fontWeight: 700 }}>
//           Add Category
//         </Typography>
//         <Box component="form" onSubmit={add} sx={{ display: "flex", gap: 2 }}>
//           <TextField
//             label="Name"
//             value={name}
//             onChange={(e) => setName(e.target.value)}
//             required
//           />
//           <Button type="submit" variant="contained">
//             Save
//           </Button>
//         </Box>
//       </Paper>

//       <Paper sx={{ p: 0 }} elevation={3}>
//         <Box sx={{ p: 3 }}>
//           <Typography variant="h6" gutterBottom sx={{ fontWeight: 700 }}>
//             Categories
//           </Typography>
//         </Box>
//         <List dense sx={{ px: 2 }}>
//           {list.map((c) => (
//             <ListItem
//               key={c.id}
//               secondaryAction={
//                 <IconButton
//                   edge="end"
//                   onClick={() => remove(c.id)}
//                   aria-label="delete"
//                 >
//                   <DeleteIcon />
//                 </IconButton>
//               }
//             >
//               <ListItemText primary={c.name} />
//             </ListItem>
//           ))}
//           {list.length === 0 && (
//             <Box sx={{ px: 2, pb: 2, color: "text.secondary" }}>
//               No categories yet.
//             </Box>
//           )}
//         </List>
//       </Paper>

//       <Snackbar
//         open={toast.open}
//         autoHideDuration={2000}
//         onClose={() => setToast({ ...toast, open: false })}
//       >
//         <Alert severity={toast.sev}>{toast.msg}</Alert>
//       </Snackbar>
//     </Container>
//   );
// };

// export default Categories;

import React, { useEffect, useState, useMemo } from "react";
import api from "../api/axios";
import {
  Container,
  Typography,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  Box,
  IconButton,
  Snackbar,
  Alert,
  Divider,
  Card,
  CardContent,
  Chip,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Tooltip,
  Fade,
} from "@mui/material";
import {
  Delete as DeleteIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Category as CategoryIcon,
  Warning as WarningIcon,
} from "@mui/icons-material";

const Categories = () => {
  const [list, setList] = useState([]);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  const [deleteDialog, setDeleteDialog] = useState({
    open: false,
    category: null,
  });

  const [editDialog, setEditDialog] = useState({
    open: false,
    category: null,
    name: "",
  });

  const [toast, setToast] = useState({ open: false, msg: "", sev: "success" });
  const filteredList = useMemo(() => {
    const regex = new RegExp(
      search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
      "i"
    );
    return list.filter((item) =>
      regex.test(`${item.name} ${item.category?.name} ${item.supplier?.name}`)
    );
  }, [search, list]);

  const highlightMatch = (text, query) => {
    if (!query) return text;
    const regex = new RegExp(`(${query})`, "gi");
    const parts = text.split(regex);
    return parts.map((part, i) =>
      regex.test(part) ? <mark key={i}>{part}</mark> : part
    );
  };

  // Load categories
  const load = async () => {
    try {
      setLoading(true);
      const { data } = await api.get("/categories");
      setList(data);
    } catch (error) {
      setToast({ open: true, msg: "Failed to load categories", sev: "error" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  // Add category
  const add = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    try {
      setLoading(true);
      await api.post("/categories", { name: name.trim() });
      setName("");
      setToast({
        open: true,
        msg: "Category added successfully",
        sev: "success",
      });
      load();
    } catch (e) {
      setToast({
        open: true,
        msg: e.response?.data?.error || "Failed to add category",
        sev: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  // Delete functionality
  const handleDeleteClick = (category) => {
    setDeleteDialog({ open: true, category });
  };

  const confirmDelete = async () => {
    const { category } = deleteDialog;
    try {
      setLoading(true);
      await api.delete("/categories/" + category.id);
      setToast({
        open: true,
        msg: "Category deleted successfully",
        sev: "info",
      });
      setDeleteDialog({ open: false, category: null });
      load();
    } catch (err) {
      const msg =
        err.response?.data?.error ||
        "Cannot delete category. Please delete its products first.";
      setToast({ open: true, msg, sev: "warning" });
    } finally {
      setLoading(false);
    }
  };

  const cancelDelete = () => {
    setDeleteDialog({ open: false, category: null });
  };

  // Edit functionality
  const handleEditClick = (category) => {
    setEditDialog({ open: true, category, name: category.name });
  };

  const confirmEdit = async () => {
    try {
      setLoading(true);
      await api.put(`/categories/${editDialog.category.id}`, {
        name: editDialog.name.trim(),
      });
      setToast({
        open: true,
        msg: "Category updated successfully",
        sev: "success",
      });
      setEditDialog({ open: false, category: null, name: "" });
      load();
    } catch (err) {
      setToast({
        open: true,
        msg: err.response?.data?.error || "Failed to update category",
        sev: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const cancelEdit = () => {
    setEditDialog({ open: false, category: null, name: "" });
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography
          variant="h4"
          sx={{
            fontWeight: 600,
            color: "primary.main",
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
        >
          <CategoryIcon fontSize="large" />
          Category Management
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Manage your product categories efficiently
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* Add Category */}
        <Grid item xs={12} md={4}>
          <Card elevation={2} sx={{ p: 2 }}>
            <CardContent>
              <Typography
                variant="h6"
                gutterBottom
                sx={{ display: "flex", alignItems: "center", gap: 1 }}
              >
                <AddIcon color="primary" />
                Add New Category
              </Typography>
              <Box component="form" onSubmit={add}>
                <TextField
                  fullWidth
                  label="Category Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  variant="outlined"
                  size="medium"
                  disabled={loading}
                  sx={{ mb: 2 }}
                  helperText="Enter a unique category name"
                />
                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  size="large"
                  disabled={loading || !name.trim()}
                  startIcon={<AddIcon />}
                >
                  {loading ? "Adding..." : "Add Category"}
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Categories List */}
        <Grid item xs={12} md={8}>
          <Card elevation={3} sx={{ borderRadius: 3 }}>
            <CardContent sx={{ p: 3 }}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 2,
                }}
              >
                <Typography variant="h6" fontWeight={600}>
                  Categories
                </Typography>
                <Chip
                  label={`${list.length} ${
                    list.length === 1 ? "Category" : "Categories"
                  }`}
                  color="primary"
                  variant="outlined"
                />
              </Box>

              {/* Search */}
              <Box sx={{ display: "flex", gap: 1, mb: 3 }}>
                <TextField
                  placeholder="Search categories..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  size="small"
                  fullWidth
                  InputProps={{
                    startAdornment: (
                      <CategoryIcon sx={{ mr: 1, color: "action.active" }} />
                    ),
                  }}
                />
                <Button
                  variant="outlined"
                  onClick={() => setSearch("")}
                  disabled={!search}
                >
                  Reset
                </Button>
              </Box>

              {/* Empty State */}
              {filteredList.length === 0 ? (
                <Box
                  sx={{ textAlign: "center", py: 6, color: "text.secondary" }}
                >
                  <CategoryIcon sx={{ fontSize: 48, mb: 2, opacity: 0.5 }} />
                  <Typography variant="h6">No categories yet</Typography>
                  <Typography variant="body2">
                    Add your first category to get started
                  </Typography>
                </Box>
              ) : (
                <List sx={{ p: 0 }}>
                  {filteredList.map((category, index) => (
                    <Fade
                      in={true}
                      timeout={300 + index * 100}
                      key={category.id}
                    >
                      <Card
                        sx={{
                          mb: 2,
                          borderLeft: "5px solid transparent",
                          "&:hover": {
                            borderLeftColor: "primary.main",
                            boxShadow: 3,
                          },
                          transition: "all 0.2s ease-in-out",
                        }}
                      >
                        <ListItem
                          sx={{ p: 2 }}
                          secondaryAction={
                            <Box>
                              <Tooltip title="Edit Category">
                                <IconButton
                                  onClick={() => handleEditClick(category)}
                                  disabled={loading}
                                  sx={{ color: "primary.main", mr: 1 }}
                                >
                                  <EditIcon />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Delete Category">
                                <IconButton
                                  onClick={() => handleDeleteClick(category)}
                                  disabled={loading}
                                  sx={{ color: "error.main" }}
                                >
                                  <DeleteIcon />
                                </IconButton>
                              </Tooltip>
                            </Box>
                          }
                        >
                          <ListItemText
                            primary={
                              <Typography fontWeight={500}>
                                {highlightMatch(category.name, search)}
                              </Typography>
                            }
                            secondary={`ID: ${highlightMatch(
                              String(category.id),
                              search
                            )}`}
                          />
                        </ListItem>
                      </Card>
                    </Fade>
                  ))}
                </List>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Delete Confirmation */}
      <Dialog open={deleteDialog.open} onClose={cancelDelete}>
        <DialogTitle
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            color: "error.main",
          }}
        >
          <WarningIcon />
          Confirm Deletion
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete "
            <strong>{deleteDialog.category?.name}</strong>"? This cannot be
            undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={cancelDelete}>Cancel</Button>
          <Button
            onClick={confirmDelete}
            color="error"
            variant="contained"
            disabled={loading}
          >
            {loading ? "Deleting..." : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Category Dialog */}
      <Dialog open={editDialog.open} onClose={cancelEdit}>
        <DialogTitle>Edit Category</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Category Name"
            fullWidth
            variant="outlined"
            value={editDialog.name}
            onChange={(e) =>
              setEditDialog({ ...editDialog, name: e.target.value })
            }
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={cancelEdit}>Cancel</Button>
          <Button
            onClick={confirmEdit}
            variant="contained"
            disabled={loading || !editDialog.name.trim()}
          >
            {loading ? "Saving..." : "Save"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Toast Notification */}
      <Snackbar
        open={toast.open}
        autoHideDuration={4000}
        onClose={() => setToast({ ...toast, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          severity={toast.sev}
          onClose={() => setToast({ ...toast, open: false })}
          variant="filled"
        >
          {toast.msg}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Categories;
