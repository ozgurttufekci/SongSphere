import React, { useState, useEffect } from "react";
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
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import SoundSphereIcon from "./SoundSphereIcon";
import LibraryMusicIcon from '@mui/icons-material/LibraryMusic';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import AccountCircle from '@mui/icons-material/AccountCircle';
import axios from 'axios';
import { authUrl } from "../api/SpotifyConfig";

const drawerWidth = 240;

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
});

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

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
}));

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

export default function NavBar({selectedTab}) {
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(selectedTab);
  const [token, setToken] = useState(null);
  const [profile, setProfile] = useState(null);
  const [profileImage, setProfileImage] = useState(null); // State for profile image
  const [anchorEl, setAnchorEl] = useState(null);

  const handleLogout = () => {
    setToken(null);
    setProfile(null);
    setProfileImage(null); // Clear profile image on logout
    window.localStorage.removeItem("token");
  };

  const fetchProfile = async (token) => {
    try {
      const response = await axios.get('https://api.spotify.com/v1/me', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setProfile(response.data);
      if (response.data.images.length > 0) {
        setProfileImage(response.data.images[0].url); // Set profile image URL if available
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      handleLogout();
    }
  };

  useEffect(() => {
    const hash = window.location.hash;
    let token = window.localStorage.getItem("token");
    if (!token && hash) {
      token = hash.substring(1).split("&").find(elem => elem.startsWith("access_token")).split("=")[1];
      window.location.hash = "";
      window.localStorage.setItem("token", token);
    }
    setToken(token);
    if (token) {
      fetchProfile(token);
    }
  }, []);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const handleListItemClick = (index) => {
    setSelectedIndex(index);
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <Box sx={{ display: 'flex' }}>
        <CssBaseline />
        <AppBar position="fixed" open={open}>
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              onClick={handleDrawerOpen}
              edge="start"
              sx={{
                marginRight: 5,
                ...(open && { display: 'none' }),
              }}
            >
              <MenuIcon />
            </IconButton>
            <IconButton href="/">
              <SoundSphereIcon sx={{ width: 48, height: 48 }} />
            </IconButton>
            <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1, textAlign: 'left' }}>
              SoundSphere
            </Typography>
            {profile ? (
              <>
                <IconButton
                  edge="end"
                  aria-label="account of current user"
                  aria-controls="primary-search-account-menu"
                  aria-haspopup="true"
                  onClick={handleMenuOpen}
                  color="inherit"
                >
                  {profileImage ? ( // Conditionally render profile image if available
                    <img src={profileImage} alt="Profile" style={{ width: 48, height: 48, borderRadius: '50%' }} />
                  ) : (
                    <AccountCircle />
                  )}
                </IconButton>
                <Menu
                  anchorEl={anchorEl}
                  anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                  keepMounted
                  transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                  open={Boolean(anchorEl)}
                  onClose={handleMenuClose}
                >
                  <MenuItem sx={{ pointerEvents: 'none' }}>{`Logged in as: ${profile.display_name}`}</MenuItem>
                  <Divider />
                  <MenuItem onClick={handleLogout}>Logout</MenuItem>
                </Menu>
              </>
            ) : (
              <Button color="inherit" sx={{backgroundColor: "#1DB954"}} href={authUrl}>Login with Spotify</Button>
            )}
          </Toolbar>
        </AppBar>
        <Drawer variant="permanent" open={open}>
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
                onClick={() => handleListItemClick(0)}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: open ? 3 : 'auto',
                    justifyContent: 'center',
                    color: selectedIndex === 0 ? '#FE2C55' : 'inherit',
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
                onClick={() => handleListItemClick(1)}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: open ? 3 : 'auto',
                    justifyContent: 'center',
                    color: selectedIndex === 1 ? '#25F4EE' : 'inherit',
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
