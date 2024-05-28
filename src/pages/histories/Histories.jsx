import Swal from 'sweetalert2'
import StyledDiv from '../../components/styleDiv/StyledDiv'
import { HiOutlineMagnifyingGlass } from 'react-icons/hi2'
import Axios from '../../libs/Axios.js'
import { useEffect, useRef, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Card } from '@material-tailwind/react'
import formatUTCtoThaiWithTime from '../../libs/formatUTCtoThaiWithTime.js'
import Pagination from '../../components/pagination/Pagination.jsx'
import Permission from '../../libs/Permission.js'
import HistoryDialog from '../../components/histories/HistoryDialog.jsx'

const TABLE_HEAD = [
  'ลำดับ',
  'เลขบิล',
  'ยอดทั้งหมด',
  'ส่วนลด',
  'กำไร',
  'การชำระเงิน',
  'เวลาขาย',
  'คนขาย'
]

function Histories () {
  document.title = 'ประวัติการขาย 💸 POSYAYEE'
  const navigate = useNavigate()

  const [searchParams] = useSearchParams({
    page: 1,
    perPage: 10
  })

  const [start, setStart] = useState(() => {
    if (!searchParams.get('start')) {
      const currentDate = new Date()
      currentDate.setUTCHours(17, 0, 0, 0)
      currentDate.setDate(currentDate.getDate() - 1)
      return currentDate.toISOString()
    } else {
      return searchParams.get('start')
    }
  })

  const [end, setEnd] = useState(() => {
    if (!searchParams.get('end')) {
      const currentDate = new Date()
      return currentDate.toISOString()
    } else {
      return searchParams.get('end')
    }
  })

  const [pageState, setPageState] = useState({
    data: [],
    category: [],
    page: searchParams.get('page') || 1,
    pageSize: searchParams.get('perPage') || 100,
    sort: searchParams.get('sort') || 'DESC',
    sortBy: searchParams.get('sortBy') || 'createdAt',
    search: searchParams.get('search') || '',
    total: 0,
    loading: false,
    storeUser: []
  })

  const fetchBillHistory = async () => {
    try {
      const permission = new Permission()
      if (permission.canViewHistory()) {
        setPageState(prevState => ({
          ...prevState,
          loading: true
        }))

        const response = await Axios.get('/api/analytic/products/bill', {
          params: {
            page: pageState.page,
            perPage: pageState.pageSize,
            sort: pageState.sort,
            sortBy: pageState.sortBy,
            search: pageState.search,
            start: start,
            end: end
          }
        })

        if (response.status === 200) {
          setPageState(prevState => ({
            ...prevState,
            data: response.data,
            total: response.data.total,
            loading: false
          }))
        }
      }
    } catch (err) {
      console.error(err)
      setPageState(prevState => ({
        ...prevState,
        loading: false
      }))
      Swal.fire({
        icon: 'error',
        title: 'เกิดข้อผิดพลาด',
        text: err.response?.data?.message || 'กรุณาลองใหม่อีกครั้ง'
      })
    }
  }

  const fetchStoreUser = async () => {
    try {
      const permission = new Permission()
      if (permission.canViewStoreUser()) {
        const response = await Axios.get('/api/analytic/users')
        if (response.status === 200) {
          setPageState(prevState => ({
            ...prevState,
            storeUser: response.data.users
          }))
        }
      }
    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => {
    fetchBillHistory()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageState.page, pageState.pageSize])

  useEffect(() => {
    const newSearchParams = new URLSearchParams()

    newSearchParams.set('page', pageState.page)
    newSearchParams.set('perPage', pageState.pageSize)
    newSearchParams.set('sort', pageState.sort)
    newSearchParams.set('sortBy', pageState.sortBy)
    newSearchParams.set('start', start)
    newSearchParams.set('end', end)

    navigate(`/history?${newSearchParams}`)
    fetchStoreUser()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    pageState.pageSize,
    pageState.page,
    pageState.sort,
    pageState.sortBy,
    start,
    end
  ])

  const totalPages = Math.ceil(pageState.total / pageState.pageSize)

  const handlePageSizeChange = event => {
    const newSize = parseInt(event.target.value)
    setPageState(prevState => ({ ...prevState, pageSize: newSize }))
  }

  const setStartDateFromDatePickup = start => {
    const newStartDate = new Date(start)
    newStartDate.setUTCHours(17, 0, 0, 1)
    newStartDate.setDate(newStartDate.getDate() - 1)
    setStart(newStartDate.toISOString())
  }

  const setEndDateFromDatePickup = end => {
    const newEndDate = new Date(end)
    newEndDate.setUTCHours(16, 59, 59, 59)
    setEnd(newEndDate.toISOString())
  }

  const [isOpenBillDetail, setIsOpenBillDetail] = useState(false)
  const [billId, setBillId] = useState()
  const handleOpen = () => setIsOpenBillDetail(!isOpenBillDetail)

  return (
    <>
      {isOpenBillDetail && (
        <HistoryDialog
          isOpenBillDetail={isOpenBillDetail}
          billId={billId}
          handleOpen={handleOpen}
        />
      )}
      <StyledDiv className='w-full rounded-md overflow-y-scroll'>
        <div className='rounded-md'>
          <div className='bg-white shadow-sm rounded-md p-2 lg:flex lg:flex-row justify-between'>
            <div className='pb-3 lg:mb-0 mt-1'>
              <h1 className='text-primary font-bold text-[1.4rem]'>
                ประวัติการขาย
              </h1>
            </div>
          </div>

          <div className='lg:flex lg:flex-row lg:justify-between flex flex-col gap-2 items-center bg-white mt-1 pb-4 p-1 rounded-md'>
            <div className='lg:flex lg:flex-row lg:w-3/4 w-full gap-2'>
              <div className='w-full'>
                <label htmlFor='' className='text-[0.7rem] ml-1 text-black/80'>
                  วันที่เริ่ม
                </label>
                <input
                  onChange={e => setStartDateFromDatePickup(e.target.value)}
                  type='date'
                  className=' border border-gray-300 rounded-md p-1 py-[7px] input-primary cursor-pointer'
                />
              </div>
              <div className='w-full'>
                <label htmlFor='' className='text-[0.7rem] ml-1 text-black/80'>
                  วันที่สิ้นสุด
                </label>
                <input
                  onChange={e => setEndDateFromDatePickup(e.target.value)}
                  type='date'
                  className='border border-gray-300 rounded-md p-1 py-[7px] input-primary cursor-pointer'
                />
              </div>

              {/*  */}
              <div className='w-full'>
                <label htmlFor='' className='text-[0.7rem] ml-1 text-black/80'>
                  เรียงตาม
                </label>
                <select
                  value={pageState.sortBy}
                  onChange={e =>
                    setPageState({ ...pageState, sortBy: e.target.value })
                  }
                  name=''
                  className='input-primary cursor-pointer'
                  id=''
                >
                  <option value='bill_no'>เลขบิล</option>
                  <option value='bill_all_amount'>ยอดทั้งหมด</option>
                  <option value='bill_all_discount'>ส่วนลด</option>
                  <option value='bill_all_profit'>กำไร</option>
                  <option value='createdAt'>เวลาขาย</option>
                </select>
              </div>

              {/*  */}
              <div className='w-full'>
                <label htmlFor='' className='text-[0.7rem] ml-1 text-black/80'>
                  เรียงจาก
                </label>
                <select
                  value={pageState.sort}
                  onChange={e =>
                    setPageState({ ...pageState, sort: e.target.value })
                  }
                  name=''
                  className='input-primary cursor-pointer'
                  id=''
                >
                  <option value='DESC'>มากไปน้อย</option>
                  <option value='ASC'>น้อยไปมาก</option>
                </select>
              </div>

              {/*  */}
              <div className='w-full'>
                <label htmlFor='' className='text-[0.7rem] ml-1 text-black/80'>
                  คนขาย
                </label>
                <select
                  onChange={e => {
                    setPageState({ ...pageState, search: e.target.value })
                  }}
                  name=''
                  className='input-primary cursor-pointer'
                  id=''
                >
                  <option value=''>ทุกคน</option>
                  {pageState?.storeUser?.map(user => (
                    <option key={user.user_id} value={user.user_id}>
                      {user.user_fname ? user.user_fname : user.user_phone}
                    </option>
                  ))}
                </select>
              </div>

              {/*  */}
              <div className='w-full lg:w-fit'>
                <label htmlFor='' className='text-[0.7rem] text-white ml-1'>
                  .
                </label>
                <button
                  onClick={() => fetchBillHistory()}
                  className='w-full justify-center btn-primary px-5 py-[0.42rem] flex items-center gap-1'
                >
                  <HiOutlineMagnifyingGlass />
                  <p>ค้นหา</p>
                </button>
              </div>
            </div>

            {/* pagePer */}
            <div className='lg:block lg:w-fit flex lg:mt-0 mt-2 justify-end w-full'>
              <label htmlFor='' className='text-[0.7rem] text-white ml-1'>
                .
              </label>
              <div className='flex items-center gap-2'>
                <p>แสดง:</p>
                <select
                  value={pageState.pageSize}
                  onChange={handlePageSizeChange}
                  className='border border-gray-300 rounded-md py-2  cursor-pointer input-primary'
                >
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={15}>15</option>
                  <option value={20}>20</option>
                  <option value={30}>30</option>
                  <option value={40}>40</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                </select>
              </div>
            </div>
          </div>
          <Card className='w-full overflow-x-scroll'>
            <table className='w-full border-collapse'>
              <thead className='h-[3rem] rounded-t-md'>
                <tr className='text-sm md:text-md'>
                  {TABLE_HEAD.map(head => (
                    <th
                      key={head}
                      className='border-b border-blue-gray-100 bg-blue-gray-50 p-4'
                    >
                      <p className='font-normal leading-none'>{head}</p>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className='bg-white'>
                {pageState.data?.bills?.map(
                  (
                    {
                      bill_id,
                      bill_no,
                      bill_all_amount,
                      bill_all_discount,
                      bill_all_profit,
                      bill_payment_method,
                      createdAt,
                      user
                    },
                    index
                  ) => {
                    return (
                      <tr
                        style={{
                          height: `50px`
                        }}
                        key={index}
                        onClick={() => {
                          setIsOpenBillDetail(!isOpenBillDetail),
                            setBillId(bill_id)
                        }}
                        className='hover:bg-[#f5f5ff] border-b-[1px] text-center cursor-pointer text-black'
                      >
                        <td className='px-3 py-1'>{index + 1}</td>
                        <td className='px-3 py-1'>
                          <div className='flex justify-center items-center z-0'>
                            <div className='text-black/70 text-sm'>
                              {bill_no}
                            </div>
                          </div>
                        </td>
                        <td className='py-1 font-bold text-primary text-lg'>
                          ฿{bill_all_amount.toFixed(2)}
                        </td>
                        <td className='py-1'>{bill_all_discount.toFixed(2)}</td>
                        <td
                          className={`py-1 font-bold ${
                            bill_all_profit > 0
                              ? 'text-green-700'
                              : 'text-red-700'
                          }`}
                        >
                          {bill_all_profit.toFixed(2)}
                        </td>
                        <td className='py-1 p-2'>
                          <div className='flex items-center justify-center'>
                            {bill_payment_method === 'cash' ? (
                              <>
                                <p className='border w-fit px-4 rounded-full bg-green-600 text-white text-sm p-1'>
                                  เงินสด
                                </p>
                              </>
                            ) : (
                              <>
                                <p className='border w-fit px-4 rounded-full bg-gray-500 text-white text-sm p-1'>
                                  เงินเชื่อ
                                </p>
                              </>
                            )}
                          </div>
                        </td>
                        <td
                          style={{
                            maxWidth: '300px',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap'
                          }}
                          className='py-1 px-2'
                        >
                          {formatUTCtoThaiWithTime(createdAt)}
                        </td>
                        <td className='py-1 mr-2'>
                          {user?.user_fname ? user.user_fname : user.user_phone}
                        </td>
                      </tr>
                    )
                  }
                )}
              </tbody>
            </table>
          </Card>

          {pageState.loading && (
            <div className='flex justify-center w-full mt-12'>
              <div className='loader'></div>
            </div>
          )}

          <Pagination
            totalPages={totalPages}
            pageState={pageState}
            setPageState={setPageState}
            lable={`ประวัติการขาย ${
              pageState.page * pageState.pageSize - pageState.pageSize + 1
            } - ${Math.min(
              pageState.page * pageState.pageSize,
              pageState.total
            )} จาก ${pageState.total} รายการ`}
          />
        </div>
      </StyledDiv>
    </>
  )
}

export default Histories
