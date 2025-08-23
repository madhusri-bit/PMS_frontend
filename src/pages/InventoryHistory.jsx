// InventoryHistory.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
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
} from "@mui/material";

const InventoryHistory = () => {
  const { id } = useParams();
  const [history, setHistory] = useState([]);

  const load = async () => {
    const { data } = await api.get(`/inventory/${id}/history`);
    setHistory(data);
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <Container sx={{ mt: 3 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6">📜 Inventory History</Typography>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Date</TableCell>
              <TableCell>Changed By</TableCell>
              <TableCell>Change</TableCell>
              <TableCell>Stock After</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {history.map((h, idx) => (
              <TableRow key={idx}>
                {/* <TableCell>{new Date(h.timestamp).toLocaleString()}</TableCell> */}
                <TableCell>
                  {h.timestamp
                    ? new Date(h.timestamp).toLocaleString()
                    : "No Date"}
                </TableCell>

                <TableCell>{h.updatedBy}</TableCell>
                <TableCell>
                  {h.changeAmount > 0 ? `+${h.changeAmount}` : h.changeAmount}
                </TableCell>
                <TableCell>{h.quantityAfter}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </Container>
  );
};

export default InventoryHistory;
