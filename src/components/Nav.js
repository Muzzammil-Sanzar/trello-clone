import React from 'react';
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux';
import { login, token } from '../redux/actions';

/* MATERIAL UI IMPORTS HERE */
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import AdbIcon from '@mui/icons-material/Adb';

function Navbar() {
    const [anchorElNav, setAnchorElNav] = React.useState(null);

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const loggedin = useSelector(state => state.allUsers)

    const handleOpenNavMenu = (event) => {
        setAnchorElNav(event.currentTarget);
    };

    const handleCloseNavMenu = () => {
        setAnchorElNav(null);
    };

    const handleClick = () => {
        dispatch(login(false))
        dispatch(token(null))
        navigate('/login')
    }

    return (
        <AppBar position="static" sx={{backgroundColor: 'rgba(218, 226, 182, 0.6)'}}>
        <Container maxWidth="xl">
            <Toolbar disableGutters>
            <AdbIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1, color: '#413F42' }} />
            <Typography
                variant="h6"
                noWrap
                component="a"
                href="/"
                sx={{
                mr: 2,
                display: { xs: 'none', md: 'flex' },
                fontFamily: 'monospace',
                fontWeight: 700,
                letterSpacing: '.3rem',
                color: '#413F42',
                textDecoration: 'none',
                }}
            >
                TRELLO
            </Typography>

            <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
                <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleOpenNavMenu}
                >
                <MenuIcon />
                </IconButton>
                <Menu
                    id="menu-appbar"
                    anchorEl={anchorElNav}
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'left',
                    }}
                    keepMounted
                    transformOrigin={{
                        vertical: 'top',
                        horizontal: 'left',
                    }}
                    open={Boolean(anchorElNav)}
                    onClose={handleCloseNavMenu}
                    sx={{
                        display: { xs: 'block', md: 'none', color:'red' },
                    }}
                >
                
                    <MenuItem  onClick={handleCloseNavMenu}>
                        <Button
                            sx={{ color: '#7F8487', display: 'block', fontWeight: 'bold' }}
                        >   
                            Home
                        </Button>
                    </MenuItem>
            
                </Menu>
            </Box>
            <AdbIcon sx={{ display: { xs: 'flex', md: 'none' }, mr: 1, color: '#413F42' }} />
            <Typography
                variant="h5"
                noWrap
                component="a"
                href=""
                sx={{
                mr: 2,
                display: { xs: 'flex', md: 'none' },
                flexGrow: 1,
                fontFamily: 'monospace',
                fontWeight: 700,
                letterSpacing: '.3rem',
                color: '#413F42',
                textDecoration: 'none',
                }}
            >
                TRELLO
            </Typography>
            <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
                <Button
                    onClick={handleCloseNavMenu}
                    sx={{ my: 2, color: '#7F8487', display: 'block', fontWeight: 'bold' }}
                >
                    Home
                </Button>
            </Box>

            <Box sx={{ flexGrow: 0 }}>
                <Button onClick={handleClick} sx={{ my: 2, color: '#7F8487', display: 'block', fontWeight: 'bold' }}>{(loggedin)? 'Logout' : 'Sign in'}</Button>
            </Box>
            </Toolbar>
        </Container>
        </AppBar>
    );
}

export default Navbar;