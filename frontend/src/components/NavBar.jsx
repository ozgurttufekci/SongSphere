// Import necessary libraries and components from React and Material-UI
import React, { useState } from "react";
import { createTheme, ThemeProvider, styled, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import MuiDrawer from '@mui/material/Drawer';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import CssBaseline from '@mui/material/CssBaseline';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import SoundSphereIcon from "./SoundSphereIcon";
import LibraryMusicIcon from '@mui/icons-material/LibraryMusic';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';

// Define the width of the drawer
const drawerWidth = 240;

// Define styles for the drawer when it is open
const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
});

// Define styles for the drawer when it is closed
const closedMixin = (theme) => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up('sm')]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

// Define a styled component for the drawer header
const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

// Define a styled component for the AppBar with conditional styles based on 'open' prop
const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

// Define a styled component for the Drawer with conditional styles based on 'open' prop
const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
    boxSizing: 'border-box',
    ...(open && {
      ...openedMixin(theme),
      '& .MuiDrawer-paper': openedMixin(theme),
    }),
    ...(!open && {
      ...closedMixin(theme),
      '& .MuiDrawer-paper': closedMixin(theme),
    }),
  }),
);

// Define the NavBar component
export default function NavBar() {
  const theme = useTheme(); // Get the theme context
  const [open, setOpen] = useState(false); // State to manage the drawer's open/close status
  const [selectedIndex, setSelectedIndex] = useState(0); // State to manage the selected item index

  // Function to open the drawer
  const handleDrawerOpen = () => {
    setOpen(true);
  };

  // Function to close the drawer
  const handleDrawerClose = () => {
    setOpen(false);
  };

  // Function to handle item selection
  const handleListItemClick = (index) => {
    setSelectedIndex(index);
  };

  return (
    <>
      <Box sx={{ display: 'flex' }}>
        <CssBaseline /> {/* Resets CSS baseline */}
        <AppBar position="fixed" open={open}> {/* AppBar at the top of the screen */}
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              onClick={handleDrawerOpen}
              edge="start"
              sx={{
                marginRight: 5,
                ...(open && { display: 'none' }), // Hide button when drawer is open
              }}
            >
              <MenuIcon />
            </IconButton>
            <IconButton href="/">
              <SoundSphereIcon sx={{ width: 48, height: 48 }} />
            </IconButton>
            <Typography variant="h6" noWrap component="div">
              SoundSphere
            </Typography>
          </Toolbar>
        </AppBar>
        <Drawer variant="permanent" open={open}> {/* Permanent drawer */}
          <DrawerHeader>
            <IconButton onClick={handleDrawerClose}>
              {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
            </IconButton>
          </DrawerHeader>
          <Divider />
          <List>
            <ListItem disablePadding sx={{ display: 'block' }}>
              <ListItemButton
                href="/"
                sx={{
                  minHeight: 48,
                  justifyContent: open ? 'initial' : 'center',
                  px: 2.5,
                }}
                onClick={() => handleListItemClick(0)} // Set selected index to 0
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: open ? 3 : 'auto',
                    justifyContent: 'center',
                    color: selectedIndex === 0 ? '#FE2C55' : 'inherit', // Change color if selected
                  }}
                >
                  <LibraryMusicIcon />
                </ListItemIcon>
                <ListItemText primary="Similar Songs" sx={{ opacity: open ? 1 : 0 }} />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding sx={{ display: 'block' }}>
              <ListItemButton
                href="/smart-playlist"
                sx={{
                  minHeight: 48,
                  justifyContent: open ? 'initial' : 'center',
                  px: 2.5,
                }}
                onClick={() => handleListItemClick(1)} // Set selected index to 1
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: open ? 3 : 'auto',
                    justifyContent: 'center',
                    color: selectedIndex === 1 ? '#25F4EE' : 'inherit', // Change color if selected
                  }}
                >
                  <AutoAwesomeIcon />
                </ListItemIcon>
                <ListItemText primary="Smart Playlist" sx={{ opacity: open ? 1 : 0 }} />
              </ListItemButton>
            </ListItem>
          </List>
        </Drawer>
      </Box>
    </>
  );
}