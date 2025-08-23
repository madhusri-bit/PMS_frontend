// // src/pages/Home.jsx
// import React, { useEffect, useState } from "react";
// import { useAuth } from "../context/AuthContext";
// import {
//   Container,
//   Grid,
//   Card,
//   CardContent,
//   Typography,
//   CircularProgress,
// } from "@mui/material";
// import {
//   BarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   Tooltip,
//   ResponsiveContainer,
//   PieChart,
//   Pie,
//   Cell,
// } from "recharts";
// import api from "../api/axios";

// const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

// const Home = () => {
//   const { user } = useAuth(); // ⬅️ get user from context
//   const role = user?.role;
//   const [products, setProducts] = useState([]);
//   const [categories, setCategories] = useState([]);
//   const [suppliers, setSuppliers] = useState([]);
//   const [users, setUsers] = useState([]);
//   const [loading, setLoading] = useState(true);

//   // useEffect(() => {
//   //   const fetchAll = async () => {
//   //     try {
//   //       const resProducts = await api.get("/products");
//   //       const resCategories = await api.get("/categories");
//   //       const resSuppliers = await api.get("/suppliers");
//   //       const resUsers = await api.get("/users");

//   //       setProducts(resProducts.data);
//   //       setCategories(resCategories.data);
//   //       setSuppliers(resSuppliers.data);
//   //       setUsers(resUsers.data);
//   //     } catch (error) {
//   //       console.error("Error fetching data:", error);
//   //     } finally {
//   //       setLoading(false);
//   //     }
//   //   };

//   //   fetchAll();
//   // }, []);

//   useEffect(() => {
//     const fetchAll = async () => {
//       try {
//         const resProducts = await api.get("/products");
//         setProducts(resProducts.data);

//         if (role === "ADMIN" || role === "MANAGER") {
//           const resCategories = await api.get("/categories");
//           const resSuppliers = await api.get("/suppliers");
//           setCategories(resCategories.data);
//           setSuppliers(resSuppliers.data);
//         }

//         if (role === "ADMIN") {
//           const resUsers = await api.get("/users");
//           setUsers(resUsers.data);
//         }
//       } catch (error) {
//         console.error("Error fetching data:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchAll();
//   }, [role]);

//   if (loading) {
//     return (
//       <Container sx={{ textAlign: "center", mt: 10 }}>
//         <CircularProgress />
//         <Typography variant="h6" sx={{ mt: 2 }}>
//           Loading Home...
//         </Typography>
//       </Container>
//     );
//   }

//   // Prepare category distribution for Pie chart
//   const categoryDistribution = categories.map((cat) => ({
//     name: cat.name,
//     value: products.filter((p) => p.category?.id === cat.id).length,
//   }));

//   // Prepare supplier-product count for Bar chart
//   const supplierDistribution = suppliers.map((sup) => ({
//     name: sup.name,
//     count: products.filter((p) => p.supplier?.id === sup.id).length,
//   }));

//   return (
//     <Container sx={{ mt: 4 }}>
//       <Typography variant="h4" gutterBottom>
//         Home
//       </Typography>

//       {/* Stat Cards */}
//       <Grid container spacing={3}>
//         <Grid item xs={12} sm={6} md={3}>
//           <Card sx={{ bgcolor: "#e3f2fd" }}>
//             <CardContent>
//               <Typography variant="h6">Products</Typography>
//               <Typography variant="h4">{products.length}</Typography>
//             </CardContent>
//           </Card>
//         </Grid>

//         {(role === "ADMIN" || role === "MANAGER") && (
//           <>
//             <Grid item xs={12} sm={6} md={3}>
//               <Card sx={{ bgcolor: "#fce4ec" }}>
//                 <CardContent>
//                   <Typography variant="h6">Categories</Typography>
//                   <Typography variant="h4">{categories.length}</Typography>
//                 </CardContent>
//               </Card>
//             </Grid>
//             <Grid item xs={12} sm={6} md={3}>
//               <Card sx={{ bgcolor: "#e8f5e9" }}>
//                 <CardContent>
//                   <Typography variant="h6">Suppliers</Typography>
//                   <Typography variant="h4">{suppliers.length}</Typography>
//                 </CardContent>
//               </Card>
//             </Grid>
//           </>
//         )}

//         {role === "ADMIN" && (
//           <Grid item xs={12} sm={6} md={3}>
//             <Card sx={{ bgcolor: "#fff3e0" }}>
//               <CardContent>
//                 <Typography variant="h6">Users</Typography>
//                 <Typography variant="h4">{users.length}</Typography>
//               </CardContent>
//             </Card>
//           </Grid>
//         )}
//       </Grid>

//       {/* Charts */}
//       {(role === "ADMIN" || role === "MANAGER") && (
//         <Grid container spacing={4} sx={{ mt: 3 }}>
//           {/* Category Distribution - Pie */}
//           <Grid item xs={12} md={6}>
//             <Card>
//               <CardContent>
//                 <Typography variant="h6" gutterBottom>
//                   Category Distribution
//                 </Typography>
//                 <ResponsiveContainer width="100%" height={300}>
//                   <PieChart>
//                     <Pie
//                       data={categoryDistribution}
//                       dataKey="value"
//                       nameKey="name"
//                       cx="50%"
//                       cy="50%"
//                       outerRadius={100}
//                       label
//                     >
//                       {categoryDistribution.map((entry, index) => (
//                         <Cell
//                           key={`cell-${index}`}
//                           fill={COLORS[index % COLORS.length]}
//                         />
//                       ))}
//                     </Pie>
//                     <Tooltip />
//                   </PieChart>
//                 </ResponsiveContainer>
//               </CardContent>
//             </Card>
//           </Grid>

//           {/* Supplier vs Products - Bar */}
//           <Grid item xs={12} md={6}>
//             <Card>
//               <CardContent>
//                 <Typography variant="h6" gutterBottom>
//                   Products per Supplier
//                 </Typography>
//                 <ResponsiveContainer width="100%" height={300}>
//                   <BarChart data={supplierDistribution}>
//                     <XAxis dataKey="name" />
//                     <YAxis />
//                     <Tooltip />
//                     <Bar dataKey="count" fill="#8884d8" />
//                   </BarChart>
//                 </ResponsiveContainer>
//               </CardContent>
//             </Card>
//           </Grid>
//         </Grid>
//       )}
//     </Container>
//   );
// };

// export default Home;
// src/pages/Home.jsx
// src/pages/Home.jsx
// src/pages/Home.jsx
import React, { useEffect, useState, useMemo } from "react";
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
import api from "../api/axios";

const CHART_COLORS = ["#2563eb", "#16a34a", "#dc2626", "#ca8a04", "#9333ea"];

const ROLE_PERMISSIONS = {
  ADMIN: ["products", "categories", "suppliers", "users"],
  MANAGER: ["products", "categories", "suppliers"],
  EMPLOYEE: ["products"],
};

const Home = () => {
  const { user } = useAuth();
  const role = user?.role;

  const [data, setData] = useState({
    products: [],
    categories: [],
    suppliers: [],
    users: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const permissions = ROLE_PERMISSIONS[role] || [];

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      setError(null);

      try {
        const requests = [];
        const newData = {};

        if (permissions.includes("products")) {
          requests.push(
            api.get("/products").then((res) => {
              newData.products = res.data;
            })
          );
        }

        if (permissions.includes("categories")) {
          requests.push(
            api.get("/categories").then((res) => {
              newData.categories = res.data;
            })
          );
        }

        if (permissions.includes("suppliers")) {
          requests.push(
            api.get("/suppliers").then((res) => {
              newData.suppliers = res.data;
            })
          );
        }

        if (permissions.includes("users")) {
          requests.push(
            api.get("/users").then((res) => {
              newData.users = res.data;
            })
          );
        }

        await Promise.all(requests);
        setData(newData);
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        setError("Failed to load dashboard data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [role]);
  console.log("User in Home:", user);

  // analytics
  const analytics = useMemo(() => {
    const { products, categories, suppliers } = data;

    const categoryDistribution =
      categories?.map((category, i) => ({
        name: category.name,
        value:
          products?.filter((p) => p.category?.id === category.id).length || 0,
        color: CHART_COLORS[i % CHART_COLORS.length],
      })) || [];

    const supplierDistribution =
      suppliers?.map((supplier) => ({
        name: supplier.name,
        count:
          products?.filter((p) => p.supplier?.id === supplier.id).length || 0,
      })) || [];

    const lowStockProducts =
      products?.filter(
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
  }, [data]);

  if (loading) {
    return (
      <Container
        maxWidth="lg"
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "60vh",
          textAlign: "center",
        }}
      >
        <CircularProgress size={60} thickness={4} />
        <Typography
          variant="h6"
          sx={{
            mt: 3,
            color: "text.secondary",
            fontWeight: 400,
          }}
        >
          Loading Dashboard...
        </Typography>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Paper
          elevation={0}
          sx={{
            p: 4,
            textAlign: "center",
            bgcolor: "error.light",
            color: "error.contrastText",
          }}
        >
          <Typography variant="h6">{error}</Typography>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Page Header */}

      <Box sx={{ mb: 4 }}>
        <Typography
          variant="h3"
          component="h1"
          sx={{
            fontWeight: 600,
            color: "text.primary",
            mb: 1,
          }}
        >
          Dashboard
        </Typography>
        <Typography
          variant="subtitle1"
          sx={{
            color: "text.secondary",
            fontSize: "1.1rem",
          }}
        >
          Welcome back, {user?.username || "User"}
        </Typography>
        <Divider sx={{ mt: 2 }} />
      </Box>

      {/* Stats Cards */}
      <StatisticsSection
        role={role}
        data={data}
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
                    sx={{
                      color: "text.secondary",
                      mt: 0.5,
                      fontWeight: 500,
                    }}
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
