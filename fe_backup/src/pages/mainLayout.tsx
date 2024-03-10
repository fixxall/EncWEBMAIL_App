import { Outlet } from "react-router-dom";
import { Box, Toolbar, Container,Typography, Button } from "@mui/material";
import Sidebar from "./sideBar";

interface MainLayoutProps{
    handleLogoutFunction: () => void;
  }
  
  const MainLayout: React.FC<MainLayoutProps> = ({handleLogoutFunction}) => {
     // Access the current theme
    return (
      <>
      <Container
        sx={{
          backgroundColor: "white",
          minHeight: "50vh",
          minWidth: "100vw",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
        >
          
        <Button sx={{ background: "blue", color:"white"}} onClick={()=>{handleLogoutFunction()}}>Logout</Button>
        <Box sx={{ display: "flex", width: "100%"}}>
          <Box
            component="nav"
            sx={{
              width: "200px",
              flexShrink: 0
            }}
            >
            <Sidebar />
          </Box>
          <Box
            component="main"
            sx={{
              flexGrow: 1,
              p: 3,
              width: `calc(100% - 200px)`,
              minHeight: "100vh",
              backgroundColor: 'transparent',
              // backgroundColor: colorConfigs.mainBg
            }}
            >
            <Toolbar />
            <Outlet />
          </Box>
        </Box>
      </Container>
      </>
    );
  };
  
  export default MainLayout;