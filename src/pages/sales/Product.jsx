import { CiSearch } from 'react-icons/ci'
import barcode_scanner_beep_sound from '../../assets/sounds/barcode-scanner-beep-sound.mp3'
import userDecode from '../../libs/userDecode'

/* eslint-disable react/prop-types */
function Product ({ products, categories, onClickAddToCart, isLoading }) {
  let productNobarcode = products?.filter(
    p => p.prod_barcode === '' || p.prod_barcode === null
  )

  return (
    <div className='w-full h-full rounded-md p-1 bg-white'>
      <div className='h-full overflow-auto flex justify-evenly flex-wrap md:gap-2 gap-[3px] pb-12'>
        <div className='w-full'>
          <div className='flex gap-2 mx-2'>
            <div className='w-full'>
              <label className='text-[0.7rem]  ml-1 text-gray-500' htmlFor=''>
                ค้นหาสินค้า
              </label>
              <div className='relative flex items-center w-full'>
                <input
                  placeholder='กรอกรายละเอียด.....'
                  className='input-primary md:text-lg text-[0.8rem] w-full md:h-[2.5rem] mb-2 rounded-lg px-2 md:pl-9 pl-6'
                ></input>
                <CiSearch className=' absolute md:pl-3 text-[1.3rem] md:text-[2rem] pl-2 mb-2' />
              </div>
            </div>

            {/* categories */}
            <div className='w-2/4 '>
              <label className='text-[0.7rem]  ml-1 text-gray-500' htmlFor=''>
                ค้นหาจาก
              </label>
              <select className='input-primary md:h-[2.5rem] text-[0.8rem] md:text-[1rem] cursor-pointer'>
                <option value='prod_name'>ชื่อสินค้า</option>
                <option value='prod_sale'>ราคาสินค้า</option>
              </select>
            </div>

            {/* sort */}
            <div className='w-2/4'>
              <label className='text-[0.7rem]  ml-1 text-gray-500' htmlFor=''>
                ประเภท
              </label>
              <select className='input-primary md:h-[2.5rem] text-[0.8rem] md:text-[1rem] cursor-pointer'>
                {categories?.map(c => (
                  <option key={c.cat_id} value={c.cat_id}>
                    {c.cat_name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {isLoading ? (
          <div>
            <div className='loader'></div>
          </div>
        ) : (
          <>
            {productNobarcode?.map(product => (
              <div
                onClick={() => {
                  {
                    userDecode()?.user?.setting?.stt_peep_sound &&
                      new Audio(barcode_scanner_beep_sound).play()
                  }
                  onClickAddToCart(product)
                }}
                key={product.prod_id}
                className='md:w-[8rem] md:h-[10rem]
                h-[10rem] w-[7.5rem] mb-2 md:mb-0 items-center md:flex
                md:flex-col rounded-md p-1 bg-white cursor-pointer shadow-md
                hover:border-primary border-[2px]'
              >
                <div className='md:w-full h-[5rem]'>
                  <img
                    src={product.prod_image}
                    alt={product.prod_name}
                    className='w-full h-full object-cover'
                  />
                </div>
                <div className='w-full mt-2 px-1 truncate '>
                  {product.prod_name}
                </div>
                <div className='w-full md:block mt-1 px-1 text-[1.2rem] font-bold text-primary'>
                  ฿{product.prod_sale.toFixed(2)}
                </div>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  )
}

export default Product
