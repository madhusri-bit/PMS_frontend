// AdjustInventory.jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Snackbar,
  Alert,
} from "@mui/material";

const AdjustInventory = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [amount, setAmount] = useState("");
  const [inventory, setInventory] = useState(null); // { product, stockLevel, minStockLevel }
  const [toast, setToast] = useState({ open: false, msg: "", sev: "success" });

  // fetch current inventory so we can validate before submit
  useEffect(() => {
    const fetchInv = async () => {
      try {
        const { data } = await api.get(`/inventory/${id}`);
        console.log("Fetched inventory:", data); // Debug log
        setInventory(data);
      } catch (error) {
        console.error("Error fetching inventory:", error);
        setToast({
          open: true,
          msg: "Failed to load inventory details",
          sev: "error",
        });
        setInventory(null);
      }
    };
    fetchInv();
  }, [id]);

  const parsed = parseInt(amount, 10);
  const exceeds =
    inventory &&
    !isNaN(parsed) &&
    parsed < 0 &&
    Math.abs(parsed) > inventory.stockLevel;

  const adjust = async () => {
    // client-side guard: don't call API if it would go below zero
    if (exceeds) {
      setToast({
        open: true,
        msg: `Required quantity is greater than available. Available: ${inventory.stockLevel}`,
        sev: "warning",
      });
      return;
    }

    try {
      await api.put(`/inventory/${id}/adjust`, { amount: parsed });
      setToast({ open: true, msg: "Stock adjusted ✅", sev: "success" });
      setTimeout(() => navigate("/inventory"), 1500);
    } catch (err) {
      let errorMsg = "Adjustment failed ❌";
      if (err.response?.data) {
        errorMsg =
          typeof err.response.data === "string"
            ? err.response.data
            : err.response.data.message || errorMsg;
      }
      setToast({ open: true, msg: errorMsg, sev: "error" });
    }
  };

  return (
    <Container sx={{ mt: 3 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6">Adjust Stock</Typography>

        {inventory && (
          <Typography sx={{ mt: 2, mb: 2 }}>
            <div>📦 Product: {inventory.name || "N/A"}</div>
            <div>✅ Available Stock: {inventory.stockLevel || 0}</div>
            <div>⚠️ Minimum Stock: {inventory.minStockLevel || 0}</div>
          </Typography>
        )}

        <TextField
          label="Amount (+/-)"
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          sx={{ mt: 2, width: "100%", maxWidth: 300 }}
          helperText={
            inventory
              ? `Available: ${inventory.stockLevel || 0} • Min: ${
                  inventory.minStockLevel || 0
                }`
              : "Loading inventory details..."
          }
        />

        <Button
          sx={{ mt: 2, ml: 2 }}
          variant="contained"
          onClick={adjust}
          disabled={!inventory || amount === "" || isNaN(parseInt(amount, 10))}
        >
          Apply
        </Button>
      </Paper>

      <Snackbar
        open={toast.open}
        autoHideDuration={3000}
        onClose={() => setToast({ ...toast, open: false })}
      >
        <Alert severity={toast.sev}>{toast.msg}</Alert>
      </Snackbar>
    </Container>
  );
};

export default AdjustInventory;
