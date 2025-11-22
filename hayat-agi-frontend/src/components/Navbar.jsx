import React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { Link } from 'react-router-dom';

import '../theme/Navbar.css';

const pages = ['Çözümlerimiz', 'Fiyatlandırma', 'Doküman', 'Destek'];
const pageRoutes = {
    'Fiyatlandırma': '/fiyatlandirma',
    'Doküman': '/dokuman',
    'Destek': '/destek'
};

const Navbar = () => {
    const [anchorElNav, setAnchorElNav] = React.useState(null);
    const [anchorElSolutions, setAnchorElSolutions] = React.useState(null);

    const handleOpenNavMenu = (event) => {
        setAnchorElNav(event.currentTarget);
    };

    const handleCloseNavMenu = () => {
        setAnchorElNav(null);
    };

    const handleOpenSolutionsMenu = (event) => {
        setAnchorElSolutions(event.currentTarget);
    };


    const handleCloseSolutionsMenu = () => {
        setAnchorElSolutions(null);
    };

    return (
        <AppBar position="static" className="custom-appbar">
            <Container maxWidth="xl">
                <Toolbar disableGutters>
                    <Typography
                        variant="h6"
                        noWrap
                        component={Link}
                        to="/"
                        className="logo-text"
                        sx={{ display: { xs: 'none', md: 'flex' }, mr: 2 }}
                    >
                        HAYAT AĞI
                    </Typography>

                    <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' }, justifyContent: 'flex-end', mr: 2 }}>
                        {pages.map((page) => {
                            if (page === 'Çözümlerimiz') {
                                return (
                                    <React.Fragment key={page}>
                                        <Button
                                            onClick={handleOpenSolutionsMenu}
                                            className="nav-btn"
                                            endIcon={<KeyboardArrowDownIcon />}
                                        >
                                            {page}
                                        </Button>


                                        <Menu
                                            sx={{ mt: '45px' }}
                                            id="menu-appbar"
                                            anchorEl={anchorElSolutions}
                                            anchorOrigin={{
                                                vertical: 'top',
                                                horizontal: 'right',
                                            }}
                                            keepMounted
                                            transformOrigin={{
                                                vertical: 'top',
                                                horizontal: 'right',
                                            }}
                                            open={Boolean(anchorElSolutions)} // State doluysa aç
                                            onClose={handleCloseSolutionsMenu}
                                        >

                                            <MenuItem onClick={handleCloseSolutionsMenu} component={Link} to="/genel-bakis">
                                                <Typography textAlign="center">Genel Bakış</Typography>
                                            </MenuItem>
                                            <MenuItem onClick={handleCloseSolutionsMenu} component={Link} to="/mobil-uygulama">
                                                <Typography textAlign="center">Mobil Uygulamamız</Typography>
                                            </MenuItem>
                                            <MenuItem onClick={handleCloseSolutionsMenu} component={Link} to="/donanimlar">
                                                <Typography textAlign="center"> Donanımlarımız</Typography>
                                            </MenuItem>
                                        </Menu>
                                    </React.Fragment>
                                );
                            }
                            return (
                                <Button
                                    key={page}
                                    onClick={handleCloseNavMenu}
                                    className="nav-btn"
                                    component={Link}
                                    to={pageRoutes[page] || '/'}
                                >
                                    {page}
                                </Button>
                            );
                        })}
                    </Box>
                    <Button
                        component={Link}
                        to="/auth/login"
                        className="login-btn"
                    >
                        Giriş Yap
                    </Button>
                </Toolbar>
            </Container>
        </AppBar>
    )
}

export default Navbar;
