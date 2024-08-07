import { Link } from 'react-router-dom'
import { FiMenu } from 'react-icons/fi'
import { RiArrowDropDownLine } from 'react-icons/ri'
import { IoNotifications, IoSettingsSharp } from 'react-icons/io5'
import { useEffect, useState } from 'react'
import userDecode from '../../libs/userDecode'
import { MdOutlineStorefront } from 'react-icons/md'
import { MdManageAccounts } from 'react-icons/md'
import { MdPayment } from 'react-icons/md'
import { TbLogout2 } from 'react-icons/tb'
import { useAuth } from '../../contexts/AuthProvider'
import { MdOutlineSupervisorAccount } from 'react-icons/md'
import { IoAnalyticsOutline } from 'react-icons/io5'
import { CiBoxes } from 'react-icons/ci'
import { MdHistory } from 'react-icons/md'
import { useLocation } from 'react-router-dom'
import checkRoutePermission from '../../libs/checkRoutePermission'
import Permission from '../../libs/Permission'
import Axios from '../../libs/Axios'
import { Menu, MenuHandler, MenuList } from '@material-tailwind/react'

// eslint-disable-next-line react/prop-types
const Navbar = ({ toggleSidebar, hiddenSidebar }) => {
  const [order, setOrder] = useState()

  const { logout } = useAuth()
  const { authenticated } = useAuth()

  const location = useLocation()

  // Function to determine active button class
  const getActiveButton = route => {
    return location.pathname === route
      ? 'bg-white text-primary rounded-sm border-b-4 border-primary'
      : ''
  }

  const getOpenOrder = async () => {
    try {
      const permission = new Permission()
      if (permission.canGetOrderOpenOrder()) {
        const response = await Axios.get('/api/payment/get-open-order')
        if (response.status === 200) {
          setOrder(response.data.order)
        }
      }
    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => {
    if (!authenticated) {
      return
    }
    getOpenOrder()
  }, [authenticated])

  return (
    <nav className='bg-white lg:h-[4rem]  flex items-center border '>
      <div className='w-full mx-auto lg:flex lg:flex-row flex flex-col justify-between items-center'>
        {/* Profile for moblile */}
        <div className='lg:hidden flex gap-2 h-[4rem] justify-between items-center w-full z-50'>
          <Link
            to='/'
            className=' cursor-pointer lg:hidden justify-center pl-2'
          >
            <span className='text-[2rem] font-bold text-primary'>POS</span>
            <span className='text-[2rem] font-bold text-black'>YAYEE</span>
          </Link>
          <div className=' flex items-center'>
            <div className='flex items-center mt-2 mr-3 hover:scale-105'>
              <Menu>
                <div className='flex items-center mt-2 relative cursor-pointer hover:scale-105'>
                  <MenuHandler>
                    <div>
                      {order && (
                        <div>
                          <div className='absolute bg-red-500 bottom-4 text-white rounded-full w-6 h-6 flex items-center justify-center'>
                            1
                          </div>
                        </div>
                      )}
                      <IoNotifications className='ml-[-12px]' size={30} />
                    </div>
                  </MenuHandler>
                  <MenuList className='mt-1 shadow-xl'>
                    <p className='focus:outline-none text-center mb-2'>
                      การแจ้งเตือน
                    </p>
                    <hr />
                    {order ? (
                      <Link
                        className='focus:outline-none'
                        to='/setting/store#payment'
                      >
                        <div className='mt-2 text-black hover:bg-[#e4e3ff67] rounded-md'>
                          <p className='font-bold'>ค่าบริการรายเดือนค้างชำระ</p>
                          <div className='flex gap-2 pb-4 cursor-pointer'>
                            <div>
                              <label
                                htmlFor=''
                                className=' text-[0.6rem] text-gray-500'
                              >
                                หมายเลขออเดอร์
                              </label>
                              <p>{order?.order_no}</p>
                            </div>
                            <div>
                              <label
                                htmlFor=''
                                className=' text-[0.6rem] text-gray-500'
                              >
                                ชื่อออเดอร์
                              </label>
                              <p>{order?.order_title}</p>
                            </div>
                            <div>
                              <label
                                htmlFor=''
                                className=' text-[0.6rem] text-gray-500'
                              >
                                สถานะ
                              </label>
                              <p className='text-[0.6rem] bg-yellow-800/20 rounded-full text-black px-2'>
                                ค้างชำระ
                              </p>
                            </div>
                          </div>
                        </div>
                      </Link>
                    ) : (
                      <p className='text-center'>ไม่มีการแจ้งเตือน</p>
                    )}
                  </MenuList>
                </div>
              </Menu>
            </div>
            <Menu>
              <div className='relative'>
                <MenuHandler>
                  <img
                    className=' w-[2.5rem] h-[2.5rem] mx-2 mt-1 object-cover border-[2px] rounded-full border-primary'
                    src={
                      userDecode()?.user?.user_image ||
                      'https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_1280.png'
                    }
                    alt=''
                  />
                </MenuHandler>
                <div className='rounded-full left-9 mt-[-14px] border border-primary absolute bg-white'>
                  <RiArrowDropDownLine size={12} />
                  <MenuList
                    className={`w-[20rem] absolute mt-2 right-2 z-50 shadow-xl`}
                  >
                    <div className='w-full mt-3 px-3 pb-2 rounded-md h-full focus:outline-none'>
                      <p className=' text-center text-sm my-2 font-bold text-[#33363F]'>
                        โปรไฟล์ของฉัน
                      </p>
                      <hr />
                      <div className='w-full h-[3rem] flex items-center gap-2 text-primary mt-2 mb-2'>
                        <MdOutlineStorefront
                          className=' border rounded-full m-2 p-1 border-primary'
                          size={40}
                        />
                        <p
                          className='font-bold text-xl'
                          style={{
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                            maxWidth: '230px'
                          }}
                        >
                          {userDecode()?.user?.store?.store_name}
                        </p>
                      </div>
                      <hr />
                      <div className=' w-full rounded-lg h-[10rem] flex justify-between items-center bg-[#aba8ff4c] mt-1 mb-1'>
                        <div className=' w-full h-[3rem] flex flex-col items-center justify-center gap-2 pl-2'>
                          <div className='w-full flex items-center gap-2'>
                            <div className=' w-fit px-2 py-[2px] border rounded-md bg-[#5e5bff]'>
                              <p className='text-[1rem] text-white'>
                                {userDecode()?.user?.package.package_name}
                              </p>
                            </div>
                            <div>
                              <p className='text-[1rem] text-primary'>
                                คงเหลือ:{' '}
                                <span className=' font-bold'>
                                  {userDecode()?.user?.store.store_remaining}
                                </span>{' '}
                                วัน
                              </p>
                            </div>
                          </div>
                          <div className='border-primary border-[2px] rounded-full'>
                            <img
                              className='rounded-full w-[3rem] h-[3rem] object-cover'
                              src={
                                userDecode()?.user?.user_image ||
                                'https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_1280.png'
                              }
                              alt=''
                            />
                          </div>
                          <div>
                            <p className='text-xl pl-2'>
                              {userDecode()?.user?.user_fname &&
                              userDecode()?.user?.user_lname
                                ? userDecode()?.user?.user_fname +
                                  ' ' +
                                  userDecode()?.user?.user_lname
                                : userDecode()?.user?.user_phone}
                              &nbsp; (
                              {userDecode()?.user.user_role === 'owner'
                                ? 'เจ้าของ'
                                : userDecode()?.user.user_role === 'manager'
                                ? 'ผู้จัดการ'
                                : 'พนักงาน'}
                              )
                            </p>
                          </div>
                        </div>
                      </div>
                      <button className='w-full flex items-center px-3 gap-2 h-12 mt-2 rounded-md text-black/70 hover:text-primary hover:bg-[#aba8ff4c]'>
                        <MdManageAccounts size={30} />
                        <p className='mt-1 text-md'>ตั้งค่าบัญชี</p>
                      </button>
                      {userDecode()?.user?.user_role === 'owner' ? (
                        <Link
                          to='/setting/store#payment'
                          className='w-full flex items-center px-3 gap-2 h-12 mt-2 rounded-md text-black/70 hover:text-primary hover:bg-[#aba8ff4c]'
                        >
                          <MdPayment size={28} />
                          <p className='text-md'>ค่าใช้จ่าย</p>
                        </Link>
                      ) : (
                        ''
                      )}
                      {userDecode()?.user?.user_role !== 'employee' ? (
                        <Link
                          to='/setting/store#profile'
                          className='w-full flex items-center px-3 gap-2 h-12 mt-2 rounded-md text-black/70 hover:text-primary hover:bg-[#aba8ff4c]'
                        >
                          <IoSettingsSharp size={28} />
                          <p className='mt-1 text-md'>ตั้งค่าร้านค้า</p>
                        </Link>
                      ) : (
                        ''
                      )}
                      <button
                        onClick={() => logout()}
                        className='w-full border flex justify-center gap-2 items-center border-primary h-12 mt-5 rounded-md text-black/70 hover:bg-[#4C49ED] hover:text-white'
                      >
                        <TbLogout2 size={18} className='mt-[2px]' />
                        <p className='text-md'>ออกจากระบบ</p>
                      </button>
                      {/*  */}
                    </div>
                  </MenuList>
                </div>
              </div>
            </Menu>
          </div>
        </div>

        {/* bottom bar for mobile */}
        {!hiddenSidebar && (
          <div className='lg:hidden bg-white z-50 fixed  w-full bottom-0 flex justify-center'>
            <div className='w-full flex justify-around max-w-screen-sm items-center mb-2'>
              {checkRoutePermission('/') && (
                <Link
                  to='/'
                  className={`h-[3rem] rounded-lg flex items-center gap-2 px-2 ${getActiveButton(
                    '/'
                  )} transition duration-500 ease-in-out`}
                >
                  <div>
                    <MdOutlineStorefront size={35} />
                  </div>
                </Link>
              )}

              {checkRoutePermission('/history') && (
                <Link
                  to='/history'
                  className={`h-[3rem] rounded-lg flex items-center gap-2 px-2 ${getActiveButton(
                    '/history'
                  )} transition duration-500 ease-in-out`}
                >
                  <div>
                    <MdHistory size={35} />
                  </div>
                </Link>
              )}

              {checkRoutePermission('/product') && (
                <Link
                  to='/product'
                  className={`h-[3rem] rounded-lg flex items-center gap-2 px-2 ${getActiveButton(
                    '/product'
                  )} transition duration-500 ease-in-out`}
                >
                  <div>
                    <CiBoxes size={35} />
                  </div>
                </Link>
              )}

              {checkRoutePermission('/finance') && (
                <Link
                  to='/finance'
                  className={`h-[3rem] rounded-lg flex items-center gap-2 px-2 ${getActiveButton(
                    '/finance'
                  )} transition duration-500 ease-in-out`}
                >
                  <div>
                    <MdOutlineSupervisorAccount size={35} />
                  </div>
                </Link>
              )}

              {checkRoutePermission('/dashboard') && (
                <Link
                  to='/dashboard'
                  className={`h-[3rem] rounded-lg flex items-center gap-2 px-2 ${getActiveButton(
                    '/dashboard'
                  )} transition duration-500 ease-in-out`}
                >
                  <div>
                    <IoAnalyticsOutline size={35} />
                  </div>
                </Link>
              )}
            </div>
          </div>
        )}

        {/* navbar for desktop */}
        <div className=' flex justify-center '>
          <Link
            to='/'
            className='cursor-pointer lg:flex hidden justify-center w-full pl-2 mt-[1px]'
          >
            <span className='text-[2rem] font-bold text-primary'>POS</span>
            <span className='text-[2rem] font-bold text-black'>YAYEE</span>
          </Link>
          <button
            className='text-black hidden lg:block mt-[2px]'
            onClick={toggleSidebar}
          >
            <FiMenu
              className='transition-all duration-300 ease-in-out mt-1 ml-2 hover:scale-105'
              size={33}
            />
          </button>
        </div>

        {/* navbar for desktop */}
        <div className='hidden lg:flex mr-5 gap-5'>
          <Menu placement='right-start'>
            <div className='flex items-center mt-2 relative cursor-pointer hover:scale-105'>
              <MenuHandler>
                <div>
                  {order && (
                    <div>
                      <div className='absolute bg-red-500 bottom-4 text-white rounded-full w-6 h-6 flex items-center justify-center'>
                        1
                      </div>
                    </div>
                  )}
                  <IoNotifications className='ml-[-12px]' size={30} />
                </div>
              </MenuHandler>
              <MenuList className='mt-8 shadow-xl'>
                <p className='focus:outline-none text-center mb-2'>
                  การแจ้งเตือน
                </p>
                <hr />
                {order ? (
                  <Link
                    className='focus:outline-none'
                    to='/setting/store#payment'
                  >
                    <div className='mt-2 text-black hover:bg-[#e4e3ff67] p-3 rounded-md'>
                      <p className='font-bold'>ค่าบริการรายเดือนค้างชำระ</p>
                      <div className='flex gap-2 pb-4 cursor-pointer'>
                        <div>
                          <label
                            htmlFor=''
                            className=' text-[0.6rem] text-gray-500'
                          >
                            หมายเลขออเดอร์
                          </label>
                          <p>{order?.order_no}</p>
                        </div>
                        <div>
                          <label
                            htmlFor=''
                            className=' text-[0.6rem] text-gray-500'
                          >
                            ชื่อออเดอร์
                          </label>
                          <p>{order?.order_title}</p>
                        </div>
                        <div>
                          <label
                            htmlFor=''
                            className=' text-[0.6rem] text-gray-500'
                          >
                            สถานะ
                          </label>
                          <p className='text-[0.6rem] bg-yellow-800/20 rounded-full text-black px-2'>
                            ค้างชำระ
                          </p>
                        </div>
                      </div>
                    </div>
                  </Link>
                ) : (
                  <p className='text-center'>ไม่มีการแจ้งเตือน</p>
                )}
              </MenuList>
            </div>
          </Menu>
          <div className='relative cursor-pointer'>
            <Menu>
              <MenuHandler>
                <div className='hover:scale-105'>
                  <img
                    className='rounded-full hover:brightness-90 w-[2.8rem] h-[2.8rem] object-cover border-primary border-[2px]'
                    src={
                      userDecode()?.user?.user_image ||
                      'https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_1280.png'
                    }
                    alt=''
                  />
                  <div className='bg-white rounded-full left-8 mt-[-16px] border border-primary absolute '>
                    <RiArrowDropDownLine size={13} />
                  </div>
                </div>
              </MenuHandler>

              <MenuList className=' shadow-xl'>
                <div
                  className={`w-[22rem] mt-5 focus:outline-none ${
                    userDecode()?.user?.user_role === 'owner'
                      ? 'h-[32rem]'
                      : userDecode()?.user?.user_role === 'manager'
                      ? 'h-[28.5rem]'
                      : 'h-[25rem]'
                  } px-2`}
                >
                  <p className=' text-center text-sm my-2 font-bold text-[#33363F]'>
                    โปรไฟล์ของฉัน
                  </p>
                  <hr />
                  <div className=' w-full h-[3rem] flex items-center gap-2 text-primary mt-2 mb-2'>
                    <MdOutlineStorefront
                      className=' border rounded-full m-2 p-1 border-primary'
                      size={40}
                    />
                    <p
                      className='font-bold text-xl'
                      style={{
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        maxWidth: '230px'
                      }}
                    >
                      {userDecode()?.user?.store?.store_name}
                    </p>
                  </div>
                  <hr />
                  <div className=' w-full rounded-lg h-[10rem] flex justify-between items-center bg-[#aba8ff4c] mt-1 mb-1'>
                    <div className=' w-full h-[3rem] flex flex-col items-center justify-center gap-2 pl-2'>
                      <div className='w-full flex items-center gap-2'>
                        <div className=' w-fit px-2 py-[2px] border rounded-md bg-[#5e5bff]'>
                          <p className='text-[1rem] text-white'>
                            {userDecode()?.user?.package.package_name}
                          </p>
                        </div>
                        <div>
                          <p className='text-[1rem] text-primary'>
                            คงเหลือ:{' '}
                            <span className=' font-bold'>
                              {userDecode()?.user?.store.store_remaining}
                            </span>{' '}
                            วัน
                          </p>
                        </div>
                      </div>
                      <div className='border-primary border-[2px] rounded-full'>
                        <img
                          className='rounded-full w-[3rem] h-[3rem] object-cover'
                          src={
                            userDecode()?.user?.user_image ||
                            'https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_1280.png'
                          }
                          alt=''
                        />
                      </div>
                      <div>
                        <p className='text-xl pl-2'>
                          {userDecode()?.user?.user_fname &&
                          userDecode()?.user?.user_lname
                            ? userDecode()?.user?.user_fname +
                              ' ' +
                              userDecode()?.user?.user_lname
                            : userDecode()?.user?.user_phone}
                          &nbsp; (
                          {userDecode()?.user.user_role === 'owner'
                            ? 'เจ้าของ'
                            : userDecode()?.user.user_role === 'manager'
                            ? 'ผู้จัดการ'
                            : 'พนักงาน'}
                          )
                        </p>
                      </div>
                    </div>
                  </div>

                  <button className='w-full flex items-center px-3 gap-2 h-12 mt-2 rounded-md text-black/70 hover:text-primary hover:bg-[#aba8ff4c]'>
                    <MdManageAccounts size={30} />
                    <p className='mt-1 text-md'>ตั้งค่าบัญชี</p>
                  </button>
                  {userDecode()?.user?.user_role === 'owner' ? (
                    <Link
                      to='/setting/store#payment'
                      className='w-full flex items-center px-3 gap-2 h-12 mt-2 rounded-md text-black/70 hover:text-primary hover:bg-[#aba8ff4c]'
                    >
                      <MdPayment size={28} />
                      <p className='text-md'>ค่าใช้จ่าย</p>
                    </Link>
                  ) : (
                    ''
                  )}
                  {userDecode()?.user?.user_role !== 'employee' ? (
                    <Link
                      to='/setting/store#profile'
                      className='w-full flex items-center px-3 gap-2 h-12 mt-2 rounded-md text-black/70 hover:text-primary hover:bg-[#aba8ff4c]'
                    >
                      <IoSettingsSharp size={28} />
                      <p className='mt-1 text-md'>ตั้งค่าร้านค้า</p>
                    </Link>
                  ) : (
                    ''
                  )}
                  <button
                    onClick={() => logout()}
                    className='w-full border flex justify-center gap-2 items-center border-primary h-12 mt-5 rounded-md text-black/70 hover:bg-[#4C49ED] hover:text-white'
                  >
                    <TbLogout2 size={18} className='mt-[2px]' />
                    <p className='text-md'>ออกจากระบบ</p>
                  </button>
                </div>
              </MenuList>
            </Menu>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
