/* eslint-disable react/prop-types */
import { RiDeleteBin5Line } from 'react-icons/ri'
import { CiCircleMinus, CiCirclePlus } from 'react-icons/ci'
import { MdShoppingCart } from 'react-icons/md'
import { useEffect, useState } from 'react'
import PaymentDialog from '../../components/sales/PaymentDialog'
import Swal from 'sweetalert2'
import Axios from '../../libs/Axios'
import cash from '../../assets/sounds/cash-register-purchase.mp3'
// eslint-disable-next-line react/prop-types
function Scan ({ carts, setCarts, discount, setDiscount }) {
  //
  const [bill, setBill] = useState({
    bill_receive: 0,
    bill_change: 0
  })

  const [open, setOpen] = useState(false)
  const handleOpen = () => setOpen(!open)

  const handleConfirmPayment = async () => {
    try {
      const response = await Axios.post(`/api/product/sale`, {
        products: carts,
        discounts: discount,
        bill_receive: bill.bill_receive,
        bill_change: bill.bill_change,
        payment_method: 'cash'
      })

      if (response.status === 200) {
        setOpen(false)
        setCarts([])
        setDiscount([])
        new Audio(cash).play()
        Swal.fire({
          icon: 'success',
          title: response?.data?.message,
          timer: 3000
        })
      }
    } catch (err) {
      console.error(err)
      setOpen(false)
      Swal.fire({
        title: 'เกิดข้อผิดพลาด',
        text: 'กรุณาลองใหม่อีกครั้ง',
        icon: 'error'
      })
    }
  }

  const incrementQuantity = prod_id => {
    const existingProductIndex = carts.findIndex(
      product => product.prod_id === prod_id
    )
    const updatedCarts = [...carts]
    updatedCarts[existingProductIndex].quantity += 1
    setCarts(updatedCarts)

    const product = carts.find(product => product.prod_id === prod_id)

    if (
      product.promotion &&
      product.quantity % product.promotion.promo_prod_amount === 0
    ) {
      if (discount.length === 0) {
        const base_price =
          product.promotion.promo_prod_amount * product.prod_sale
        const promotion = product.promotion

        const newDiscount = [
          {
            base_price,
            prod_name: product.prod_name,
            prod_id: product.prod_id,
            promotion
          }
        ]

        setDiscount(newDiscount)
        console.log(discount)
      } else {
        const base_price =
          product.promotion.promo_prod_amount * product.prod_sale
        const promotion = product.promotion
        discount.push({
          base_price,
          prod_name: product.prod_name,
          prod_id: product.prod_id,
          promotion
        })
        console.log(discount)
      }
    }
  }

  const decrementQuantity = prod_id => {
    const existingProductIndex = carts.findIndex(
      product => product.prod_id === prod_id
    )
    const updatedCarts = [...carts]
    if (updatedCarts[existingProductIndex].quantity > 1) {
      updatedCarts[existingProductIndex].quantity -= 1
    }

    setCarts(updatedCarts)

    const product = updatedCarts[existingProductIndex]
    if (product.promotion) {
      const promoIndex = discount.findIndex(
        item =>
          item.prod_id === prod_id &&
          item.promotion.promo_id === product.promotion.promo_id
      )

      let cycle = 0
      for (let i = 1; i <= product.quantity; i++) {
        if (i % product.promotion.promo_prod_amount === 0) {
          cycle++
        }
      }

      console.log(discount)
      console.log(
        'dis2',
        discount.filter(p => p.prod_id === product.prod_id)
      )
      console.log('=========')

      if (
        discount.filter(p => p.prod_id === product.prod_id).length - cycle ===
        1
      ) {
        const updatedDiscount = [...discount]
        updatedDiscount.splice(promoIndex, 1)
        setDiscount(updatedDiscount)
      }
    }
  }

  const deleteProductFromCart = prod_id => {
    const indexToDelete = carts.findIndex(prod => prod.prod_id === prod_id)
    if (indexToDelete !== -1) {
      // eslint-disable-next-line no-unused-vars
      const deletedItem = carts[indexToDelete]
      const updatedItems = [...carts]
      updatedItems.splice(indexToDelete, 1)
      setCarts(updatedItems)

      // Remove any discounts related to the deleted product
      const updatedDiscount = discount.filter(item => item.prod_id !== prod_id)
      setDiscount(updatedDiscount)
    }
  }

  let totalPrice = carts.reduce(
    (total, item) => total + item.prod_sale * item.quantity,
    0
  )

  let totalDiscount = discount?.reduce((total, item) => {
    if (item.promotion) {
      return total + (item.base_price - item.promotion.promo_prod_price)
    } else {
      return total
    }
  }, 0)

  const handleCancel = () => {
    if (totalPrice <= 0) {
      return
    }
    Swal.fire({
      title: 'ยกเลิกการขาย',
      text: 'คุณต้องการยกเลิกการขายใช่หรือไม่',
      icon: 'warning',
      showCancelButton: true,
      cancelButtonText: 'ไม่ต้องการ',
      confirmButtonText: 'ใช่ ฉันต้องการ',
      reverseButtons: true
    }).then(result => {
      if (result.isConfirmed) {
        setCarts([])
        setDiscount([])
      }
    })
  }

  useEffect(() => {
    let totalPrice = carts.reduce(
      (total, item) => total + item.prod_sale * item.quantity,
      0
    )

    function handleKeyDown (event) {
      // เช็คว่าถ้ากดปุ่ม =,ช, +
      if (event.keyCode === 107 || event.key === '=' || event.key === 'ช') {
        console.log(totalPrice)
        if (totalPrice !== 0) {
          handleOpen()
        }
      }
    }

    // เพิ่ม event listener เมื่อคอมโพเนนต์ถูก mount
    window.addEventListener('keydown', handleKeyDown)

    // คืนค่าฟังก์ชันที่ใช้ในการลบ event listener เมื่อคอมโพเนนต์ถูก unmount
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [carts])

  return (
    <>
      {/* payment dialog */}
      <PaymentDialog
        handleConfirmPayment={handleConfirmPayment}
        open={open}
        handleOpen={handleOpen}
        totalPrice={totalPrice}
        totalDiscount={totalDiscount}
        setBill={setBill}
      />
      {/* cart for mobile */}
      <div className='lg:hidden absolute bottom-24 right-7'>
        <div className='absolute inset-0 bg-gradient-to-br from-blue-200 to-purple-200 rounded-full filter blur-[20px]'></div>
        <div className='relative bg-white p-2 rounded-full'>
          <div>
            <MdShoppingCart size={50} />
          </div>
          <div className='absolute bg-red-500 w-7 h-7 flex items-center justify-center rounded-full right-10 top-0 text-white'>
            <p>{carts?.length}</p>
          </div>
        </div>
      </div>

      <div className='w-full hidden lg:block h-full'>
        <div className='w-full h-full bg-white rounded-md'>
          <table className='w-full border-collapse mb-1'>
            <thead>
              <tr>
                <th
                  style={{ width: '40%' }}
                  className='py-2 px-4 bg-gray-100 rounded-tl-md'
                >
                  ชื่อ
                </th>
                <th style={{ width: '24%' }} className='py-2 px-4 bg-gray-100'>
                  ราคา
                </th>
                <th style={{ width: '18%' }} className='py-2 px-4 bg-gray-100'>
                  จำนวน
                </th>
                <th style={{ width: '18%' }} className='py-2 px-4 bg-gray-100'>
                  ลบ
                </th>
              </tr>
            </thead>
          </table>
          <div
            className='overflow-y-scroll w-full'
            style={{ height: 'calc(100vh - 18.2rem)' }}
          >
            <tbody className='overflow-y-scroll w-full pb-6'>
              {carts?.map(prod => (
                <tr
                  key={prod.prod_id}
                  className='text-center cursor-pointer hover:bg-[#e4e3ff42]'
                >
                  <td
                    style={{ width: '40%' }}
                    className='py-1 px-4 text-left border-b-[1px]'
                  >
                    <div className='flex items-center gap-2 w-full'>
                      <img
                        className='w-12 h-12 rounded-sm'
                        src={prod.prod_image}
                        alt=''
                      />
                      <p
                        style={{
                          maxWidth: '200px',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap'
                        }}
                      >
                        {prod.prod_name}
                      </p>
                    </div>
                  </td>
                  <td
                    style={{ width: '25%' }}
                    className='py-2 px-4 border-b-[1px]'
                  >
                    <h1 className='text-primary font-bold text-[1.2rem]'>
                      ฿{prod.prod_sale.toFixed(2)}
                    </h1>
                  </td>
                  <td
                    style={{ width: '16%' }}
                    className='py-2 px-4 border-b-[1px]'
                  >
                    <div className='flex items-center gap-2 justify-center'>
                      <button
                        className='p-1 px-[10px] rounded-lg border-[1px] hover:scale-105 hover:bg-[#E4E3FF] hover:text-primary'
                        onClick={() => decrementQuantity(prod.prod_id)}
                      >
                        <CiCircleMinus size={20} />
                      </button>
                      <span>{prod.quantity}</span>
                      <button
                        className='p-1 px-[10px] rounded-lg border-[1px] hover:scale-105 hover:bg-[#E4E3FF] hover:text-primary'
                        onClick={() => incrementQuantity(prod.prod_id)}
                      >
                        <CiCirclePlus size={20} />
                      </button>
                    </div>
                  </td>
                  <td
                    style={{ width: '15%' }}
                    className='py-2 px-4 border-b-[1px]'
                  >
                    <div className='flex justify-center items-center'>
                      <RiDeleteBin5Line
                        onClick={() => deleteProductFromCart(prod.prod_id)}
                        className='hover:scale-110 cursor-pointer text-red-500'
                        size={25}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </div>
          <div className='bg-gray-100'>
            <div className='flex justify-between mx-6 items-center mt-2'>
              <h1>ราคาสินค้า</h1>
              <h1 className=''>{totalPrice.toLocaleString('en-US')}</h1>
            </div>
            <div className='flex justify-between mx-6 items-center'>
              <h1>ส่วนลด</h1>
              <h1 className=''>{totalDiscount}</h1>
            </div>
            <div className='flex justify-between mx-6 items-center'>
              <h1>ราคารวม</h1>
              <h1 className='text-[2.5rem] font-bold text-primary'>
                {(totalPrice - totalDiscount).toLocaleString('en-US')}
              </h1>
            </div>
          </div>
          <div className='flex gap-2 justify-between w-full'>
            <div className='w-full text-center'>
              <div
                onClick={() => handleCancel()}
                className='btn-warnning w-full py-4 cursor-pointer'
              >
                ยกเลิก
              </div>
            </div>
            <div className='w-full'>
              <div
                onClick={totalPrice !== 0 ? handleOpen : null}
                className='btn-primary w-full py-4 text-[1rem] cursor-pointer text-center'
              >
                จ่าย (+)
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Scan
