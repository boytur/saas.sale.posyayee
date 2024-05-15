import { useState } from 'react'
import Swal from 'sweetalert2'
import Axios from '../../../libs/Axios'

/* eslint-disable react/prop-types */
function AddNewProduct ({ categories, units }) {
  document.title = 'เพิ่มสินค้าใหม่ 💸 POSYAYEE'

  const [isLoading, setIsLoading] = useState(false)

  const [imageFile, setImageFile] = useState(null)
  const [product, setProduct] = useState({
    auto_generate_barcode: false,
    prod_barcode: '',
    prod_name: '',
    prod_cost: '',
    prod_sale: '',
    prod_quantity: '',
    prod_image: '',
    cat_id: '',
    unit_id: ''
  })

  const handleImageChange = e => {
    const file = e.target.files[0]
    if (file && file.size <= 2 * 1024 * 1024) {
      setProduct({ ...product, prod_image: URL.createObjectURL(file) })
      setImageFile(file)
    } else {
      Swal.fire({
        icon: 'error',
        title: 'ขนาดไฟล์รูปภาพใหญ่เกินไป',
        text: 'ขนาดไฟล์รูปภาพต้องไม่เกิน 2MB'
      })
    }
  }

  const handleImageDrop = e => {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (file && file.size <= 2 * 1024 * 1024) {
      setProduct({ ...product, prod_image: URL.createObjectURL(file) })
      setImageFile(file)
    } else {
      Swal.fire({
        icon: 'error',
        title: 'ขนาดไฟล์รูปภาพใหญ่เกินไป',
        text: 'ขนาดไฟล์รูปภาพต้องไม่เกิน 2MB'
      })
    }
  }

  const handleDragOver = e => {
    e.preventDefault()
  }

  const handleSaveProduct = async () => {
    if (product.prod_barcode !== '' && product.prod_barcode.length !== 13) {
      Swal.fire({
        icon: 'warning',
        title: 'กรุณาระบุข่้อมูลให้ถูกต้อง',
        text: 'สินค้าต้องมีบารืโค้ด 13 หลัก'
      })
      return
    }
    if (
      !product.prod_name ||
      !product.prod_quantity ||
      !product.prod_cost ||
      !product.prod_sale | !product.cat_id ||
      !product.unit_id
    ) {
      Swal.fire({
        icon: 'warning',
        title: 'กรุณาระบุข้อมูลสินค้าให้ครบถ้วน \n และถูกต้อง'
      })
      return
    }

    try {
      setIsLoading(true)
      const formData = new FormData()
      formData.append('prod_barcode', product.prod_barcode)
      formData.append('prod_name', product.prod_name)
      formData.append('prod_cost', product.prod_cost)
      formData.append('prod_sale', product.prod_sale)
      formData.append('prod_quantity', product.prod_quantity)
      formData.append('cat_id', product.cat_id)
      formData.append('unit_id', product.unit_id)
      formData.append('auto_generate_barcode', product.auto_generate_barcode)

      if (imageFile) {
        formData.append('prod_image', imageFile)
      }

      const response = await Axios.post('api/product/add-product', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      if (response.status === 201) {
        Swal.fire({
          icon: 'success',
          title: 'เพิ่มสินค้าสำเร็จ',
          text: `${response.data.message}`
        })

        setProduct({
          auto_generate_barcode: false,
          prod_barcode: '',
          prod_name: '',
          prod_cost: '',
          prod_sale: '',
          prod_quantity: '',
          prod_image: '',
          cat_id: '',
          unit_id: ''
        })
        setIsLoading(false)
      }
    } catch (err) {
      setIsLoading(false)
      console.log(err)
      Swal.fire({
        icon: 'error',
        title: 'เกิดข้อผิดพลาด',
        text: `${err?.response?.data?.message}`
      })
    }
  }

  return (
    <div
      style={{ height: 'calc(100vh - 14rem)' }}
      className='w-full bg-white h-full lg:flex lg:flex-row flex flex-col lg:mb-0 mb-6 rounded-md'
    >
      <div className='pt-2 p-2 w-full order-2 lg:order-1'>
        {/* barcode */}
        <div>
          <label htmlFor='' className='text-sm text-gray-700'>
            บาร์โค้ด
          </label>
          <input
            onChange={e =>
              setProduct({ ...product, prod_barcode: e.target.value })
            }
            type='number'
            placeholder='กรุณายิงหรือป้อนบาร์โค้ด'
            className='input-primary  mt-1'
          />
        </div>

        <div className='flex justify-start items-center mt-2'>
          <div className='p-2'>
            <input
              value={product.auto_generate_barcode}
              onChange={e =>
                setProduct({
                  ...product,
                  auto_generate_barcode: e.target.checked
                })
              }
              type='checkbox'
              placeholder='กรุณายิงหรือป้อนบาร์โค้ด'
              className='input-primary mt-1 cursor-pointer scale-125 hover:scale-150'
            />
          </div>
          <label htmlFor='' className='mt-[2px]'>
            สร้างบาร์โค้ดอัตโนมัติ
          </label>
        </div>

        {/* name */}
        <div className='mt-2 lg:flex lg:flex-row flex-col gap-2'>
          <div className='lg:w-3/4 w-full'>
            <label htmlFor='' className='text-sm text-gray-700 '>
              ชื่อสินค้า <span className=' text-red-500'>*</span>
            </label>
            <input
              value={product.prod_name}
              onChange={e =>
                setProduct({ ...product, prod_name: e.target.value })
              }
              type='text'
              placeholder='กรุณาป้อนชื่อสินค้า'
              className='input-primary  mt-1'
            />
          </div>
          <div>
            <label htmlFor='' className='text-sm text-gray-700'>
              จำนวน <span className=' text-red-500'>*</span>
            </label>
            <input
              value={product.prod_quantity}
              onChange={e =>
                setProduct({ ...product, prod_quantity: e.target.value })
              }
              type='number'
              placeholder='จำนวนสินค้า'
              className='input-primary  mt-1'
            />
          </div>
        </div>

        {/* categorie and unit */}
        <div className='flex gap-2'>
          <div className='mt-2 w-full'>
            <label htmlFor='' className='text-sm text-gray-700'>
              ประเภท <span className=' text-red-500'>*</span>
            </label>
            <select
              value={product.cat_id}
              onChange={e => setProduct({ ...product, cat_id: e.target.value })}
              name=''
              id=''
              className='input-primary cursor-pointer'
            >
              <option value=''>เลือกประเภท</option>
              {categories?.map(cat => (
                <option key={cat.cat_id} value={cat.cat_id}>
                  {cat.cat_name}
                </option>
              ))}
            </select>
          </div>
          <div className='mt-2 w-full'>
            <label htmlFor='' className='text-sm text-gray-700'>
              หน่วยเรียก <span className=' text-red-500'>*</span>
            </label>
            <select
              value={product.unit_id}
              onChange={e =>
                setProduct({ ...product, unit_id: e.target.value })
              }
              name=''
              id=''
              className='input-primary cursor-pointer'
            >
              <option value=''>เลือกหน่วยเรียก</option>
              {units?.map(unit => (
                <option key={unit.unit_id} value={unit.unit_id}>
                  {unit.unit_name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* price */}
        <div className='flex gap-2'>
          <div className='mt-2 w-full'>
            <label htmlFor='' className='text-sm text-gray-700'>
              ราคาทุน <span className=' text-red-500'>*</span>
            </label>
            <input
              value={product.prod_cost}
              onChange={e =>
                setProduct({ ...product, prod_cost: e.target.value })
              }
              type='number'
              placeholder='กรุณาป้อนราคาทุน'
              className='input-primary  mt-1'
            />
          </div>
          <div className='mt-2 w-full'>
            <label htmlFor='' className='text-sm text-gray-700'>
              ราคาขาย <span className=' text-red-500'>*</span>
            </label>
            <input
              value={product.prod_sale}
              onChange={e =>
                setProduct({ ...product, prod_sale: e.target.value })
              }
              type='number'
              placeholder='กรุณาป้อนราคาขาย'
              className='input-primary  mt-1'
            />
          </div>
        </div>

        {/* save btn */}
        <button
          onClick={!isLoading ? () => handleSaveProduct() : null}
          className='btn-primary w-full mt-12 p-3 mb-6'
        >
          {isLoading ? (
            <div className='flex justify-center my-1'>
              <div className='white-loader'></div>
            </div>
          ) : (
            'บันทึก'
          )}
        </button>
      </div>

      {/* image */}
      <div
        className='w-full order-1 p-3 justify-center flex items-center'
        onDrop={e => handleImageDrop(e)}
        onDragOver={e => handleDragOver(e)}
      >
        <div className='flex items-center justify-center border w-full max-w-[30rem]'>
          {product.prod_image ? (
            <div className='flex flex-col'>
              <img
                src={product.prod_image}
                className=' rounded-md border object-cover w-[30rem] h-[20rem]  lg:w-[30rem] lg:h-[20rem]'
                alt=''
              />
              <button
                className='btn-danger mt-2'
                onClick={() => setProduct({ ...product, prod_image: '' })}
              >
                ลบรูปภาพ
              </button>
            </div>
          ) : (
            <label
              htmlFor='dropzone-file'
              className='flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 '
            >
              <div className='flex flex-col items-center justify-center pt-5 pb-6'>
                <svg
                  className='w-8 h-8 mb-4 text-gray-500 '
                  aria-hidden='true'
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 20 16'
                >
                  <path
                    stroke='currentColor'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth='2'
                    d='M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2'
                  />
                </svg>
                <p className='mb-2 text-sm text-gray-500 '>
                  <span className='font-semibold'>คลิ๊กหรือลากวางรูปภาพ</span>
                </p>
                <p className='text-xs text-gray-500 '>
                  รองรับไฟล์ภาพ PNG, JPG, JPEG และ GIF ขนาดไม่เกิน 2MB
                </p>
              </div>
              <input
                accept='.jpg,.jpeg,.png,.gif'
                id='dropzone-file'
                onChange={handleImageChange}
                type='file'
                className='hidden'
              />
            </label>
          )}
        </div>
      </div>
    </div>
  )
}

export default AddNewProduct
