import { Link } from "react-router-dom";
import { FiMenu } from "react-icons/fi";
import { RiArrowDropDownLine } from "react-icons/ri";
import { IoNotifications, IoSettingsSharp } from "react-icons/io5";
import { useEffect, useState } from "react";
import userDecode from "../../libs/userDecode";
import { MdOutlineStorefront } from "react-icons/md";
import { MdManageAccounts } from "react-icons/md";
import { MdPayment } from "react-icons/md";
import { TbLogout2 } from "react-icons/tb";
import { useAuth } from "../../contexts/AuthProvider";
import { MdOutlineSupervisorAccount } from "react-icons/md";
import { IoAnalyticsOutline } from "react-icons/io5";
import { CiBoxes } from "react-icons/ci";
import { MdHistory } from "react-icons/md";
import { useLocation } from "react-router-dom";
import checkRoutePermission from "../../libs/checkRoutePermission";
import Permission from "../../libs/Permission";
import Axios from "../../libs/Axios";


// eslint-disable-next-line react/prop-types
const Navbar = ({ toggleSidebar }) => {

  const [isOpenProfileDestop, setOpenProfileDestop] = useState(false);
  const [isOpenProfileMobile, setOpenProfileMobile] = useState(false);

  const [order, setOrder] = useState();

  const { logout } = useAuth();
  const { authenticated } = useAuth();
  const location = useLocation();

  // Function to determine active button class
  const getActiveButton = (route) => {
    return location.pathname === route
      ? "bg-white text-primary rounded-sm border-b-4 border-primary"
      : "";
  };

  const getOpenOrder = async () => {
    try {
      const permission = new Permission();
      if (permission.canGetOrderOpenOrder()) {
        const response = await Axios.get('/api/payment/get-open-order');
        if (response.status === 200) {
          setOrder(response.data.order);
        }
      }
    }
    catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    if (!authenticated) { return; }
    getOpenOrder();
  }, [authenticated]);

  return (
    <nav className="bg-white lg:h-[4rem]  flex items-center border ">
      <div className="w-full mx-auto lg:flex lg:flex-row flex flex-col justify-between items-center ">

        {/* Profile for moblile */}
        <div className="lg:hidden flex gap-2 h-[4rem] justify-between items-center w-full z-50">
          <Link to="/" className=" cursor-pointer lg:hidden justify-center pl-2">
            <span className="text-[2rem] font-bold text-primary">
              POS
            </span>
            <span className="text-[2rem] font-bold text-black">YAYEE</span>
          </Link>
          <div className=" flex items-center">
            <div className="flex items-center mt-2 mr-3 hover:scale-105">
              {order &&
                <div className="absolute bg-red-500 mb-4 ml-4 text-white rounded-full w-4 h-4 flex items-center justify-center ">
                  1
                </div>
              }
              <IoNotifications size={30} />
            </div>
            <div className=" relative ">
              <img onClick={() => setOpenProfileMobile(prev => !prev)}
                className=" w-[2.5rem] h-[2.5rem] mx-2 mt-1 object-cover border-[2px] rounded-full border-primary"
                src={userDecode()?.user?.user_image || "https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_1280.png"} alt="" />
              <div className="bg-white rounded-full left-9 mt-[-14px] border border-primary absolute ">
                <RiArrowDropDownLine size={12} />
                {
                  isOpenProfileMobile && (
                    <div className={`w-[20rem] absolute mt-2 right-2 z-50`} >
                      <div className="w-full bg-white border mt-3 px-3 pb-2 rounded-md shadow-2xl h-full">
                        <p className=" text-center text-sm my-2 font-bold text-[#33363F]">โปรไฟล์ของฉัน</p>
                        <hr />
                        <div className="w-full h-[3rem] flex items-center gap-2 text-primary mt-2 mb-2">
                          <MdOutlineStorefront className=" border rounded-full m-2 p-1 border-primary" size={40} />
                          <p className="font-bold text-xl" style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '230px' }}>
                            {(userDecode())?.user?.store?.store_name}
                          </p>
                        </div>
                        <hr />
                        <div className=" w-full rounded-lg h-[10rem] flex justify-between items-center bg-[#aba8ff4c] mt-1 mb-1">
                          <div className=" w-full h-[3rem] flex flex-col items-center justify-center gap-2 pl-2">
                            <div className="w-full flex items-center gap-2">
                              <div className=" w-fit px-2 py-[2px] border rounded-md bg-[#5e5bff]">
                                <p className="text-[1rem] text-white">{userDecode()?.user?.package.package_name}</p>
                              </div>
                              <div>
                                <p className="text-[1rem] text-primary">คงเหลือ: <span className=" font-bold">{userDecode()?.user?.store.store_remaining}</span>  วัน</p>
                              </div>
                            </div>
                            <div className="border-primary border-[2px] rounded-full">
                              <img className='rounded-full w-[3rem] h-[3rem] object-cover' src={userDecode()?.user?.user_image || "https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_1280.png"} alt="" />
                            </div>
                            <div>
                              <p className="text-xl pl-2">
                                {
                                  ((userDecode())?.user?.user_fname && (userDecode())?.user?.user_lname) ?
                                    ((userDecode())?.user?.user_fname + " " + (userDecode())?.user?.user_lname) :
                                    ((userDecode())?.user?.user_phone)
                                }
                                &nbsp;
                                (
                                {
                                  (userDecode())?.user.user_role === "owner" ? "เจ้าของ" :
                                    (userDecode())?.user.user_role === "manager" ? "ผู้จัดการ" :
                                      "พนักงาน"
                                })
                              </p>
                            </div>
                          </div>
                        </div>
                        <button className="w-full flex items-center px-3 gap-2 h-12 mt-2 rounded-md text-black/70 hover:text-primary hover:bg-[#aba8ff4c]">
                          <MdManageAccounts size={30} />
                          <p className="mt-1 text-md">ตั้งค่าบัญชี</p>
                        </button>
                        {
                          (userDecode())?.user?.user_role === "owner" ? <button className="w-full flex items-center px-3 gap-2 h-12 mt-2 rounded-md text-black/70 hover:text-primary hover:bg-[#aba8ff4c]">
                            <MdPayment size={28} />
                            <p className="text-md">ค่าใช้จ่าย</p>
                          </button> : ""
                        }
                        {
                          (userDecode())?.user?.user_role !== "employee" ? <button className="w-full flex items-center px-3 gap-2 h-12 mt-2 rounded-md text-black/70 hover:text-primary hover:bg-[#aba8ff4c]">
                            <IoSettingsSharp size={28} />
                            <p className="mt-1 text-md">ตั้งค่าร้านค้า</p>
                          </button> : ""
                        }
                        <button onClick={() => logout()} className="w-full border flex justify-center gap-2 items-center border-primary h-12 mt-5 rounded-md text-black/70 hover:bg-[#4C49ED] hover:text-white">
                          <TbLogout2 size={18} className="mt-[2px]" />
                          <p className="text-md">ออกจากระบบ</p>
                        </button>{/*  */}
                      </div>
                    </div>)
                }
              </div>
            </div>
          </div>
        </div>

        <div className="lg:hidden bg-white  w-full absolute bottom-0 mx-1 flex justify-center">
          <div className="w-full flex justify-around max-w-screen-sm items-center mb-4">
            {checkRoutePermission("/") &&
              <Link
                onClick={() => setOpenProfileMobile(false)}
                to="/"
                className={`h-[3rem] rounded-lg flex items-center gap-2 px-2 ${getActiveButton(
                  "/"
                )} transition duration-500 ease-in-out`}
              >
                <div>
                  <MdOutlineStorefront size={35} />
                </div>
              </Link>}

            {checkRoutePermission('/history') &&
              <Link
                onClick={() => setOpenProfileMobile(false)}
                to="/history"
                className={`h-[3rem] rounded-lg flex items-center gap-2 px-2 ${getActiveButton(
                  "/history"
                )} transition duration-500 ease-in-out`}
              >
                <div>
                  <MdHistory size={35} />
                </div>
              </Link>}

            {checkRoutePermission('/product') &&
              <Link
                onClick={() => setOpenProfileMobile(false)}
                to="/product"
                className={`h-[3rem] rounded-lg flex items-center gap-2 px-2 ${getActiveButton(
                  "/product"
                )} transition duration-500 ease-in-out`}
              >
                <div>
                  <CiBoxes size={35} />
                </div>
              </Link>
            }

            {checkRoutePermission('/finance') &&
              <Link
                onClick={() => setOpenProfileMobile(false)}
                to="/finance"
                className={`h-[3rem] rounded-lg flex items-center gap-2 px-2 ${getActiveButton(
                  "/finance"
                )} transition duration-500 ease-in-out`}
              >
                <div>
                  <MdOutlineSupervisorAccount size={35} />
                </div>

              </Link>}

            {checkRoutePermission('/dashboard') &&
              <Link
                onClick={() => setOpenProfileMobile(false)}
                to="/dashboard"
                className={`h-[3rem] rounded-lg flex items-center gap-2 px-2 ${getActiveButton(
                  "/dashboard"
                )} transition duration-500 ease-in-out`}
              >
                <div>
                  <IoAnalyticsOutline size={35} />
                </div>
              </Link>
            }
          </div>
        </div>

        <div className=" flex justify-center ">

          <Link to="/" className="cursor-pointer lg:flex hidden justify-center w-full pl-2 mt-[1px]">
            <span className="text-[2rem] font-bold text-primary">
              POS
            </span>
            <span className="text-[2rem] font-bold text-black">YAYEE</span>
          </Link>
          <button
            className="text-black hidden lg:block mt-[2px]"
            onClick={toggleSidebar}
          >
            <FiMenu className="transition-all duration-300 ease-in-out mt-1 ml-2 hover:scale-105" size={33} />
          </button>
        </div>

        <div className="hidden lg:flex mr-5 gap-5">
          <div className="flex items-center mt-2 relative cursor-pointer hover:scale-105">
            {order &&
              <div className="absolute bg-red-500 mb-4 text-white rounded-full w-6 h-6 flex items-center justify-center">
                1
              </div>
            }
            <IoNotifications className="ml-[-12px]" size={30} />
          </div>
          <div className="relative cursor-pointer">
            <div className="hover:scale-105">
              <img
                onClick={() => setOpenProfileDestop(prev => !prev)}
                className='rounded-full hover:brightness-90 w-[2.8rem] h-[2.8rem] object-cover border-primary border-[2px]'
                src={userDecode()?.user?.user_image || "https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_1280.png"} alt="" />
              <div className="bg-white rounded-full left-8 mt-[-16px] border border-primary absolute ">
                <RiArrowDropDownLine size={13} />
              </div>
            </div>
            {isOpenProfileDestop && userDecode() !== null && (
              <div className={`w-[22rem] left-[-20rem] mt-5 z-50 bg-white  rounded-md shadow-xl ${userDecode()?.user?.user_role === "owner" ? "h-[32rem]" : userDecode()?.user?.user_role === "manager" ? "h-[28.5rem]" : "h-[25rem]"} absolute px-2`}>
                <p className=" text-center text-sm my-2 font-bold text-[#33363F]">โปรไฟล์ของฉัน</p>
                <hr />
                <div className=" w-full h-[3rem] flex items-center gap-2 text-primary mt-2 mb-2">
                  <MdOutlineStorefront className=" border rounded-full m-2 p-1 border-primary" size={40} />
                  <p className="font-bold text-xl" style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '230px' }}>
                    {(userDecode())?.user?.store?.store_name}
                  </p>
                </div>
                <hr />
                <div className=" w-full rounded-lg h-[10rem] flex justify-between items-center bg-[#aba8ff4c] mt-1 mb-1">
                  <div className=" w-full h-[3rem] flex flex-col items-center justify-center gap-2 pl-2">
                    <div className="w-full flex items-center gap-2">
                      <div className=" w-fit px-2 py-[2px] border rounded-md bg-[#5e5bff]">
                        <p className="text-[1rem] text-white">{userDecode()?.user?.package.package_name}</p>
                      </div>
                      <div>
                        <p className="text-[1rem] text-primary">คงเหลือ: <span className=" font-bold">{userDecode()?.user?.store.store_remaining}</span>  วัน</p>
                      </div>
                    </div>
                    <div className="border-primary border-[2px] rounded-full">
                      <img className='rounded-full w-[3rem] h-[3rem] object-cover' src={userDecode()?.user?.user_image || "https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_1280.png"} alt="" />
                    </div>
                    <div>
                      <p className="text-xl pl-2">
                        {
                          ((userDecode())?.user?.user_fname && (userDecode())?.user?.user_lname) ?
                            ((userDecode())?.user?.user_fname + " " + (userDecode())?.user?.user_lname) :
                            ((userDecode())?.user?.user_phone)
                        }
                        &nbsp;
                        (
                        {
                          (userDecode())?.user.user_role === "owner" ? "เจ้าของ" :
                            (userDecode())?.user.user_role === "manager" ? "ผู้จัดการ" :
                              "พนักงาน"
                        })
                      </p>
                    </div>
                  </div>
                </div>

                <button className="w-full flex items-center px-3 gap-2 h-12 mt-2 rounded-md text-black/70 hover:text-primary hover:bg-[#aba8ff4c]">
                  <MdManageAccounts size={30} />
                  <p className="mt-1 text-md">ตั้งค่าบัญชี</p>
                </button>
                {
                  (userDecode())?.user?.user_role === "owner" ? <button className="w-full flex items-center px-3 gap-2 h-12 mt-2 rounded-md text-black/70 hover:text-primary hover:bg-[#aba8ff4c]">
                    <MdPayment size={28} />
                    <p className="text-md">ค่าใช้จ่าย</p>
                  </button> : ""
                }
                {
                  (userDecode())?.user?.user_role !== "employee" ? <button className="w-full flex items-center px-3 gap-2 h-12 mt-2 rounded-md text-black/70 hover:text-primary hover:bg-[#aba8ff4c]">
                    <IoSettingsSharp size={28} />
                    <p className="mt-1 text-md">ตั้งค่าร้านค้า</p>
                  </button> : ""
                }
                <button onClick={() => logout()} className="w-full border flex justify-center gap-2 items-center border-primary h-12 mt-5 rounded-md text-black/70 hover:bg-[#4C49ED] hover:text-white">
                  <TbLogout2 size={18} className="mt-[2px]" />
                  <p className="text-md">ออกจากระบบ</p>
                </button>
              </div>
            )}

          </div>
        </div>

      </div>
    </nav>
  );
};

export default Navbar;
