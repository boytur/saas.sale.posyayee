import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useEffect, useState } from 'react';
import Navbar from './components/navbar/Navbar';
import Sidebar from './components/sidebar/Sidebar';
import Sale from './pages/sales';
import Dashboard from './pages/dashboards';
import Product from './pages/products';
import Histories from "./pages/histories/Histories";
import Finance from "./pages/finances/Finance";
import Account from "./pages/settings/accounts/Account";
import Store from "./pages/settings/stores/Store";
import Login from "./pages/auth/Login";
import { getSidebarSetting, getUuid, setSidebarSetting } from "./libs/localStrage";
import checkRoutePermission from "./libs/checkRoutePermission";
import AddProduct from "./pages/products/addProducts/AddProduct";

const App = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(getSidebarSetting());
  const [hiddenSidebar, setHiddenSidebar] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const location = useLocation();

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
    setSidebarSetting(!isSidebarOpen);
  };

  useEffect(() => {
    let uuid = getUuid();
    if (uuid === null || uuid === undefined) {
      setIsAuthenticated(false);
    }
  }, []);

  useEffect(() => {
    const isSettingPath = location.pathname.startsWith("/setting");
    if (isSettingPath) {
      setHiddenSidebar(true);
      setIsSidebarOpen(false);
      return;
    }
    else {
      setHiddenSidebar(false);
    }
  }, [location.pathname]);


  return (
    <div className="bg-[#F9FAFB]">
      {isAuthenticated && <Navbar
        hiddenSidebar={hiddenSidebar}
        isSidebarOpen={isSidebarOpen}
        toggleSidebar={toggleSidebar} />}

      <div className="flex md:gap-2">
        {!hiddenSidebar && isAuthenticated &&
          <div className="">
            <Sidebar isSidebarOpen={isSidebarOpen} />
          </div>}
        <div className={` ${isAuthenticated && "w-full md:mt-2 md:mb-2"}`}>
          <Routes>
            <Route index element={isAuthenticated ? <Sale /> : <Login />} />
            <Route path="/history" element={isAuthenticated && checkRoutePermission("/history") ? <Histories /> : <Navigate to="/" />} />
            <Route path="/product" element={isAuthenticated && checkRoutePermission("/product") ? <Product /> : <Navigate to="/" />} />
            <Route path="/product/add-product" element={isAuthenticated && checkRoutePermission("/product") ? <AddProduct /> : <Navigate to="/" />} />
            <Route path="/finance" element={isAuthenticated && checkRoutePermission("/finance") ? <Finance /> : <Navigate to="/" />} />
            <Route path="/dashboard" element={isAuthenticated && checkRoutePermission("/dashboard") ? <Dashboard /> : <Navigate to="/" />} />
            <Route path="/setting/account" element={isAuthenticated && checkRoutePermission("/setting/account") ? <Account /> : <Navigate to="/" />} />
            <Route path="/setting/store" element={isAuthenticated && checkRoutePermission("/setting/store") ? <Store /> : <Navigate to="/" />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default App;
