/* eslint-disable react/prop-types */
import { forwardRef } from 'react'
import formatUTCtoThaiWithTime from '../../libs/formatUTCtoThaiWithTime.js'
import userDecode from '../../libs/userDecode'
import formatCurrency from '../../libs/formatCurrency.js'

// eslint-disable-next-line react/display-name
const Bill = forwardRef((props, ref) => {
  const { carts, discount, totalPrice, totalDiscount, billNo, bill } = props

  return (
    <div ref={ref} className='' style={{ width: '60mm' }}>
      <div className='mx-1  w-[90%]'>
        <div className='flex justify-center w-full items-center '>
          <h1 className='font-bold text-center break-words'>
            {userDecode()?.user?.store?.store_name}
          </h1>
        </div>
        <div className='text-[0.7rem] text-center'>
          <h2>{userDecode()?.user?.store?.store_address}</h2>
        </div>
        <div className='text-[0.7rem] text-center'>
          <h2>{userDecode()?.user?.store?.store_phone}</h2>
        </div>
        <div className='text-[0.7rem]'>
          <h2>
            <span className='font-bold'>เลขประจำตัวผู้เสียภาษี: </span>
            {userDecode()?.user?.store?.store_taxid}
          </h2>
          <h2>
            <span className='font-bold'>ใบเสร็จเลขที่: </span>
            {billNo}
          </h2>
          <h2>
            <span className='font-bold'>ประเภท: </span>
            เงินสด
          </h2>
          <h2>
            <span className='font-bold'>วันที่ออกบิล: </span>
            {formatUTCtoThaiWithTime(new Date().toISOString())}
          </h2>
          <h2>
            <span className='font-bold'>พนักงาน: </span>
            {userDecode()?.user?.user_fname
              ? userDecode()?.user?.user_fname
              : userDecode()?.user?.user_phone}
          </h2>
        </div>
        <hr className='mt-2' />
        <div className='text-[0.7rem] font-bold mt-2 text-center mb-2'>
          <h2>ใบเสร็จรับเงิน</h2>
        </div>
        <div className='text-[0.7rem]'>
          <table className='w-full text-center'>
            <thead>
              <tr>
                <th className='text-start'>รายการ</th>
                <th>ราคา</th>
                <th>จำนวน</th>
                <th>รวม</th>
              </tr>
            </thead>
            <tbody>
              {carts?.map(prod => (
                <tr key={prod.prod_id}>
                  <td className='text-start truncate max-w-16'>
                    {prod.prod_name}
                  </td>
                  <td>{formatCurrency(prod.prod_sale)}</td>
                  <td>{prod.quantity}</td>
                  <td>{formatCurrency(prod.prod_sale * prod.quantity)}</td>
                </tr>
              ))}
              {discount.length !== 0 && (
                <>
                  <tr>
                    <td colSpan='4' className='text-center font-bold'>
                      <p className='mt-5'>รายการส่วนลด</p>
                    </td>
                  </tr>
                  <tr>
                    <th className='text-start'>ชื่อส่วนลด</th>
                    <th></th>
                    <th></th>
                    <th>มูลค่า</th>
                  </tr>
                  {discount?.map(dis => (
                    <tr key={dis.prod_id}>
                      <td className='text-start'>{dis.promotion.promo_name}</td>
                      <td></td>
                      <td></td>
                      <td colSpan='3'>
                        {formatCurrency(
                          dis.base_price - dis.promotion.promo_prod_price
                        )}
                      </td>
                    </tr>
                  ))}
                </>
              )}
            </tbody>
          </table>
          <h1>===============================</h1>
          <div className='w-full  pr-2'>
            <div className='w-full flex justify-between'>
              <p>ราคารวม</p>
              <p>{formatCurrency(totalPrice)}</p>
            </div>
            <div className='w-full flex justify-between'>
              <p>ส่วนลด</p>
              <p>{formatCurrency(totalDiscount)}</p>
            </div>
            <div className='w-full flex justify-between font-bold text-md'>
              <p>รวมสุทธิ</p>
              <p>{formatCurrency(totalPrice - totalDiscount)}</p>
            </div>
            <h1>===============================</h1>
            <div className='w-full flex justify-between'>
              <p>รับมา</p>
              <p>{formatCurrency(bill.bill_receive)}</p>
            </div>
            <div className='w-full flex justify-between'>
              <p>เงินทอน</p>
              <p>{formatCurrency(bill.bill_change)}</p>
            </div>
          </div>
        </div>
        <div className='text-[0.6rem] text-center mt-2 w-full'>
          <h1>====================================</h1>
          ขอบคุณที่ใช้บริการ(❁´◡`❁)
          <h1>====================================</h1>
        </div>
      </div>
    </div>
  )
})

export default Bill
