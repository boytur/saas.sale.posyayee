import { Routes, Route } from "react-router-dom";
import { useEffect, useState } from 'react';
import Navbar from './components/navbar/Navbar';
import Sidebar from './components/sidebar/Sidebar';
import Sale from './pages/sales/Sale';
import Dashboard from './pages/dashboards/Dashboard';
import Product from './pages/products/Product';
import Histories from "./pages/histories/Histories";
import Finance from "./pages/finances/Finance";
import Account from "./pages/settings/accounts/Account";
import Store from "./pages/settings/stores/Store";
import Login from "./pages/auth/Login";
import { getSidebarSetting, getUuid, setSidebarSetting } from "./libs/localStrage";

const App = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(getSidebarSetting());
  const [isAuthenticated, setIsAuthenticated] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
    setSidebarSetting(!isSidebarOpen);
  };

  useEffect(() => {

    let uuid = getUuid();
    if (uuid === null || uuid === undefined) {
      setIsAuthenticated(false);
      return;
    }

  }, []);

  return (
    <div>
      <div className={`${isAuthenticated ? "flex" : ""}`}>
        {isSidebarOpen && isAuthenticated ? <Sidebar toggleSidebar={toggleSidebar} /> : ''}
        <div className={`${isAuthenticated ? "flex-grow" : ""}`}>
          {isAuthenticated &&
            <Navbar
              toggleSidebar={toggleSidebar}
              isSidebarOpen={isSidebarOpen}
            />
          }
          <div className={`${isAuthenticated ? "w-full mx-auto p-1 bg-[#F9FAFB]" : ""}`}>
            <Routes>
              <Route index element={isAuthenticated ? <Sale /> : <Login />} />
              <Route path="/history" element={isAuthenticated ? <Histories /> : <Login />} />
              <Route path="/product" element={isAuthenticated ? <Product /> : <Login />} />
              <Route path="/finance" element={isAuthenticated ? <Finance /> : <Login />} />
              <Route path="/dashboard" element={isAuthenticated ? <Dashboard /> : <Login />} />
              <Route path="/setting/account" element={isAuthenticated ? <Account /> : <Login />} />
              <Route path="/setting/store" element={isAuthenticated ? <Store /> : <Login />} />
            </Routes>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
