import { Link, useLocation } from "react-router-dom";
import { MdOutlineSupervisorAccount } from "react-icons/md";
import { IoAnalyticsOutline } from "react-icons/io5";
import { CiBoxes } from "react-icons/ci";
import { MdHistory } from "react-icons/md";
import { MdOutlineStorefront } from "react-icons/md";

const Sidebar = () => {

  const location = useLocation();

  // Function to determine active button class
  const getActiveButton = (route) => {
    return location.pathname === route
      ? "bg-[#E4E3FF] text-[#4C49ED] rounded-sm border-r-4 border-[#4C49ED]"
      : "";
  };


  return (
    // sidebar for desktop
    <div className="bg-white text-black h-screen w-[65%] hidden md:w-[13rem] lg:block absolute lg:relative border z-50">
      <div className="pt-2 flex justify-center pr-4">
        <Link to="/" className="cursor-pointer lg:flex">
          <span className="text-[2rem] font-bold text-[#4C49ED]">
            POS
          </span>
          <span className="text-[2rem] font-bold text-black">YAYEE</span>
        </Link>
      </div>
      <div className="w-full px-1 py-2 flex flex-col gap-2 mt-6 ">
        <Link 
        to="/"
          className={`h-[3rem] rounded-lg flex items-center gap-2 px-2 ${getActiveButton(
            "/"
          )}`}
        >
          <div>
            <MdOutlineStorefront size={25} />
          </div>
          <div className="text-[1rem]">ขายของหน้าร้าน</div>
        </Link>
        <Link
          to="/history"
          className={`h-[3rem] rounded-lg flex items-center gap-2 px-2 ${getActiveButton(
            "/history"
          )}`}
        >
          <div>
            <MdHistory size={25} />
          </div>
          <div className="text-[1rem]">ประวัติการขาย</div>
        </Link>
        <Link
          to="/product"
          className={`h-[3rem] rounded-lg flex items-center gap-2 px-2 ${getActiveButton(
            "/product"
          )}`}
        >
          <div>
            <CiBoxes size={25} />
          </div>
          <div className="text-[1rem]">จัดการสินค้า</div>
        </Link>
        <Link
          to="/finance"
          className={`h-[3rem] rounded-lg flex items-center gap-2 px-2 ${getActiveButton(
            "/finance"
          )}`}
        >
          <div>
            <MdOutlineSupervisorAccount size={25} />
          </div>
          <div className="text-[1rem]">บัญชีลูกหนี้</div>
        </Link>
        <Link
          to="/dashboard"
          className={`h-[3rem] rounded-lg flex items-center gap-2 px-2 ${getActiveButton(
            "/dashboard"
          )}`}
        >
          <div>
            <IoAnalyticsOutline size={25} />
          </div>
          <div className="text-[1rem]">แดชบอร์ด</div>
        </Link>
      </div>
    </div>
  );
};

export default Sidebar;
