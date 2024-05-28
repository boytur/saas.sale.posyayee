/* eslint-disable react/prop-types */
import { useEffect, useRef, useState } from 'react'
import Axios from '../../libs/Axios'
import { useAuth } from '../../contexts/AuthProvider'
import {
  Button,
  Dialog,
  DialogBody,
  DialogFooter
} from '@material-tailwind/react'
import { FaPrint } from 'react-icons/fa6'
import formatUTCtoThaiWithTime from '../../libs/formatUTCtoThaiWithTime'
import formatCurrency from '../../libs/formatCurrency'
import { useReactToPrint } from 'react-to-print'
import CopyBill from '../sales/CopyBill'

function HistoryDialog ({ billId, isOpenBillDetail, handleOpen }) {
  const [billDetails, setBillDetails] = useState([])
  const [loading, setLoading] = useState(false)
  const { authenticated } = useAuth()

  // fetch the bill details
  const fetchBillDetails = async () => {
    try {
      setLoading(true)
      const response = await Axios.get(
        `/api/analytic/products/bill/${billId}/info`
      )

      if (response.status === 200) {
        setBillDetails(response.data)
        setLoading(false)
        console.log(response.data)
      }
    } catch (err) {
      console.error('Failed to fetch bill details', err)
    }
  }

  const getTotalCost = () => {
    if (!billDetails?.bill?.bill_details) return 0
    return billDetails.bill.bill_details
      .map(detail => detail.bill_detail_cost)
      .reduce((a, b) => a + b, 0)
  }

  useEffect(() => {
    if (!authenticated) {
      return
    }

    fetchBillDetails()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const componentRef = useRef()
  const handlePrint = useReactToPrint({
    content: () => componentRef.current
  })

  return (
    <>
      <div className='hidden'>
        <CopyBill
          ref={componentRef}
          carts={billDetails?.bill?.bill_details}
          billNo={billDetails?.bill?.bill.bill_no}
          date={billDetails?.bill?.bill.createdAt}
          totalPrice={billDetails?.bill?.bill.bill_all_amount}
          totalDiscount={billDetails?.bill?.bill.bill_all_discount}
          bill_receive={billDetails?.bill?.bill.bill_receive}
          bill_change={billDetails?.bill?.bill.bill_change}
        />
      </div>
      <Dialog
        className='w-full bg-white'
        handler={handleOpen}
        open={isOpenBillDetail}
        size={'lg'}
      >
        <DialogBody className='overflow-y-scroll max-h-[80vh] h-full py-3'>
          <div className='m-2 text-center w-screen-lg'>
            <h1 className='text-primary text-lg font-bold mb-2'>
              รายละเอียดบิล
            </h1>
            <hr />
          </div>
          <div className='text-black'>
            <div className='flex m-2'>
              <div className='font-bold'>เลขที่บิล&nbsp;</div>
              <div>{billDetails?.bill?.bill.bill_no}</div>
            </div>
            <div className='flex m-2'>
              <div className='font-bold'>วันที่&nbsp;</div>
              <div>
                {formatUTCtoThaiWithTime(billDetails?.bill?.bill.createdAt)}
              </div>
            </div>
            <div className='flex'>
              <div className='flex m-2'>
                <div className='font-bold'>รับมา&nbsp;</div>
                <div className='text-primary font-bold'>
                  {formatCurrency(billDetails?.bill?.bill.bill_receive)}
                </div>
              </div>
              <div className='flex m-2'>
                <div className='font-bold'>ทอน&nbsp;</div>
                <div className='text-red-600 font-bold'>
                  {formatCurrency(billDetails?.bill?.bill?.bill_change)}
                </div>
              </div>
              <div className='flex m-2'>
                <div className='font-bold'>การชำระ&nbsp;</div>
                <div>
                  {billDetails?.bill?.bill?.bill_payment_method === 'cash'
                    ? 'เงินสด'
                    : 'เงินเชื่อ'}
                </div>
              </div>
            </div>
            <div className='flex m-2'>
              <div className='font-bold'>พนักงาน&nbsp;</div>
              <div>
                {billDetails?.bill?.bill?.user?.user_fname ||
                  'ไม่พบพนักงาน หรือพนักงานโดนลบ'}
              </div>
            </div>
          </div>
          <hr />
          <table className='min-w-full divide-y divide-gray-200'>
            <thead>
              <tr>
                <th className='px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  รายการ
                </th>
                <th className='px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  จำนวน
                </th>
                <th className='px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  ราคารวม
                </th>
                <th className='px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  ส่วนลด
                </th>
                <th className='px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  ต้นทุน
                </th>
                <th className='px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  กำไร
                </th>
              </tr>
            </thead>
            <tbody className='bg-white divide-y divide-gray-200 text-black'>
              {loading ? (
                <tr>
                  <td colSpan='6' className='text-center py-4'>
                    กำลังโหลด...
                  </td>
                </tr>
              ) : (
                billDetails?.bill?.bill_details?.map((billDetail, index) => (
                  <tr key={index}>
                    <td className='px-6 py-2 whitespace-nowrap'>
                      {billDetail.bill_detail_prod_name}
                    </td>
                    <td className='px-6 py-2 whitespace-nowrap'>
                      {billDetail.bill_detail_quantity}
                    </td>
                    <td className='px-6 py-2 whitespace-nowrap text-primary'>
                      {formatCurrency(billDetail.bill_detail_amount)}
                    </td>
                    <td className='px-6 py-2 whitespace-nowrap text-red-600'>
                      - {formatCurrency(billDetail.bill_detail_discount)}
                    </td>
                    <td className='px-6 py-2 whitespace-nowrap'>
                      {formatCurrency(billDetail.bill_detail_cost)}
                    </td>
                    <td className='px-6 py-2 whitespace-nowrap text-green-700'>
                      + {formatCurrency(billDetail.bill_detail_profit)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
            {!loading && (
              <tfoot>
                <tr>
                  <td className='px-6 py-2 font-bold text-black' colSpan='2'>
                    รวม
                  </td>
                  <td className='px-6 py-2 font-bold text-primary'>
                    {formatCurrency(billDetails?.bill?.bill?.bill_all_amount)}
                  </td>
                  <td className='px-6 py-2 font-bold text-red-600'>
                    -{' '}
                    {formatCurrency(billDetails?.bill?.bill?.bill_all_discount)}
                  </td>
                  <td className='px-6 py-2 text-black font-bold'>
                    {formatCurrency(getTotalCost())}
                  </td>
                  <td className='px-6 py-2 font-bold text-green-700'>
                    + {formatCurrency(billDetails?.bill?.bill?.bill_all_profit)}
                  </td>
                </tr>
              </tfoot>
            )}
          </table>
        </DialogBody>
        <DialogFooter>
          <Button
            onClick={handleOpen}
            variant='text'
            color='red'
            className='mr-1 focus:outline-none'
          >
            <span>ปิด</span>
          </Button>
          <button
            onClick={handlePrint}
            className='btn-primary p-[7px] px-6 flex items-center gap-1'
          >
            <FaPrint />
            <span>พิมพ์</span>
          </button>
        </DialogFooter>
      </Dialog>
    </>
  )
}
export default HistoryDialog
