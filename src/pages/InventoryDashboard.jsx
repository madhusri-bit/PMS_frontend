// // InventoryDashboard.jsx
// import React, { useEffect, useState } from "react";
// import { Alert } from "@mui/material";
// import api from "../api/axios";
// import {
//   Container,
//   Paper,
//   Typography,
//   Table,
//   TableHead,
//   TableRow,
//   TableCell,
//   TableBody,
//   Button,
//   Chip,
// } from "@mui/material";

// const InventoryDashboard = () => {
//   const [inventory, setInventory] = useState([]);

//   const load = async () => {
//     const { data } = await api.get("/inventory");
//     setInventory(data);
//   };

//   useEffect(() => {
//     load();
//   }, []);

//   return (
//     <Container sx={{ mt: 3 }}>
//       {/* 🔴 Low Stock Alert Banner */}
//       {inventory.length > 0 &&
//         inventory.some((inv) => inv.stockLevel <= inv.minStockLevel) && (
//           <Alert severity="warning" sx={{ mb: 2 }}>
//             ⚠️ Some products are below their minimum stock! Please restock soon.
//           </Alert>
//         )}

//       <Paper sx={{ p: 3 }} elevation={3}>
//         <Typography variant="h6" gutterBottom sx={{ fontWeight: 700 }}>
//           📦 Inventory Overview
//         </Typography>

//         <Table>
//           <TableHead>
//             <TableRow>
//               <TableCell>Product</TableCell>
//               <TableCell>Stock</TableCell>
//               <TableCell>Min Stock</TableCell>
//               <TableCell>Actions</TableCell>
//             </TableRow>
//           </TableHead>
//           <TableBody>
//             {inventory?.map((inv) => (
//               <TableRow key={inv?.id}>
//                 <TableCell>{inv?.name ?? "No Product"}</TableCell>
//                 <TableCell>
//                   {inv?.stockLevel <= inv?.minStockLevel ? (
//                     <Chip label={inv?.stockLevel ?? 0} color="error" />
//                   ) : (
//                     <Chip label={inv?.stockLevel ?? 0} color="success" />
//                   )}
//                 </TableCell>
//                 <TableCell>{inv?.minStockLevel ?? 0}</TableCell>
//                 <TableCell>
//                   <Button
//                     variant="outlined"
//                     size="small"
//                     href={`/inventory/${inv?.id}/adjust`}
//                   >
//                     Adjust
//                   </Button>
//                   <Button
//                     variant="contained"
//                     size="small"
//                     sx={{ ml: 1 }}
//                     href={`/inventory/${inv?.id}/history`}
//                   >
//                     History
//                   </Button>
//                 </TableCell>
//               </TableRow>
//             ))}
//           </TableBody>
//         </Table>
//       </Paper>
//     </Container>
//   );
// };

// export default InventoryDashboard;
// src/pages/InventoryDashboard.jsx
import React, { useEffect, useState, useMemo } from "react";
import {
  Container,
  Paper,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
  Chip,
  Alert,
  Box,
  Grid,
  Card,
  CardContent,
  TextField,
  InputAdornment,
  MenuItem,
  FormControl,
  Select,
  InputLabel,
  IconButton,
  Tooltip,
  LinearProgress,
  Skeleton,
  TableContainer,
  TablePagination,
  AlertTitle,
  Divider,
  Stack,
} from "@mui/material";
import {
  Search as SearchIcon,
  Refresh as RefreshIcon,
  FileDownload as ExportIcon,
  Warning as WarningIcon,
  Inventory as InventoryIcon,
  TrendingDown as LowStockIcon,
  CheckCircle as GoodStockIcon,
  Error as CriticalIcon,
  History as HistoryIcon,
  Edit as EditIcon,
  Visibility as ViewIcon,
} from "@mui/icons-material";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";

const STOCK_STATUS = {
  CRITICAL: {
    label: "Critical",
    color: "error",
    threshold: 0.2,
    icon: <CriticalIcon />,
  },
  LOW: {
    label: "Low Stock",
    color: "warning",
    threshold: 1,
    icon: <LowStockIcon />,
  },
  GOOD: {
    label: "Good Stock",
    color: "success",
    threshold: Infinity,
    icon: <GoodStockIcon />,
  },
};

const FILTER_OPTIONS = [
  { value: "all", label: "All Products" },
  { value: "critical", label: "Critical Stock" },
  { value: "low", label: "Low Stock" },
  { value: "good", label: "Good Stock" },
];

const InventoryDashboard = () => {
  const { user } = useAuth();
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [refreshing, setRefreshing] = useState(false);

  const hasWriteAccess = ["ADMIN", "MANAGER"].includes(
    user?.role?.toUpperCase()
  );

  // Load inventory data
  const loadInventory = async (showRefreshIndicator = false) => {
    try {
      if (showRefreshIndicator) setRefreshing(true);
      else setLoading(true);

      setError(null);
      const { data } = await api.get("/inventory");
      setInventory(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error loading inventory:", err);
      setError("Failed to load inventory data. Please try again.");
      setInventory([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadInventory();
  }, []);

  // Calculate stock status
  const getStockStatus = (item) => {
    const stock = item?.stockLevel ?? 0;
    const min = item?.minStockLevel ?? 0;

    if (min === 0) return STOCK_STATUS.GOOD; // avoid divide by zero

    const ratio = stock / min;
    if (ratio <= STOCK_STATUS.CRITICAL.threshold) return STOCK_STATUS.CRITICAL;
    if (ratio <= STOCK_STATUS.LOW.threshold) return STOCK_STATUS.LOW;
    return STOCK_STATUS.GOOD;
  };

  // Filtered and searched inventory
  const filteredInventory = useMemo(() => {
    return inventory.filter((item) => {
      const productName = item?.product?.name ?? item?.name ?? "";
      const category = item?.product?.category?.name ?? item?.category ?? "";
      const supplier = item?.product?.supplier?.name ?? item?.supplier ?? "";

      const matchesSearch =
        !searchTerm ||
        productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        supplier.toLowerCase().includes(searchTerm.toLowerCase());

      if (!matchesSearch) return false;

      if (filterStatus === "all") return true;

      const status = getStockStatus(item);
      return status.label.toLowerCase().includes(filterStatus);
    });
  }, [inventory, searchTerm, filterStatus]);

  // Inventory statistics
  const inventoryStats = useMemo(() => {
    const stats = {
      total: inventory.length,
      critical: 0,
      low: 0,
      good: 0,
    };

    inventory.forEach((item) => {
      const status = getStockStatus(item);
      if (status.label === "Critical") stats.critical++;
      else if (status.label === "Low Stock") stats.low++;
      else stats.good++;
    });

    return stats;
  }, [inventory]);

  // Pagination
  const paginatedInventory = filteredInventory.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Skeleton variant="text" width="300px" height={40} />
        <Skeleton
          variant="rectangular"
          height={400}
          sx={{ mt: 2, borderRadius: 2 }}
        />
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box
        sx={{
          mb: 4,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>
            📦 Inventory Dashboard
          </Typography>
          <Typography variant="subtitle1" sx={{ color: "text.secondary" }}>
            Monitor and manage your stock levels
          </Typography>
        </Box>
        <Box>
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={() => loadInventory(true)}
            disabled={refreshing}
            sx={{ mr: 1 }}
          >
            {refreshing ? "Refreshing..." : "Refresh"}
          </Button>
          <Button
            variant="contained"
            startIcon={<ExportIcon />}
            onClick={() => {
              const csvContent = [
                ["Product", "Stock", "Min Stock", "Status"].join(","),
                ...filteredInventory.map((item) => {
                  const productName =
                    item?.product?.name ?? item?.name ?? "N/A";
                  const stock = item?.stockLevel ?? 0;
                  const min = item?.minStockLevel ?? 0;
                  const status = getStockStatus(item).label;
                  return `"${productName}",${stock},${min},"${status}"`;
                }),
              ].join("\n");

              const blob = new Blob([csvContent], { type: "text/csv" });
              const url = window.URL.createObjectURL(blob);
              const a = document.createElement("a");
              a.href = url;
              a.download = `inventory-report-${
                new Date().toISOString().split("T")[0]
              }.csv`;
              a.click();
              window.URL.revokeObjectURL(url);
            }}
          >
            Export
          </Button>
        </Box>
      </Box>

      {/* Alerts */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
          <AlertTitle>Error</AlertTitle>
          {error}
        </Alert>
      )}
      {inventoryStats.critical > 0 && (
        <Alert severity="error" sx={{ mb: 2 }} icon={<CriticalIcon />}>
          <AlertTitle>Critical Stock</AlertTitle>
          {inventoryStats.critical} product(s) are critically low.
        </Alert>
      )}
      {inventoryStats.low > 0 && (
        <Alert severity="warning" sx={{ mb: 2 }} icon={<WarningIcon />}>
          <AlertTitle>Low Stock</AlertTitle>
          {inventoryStats.low} product(s) are below minimum stock.
        </Alert>
      )}

      {/* Filters */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              placeholder="Search product, category, supplier..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: "text.secondary" }} />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                value={filterStatus}
                label="Status"
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                {FILTER_OPTIONS.map((o) => (
                  <MenuItem key={o.value} value={o.value}>
                    {o.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={3}>
            <Typography sx={{ textAlign: "center", color: "text.secondary" }}>
              Showing {filteredInventory.length} / {inventory.length}
            </Typography>
          </Grid>
        </Grid>
      </Paper>

      {/* Table */}
      <Paper>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: "grey.50" }}>
                <TableCell>Product</TableCell>
                <TableCell>Stock</TableCell>
                <TableCell>Min Stock</TableCell>
                <TableCell>Status</TableCell>
                {hasWriteAccess && (
                  <TableCell align="center">Actions</TableCell>
                )}
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedInventory.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={hasWriteAccess ? 5 : 4} align="center">
                    No products found.
                  </TableCell>
                </TableRow>
              ) : (
                paginatedInventory.map((inv) => {
                  const status = getStockStatus(inv);
                  const productName = inv?.product?.name ?? inv?.name ?? "N/A";
                  const category = inv?.product?.category?.name ?? "";
                  const supplier = inv?.product?.supplier?.name ?? "";

                  return (
                    <TableRow key={inv?.id}>
                      <TableCell>
                        <Typography variant="subtitle2">
                          {productName}
                        </Typography>
                        {(category || supplier) && (
                          <Typography variant="body2" color="text.secondary">
                            {category} {supplier && `• ${supplier}`}
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={inv?.stockLevel ?? 0}
                          color={status.color}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>{inv?.minStockLevel ?? 0}</TableCell>
                      <TableCell>
                        <Chip
                          label={status.label}
                          color={status.color}
                          size="small"
                          icon={status.icon}
                        />
                      </TableCell>
                      {hasWriteAccess && (
                        <TableCell align="center">
                          <Stack
                            direction="row"
                            spacing={1}
                            justifyContent="center"
                          >
                            <Tooltip title="Adjust">
                              <IconButton
                                href={`/inventory/${inv?.id}/adjust`}
                                size="small"
                              >
                                <EditIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="History">
                              <IconButton
                                href={`/inventory/${inv?.id}/history`}
                                size="small"
                              >
                                <HistoryIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          </Stack>
                        </TableCell>
                      )}
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          component="div"
          count={filteredInventory.length}
          page={page}
          onPageChange={(_, newPage) => setPage(newPage)}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={(e) => {
            setRowsPerPage(parseInt(e.target.value, 10));
            setPage(0);
          }}
          rowsPerPageOptions={[5, 10, 25]}
        />
      </Paper>
    </Container>
  );
};

export default InventoryDashboard;
