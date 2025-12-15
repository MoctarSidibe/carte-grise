import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Box,
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton,
  Avatar,
  Divider,
  useMediaQuery,
  useTheme,
  Menu,
  MenuItem,
  Chip,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  Description as DescriptionIcon,
  AccountTree as WorkflowIcon,
  People as PeopleIcon,
  Security as SecurityIcon,
  DirectionsCar,
  Logout,
  AccountCircle,
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';

const drawerWidth = 280;

const Layout = ({ children }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout, isSystemAdmin } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    handleMenuClose();
    logout();
  };

  const menuItems = [
    { text: 'Tableau de Bord', icon: <DashboardIcon />, path: '/dashboard' },
    { text: 'Demandes', icon: <DescriptionIcon />, path: '/applications' },
    ...(isSystemAdmin() ? [
      { text: 'Workflows', icon: <WorkflowIcon />, path: '/workflows' },
      { text: 'Utilisateurs', icon: <PeopleIcon />, path: '/users' },
      { text: 'Rôles', icon: <SecurityIcon />, path: '/roles' },
    ] : []),
  ];

  const drawer = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Logo Section */}
      <Box
        sx={{
          p: 3,
          background: 'linear-gradient(135deg, #009E60 0%, #FCD116 50%, #3A75C4 100%)',
          color: 'white',
          position: 'relative',
        }}
      >
        {/* Top Stripe */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: 4,
            display: 'flex',
          }}
        >
          <Box sx={{ flex: 1, background: '#009E60' }} />
          <Box sx={{ flex: 1, background: '#FCD116' }} />
          <Box sx={{ flex: 1, background: '#3A75C4' }} />
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
          <Avatar
            sx={{
              width: 50,
              height: 50,
              bgcolor: 'rgba(255,255,255,0.3)',
              mr: 2,
            }}
          >
            <DirectionsCar sx={{ fontSize: 28 }} />
          </Avatar>
          <Box>
            <Typography variant="h6" fontWeight={700}>
              CGA
            </Typography>
            <Typography variant="caption" sx={{ opacity: 0.9 }}>
              République Gabonaise
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Navigation Items */}
      <List sx={{ flex: 1, pt: 2 }}>
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <ListItem key={item.text} disablePadding sx={{ px: 2, mb: 0.5 }}>
              <ListItemButton
                onClick={() => {
                  navigate(item.path);
                  if (isMobile) handleDrawerToggle();
                }}
                sx={{
                  borderRadius: 2,
                  backgroundColor: isActive ? 'rgba(0, 158, 96, 0.1)' : 'transparent',
                  borderLeft: isActive ? '4px solid #009E60' : '4px solid transparent',
                  '&:hover': {
                    backgroundColor: 'rgba(0, 158, 96, 0.05)',
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    color: isActive ? '#009E60' : 'text.secondary',
                    minWidth: 40,
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.text}
                  primaryTypographyProps={{
                    fontWeight: isActive ? 600 : 400,
                    color: isActive ? '#009E60' : 'text.primary',
                  }}
                />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>

      <Divider />

      {/* User Info */}
      <Box sx={{ p: 2 }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            p: 2,
            borderRadius: 2,
            bgcolor: 'rgba(0, 158, 96, 0.05)',
          }}
        >
          <Avatar
            sx={{
              width: 40,
              height: 40,
              bgcolor: '#009E60',
              mr: 2,
            }}
          >
            {user?.username?.charAt(0).toUpperCase()}
          </Avatar>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography variant="body2" fontWeight={600} noWrap>
              {user?.username}
            </Typography>
            <Typography variant="caption" color="text.secondary" noWrap>
              {user?.email}
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      {/* AppBar */}
      <AppBar
        position="fixed"
        sx={{
          width: { md: `calc(100% - ${drawerWidth}px)` },
          ml: { md: `${drawerWidth}px` },
          background: 'linear-gradient(90deg, #009E60 0%, #FCD116 50%, #3A75C4 100%)',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { md: 'none' } }}
          >
            <MenuIcon />
          </IconButton>

          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1, fontWeight: 600 }}>
            Carte Grise Administrative
          </Typography>

          {/* User Role Chip */}
          {user?.roles && user.roles.length > 0 && (
            <Chip
              label={typeof user.roles[0] === 'string' ? user.roles[0] : user.roles[0].name}
              size="small"
              sx={{
                mr: 2,
                display: { xs: 'none', sm: 'flex' },
                bgcolor: 'rgba(255,255,255,0.2)',
                color: 'white',
                fontWeight: 600,
              }}
            />
          )}

          {/* User Menu */}
          <IconButton color="inherit" onClick={handleMenuOpen}>
            <AccountCircle />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          >
            <MenuItem disabled>
              <Typography variant="body2" fontWeight={600}>
                {user?.username}
              </Typography>
            </MenuItem>
            <Divider />
            <MenuItem onClick={handleLogout}>
              <ListItemIcon>
                <Logout fontSize="small" />
              </ListItemIcon>
              Déconnexion
            </MenuItem>
          </Menu>
        </Toolbar>

        {/* Bottom Stripe on AppBar */}
        <Box
          sx={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: 3,
            display: 'flex',
          }}
        >
          <Box sx={{ flex: 1, background: '#009E60' }} />
          <Box sx={{ flex: 1, background: '#FCD116' }} />
          <Box sx={{ flex: 1, background: '#3A75C4' }} />
        </Box>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: drawerWidth,
          },
        }}
      >
        {drawer}
      </Drawer>

      {/* Desktop Drawer */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', md: 'block' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: drawerWidth,
            borderRight: '1px solid rgba(0,0,0,0.08)',
          },
        }}
        open
      >
        {drawer}
      </Drawer>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: { xs: '100%', md: `calc(100% - ${drawerWidth}px)` },
          minHeight: '100vh',
          bgcolor: '#F5F7FA',
        }}
      >
        <Toolbar /> {/* Spacer for AppBar */}
        {children}
      </Box>
    </Box>
  );
};

export default Layout;
