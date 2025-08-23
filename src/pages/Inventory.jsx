// import React, { useEffect, useState } from "react";
// import api from "../api/axios";
// import {
//   Container,
//   Paper,
//   Typography,
//   TextField,
//   Button,
//   Box,
//   Snackbar,
//   Alert,
// } from "@mui/material";

// const Inventory = () => {
//   const [products, setProducts] = useState([]);
//   const [amount, setAmount] = useState("");
//   const [selected, setSelected] = useState("");
//   const [toast, setToast] = useState({ open: false, msg: "", sev: "success" });

//   const load = async () => {
//     const { data } = await api.get("/products"); // list for picker
//     setProducts(data);
//   };
//   useEffect(() => {
//     load();
//   }, []);

//   const adjust = async () => {
//     if (!selected || !amount) return;
//     try {
//       await api.put(`/inventory/${selected}`, {
//         amount: parseInt(amount, 10),
//       });
//       setToast({ open: true, msg: "Stock adjusted", sev: "success" });
//       setAmount("");
//       setSelected("");
//     } catch {
//       setToast({ open: true, msg: "Adjustment failed", sev: "error" });
//     }
//   };

//   return (
//     <Container sx={{ mt: 3 }}>
//       <Paper sx={{ p: 3, mb: 3 }} elevation={3}>
//         <Typography variant="h6" gutterBottom sx={{ fontWeight: 700 }}>
//           Adjust Inventory
//         </Typography>
//         <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
//           <TextField
//             select
//             label="Product"
//             value={selected}
//             onChange={(e) => setSelected(e.target.value)}
//             SelectProps={{ native: true }}
//             sx={{ minWidth: 260 }}
//           >
//             <option value="">Select...</option>
//             {products.map((p) => (
//               <option key={p.id} value={p.id}>
//                 {p.name} ({p.sku})
//               </option>
//             ))}
//           </TextField>

//           <TextField
//             label="Amount (+/-)"
//             type="number"
//             value={amount}
//             onChange={(e) => setAmount(e.target.value)}
//             sx={{ width: 200 }}
//           />

//           <Button variant="contained" onClick={adjust}>
//             Apply
//           </Button>
//         </Box>
//       </Paper>

//       <Paper sx={{ p: 3 }} elevation={3}>
//         <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600 }}>
//           Hint
//         </Typography>
//         Use negative numbers for sales/consumption and positive numbers for
//         restock.
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

// export default Inventory;
import React, { useEffect, useState } from "react";
import api from "../api/axios";
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
  Dialog,
  DialogTitle,
  DialogContent,
  Snackbar,
  Alert,
} from "@mui/material";

const Inventory = () => {
  const [inventory, setInventory] = useState([]);
  const [history, setHistory] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [toast, setToast] = useState({ open: false, msg: "", sev: "warning" });

  // ✅ Load inventory stock levels safely
  const loadInventory = async () => {
    try {
      const { data } = await api.get("/inventory");
      const items = Array.isArray(data) ? data : []; // always an array
      setInventory(items);

      // check for low stock items
      const lowStockItems = items.filter(
        (inv) => inv.stockLevel < inv.minStockLevel
      );
      if (lowStockItems.length > 0) {
        const names = lowStockItems
          .map((i) => i.product?.name || "Unknown")
          .join(", ");
        setToast({
          open: true,
          msg: `Low stock alert: ${names}`,
          sev: "warning",
        });
      }
    } catch (err) {
      console.error("❌ Failed to load inventory:", err);
      setInventory([]); // fallback
    }
  };

  // ✅ Load history for selected product
  const loadHistory = async (id) => {
    try {
      const { data } = await api.get(`/inventory/${id}/history`);
      setHistory(Array.isArray(data) ? data : []);
      setOpen(true);
    } catch (err) {
      console.error("❌ Failed to load history:", err);
      setHistory([]);
    }
  };

  useEffect(() => {
    loadInventory();
  }, []);

  return (
    <Container sx={{ mt: 3 }}>
      <Paper sx={{ p: 3 }} elevation={3}>
        <Typography variant="h6" gutterBottom sx={{ fontWeight: 700 }}>
          Current Inventory
        </Typography>

        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Product</TableCell>
              <TableCell>SKU</TableCell>
              <TableCell>Stock Level</TableCell>
              <TableCell>Min Stock</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {inventory.map((inv) => {
              const lowStock = inv.stockLevel < inv.minStockLevel;

              return (
                <TableRow
                  key={inv.id}
                  sx={{
                    backgroundColor: lowStock ? "#ffebee" : "inherit", // highlight low stock
                  }}
                >
                  <TableCell>{inv.product?.name ?? "-"}</TableCell>
                  <TableCell>{inv.product?.sku ?? "-"}</TableCell>
                  <TableCell
                    sx={{
                      color: lowStock ? "red" : "inherit",
                      fontWeight: lowStock ? 600 : 400,
                    }}
                  >
                    {inv.stockLevel}
                  </TableCell>
                  <TableCell>{inv.minStockLevel}</TableCell>
                  <TableCell>
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() => {
                        setSelectedProduct(inv.product?.name ?? "Unknown");
                        loadHistory(inv.id);
                      }}
                    >
                      View History
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
            {inventory.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={5}
                  sx={{ textAlign: "center", color: "gray" }}
                >
                  No inventory records found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Paper>

      {/* History Dialog */}
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Inventory History – {selectedProduct}</DialogTitle>
        <DialogContent>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Date</TableCell>
                <TableCell>Changed By</TableCell>
                <TableCell>Change Amount</TableCell>
                <TableCell>Stock After</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {history.map((h, idx) => (
                <TableRow key={idx}>
                  <TableCell>
                    {h.timestamp ? new Date(h.timestamp).toLocaleString() : "-"}
                  </TableCell>
                  <TableCell>{h.updatedBy ?? "-"}</TableCell>
                  <TableCell>{h.changeAmount ?? 0}</TableCell>
                  <TableCell>{h.quantityAfter ?? 0}</TableCell>
                </TableRow>
              ))}
              {history.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={4}
                    sx={{ textAlign: "center", color: "gray" }}
                  >
                    No history found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </DialogContent>
      </Dialog>

      {/* 🔔 Snackbar Toast for Low Stock */}
      <Snackbar
        open={toast.open}
        autoHideDuration={4000}
        onClose={() => setToast({ ...toast, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert severity={toast.sev}>{toast.msg}</Alert>
      </Snackbar>
    </Container>
  );
};

export default Inventory;
