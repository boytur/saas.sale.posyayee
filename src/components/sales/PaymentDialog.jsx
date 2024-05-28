/* eslint-disable react/prop-types */
import { useState } from 'react'
import {
  Dialog,
  DialogBody,
  DialogFooter,
  Button
} from '@material-tailwind/react'
import { FcMoneyTransfer, FcCurrencyExchange } from 'react-icons/fc'

const PaymentDialog = ({
  open,
  handleOpen,
  totalPrice,
  totalDiscount,
  handleConfirmPayment,
  setBill
}) => {
  const [paymentMethod, setPaymentMethod] = useState('cash')
  const [money, setMoney] = useState(0)

  const handleChange = e => {
    const value = e.target.value
    const regex = /^[0-9]*$/

    if (regex.test(value)) {
      const numValue = parseFloat(value)
      setMoney(numValue)
      setBill(prev => ({ ...prev, bill_receive: numValue }))
      setBill(prev => ({
        ...prev,
        bill_change: numValue - (totalPrice - totalDiscount)
      }))
    }
  }

  const handleKeyDown = async e => {
    // Allow only numeric keys, backspace, and delete
    if (!/[0-9]/.test(e.key) && e.key !== 'Backspace' && e.key !== 'Delete') {
      e.preventDefault()
    }
    // Check if the Enter key is pressed
    if (e.key === 'Enter' && money > 0 && money >= totalPrice - totalDiscount) {
      e.preventDefault()
      await handleConfirmPayment()
      setMoney(0)
    }
  }

  return (
    <Dialog open={open} handler={handleOpen}>
      <div className='font-bold text-primary p-4 text-[1.5rem] text-center px-4'>
        <h1>ชำระเงิน</h1>
        <hr />
      </div>
      <DialogBody>
        <div className='mx-6 text-black flex'>
          <div className='w-full'>
            <div className='flex justify-center'>
              <div>
                <p className='text-sm text-center'>วิธีการชำระเงิน</p>
                <div className='flex gap-4 mt-2'>
                  <div
                    className={`btn text-xl flex gap-2 items-center cursor-pointer ${
                      paymentMethod === 'cash'
                        ? 'border-b-4 border-[#4C49ED] text-primary'
                        : ''
                    }`}
                    onClick={() => setPaymentMethod('cash')}
                  >
                    <FcMoneyTransfer className='mt-1' />
                    <p>เงินสด</p>
                  </div>
                  <div
                    className={`btn text-xl flex gap-2 cursor-pointer ${
                      paymentMethod === 'credit'
                        ? 'border-b-4 border-[#4C49ED] text-primary'
                        : 'text-xl'
                    }`}
                    onClick={() => setPaymentMethod('credit')}
                  >
                    <FcCurrencyExchange className='mt-1' />
                    <p>เงินเชื่อ</p>
                  </div>
                </div>
              </div>
            </div>

            {paymentMethod === 'cash' && (
              <form onSubmit={handleConfirmPayment}>
                <div className='mt-6 flex flex-col text-center'>
                  <label htmlFor='' className='text-[2rem]'>
                    ยอดรวม{' '}
                    <span className='text-primary font-bold'>
                      {(totalPrice - totalDiscount).toLocaleString('en-US')}
                    </span>{' '}
                    บาท
                  </label>
                  <label htmlFor='' className='text-[2rem]'>
                    เงินทอน{' '}
                    <span className='font-bold'>
                      {money > 0 && money >= totalPrice - totalDiscount ? (
                        (money - (totalPrice - totalDiscount)).toLocaleString(
                          'en-US'
                        )
                      ) : (
                        <span>ยอดเงินไม่เพียงพอ</span>
                      )}
                    </span>{' '}
                    {money > 0 && money >= totalPrice - totalDiscount && 'บาท'}
                  </label>
                </div>
                <div className='flex items-center flex-col'>
                  <div className='flex justify-start w-3/4 ml-2'>
                    <p htmlFor='' className='text-sm mb-1 text-start'>
                      รับมา
                    </p>
                  </div>
                  <input
                    required
                    onKeyDown={handleKeyDown}
                    onChange={handleChange}
                    autoFocus
                    type='number'
                    placeholder='กรุณาระบุจำนวนเงิน'
                    className='input-primary w-3/4 h-12 text-lg'
                    name=''
                    id=''
                  />
                </div>
              </form>
            )}
            {paymentMethod === 'credit' && (
              <div className='mt-4'>
                <label htmlFor='cardNumber' className='block text-[1.5rem]'>
                  ค้นหาลูกค้า:
                </label>
                <input
                  type='text'
                  id='cardNumber'
                  className='w-full p-2 mt-2 border rounded'
                  placeholder='กรอกหมายเลขบัตรเครดิต'
                />
              </div>
            )}
          </div>
        </div>
      </DialogBody>
      <DialogFooter>
        <Button
          variant='text'
          color='red'
          onClick={handleOpen}
          className='mr-1'
        >
          <span>ยกเลิก</span>
        </Button>
        <button
          className='btn-primary p-[7px] px-6'
          onClick={() => {
            handleConfirmPayment()
            setMoney(0)
          }}
        >
          <span>ยืนยัน</span>
        </button>
      </DialogFooter>
    </Dialog>
  )
}

export default PaymentDialog
