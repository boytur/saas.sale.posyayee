/* eslint-disable react/prop-types */
import { Link, useLocation } from "react-router-dom";
import { MdOutlineSupervisorAccount } from "react-icons/md";
import { IoAnalyticsOutline } from "react-icons/io5";
import { CiBoxes } from "react-icons/ci";
import { MdHistory } from "react-icons/md";
import { MdOutlineStorefront } from "react-icons/md";
import { useEffect, useState } from "react";
import checkRoutePermission from "../../libs/checkRoutePermission";


const Sidebar = ({ isSidebarOpen }) => {
  const location = useLocation();
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    if (!isSidebarOpen) {
      setTimeout(() => {
        setExpanded(true);
      }, 150);
    } else {
      setExpanded(false);
    }
  }, [isSidebarOpen]);

  // Function to determine active button class
  const getActiveButton = (route) => {
    return location.pathname === route
      ? "bg-[#E4E3FF] text-primary rounded-md border-primary"
      : "";
  };

  return (
    <div className={`bg-white text-black h-full w-[65%] hidden ${!isSidebarOpen ? "md:w-[13rem]" : "md:w-[3.6rem]"} lg:block lg:relative border z-50 transition-width duration-300 ease-in-out`}>
      <div className="w-full px-1 py-2 flex flex-col gap-2 transition-all duration-300 ease-in-out">
        {checkRoutePermission("/") && (
          <Link to="/" className={`h-[3rem] rounded-lg flex ${isSidebarOpen && "justify-center"} items-center gap-2 px-2 hover:bg-[#E4E3FF] hover:text-primary hover:border-primary ${getActiveButton("/")}`}>
            <div>
              <MdOutlineStorefront size={25} />
            </div>
            {expanded && <div className="text-[1rem]">ขายของหน้าร้าน</div>}
          </Link>
        )}
        {checkRoutePermission("/history") && (
          <Link to="/history" className={`h-[3rem] rounded-lg flex ${isSidebarOpen && "justify-center"} items-center gap-2 px-2 hover:bg-[#E4E3FF] hover:text-primary hover:border-primary ${getActiveButton("/history")}`}>
            <div>
              <MdHistory size={25} />
            </div>
            {expanded && <div className="text-[1rem]">ประวัติการขาย</div>}
          </Link>
        )}
        {checkRoutePermission("/product") && (
          <Link to="/product" className={`h-[3rem] rounded-lg flex ${isSidebarOpen && "justify-center"} items-center gap-2 px-2 hover:bg-[#E4E3FF] hover:text-primary hover:border-primary ${getActiveButton("/product")}`}>
            <div>
              <CiBoxes size={25} />
            </div>
            {expanded && <div className="text-[1rem]">จัดการสินค้า</div>}
          </Link>
        )}
        {checkRoutePermission("/finance") && (
          <Link to="/finance" className={`h-[3rem] rounded-lg flex ${isSidebarOpen && "justify-center"} items-center gap-2 px-2 hover:bg-[#E4E3FF] hover:text-primary hover:border-primary ${getActiveButton("/finance")}`}>
            <div>
              <MdOutlineSupervisorAccount size={25} />
            </div>
            {expanded && <div className="text-[1rem]">บัญชีลูกหนี้</div>}
          </Link>
        )}
        {checkRoutePermission("/dashboard") && (
          <Link to="/dashboard" className={`h-[3rem] rounded-lg flex  ${isSidebarOpen && "justify-center"} items-center gap-2 px-2 hover:bg-[#E4E3FF] hover:text-primary hover:border-primary ${getActiveButton("/dashboard")}`}>
            <div>
              <IoAnalyticsOutline size={25} />
            </div>
            {expanded && <div className="text-[1rem]">แดชบอร์ด</div>}
          </Link>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
