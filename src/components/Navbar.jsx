// import React from "react";
// import AppBar from "@mui/material/AppBar";
// import Toolbar from "@mui/material/Toolbar";
// import Typography from "@mui/material/Typography";
// import Button from "@mui/material/Button";
// import IconButton from "@mui/material/IconButton";
// import InventoryIcon from "@mui/icons-material/Inventory2";
// import Box from "@mui/material/Box";
// import Chip from "@mui/material/Chip";
// import { useAuth } from "../context/AuthContext";
// import { useNavigate, Link } from "react-router-dom";

// const Navbar = () => {
//   const { user, logout } = useAuth();
//   const navigate = useNavigate();
//   const role = user?.role;

//   return (
//     <AppBar position="static" elevation={2}>
//       <Toolbar>
//         <IconButton edge="start" color="inherit" sx={{ mr: 1 }}>
//           <InventoryIcon />
//         </IconButton>
//         <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 700 }}>
//           Product Management
//         </Typography>

//         {user ? (
//           <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
//             <Button color="inherit" component={Link} to="/">
//               Home
//             </Button>

//             {(role === "ADMIN" || role === "MANAGER") && (
//               <>
//                 <Button color="inherit" component={Link} to="/products">
//                   Products
//                 </Button>
//                 <Button color="inherit" component={Link} to="/categories">
//                   Categories
//                 </Button>
//                 <Button color="inherit" component={Link} to="/suppliers">
//                   Suppliers
//                 </Button>
//               </>
//             )}

//             <Button color="inherit" component={Link} to="/inventory">
//               Inventory
//             </Button>
//             {role == "ADMIN" && (
//               <Button color="inherit" component={Link} to="/admin/users">
//                 Add users
//               </Button>
//             )}
//             <Chip
//               label={`${user.username} • ${role}`}
//               size="small"
//               sx={{ ml: 1, bgcolor: "rgba(255,255,255,0.15)", color: "white" }}
//             />

//             <Button
//               color="inherit"
//               onClick={() => {
//                 logout();
//                 navigate("/login");
//               }}
//             >
//               Logout
//             </Button>
//           </Box>
//         ) : (
//           <Button color="inherit" onClick={() => navigate("/login")}>
//             Login
//           </Button>
//         )}
//       </Toolbar>
//     </AppBar>
//   );
// };

// export default Navbar;
import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Box,
  Chip,
  Avatar,
  Menu,
  MenuItem,
  Divider,
  useTheme,
  useMediaQuery,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Tooltip,
} from "@mui/material";
import {
  Inventory2 as InventoryIcon,
  Person as PersonIcon,
  Logout as LogoutIcon,
  Menu as MenuIcon,
  Home as HomeIcon,
  Category as CategoryIcon,
  LocalShipping as SuppliersIcon,
  Inventory as ProductsIcon,
  AdminPanelSettings as AdminIcon,
  ExpandMore as ExpandMoreIcon,
} from "@mui/icons-material";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link, useLocation } from "react-router-dom";

const NAVIGATION_ITEMS = [
  {
    title: "Home",
    path: "/dashboard",
    icon: <HomeIcon />,
    roles: ["ADMIN", "MANAGER", "EMPLOYEE"],
  },
  {
    title: "Products",
    path: "/products",
    icon: <ProductsIcon />,
    roles: ["ADMIN", "MANAGER"],
  },
  {
    title: "Categories",
    path: "/categories",
    icon: <CategoryIcon />,
    roles: ["ADMIN", "MANAGER"],
  },
  {
    title: "Suppliers",
    path: "/suppliers",
    icon: <SuppliersIcon />,
    roles: ["ADMIN", "MANAGER"],
  },
  {
    title: "Inventory",
    path: "/inventory",
    icon: <InventoryIcon />,
    roles: ["ADMIN", "MANAGER", "EMPLOYEE"],
  },
  {
    title: "User Management",
    path: "/admin/users",
    icon: <AdminIcon />,
    roles: ["ADMIN"],
  },
];

const ROLE_COLORS = {
  ADMIN: "#f44336",
  MANAGER: "#ff9800",
  EMPLOYEE: "#4caf50",
};

const ROLE_LABELS = {
  ADMIN: "Administrator",
  MANAGER: "Manager",
  EMPLOYEE: "Employee",
};

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const [userMenuAnchor, setUserMenuAnchor] = useState(null);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  const role = user?.role;
  const userInitials = user?.username
    ? user.username.slice(0, 2).toUpperCase()
    : "U";

  // Filter navigation items based on user role
  const allowedNavItems = NAVIGATION_ITEMS.filter((item) =>
    item.roles.includes(role)
  );

  const handleUserMenuOpen = (event) => {
    setUserMenuAnchor(event.currentTarget);
  };

  const handleUserMenuClose = () => {
    setUserMenuAnchor(null);
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
    handleUserMenuClose();
  };

  const toggleMobileDrawer = () => {
    setMobileDrawerOpen(!mobileDrawerOpen);
  };

  const isActivePath = (path) => {
    return location.pathname === path;
  };

  // Desktop Navigation
  const DesktopNavigation = () => (
    <Box
      sx={{
        display: { xs: "none", md: "flex" },
        alignItems: "center",
        gap: 0.5,
      }}
    >
      {allowedNavItems.map((item) => (
        <Button
          key={item.path}
          color="inherit"
          component={Link}
          to={item.path}
          startIcon={item.icon}
          sx={{
            mx: 0.5,
            px: 2,
            py: 1,
            borderRadius: 2,
            textTransform: "none",
            fontWeight: 500,
            transition: "all 0.2s ease-in-out",
            position: "relative",
            backgroundColor: isActivePath(item.path)
              ? "rgba(255, 255, 255, 0.15)"
              : "transparent",
            "&:hover": {
              backgroundColor: "rgba(255, 255, 255, 0.1)",
              transform: "translateY(-1px)",
            },
            "&::after": isActivePath(item.path)
              ? {
                  content: '""',
                  position: "absolute",
                  bottom: 0,
                  left: "50%",
                  transform: "translateX(-50%)",
                  width: "60%",
                  height: 2,
                  backgroundColor: "white",
                  borderRadius: 1,
                }
              : {},
          }}
        >
          {item.title}
        </Button>
      ))}
    </Box>
  );

  // Mobile Drawer
  const MobileDrawer = () => (
    <Drawer
      anchor="left"
      open={mobileDrawerOpen}
      onClose={toggleMobileDrawer}
      PaperProps={{
        sx: {
          width: 280,
          bgcolor: "background.paper",
        },
      }}
    >
      <Box sx={{ p: 2 }}>
        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
          <InventoryIcon sx={{ mr: 1, color: "primary.main" }} />
          <Typography
            variant="h6"
            sx={{ fontWeight: 700, color: "text.primary" }}
          >
            Product Management
          </Typography>
        </Box>
        <Divider />
      </Box>

      <List>
        {allowedNavItems.map((item) => (
          <ListItem key={item.path} disablePadding>
            <ListItemButton
              component={Link}
              to={item.path}
              onClick={toggleMobileDrawer}
              selected={isActivePath(item.path)}
              sx={{
                mx: 1,
                borderRadius: 2,
                mb: 0.5,
                "&.Mui-selected": {
                  backgroundColor: "primary.light",
                  color: "primary.contrastText",
                  "& .MuiListItemIcon-root": {
                    color: "primary.contrastText",
                  },
                },
              }}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText
                primary={item.title}
                primaryTypographyProps={{
                  fontWeight: isActivePath(item.path) ? 600 : 400,
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Drawer>
  );

  // User Menu
  const UserMenu = () => (
    <Menu
      anchorEl={userMenuAnchor}
      open={Boolean(userMenuAnchor)}
      onClose={handleUserMenuClose}
      PaperProps={{
        elevation: 8,
        sx: {
          mt: 1.5,
          minWidth: 220,
          borderRadius: 2,
          "& .MuiMenuItem-root": {
            px: 2,
            py: 1.5,
            borderRadius: 1,
            mx: 1,
            my: 0.5,
          },
        },
      }}
      transformOrigin={{ horizontal: "right", vertical: "top" }}
      anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
    >
      <Box sx={{ px: 2, py: 1.5 }}>
        <Typography
          variant="subtitle2"
          sx={{ fontWeight: 600, color: "text.primary" }}
        >
          {user?.name || user?.username}
        </Typography>
        <Typography variant="body2" sx={{ color: "text.secondary", mt: 0.5 }}>
          {user?.email || `${ROLE_LABELS[role]} Account`}
        </Typography>
      </Box>
      <Divider />
      <MenuItem onClick={handleLogout} sx={{ color: "error.main" }}>
        <LogoutIcon sx={{ mr: 2, fontSize: 20 }} />
        Sign Out
      </MenuItem>
    </Menu>
  );

  if (!user) {
    return (
      <AppBar
        position="static"
        elevation={0}
        sx={{
          bgcolor: "primary.main",
          borderBottom: 1,
          borderColor: "divider",
        }}
      >
        <Toolbar>
          <Box sx={{ display: "flex", alignItems: "center", flexGrow: 1 }}>
            <InventoryIcon sx={{ mr: 1 }} />
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                letterSpacing: 0.5,
              }}
            >
              Product Management
            </Typography>
          </Box>
          <Button
            color="inherit"
            onClick={() => navigate("/login")}
            variant="outlined"
            sx={{
              borderColor: "rgba(255, 255, 255, 0.3)",
              "&:hover": {
                borderColor: "white",
                backgroundColor: "rgba(255, 255, 255, 0.1)",
              },
            }}
          >
            Sign In
          </Button>
        </Toolbar>
      </AppBar>
    );
  }

  return (
    <>
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          bgcolor: "primary.main",
          borderBottom: 1,
          borderColor: "divider",
          backdropFilter: "blur(20px)",
        }}
      >
        <Toolbar sx={{ px: { xs: 2, sm: 3 } }}>
          {/* Mobile Menu Button */}
          {isMobile && (
            <IconButton
              color="inherit"
              edge="start"
              onClick={toggleMobileDrawer}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
          )}

          {/* Logo */}
          <Box sx={{ display: "flex", alignItems: "center", flexGrow: 1 }}>
            <IconButton
              edge="start"
              color="inherit"
              component={Link}
              to="/"
              sx={{
                mr: 1,
                p: 1,
                "&:hover": {
                  transform: "scale(1.1)",
                  transition: "transform 0.2s ease-in-out",
                },
              }}
            >
              <InventoryIcon />
            </IconButton>
            <Typography
              variant="h6"
              component={Link}
              to="/"
              sx={{
                fontWeight: 700,
                textDecoration: "none",
                color: "inherit",
                letterSpacing: 0.5,
                display: { xs: "none", sm: "block" },
                "&:hover": {
                  opacity: 0.8,
                },
              }}
            >
              Product Management
            </Typography>
          </Box>

          {/* Desktop Navigation */}
          <DesktopNavigation />

          {/* User Section */}
          <Box sx={{ display: "flex", alignItems: "center", ml: 2 }}>
            {/* Role Chip */}
            <Chip
              label={ROLE_LABELS[role]}
              size="small"
              sx={{
                mr: 2,
                bgcolor: ROLE_COLORS[role],
                color: "white",
                fontWeight: 600,
                display: { xs: "none", sm: "flex" },
                "& .MuiChip-label": {
                  px: 1.5,
                },
              }}
            />

            {/* User Avatar & Menu */}
            <Tooltip title="Account settings">
              <Button
                onClick={handleUserMenuOpen}
                sx={{
                  minWidth: "auto",
                  p: 0,
                  borderRadius: 3,
                  "&:hover": {
                    backgroundColor: "rgba(255, 255, 255, 0.1)",
                  },
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    px: 1.5,
                    py: 0.5,
                  }}
                >
                  <Avatar
                    sx={{
                      width: 36,
                      height: 36,
                      bgcolor: ROLE_COLORS[role],
                      fontSize: 14,
                      fontWeight: 600,
                      mr: { xs: 0, sm: 1 },
                    }}
                  >
                    {userInitials}
                  </Avatar>
                  <Box sx={{ display: { xs: "none", sm: "block" } }}>
                    <Typography
                      variant="body2"
                      sx={{
                        color: "white",
                        fontWeight: 500,
                        lineHeight: 1,
                      }}
                    >
                      {user?.username}
                    </Typography>
                  </Box>
                  <ExpandMoreIcon
                    sx={{
                      ml: 0.5,
                      fontSize: 18,
                      color: "rgba(255, 255, 255, 0.7)",
                    }}
                  />
                </Box>
              </Button>
            </Tooltip>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Mobile Drawer */}
      <MobileDrawer />

      {/* User Menu */}
      <UserMenu />
    </>
  );
};

export default Navbar;
