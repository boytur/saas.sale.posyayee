/* eslint-disable no-case-declarations */
import Swal from 'sweetalert2'
import StyledDiv from '../../components/styleDiv/StyledDiv'
import Permission from '../../libs/Permission'
import Axios from '../../libs/Axios'
import { useEffect, useState } from 'react'
import { useAuth } from '../../contexts/AuthProvider'
import { HiOutlineMagnifyingGlass } from 'react-icons/hi2'
import { useNavigate, useSearchParams } from 'react-router-dom'
import Charts from './Charts'
import Card from './Card'

function Dashboard () {
  document.title = 'แดชบอร์ด 💸 POSYAYEE'

  const { authenticated } = useAuth()
  const navigate = useNavigate()

  const [searchParams] = useSearchParams({
    start: '',
    end: ''
  })
  const [loading, setLoading] = useState(false)

  const [start, setStart] = useState(() => {
    if (!searchParams.get('start')) {
      const currentDate = new Date()

      if (currentDate.getUTCHours() >= 17) {
        currentDate.setUTCHours(17, 0, 0, 1)
      } else {
        currentDate.setDate(currentDate.getDate() - 1)
        currentDate.setHours(24, 0, 0, 0)
      }
      return currentDate.toISOString()
    } else {
      return searchParams.get('start')
    }
  })

  const [end, setEnd] = useState(() => {
    if (!searchParams.get('end')) {
      const currentDate = new Date()
      currentDate.setHours(currentDate.getHours() + 5)
      return currentDate.toISOString()
    } else {
      return searchParams.get('end')
    }
  })

  const setStartDateFromDatePickup = start => {
    const newStartDate = new Date(start)
    newStartDate.setUTCHours(0, 0, 0, 0) // Set to the beginning of the day in local time
    newStartDate.setTime(newStartDate.getTime() - 7 * 60 * 60 * 1000) // Adjust for UTC+7
    setStart(newStartDate.toISOString())
  }

  const setEndDateFromDatePickup = end => {
    const newEndDate = new Date(end)
    newEndDate.setUTCHours(23, 59, 59, 999) // Set to the end of the day in local time
    newEndDate.setTime(newEndDate.getTime() - 7 * 60 * 60 * 1000) // Adjust for UTC+7
    setEnd(newEndDate.toISOString())
  }

  const [cashFlow, setCashFlow] = useState([])

  const fecthDashboardCashFlow = async () => {
    try {
      setLoading(true)
      const permission = new Permission()
      if (permission.canViewDashboard()) {
        const response = await Axios.get('/api/analytic/cashflows', {
          params: {
            start: start,
            end: end
          }
        })
        if (response.status === 200) {
          setCashFlow(response.data)
          console.log(response.data)
          setLoading(false)
        }
      }
    } catch (err) {
      console.error(err)
      setLoading(false)
      Swal.fire({
        icon: 'error',
        title: 'เกิดข้อผิดพลาด',
        text: err?.response?.data?.message || 'เกิดข้อผิดพลาดในการเรียกข้อมูล'
      })
    }
  }

  const handleDateChange = event => {
    const selectedOption = event.target.value
    let newStartDate = new Date()
    let newEndDate = new Date()

    switch (selectedOption) {
      case 'today':
        newStartDate.setUTCHours(0, 0, 0, 0)
        newStartDate.setTime(newStartDate.getTime() - 7 * 60 * 60 * 1000)
        newEndDate.setUTCHours(23, 59, 59, 999)
        newEndDate.setTime(newEndDate.getTime() - 7 * 60 * 60 * 1000)
        break
      case 'alltime':
        newStartDate = new Date('2024-05-01')
        newStartDate.setHours(0, 0, 0, 0)
        break
      case 'yesterday':
        newStartDate.setDate(newStartDate.getDate() - 1)
        newStartDate.setHours(0, 0, 0, 0)
        newEndDate.setDate(newEndDate.getDate() - 1)
        newEndDate.setHours(23, 59, 59, 999)
        break
      case '3days':
        newStartDate.setDate(newStartDate.getDate() - 3)
        break
      case 'thisweek':
        const today = newStartDate.getDay()
        const diff = newStartDate.getDate() - today + (today === 0 ? -6 : 1)
        newStartDate.setDate(diff)
        break
      case 'lastweek':
        const today_ = newStartDate.getDay()
        const diff_ = newStartDate.getDate() - today_ - 7
        if (today_ === 0) {
          newStartDate.setDate(diff_ - 6)
        } else {
          newStartDate.setDate(diff_)
        }
        newEndDate.setDate(newEndDate.getDate() - newEndDate.getDay() - 1)
        break
      case 'thismonth':
        newStartDate.setDate(1)
        break
      case 'lastmonth':
        const currentDate = new Date()
        const lastMonthStartDate = new Date(currentDate)
        lastMonthStartDate.setMonth(lastMonthStartDate.getMonth() - 1)
        lastMonthStartDate.setDate(1)

        const lastMonthEndDate = new Date(
          currentDate.getFullYear(),
          currentDate.getMonth(),
          0
        )
        newStartDate = lastMonthStartDate
        newEndDate = lastMonthEndDate
        break
      case '3weeks':
        newStartDate.setDate(newStartDate.getDate() - 21)
        break
      case '30days':
        newStartDate.setMonth(newStartDate.getMonth() - 1)
        break
      default:
        break
    }

    setStart(newStartDate.toISOString())
    setEnd(newEndDate.toISOString())
  }

  const handleMonthChange = event => {
    if (!event.target.value) {
      return
    }
    const selectedMonth = parseInt(event.target.value)
    let newStartDate = new Date()
    let newEndDate = new Date()

    // Set start date and end date based on selected month
    newStartDate.setFullYear(newStartDate.getFullYear(), selectedMonth - 1, 1)
    newEndDate.setFullYear(newEndDate.getFullYear(), selectedMonth, 0)
    newEndDate.setHours(23, 59, 59, 999)

    setStart(newStartDate.toISOString())
    setEnd(newEndDate.toISOString())
  }

  useEffect(() => {
    if (!authenticated) {
      return
    }

    fecthDashboardCashFlow()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authenticated])

  useEffect(() => {
    searchParams.set('start', start)
    searchParams.set('end', end)
    navigate(`?${searchParams.toString()}`)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [start, end])

  return (
    <StyledDiv className='w-full rounded-md overflow-y-scroll'>
      <div className='rounded-md h-full'>
        <div className='bg-white shadow-sm rounded-md p-2 md:flex md:flex-row justify-between'>
          <div className='pb-3 md:mb-0 mt-1'>
            <h1 className='text-primary font-bold text-[1.4rem]'>แดชบอร์ด</h1>
          </div>
        </div>
        {/* input */}
        <div className='lg:flex lg:flex-row lg:justify-between flex flex-col gap-2 items-center bg-white mt-1 pb-4 p-1 rounded-md'>
          <div className='lg:flex lg:flex-row lg:w-3/4 w-full gap-2'>
            <div className='lg:w-1/4'>
              <label htmlFor='' className='text-[0.7rem] ml-1 text-black/80'>
                วันที่เริ่ม
              </label>
              <input
                value={start.slice(0, 10)}
                onChange={e => setStartDateFromDatePickup(e.target.value)}
                type='date'
                className=' border border-gray-300 rounded-md p-1 py-[7px] input-primary cursor-pointer'
              />
            </div>
            <div className='lg:w-1/4'>
              <label htmlFor='' className='text-[0.7rem] ml-1 text-black/80'>
                วันที่สิ้นสุด
              </label>
              <input
                value={end.slice(0, 10)}
                onChange={e => setEndDateFromDatePickup(e.target.value)}
                type='date'
                className='border border-gray-300 rounded-md p-1 py-[7px] input-primary cursor-pointer'
              />
            </div>

            {/*  */}
            <div>
              <label htmlFor='' className='text-[0.7rem] ml-1 text-black/80'>
                เลือกเดือน
              </label>
              <select
                onChange={e => handleMonthChange(e)}
                name=''
                className='input-primary cursor-pointer'
                id=''
              >
                <option value=''>เดือนนี้</option>
                <option value='1'>มกราคม</option>
                <option value='2'>กุมภาพันธ์</option>
                <option value='3'>มีนาคม</option>
                <option value='4'>เมษายน</option>
                <option value='5'>พฤษภาคม</option>
                <option value='6'>มิถุนายน</option>
                <option value='7'>กรกฎาคม</option>
                <option value='8'>สิงหาคม</option>
                <option value='9'>กันยายน</option>
                <option value='10'>ตุลาคม</option>
                <option value='11'>พฤศจิกายน</option>
                <option value='12'>ธันวาคม</option>
              </select>
            </div>

            {/*  */}
            <div>
              <label htmlFor='' className='text-[0.7rem] ml-1 text-black/80'>
                เพิ่มเติม
              </label>
              <select
                onChange={e => handleDateChange(e)}
                name=''
                className='input-primary cursor-pointer'
                id=''
              >
                <option value='today'>วันนี้</option>
                <option value='yesterday'>เมื่อวาน</option>
                <option value='3days'>3 วัน</option>
                <option value='thisweek'>สัปดาห์นี้</option>
                <option value='lastweek'>สัปดาห์ที่แล้ว</option>
                <option value='thismonth'>เดือนนี้</option>
                <option value='lastmonth'>เดือนที่แล้ว</option>
                <option value='3weeks'>3 สัปดาห์</option>
                <option value='30days'>30 วันย้อนหลัง</option>
                <option value='alltime'>ตลอดอายุ</option>
              </select>
            </div>
            <div className='w-full lg:w-fit'>
              <label htmlFor='' className='text-[0.7rem] text-white ml-1'>
                .
              </label>
              <button
                onClick={fecthDashboardCashFlow}
                className='w-full justify-center btn-primary px-5 py-[0.42rem] flex items-center gap-1'
              >
                {loading ? (
                  <div className='px-6 py-[0.4rem]'>
                    <div
                      style={{ width: '12px' }}
                      className='loader-2 w-4'
                    ></div>
                  </div>
                ) : (
                  <>
                    <HiOutlineMagnifyingGlass />
                    <p>ค้นหา</p>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
        {loading ? (
          <div className='flex relative justify-center'>
            <div className='flex absolute items-center justify-center mt-24'>
              <div className='loader'></div>
            </div>
          </div>
        ) : (
          <div>
            <div>
              <Card cashFlow={cashFlow} />
            </div>
            <div className='w-[99%] h-full bg-white mt-2'>
              <Charts cashFlow={cashFlow} />
            </div>
          </div>
        )}
      </div>
    </StyledDiv>
  )
}

export default Dashboard
