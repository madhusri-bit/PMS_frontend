import React from "react";
import { Box, Typography, Button } from "@mui/material";
import { Link } from "react-router-dom";

const Landing = () => (
  <Box
    display="flex"
    flexDirection="column"
    alignItems="center"
    justifyContent="center"
    minHeight="80vh"
    textAlign="center"
    px={2}
  >
    <Typography variant="h2" gutterBottom>
      Welcome to PMS
    </Typography>
    <Typography variant="h5" color="textSecondary" gutterBottom>
      Your Inventory & Product Management Solution
    </Typography>
    <Typography variant="body1" color="textSecondary" mb={4}>
      Streamline your inventory, manage products, suppliers, and more—all in one place.
    </Typography>
    <Button
      component={Link}
      to="/login"
      variant="contained"
      color="primary"
      size="large"
    >
      Get Started
    </Button>
  </Box>
);

export default Landing;
