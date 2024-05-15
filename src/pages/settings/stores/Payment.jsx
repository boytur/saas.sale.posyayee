import Swal from 'sweetalert2'
import Axios from '../../../libs/Axios'
import Permission from '../../../libs/Permission'
import { useEffect, useState } from 'react'
import Pagination from '../../../components/pagination/Pagination'
import GetOrderCheckoutPage from '../../../libs/getOrderCheckoutPage'
import { Card } from '@material-tailwind/react'

const TABLE_HEAD_OPEN_ORDER = [
  'หมายเลขออเดอร์	',
  'ชื่อออเดอร์	',
  'โน้ต',
  'ราคา',
  'สถานะ',
  'การกระทำ'
]

const TABLE_HEAD_HISTORY = [
  'หมายเลขออเดอร์	',
  'ชื่อออเดอร์	',
  'โน้ต',
  'ราคา',
  'สถานะ'
]

function Payment () {
  document.title = 'ค่าใช้จ่าย 💸 การตั้งค่า'

  const [pageState, setPageState] = useState({
    isLoading: false,
    data: [],
    total: 0,
    page: 1,
    pageSize: 10
  })

  const totalPages = Math.ceil(pageState.total / pageState.pageSize)

  const [openOrder, setOpenOrder] = useState(null)

  const fetchPayments = async () => {
    try {
      const permission = new Permission()
      if (permission.canGetOrderOpenOrder()) {
        setPageState(prev => ({
          ...prev,
          isLoading: true
        }))

        const response = await Axios.get('/api/payment/get-order', {
          params: {
            page: pageState.page,
            perPage: pageState.pageSize,
            sort: 'DESC',
            sortBy: 'createdAt'
          }
        })

        if (response.status === 200) {
          setPageState(prev => ({
            ...prev,
            isLoading: false,
            data: response.data.order,
            total: response.data.total
          }))
          setOpenOrder(
            response.data.order.filter(order => order.order_status === 'open')
          )
        }
      }
    } catch (err) {
      console.log(err)
      Swal.fire({
        title: 'เกิดข้อผิดพลาด',
        icon: 'error',
        text: err?.response?.data?.message
      })
    }
  }

  useEffect(() => {
    fetchPayments()
  }, [])

  return (
    <>
      <div className='w-full px-4 bg-white rounded-md mb-32'>
        <div className='w-full'>
          <h1 className='text-[2rem] font-bold mb-2'>ค่าใช้จ่าย</h1>
          <hr />
        </div>
        {pageState.isLoading && (
          <div className='w-full flex justify-center mt-12'>
            <div className='loader'></div>
          </div>
        )}

        {/* Open order */}
        <div className='w-full mt-6'>
          <div>
            <p className='mb-2'>ค่าใช้จ่ายรอชำระ</p>
            {openOrder?.length > 0 && !pageState.isLoading ? (
              <div className='w-full rounded-md'>
                <Card className='h-full w-full overflow-scroll'>
                  <table className='w-full min-w-max table-auto text-left'>
                    <thead>
                      <tr>
                        {TABLE_HEAD_OPEN_ORDER.map(head => (
                          <th
                            key={head}
                            className='border-b border-blue-gray-100 bg-blue-gray-50 p-4'
                          >
                            <p className='font-normal leading-none'>{head}</p>
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {openOrder?.map(
                        (
                          {
                            order_id,
                            order_no,
                            order_title,
                            order_price,
                            order_note
                          },
                        ) => {

                          return (
                            <tr key={order_id} className='text-black'>
                              <td >
                                <p className='font-normal p-4'>{order_no}</p>
                              </td>
                              <td >
                                <p className='font-normal'>{order_title}</p>
                              </td>
                              <td >
                                <p className='font-normal'>{order_note}</p>
                              </td>
                              <td >
                                <p className='font-normal'>
                                  ฿{order_price?.toFixed(2)}
                                </p>
                              </td>
                              <td >
                                <div>
                                  <p className='font-normal bg-yellow-800/20 w-fit px-3 p-1 text-[0.8rem] rounded-full text-black'>
                                    ค้างชำระ
                                  </p>
                                </div>
                              </td>
                              <td >
                                <p className='font-medium'>
                                  <button
                                    onClick={() => {
                                      GetOrderCheckoutPage(order_id)
                                    }}
                                    className='btn-primary text-white  py-2 px-4 rounded-md text-sm'
                                  >
                                    ชำระเงิน
                                  </button>
                                </p>
                              </td>
                            </tr>
                          )
                        }
                      )}
                    </tbody>
                  </table>
                </Card>
              </div>
            ) : (
              <p className='text-center text-gray-500'>ไม่มีรายการค้างชำระ</p>
            )}
          </div>

          {/* History */}
          <div className='mt-8'>
            <p className='mb-2'>ประวัติการชำระเงิน</p>
            {!pageState.isLoading &&
            pageState.data.filter(order => order.order_status === 'complete')
              .length > 0 ? (
              <Card className='h-full w-full overflow-scroll'>
                <table className='w-full min-w-max table-auto text-left'>
                  <thead>
                    <tr>
                      {TABLE_HEAD_HISTORY.map(head => (
                        <th
                          key={head}
                          className='border-b border-blue-gray-100 bg-blue-gray-50 p-4'
                        >
                          <p className='font-normal leading-none'>{head}</p>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {pageState.data
                      .filter(order => order.order_status === 'complete')
                      ?.map(
                        (
                          {
                            order_id,
                            order_no,
                            order_title,
                            order_price,
                            order_status,
                            order_note
                          },

                        ) => {
                          return (
                            <tr key={order_id} className='text-black border-b'>
                              <td >
                                <p className='font-normal p-4'>{order_no}</p>
                              </td>
                              <td >
                                <p className='font-normal'>{order_title}</p>
                              </td>
                              <td >
                                <p className='font-normal'>{order_note}</p>
                              </td>
                              <td >
                                <p className='font-normal'>
                                  ฿{order_price?.toFixed(2)}
                                </p>
                              </td>
                              <td >
                                <div>
                                  <p className='font-normal bg-green-500/30   text-sm  w-fit px-3 p-1 text-[0.8rem] rounded-full text-black'>
                                    {order_status === 'complete'
                                      ? 'ชำระเงินแล้ว'
                                      : 'ค้างชำระ'}
                                  </p>
                                </div>
                              </td>
                            </tr>
                          )
                        }
                      )}
                  </tbody>
                </table>
              </Card>
            ) : (
              <p className='text-center text-gray-500'>
                ไม่มีประวัติการชำระเงิน
              </p>
            )}
          </div>

          {pageState.data.filter(order => order.order_status === 'complete')
            .length > 0 && (
            <Pagination
              totalPages={totalPages}
              pageState={pageState}
              setPageState={setPageState}
              lable={`ประวัติการชำระเงินทั้งหมด ${
                pageState.data.filter(
                  order => order.order_status === 'complete'
                )?.length
              } รายการ`}
            />
          )}
        </div>
      </div>
    </>
  )
}
export default Payment
