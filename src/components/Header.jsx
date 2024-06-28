import React, { useState, useEffect } from "react";
import MenuIcon from "@mui/icons-material/Menu";
import {
  AppBar,
  Box,
  Button,
  IconButton,
  Menu,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Stack,
  Toolbar,
  Typography,
  alpha,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import menuConfigs from "../config/menu.configs";
import Logo from "./Logo";

const Header = () => {
  const navigate = useNavigate();
  // const {user} = useContext(UserContext)
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrolled, setScrolled] = useState(false);
  const [userName, setUserName] = useState();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleButtonClick = (index) => {
    setSelectedIndex(index);
  };

  const handleScroll = () => {
    if (window.scrollY > 50) {
      setScrolled(true);
    } else {
      setScrolled(false);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    const userData = sessionStorage.getItem("userData");
    if (userData) {
      const parsedUserData = JSON.parse(userData);
      setUserName(parsedUserData.account.fullName);
    }
  }, []);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    sessionStorage.removeItem("userData");
    setUserName(null);
    navigate('/login');
  };

  // const handleFavorite = () => {
  //   navigate("/favorite");
  //   handleMenuClose();
  // };

  return (
    <>
      <AppBar
        elevation={0}
        sx={{
          zIndex: 9999,
          backgroundColor: scrolled ? "#131313" : "transparent",
          transition: "background-color 0.3s",
        }}
      >
        <Toolbar className="items-center justify-between">
          <Stack direction="row" spacing={1} alignItems="center">
            <IconButton color="inherit" sx={{ mr: 2, display: { md: "none" } }}>
              <MenuIcon />
            </IconButton>

            <Box sx={{ display: { xs: "inline-block", md: "none" } }}>
              <Logo />
            </Box>
          </Stack>

          {/* main menu */}
          <Box
            flexGrow={1}
            alignItems="center"
            display={{ xs: "none", md: "flex" }}
          >
            <Box sx={{ marginRight: "30px" }}>
              <Logo />
            </Box>
            {menuConfigs.main.map((item, index) => (
              <Button
                key={index}
                component={Link}
                to={item.path}
                // variant="contained"
                onClick={() => {
                  handleButtonClick(index);
                  navigate(item.path);
                }}
                style={{
                  backgroundColor:
                    selectedIndex === index ? "red" : "transparent",
                  margin: "0px 5px",
                }}
              >
                <Typography
                  className="text-white"
                  fontWeight={600}
                  sx={{ fontSize: "14px" }}
                >
                  {item.display}
                </Typography>
              </Button>
            ))}
          </Box>
          {/* main menu */}

          {/* user menu */}
          <Stack
            spacing={3}
            direction="row"
            alignItems="center"
            sx={{ marginRight: "10px" }}
          >
            {userName ? (
              <>
                <Typography
                  className="text-white"
                  fontWeight={700}
                  sx={{ fontSize: "18px", cursor: "pointer" }}
                  onMouseEnter={handleMenuOpen}
                >
                  {userName}
                </Typography>
                <Menu
                  anchorEl={anchorEl}
                  open={open}
                  onClose={handleMenuClose}
                  MenuListProps={{ onMouseLeave: handleMenuClose }}
                  sx={{ zIndex: "9999"}}
                >
                  {menuConfigs.user.map((item, index) => (
                    <ListItemButton
                      component={Link}
                      to={item.path}
                      key={index}
                      onClick={()=> {
                        if(index === 4){
                          handleLogout()
                        }
                      }}
                    >
                      <ListItemIcon>{item.icon}</ListItemIcon>
                      <ListItemText
                        disableTypography
                        primary={
                          <Typography textTransform="uppercase">
                            {item.display}
                          </Typography>
                        }
                      />
                    </ListItemButton>
                  ))}
                </Menu>
              </>
            ) : (
              <Button
                className=""
                variant="contained"
                sx={{
                  fontSize: "13px",
                  backgroundColor: "#ff0000",
                  "&:hover": {
                    backgroundColor: alpha("#ff0000", 0.8),
                  },
                }}
                onClick={() => navigate("/login")}
              >
                Đăng nhập
              </Button>
            )}
          </Stack>
          {/* user menu */}
        </Toolbar>
      </AppBar>
    </>
  );
};

export default Header;
