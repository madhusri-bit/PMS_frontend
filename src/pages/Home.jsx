// src/pages/Home.jsx
import React, { useMemo } from "react";
import { useAuth } from "../context/AuthContext";
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  Box,
  Divider,
  Paper,
} from "@mui/material";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import {
  TrendingUp,
  Inventory,
  Category,
  Group,
  Warning,
} from "@mui/icons-material";

const CHART_COLORS = ["#2563eb", "#16a34a", "#dc2626", "#ca8a04", "#9333ea"];

const ROLE_PERMISSIONS = {
  ADMIN: ["products", "categories", "suppliers", "users"],
  MANAGER: ["products", "categories", "suppliers"],
  EMPLOYEE: ["products"],
};

// Dummy Data
const STATIC_DATA = {
  products: [
    {
      id: 1,
      name: "Laptop",
      category: { id: 1, name: "Electronics" },
      supplier: { id: 1, name: "Supplier A" },
      inventory: { stockLevel: 5, minStockLevel: 10 },
      createdAt: "2025-08-01",
    },
    {
      id: 2,
      name: "Shampoo",
      category: { id: 2, name: "Cosmetics" },
      supplier: { id: 2, name: "Supplier B" },
      inventory: { stockLevel: 20, minStockLevel: 5 },
      createdAt: "2025-08-10",
    },
    {
      id: 3,
      name: "Tablet",
      category: { id: 1, name: "Electronics" },
      supplier: { id: 1, name: "Supplier A" },
      inventory: { stockLevel: 2, minStockLevel: 5 },
      createdAt: "2025-08-15",
    },
  ],
  categories: [
    { id: 1, name: "Electronics" },
    { id: 2, name: "Cosmetics" },
  ],
  suppliers: [
    { id: 1, name: "Supplier A" },
    { id: 2, name: "Supplier B" },
  ],
  users: [
    { id: 1, username: "AdminUser" },
    { id: 2, username: "ManagerUser" },
  ],
};

const Home = () => {
  const { user } = useAuth();
  const role = user?.role || "ADMIN"; // default ADMIN for testing
  const permissions = ROLE_PERMISSIONS[role] || [];

  // analytics
  const analytics = useMemo(() => {
    const { products, categories, suppliers } = STATIC_DATA;

    const categoryDistribution =
      categories.map((category, i) => ({
        name: category.name,
        value:
          products.filter((p) => p.category?.id === category.id).length || 0,
        color: CHART_COLORS[i % CHART_COLORS.length],
      })) || [];

    const supplierDistribution =
      suppliers.map((supplier) => ({
        name: supplier.name,
        count:
          products.filter((p) => p.supplier?.id === supplier.id).length || 0,
      })) || [];

    const lowStockProducts =
      products.filter(
        (p) => p.inventory && p.inventory.stockLevel < p.inventory.minStockLevel
      ) || [];

    const recentProducts = [...(products || [])]
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 5);

    return {
      categoryDistribution,
      supplierDistribution,
      lowStockProducts,
      recentProducts,
    };
  }, []);

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Page Header */}
      <Box sx={{ mb: 4 }}>
        <Typography
          variant="h3"
          component="h1"
          sx={{ fontWeight: 600, color: "text.primary", mb: 1 }}
        >
          Dashboard
        </Typography>
        <Typography
          variant="subtitle1"
          sx={{ color: "text.secondary", fontSize: "1.1rem" }}
        >
          Welcome back, {user?.username || "User"}
        </Typography>
        <Divider sx={{ mt: 2 }} />
      </Box>

      {/* Stats Cards */}
      <StatisticsSection
        role={role}
        data={STATIC_DATA}
        lowStockCount={analytics.lowStockProducts.length}
      />

      {/* Charts */}
      {(role === "ADMIN" || role === "MANAGER") && (
        <ChartsSection
          categoryDistribution={analytics.categoryDistribution}
          supplierDistribution={analytics.supplierDistribution}
        />
      )}

      {/* Employee Specific */}
      {role === "EMPLOYEE" && (
        <EmployeeSection
          recentProducts={analytics.recentProducts}
          lowStockProducts={analytics.lowStockProducts}
        />
      )}
    </Container>
  );
};

// Stats Section
const StatisticsSection = ({ role, data, lowStockCount }) => {
  const statsConfig = [
    {
      title: "Total Products",
      value: data.products?.length || 0,
      icon: <Inventory sx={{ fontSize: 28 }} />,
      color: "#1976d2",
      bgColor: "#e3f2fd",
      roles: ["ADMIN", "MANAGER", "EMPLOYEE"],
    },
    {
      title: "Categories",
      value: data.categories?.length || 0,
      icon: <Category sx={{ fontSize: 28 }} />,
      color: "#388e3c",
      bgColor: "#e8f5e9",
      roles: ["ADMIN", "MANAGER"],
    },
    {
      title: "Suppliers",
      value: data.suppliers?.length || 0,
      icon: <TrendingUp sx={{ fontSize: 28 }} />,
      color: "#f57c00",
      bgColor: "#fff3e0",
      roles: ["ADMIN", "MANAGER"],
    },
    {
      title: "Users",
      value: data.users?.length || 0,
      icon: <Group sx={{ fontSize: 28 }} />,
      color: "#7b1fa2",
      bgColor: "#f3e5f5",
      roles: ["ADMIN"],
    },
    {
      title: "Low Stock Items",
      value: lowStockCount,
      icon: <Warning sx={{ fontSize: 28 }} />,
      color: "#d32f2f",
      bgColor: "#ffebee",
      roles: ["EMPLOYEE"],
    },
  ];

  const visibleStats = statsConfig.filter((stat) => stat.roles.includes(role));

  return (
    <Grid container spacing={3} sx={{ mb: 4 }}>
      {visibleStats.map((stat, index) => (
        <Grid item xs={12} sm={6} md={3} key={index}>
          <Card
            elevation={0}
            sx={{
              height: "100%",
              border: "1px solid",
              borderColor: "divider",
              transition: "all 0.2s ease-in-out",
              "&:hover": {
                transform: "translateY(-2px)",
                boxShadow: 3,
              },
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <Box
                  sx={{
                    p: 1.5,
                    borderRadius: 2,
                    bgcolor: stat.bgColor,
                    color: stat.color,
                    mr: 2,
                  }}
                >
                  {stat.icon}
                </Box>
                <Box>
                  <Typography
                    variant="h4"
                    component="div"
                    sx={{
                      fontWeight: 700,
                      color: "text.primary",
                      lineHeight: 1,
                    }}
                  >
                    {stat.value.toLocaleString()}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ color: "text.secondary", mt: 0.5, fontWeight: 500 }}
                  >
                    {stat.title}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

// Charts Section
const ChartsSection = ({ categoryDistribution, supplierDistribution }) => (
  <Grid container spacing={4} sx={{ mb: 4 }}>
    <Grid item xs={12} lg={6}>
      <Card
        elevation={0}
        sx={{ height: "100%", border: "1px solid", borderColor: "divider" }}
      >
        <CardContent sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
            Category Distribution
          </Typography>
          <ResponsiveContainer width="100%" height={350}>
            <PieChart>
              <Pie
                data={categoryDistribution}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={110}
                innerRadius={50}
                paddingAngle={2}
              >
                {categoryDistribution.map((entry, i) => (
                  <Cell
                    key={`cell-${i}`}
                    fill={CHART_COLORS[i % CHART_COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend wrapperStyle={{ paddingTop: "20px" }} />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </Grid>

    <Grid item xs={12} lg={6}>
      <Card
        elevation={0}
        sx={{ height: "100%", border: "1px solid", borderColor: "divider" }}
      >
        <CardContent sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
            Products per Supplier
          </Typography>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart
              data={supplierDistribution}
              margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
            >
              <XAxis
                dataKey="name"
                angle={-45}
                textAnchor="end"
                height={80}
                interval={0}
                fontSize={12}
              />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#1976d2" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </Grid>
  </Grid>
);

// Employee Section
const EmployeeSection = ({ recentProducts, lowStockProducts }) => (
  <Grid container spacing={4}>
    <Grid item xs={12} md={6}>
      <Card
        elevation={0}
        sx={{ border: "1px solid", borderColor: "divider", height: "100%" }}
      >
        <CardContent sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
            Recently Added Products
          </Typography>
          <List disablePadding>
            {recentProducts.length > 0 ? (
              recentProducts.map((p, i) => (
                <React.Fragment key={p.id}>
                  <ListItem disableGutters sx={{ py: 2 }}>
                    <ListItemText
                      primary={
                        <Typography sx={{ fontWeight: 600 }}>
                          {p.name}
                        </Typography>
                      }
                      secondary={`${
                        p.category?.name || "Uncategorized"
                      } • Stock: ${p.inventory?.stockLevel ?? 0} (Min: ${
                        p.inventory?.minStockLevel ?? 0
                      })`}
                    />
                  </ListItem>
                  {i < recentProducts.length - 1 && <Divider />}
                </React.Fragment>
              ))
            ) : (
              <Typography variant="body2" sx={{ textAlign: "center", py: 4 }}>
                No recent products found
              </Typography>
            )}
          </List>
        </CardContent>
      </Card>
    </Grid>

    <Grid item xs={12} md={6}>
      <Card
        elevation={0}
        sx={{ border: "1px solid", borderColor: "divider", height: "100%" }}
      >
        <CardContent sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
            Low Stock Alert
          </Typography>
          <List disablePadding>
            {lowStockProducts.length > 0 ? (
              lowStockProducts.slice(0, 5).map((p, i) => (
                <React.Fragment key={p.id}>
                  <ListItem disableGutters sx={{ py: 2 }}>
                    <ListItemText
                      primary={
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <Warning
                            sx={{ color: "warning.main", mr: 1, fontSize: 20 }}
                          />
                          <Typography sx={{ fontWeight: 600 }}>
                            {p.name}
                          </Typography>
                        </Box>
                      }
                      secondary={`Current: ${
                        p.inventory?.stockLevel ?? 0
                      } • Minimum: ${p.inventory?.minStockLevel ?? 0}`}
                    />
                  </ListItem>
                  {i < Math.min(lowStockProducts.length, 5) - 1 && <Divider />}
                </React.Fragment>
              ))
            ) : (
              <Typography variant="body2" sx={{ textAlign: "center", py: 4 }}>
                All products are adequately stocked
              </Typography>
            )}
          </List>
        </CardContent>
      </Card>
    </Grid>
  </Grid>
);

export default Home;
