import { AppSidebar } from "../components/app-sidebar"
import Overview from "../components/Overview"
import { SiteHeader } from "../components/site-header"
import { SidebarInset,SidebarProvider } from "@/components/ui/sidebar"
import Portfolio from "../components/pages/Portfolio1"
import Chatbot from "../components/pages/chatbot1";
import StockAnalysis from "../components/pages/Stockanalysis1";
import Timeline from "./pages/Timeline1";
import {ThemeProvider} from '@/components/theme/ThemeProvider'
import Account from '@/components/pages/account'
import Billing from '@/components/pages/billing'
import Notifications from "./pages/Notification"
import Settings from "./pages/Settings";
import GetHelp from "./pages/Gethelp";
import Search from "./pages/search"
import { TradeTable } from "./tradebook/TradeTable"


import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom"



export default function Page() {
  return (
    <ThemeProvider>
    <SidebarProvider>
      <AppSidebar variant="inset" />
      <SidebarInset>
        <Routes>
            <Route path={"/"} element={<><SiteHeader name="Overview"/><Overview/></>} />
            <Route path="/portfolio" element={<><SiteHeader name="Portfolio"/> <Portfolio/></>} />
            <Route path="/chatbot" element={<><SiteHeader name="Chatbot"/><Chatbot/></>} />
            <Route path="/analysis" element={<><SiteHeader name="Stock Analysis"/><StockAnalysis/></>} />
            <Route path="/timeline" element={<><SiteHeader name="Tracker"/><Timeline/></>} />
            <Route path="/acc" element={<><SiteHeader name="Account"/><Account/></>} />
            <Route path="/Billing"element={<><SiteHeader name="Billing"/><Billing/></>}/>
            <Route path="/Notifications" element={<><SiteHeader name="Notifications"/><Notifications/></>}/>
            <Route path="/settings" element={<><SiteHeader name="Settings"/><Settings/></>} />
            <Route path="/gethelp" element={<><SiteHeader name="Get Help"/><GetHelp/></>} />
            <Route path="/search" element={<><SiteHeader name="Search"/><Search/></>} />
            <Route path="/tradetable" element={<><SiteHeader name="tradetable"/><TradeTable/></>}/>
            {/* Add more routes as needed */}
          </Routes>
      </SidebarInset>
    </SidebarProvider>
    </ThemeProvider>
  )
}
