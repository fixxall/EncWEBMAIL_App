import DashboardPageLayout from "../pages/dashboardPage";
import { RouteType } from "./config";
import InboxIcon from '@mui/icons-material/Inbox';
import UnarchiveIcon from '@mui/icons-material/Unarchive';
import ArchiveIcon from '@mui/icons-material/Archive';
import CreateMessage from "../pages/CreateMessagePage";
import DraftPage from "../pages/DraftsPage";


const appRoutes: RouteType[] = [
  {
    path: "/create",
    element: <CreateMessage />,
    state: "create",
    sidebarProps: {
      displayText: "Create Message",
      icon: <InboxIcon />
    }
  },
  {
    path: "/sents",
    element: <DashboardPageLayout />,
    state: "sents",
    sidebarProps: {
      displayText: "Sents",
      icon: <UnarchiveIcon />
    }
  },
  {
    path: "/draft",
    element: <DraftPage />,
    state: "draft",
    sidebarProps: {
      displayText: "Draft",
      icon: <ArchiveIcon />
    }
  },
  
];

export default appRoutes;