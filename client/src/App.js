import React, { useState } from 'react';
import { Routes, Route, NavLink, useLocation } from 'react-router-dom';
import { CssBaseline, AppBar, Toolbar, IconButton, Typography, Drawer, List, ListItem, ListItemIcon, ListItemText, Box, Divider, useTheme, useMediaQuery } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import HomeIcon from '@mui/icons-material/Home';
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';
import PeopleIcon from '@mui/icons-material/People';
import BarChartIcon from '@mui/icons-material/BarChart';
import SettingsIcon from '@mui/icons-material/Settings';

const drawerWidth = 220;

const navItems = [
  { label: 'Dashboard', icon: <HomeIcon />, path: '/' },
  { label: 'Tickets', icon: <ConfirmationNumberIcon />, path: '/tickets' },
  { label: 'Users', icon: <PeopleIcon />, path: '/users' },
  { label: 'Reports', icon: <BarChartIcon />, path: '/reports' },
  { label: 'Settings', icon: <SettingsIcon />, path: '/settings' },
];

function DashboardHome() {
  return (
    <Box p={2}>
      <Typography variant="h4" gutterBottom>Welcome, Admin!</Typography>
      <Box display="flex" gap={2} flexWrap="wrap">
        <Box bgcolor="#e3f2fd" p={2} borderRadius={2} minWidth={180}>Open Tickets: 12</Box>
        <Box bgcolor="#e8f5e9" p={2} borderRadius={2} minWidth={180}>Active Users: 5</Box>
        <Box bgcolor="#fff3e0" p={2} borderRadius={2} minWidth={180}>Avg. Response: 2h</Box>
      </Box>
    </Box>
  );
}
function TicketsPage() {
  return <Box p={2}><Typography variant="h5">Tickets</Typography><div>Ticket list goes here.</div></Box>;
}
function UsersPage() {
  return <Box p={2}><Typography variant="h5">Users</Typography><div>User management goes here.</div></Box>;
}
function ReportsPage() {
  return <Box p={2}><Typography variant="h5">Reports</Typography><div>Reports go here.</div></Box>;
}
function SettingsPage() {
  return <Box p={2}><Typography variant="h5">Settings</Typography><div>Settings go here.</div></Box>;
}

export default function App() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  const drawer = (
    <div role="navigation" aria-label="Main navigation">
      <Toolbar />
      <Divider />
      <List>
        {navItems.map(item => (
          <ListItem
            button
            key={item.path}
            component={NavLink}
            to={item.path}
            selected={location.pathname === item.path}
            onClick={() => setMobileOpen(false)}
            aria-current={location.pathname === item.path ? 'page' : undefined}
          >
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.label} />
          </ListItem>
        ))}
      </List>
    </div>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar position="fixed" sx={{ zIndex: theme.zIndex.drawer + 1 }}>
        <Toolbar>
          {isMobile && (
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={() => setMobileOpen(true)}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
          )}
          <Typography variant="h6" noWrap component="div">
            Helpdesk Admin
          </Typography>
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
        aria-label="sidebar navigation"
      >
        {/* Mobile Drawer */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={() => setMobileOpen(false)}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>
        {/* Desktop Drawer */}
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', md: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{ flexGrow: 1, p: 3, width: { md: `calc(100% - ${drawerWidth}px)` }, minHeight: '100vh', bgcolor: '#f5f7fa' }}
        tabIndex={-1}
      >
        <Toolbar />
        <Routes>
          <Route path="/" element={<DashboardHome />} />
          <Route path="/tickets" element={<TicketsPage />} />
          <Route path="/users" element={<UsersPage />} />
          <Route path="/reports" element={<ReportsPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Routes>
      </Box>
    </Box>
  );
}
