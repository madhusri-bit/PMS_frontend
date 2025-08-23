import React, { useEffect, useState } from "react";
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
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  Pagination,
  DialogActions,
  Select,
} from "@mui/material";
import { Edit as EditIcon, Delete as DeleteIcon } from "@mui/icons-material";
import api from "../api/axios";

const Products = () => {
  // State for product list, categories, suppliers
  const [list, setList] = useState([]);
  const [categories, setCategories] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  // Add these states at the top inside your component
  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [filterSupplier, setFilterSupplier] = useState("");

  // Toast notifications
  const [toast, setToast] = useState({ open: false, msg: "", sev: "success" });
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  // Form for creating product
  const [form, setForm] = useState({
    name: "",
    sku: "",
    price: "",
    description: "",
    categoryId: "",
    supplierId: "",
  });

  // Edit dialog state
  const [editDialog, setEditDialog] = useState({
    open: false,
    product: null,
    form: {
      name: "",
      sku: "",
      price: "",
      description: "",
      categoryId: "",
      supplierId: "",
    },
  });

  const [formLoading, setFormLoading] = useState(false);

  // Load all data
  const load = async () => {
    try {
      const [productsRes, catsRes, supsRes] = await Promise.all([
        api.get("/products"),
        api.get("/categories"),
        api.get("/suppliers"),
      ]);

      setList(productsRes.data);
      setCategories(catsRes.data);
      setSuppliers(supsRes.data);
    } catch (err) {
      console.error("Error loading data:", err);
      setList([]);
      setCategories([]);
      setSuppliers([]);
    }
  };

  useEffect(() => {
    load();
  }, []);
  useEffect(() => {
    setPage(1);
  }, [search, filterCategory, filterSupplier]);
  const filteredList = list
    .filter(
      (p) =>
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.sku.toLowerCase().includes(search.toLowerCase())
    )
    .filter((p) => (filterCategory ? p.category?.id === filterCategory : true))
    .filter((p) => (filterSupplier ? p.supplier?.id === filterSupplier : true));
  const paginatedList = filteredList.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );
  // Create new product
  const create = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        name: form.name,
        sku: form.sku,
        price: form.price ? Number(form.price) : null,
        description: form.description || "",
        categoryId: form.categoryId || null,
        supplierId: form.supplierId || null,
      };
      await api.post("/products", payload);
      setForm({
        name: "",
        sku: "",
        price: "",
        description: "",
        categoryId: "",
        supplierId: "",
      });
      setToast({ open: true, msg: "Product created", sev: "success" });
      load();
    } catch (err) {
      const msg = err?.response?.data?.error || "Create failed";
      setToast({ open: true, msg, sev: "error" });
    }
  };

  // Delete product
  const remove = async (id) => {
    try {
      await api.delete("/products/" + id);
      setToast({ open: true, msg: "Product deleted", sev: "info" });
      load();
    } catch {
      setToast({ open: true, msg: "Delete failed", sev: "error" });
    }
  };

  // Open edit dialog
  const handleEditClick = (product) => {
    setEditDialog({
      open: true,
      product,
      form: {
        name: product.name || "",
        sku: product.sku || "",
        price: product.price ?? "",
        description: product.description || "",
        categoryId: product.category?.id || "",
        supplierId: product.supplier?.id || "",
      },
    });
  };

  // Confirm edit
  const confirmEdit = async () => {
    if (!editDialog.product) return;
    setFormLoading(true);
    try {
      const payload = {
        name: editDialog.form.name,
        sku: editDialog.form.sku,
        price: editDialog.form.price ? Number(editDialog.form.price) : null,
        description: editDialog.form.description || "",
        categoryId: editDialog.form.categoryId || null,
        supplierId: editDialog.form.supplierId || null,
      };
      await api.put(`/products/${editDialog.product.id}`, payload);
      setToast({ open: true, msg: "Product updated", sev: "success" });
      setEditDialog({
        open: false,
        product: null,
        form: {
          name: "",
          sku: "",
          price: "",
          description: "",
          categoryId: "",
          supplierId: "",
        },
      });
      load();
    } catch (err) {
      const msg = err?.response?.data?.error || "Update failed";
      setToast({ open: true, msg, sev: "error" });
    } finally {
      setFormLoading(false);
    }
  };

  // Cancel edit
  const cancelEdit = () => {
    setEditDialog({
      open: false,
      product: null,
      form: {
        name: "",
        sku: "",
        price: "",
        description: "",
        categoryId: "",
        supplierId: "",
      },
    });
  };
  const highlightMatch = (text, query) => {
    if (!query) return text;
    const regex = new RegExp(`(${query})`, "gi");
    const parts = text.split(regex);
    return parts.map((part, i) =>
      regex.test(part) ? <mark key={i}>{part}</mark> : part
    );
  };

  return (
    <Container sx={{ mt: 3 }}>
      {/* Create Product Form */}
      <Paper sx={{ p: 3, mb: 3 }} elevation={3}>
        <Typography variant="h6" gutterBottom sx={{ fontWeight: 700 }}>
          Add Product
        </Typography>
        <Box
          component="form"
          onSubmit={create}
          sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}
        >
          <TextField
            label="Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />
          <TextField
            label="SKU"
            value={form.sku}
            onChange={(e) => setForm({ ...form, sku: e.target.value })}
            required
          />
          <TextField
            label="Price"
            type="number"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
          />
          <TextField
            label="Description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
          <TextField
            select
            label="Category"
            value={form.categoryId}
            onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
          >
            <MenuItem value="">None</MenuItem>
            {categories.map((c) => (
              <MenuItem key={c.id} value={c.id}>
                {c.name}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            select
            label="Supplier"
            value={form.supplierId}
            onChange={(e) => setForm({ ...form, supplierId: e.target.value })}
          >
            <MenuItem value="">None</MenuItem>
            {suppliers.map((s) => (
              <MenuItem key={s.id} value={s.id}>
                {s.name}
              </MenuItem>
            ))}
          </TextField>
          <Box />
          <Button type="submit" variant="contained">
            Save
          </Button>
        </Box>
      </Paper>

      {/* Product Table */}
      <Paper sx={{ p: 3 }} elevation={3}>
        <Typography variant="h6" gutterBottom sx={{ fontWeight: 700 }}>
          Products
        </Typography>
        <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
          <TextField
            label="Search by name or SKU"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            size="small"
            fullWidth
          />
          <TextField
            select
            label="Filter by Category"
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            size="small"
            sx={{ minWidth: 150 }}
          >
            <MenuItem value="">All</MenuItem>
            {categories.map((c) => (
              <MenuItem key={c.id} value={c.id}>
                {c.name}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            select
            label="Filter by Supplier"
            value={filterSupplier}
            onChange={(e) => setFilterSupplier(e.target.value)}
            size="small"
            sx={{ minWidth: 150 }}
          >
            <MenuItem value="">All</MenuItem>
            {suppliers.map((s) => (
              <MenuItem key={s.id} value={s.id}>
                {s.name}
              </MenuItem>
            ))}
          </TextField>
          <Button
            variant="outlined"
            onClick={() => {
              setSearch("");
              setFilterCategory("");
              setFilterSupplier("");
            }}
          >
            Reset
          </Button>
        </Box>

        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>SKU</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Supplier</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedList.map((p) => (
              <TableRow key={p.id}>
                <TableCell>{highlightMatch(p.name, search)}</TableCell>
                <TableCell>{highlightMatch(p.sku, search)}</TableCell>

                <TableCell>{p.price ?? "-"}</TableCell>
                <TableCell>{p.category?.name ?? "-"}</TableCell>
                <TableCell>{p.supplier?.name ?? "-"}</TableCell>
                <TableCell>
                  <IconButton
                    onClick={() => handleEditClick(p)}
                    aria-label="edit"
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => remove(p.id)} aria-label="delete">
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
            {paginatedList.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} sx={{ color: "text.secondary" }}>
                  No products yet.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
          {/* Rows per page selector */}
          <Select
            size="small"
            value={rowsPerPage}
            onChange={(e) => {
              setRowsPerPage(Number(e.target.value));
              setPage(1);
            }}
          >
            {[5, 10, 20].map((n) => (
              <MenuItem key={n} value={n}>
                {n} / page
              </MenuItem>
            ))}
          </Select>

          {/* Page numbers */}
          <Pagination
            count={Math.ceil(filteredList.length / rowsPerPage)}
            page={page}
            onChange={(e, val) => setPage(val)}
            color="primary"
          />
        </Box>
      </Paper>

      {/* Edit Product Dialog */}
      <Dialog
        open={editDialog.open}
        onClose={cancelEdit}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Edit Product</DialogTitle>
        <DialogContent sx={{ display: "grid", gap: 2, mt: 1 }}>
          <TextField
            label="Name"
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
            label="SKU"
            value={editDialog.form.sku}
            onChange={(e) =>
              setEditDialog({
                ...editDialog,
                form: { ...editDialog.form, sku: e.target.value },
              })
            }
            fullWidth
          />
          <TextField
            label="Price"
            type="number"
            value={editDialog.form.price}
            onChange={(e) =>
              setEditDialog({
                ...editDialog,
                form: { ...editDialog.form, price: e.target.value },
              })
            }
            fullWidth
          />
          <TextField
            label="Description"
            value={editDialog.form.description}
            onChange={(e) =>
              setEditDialog({
                ...editDialog,
                form: { ...editDialog.form, description: e.target.value },
              })
            }
            fullWidth
          />
          <TextField
            select
            label="Category"
            value={editDialog.form.categoryId}
            onChange={(e) =>
              setEditDialog({
                ...editDialog,
                form: { ...editDialog.form, categoryId: e.target.value },
              })
            }
          >
            <MenuItem value="">None</MenuItem>
            {categories.map((c) => (
              <MenuItem key={c.id} value={c.id}>
                {c.name}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            select
            label="Supplier"
            value={editDialog.form.supplierId}
            onChange={(e) =>
              setEditDialog({
                ...editDialog,
                form: { ...editDialog.form, supplierId: e.target.value },
              })
            }
          >
            <MenuItem value="">None</MenuItem>
            {suppliers.map((s) => (
              <MenuItem key={s.id} value={s.id}>
                {s.name}
              </MenuItem>
            ))}
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={cancelEdit}>Cancel</Button>
          <Button onClick={confirmEdit} variant="contained" color="primary">
            {formLoading ? "Saving..." : "Save"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Toast */}
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

export default Products;
