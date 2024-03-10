import { Avatar, Drawer, List, Stack, Toolbar, IconButton } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import React, { useState } from "react";
import appRoutes from "../routes/appRoutes";
import SidebarItem from "./sideBarItem";

const Sidebar = () => {
  
  const [isSidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: "200px",
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: "200px",
          boxSizing: "border-box",
          borderRight: "0px",
          backgroundColor: "blue",
          color: "white"
        }
      }}
    >
      <List disablePadding>
        <Toolbar sx={{ marginBottom: "20px" }}>
          <Stack sx={{ width: "100%" }} direction="row" justifyContent="space-between">
            <Stack direction="row" alignItems="center">
              <IconButton onClick={toggleSidebar}>
                {isSidebarOpen ? <ChevronLeftIcon /> : <MenuIcon />}
              </IconButton>
              {/* {isSidebarOpen && <Avatar src={assets.images.logo} />} */}
            </Stack>
          </Stack>
        </Toolbar>
        <Toolbar sx={{ marginBottom: "20px" }}>
          <Stack
            sx={{ width: "100%" }}
            direction="row"
            justifyContent="center"
          >
          </Stack>
        </Toolbar>
        {appRoutes.map((route, index) => (
          route.sidebarProps ? (
            <SidebarItem item={route} key={index} />
          ) : null
        ))}
      </List>
    </Drawer>
  );
};

export default Sidebar;