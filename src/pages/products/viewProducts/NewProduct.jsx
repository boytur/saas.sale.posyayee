/* eslint-disable react/prop-types */
import { useState, useEffect, useRef } from 'react'
import { IoSearch } from 'react-icons/io5'
import Swal from 'sweetalert2'
import { LuPencilLine } from 'react-icons/lu'
import { RiDeleteBin5Line } from 'react-icons/ri'
import Barcode from 'react-barcode'
import { Card } from '@material-tailwind/react'
import Permission from '../../../libs/Permission'
import { useAuth } from '../../../contexts/AuthProvider'
import formatUTCtoThai from '../../../libs/formatUTCtoThai'
import Axios from '../../../libs/Axios'
import Pagination from '../../../components/pagination/Pagination'


const TABLE_HEAD = [
  'ลำดับ',
  'รูปภาพ',
  'ชื่อ',
  'บาร์โค้ด',
  'ประเภท',
  'สถานะ',
  'ต้นทุน',
  'ราคาขาย',
  'คงเหลือ',
  'เพิ่มเมื่อ',
  'การกระทำ'
]

function NewProduct ({ pageState, setPageState }) {
  const { authenticated } = useAuth()
  const permission = new Permission()

  useEffect(() => {
    fetchProducts()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageState.page, pageState.pageSize, authenticated])

  const fetchProducts = async () => {
    try {
      setPageState(prev => ({
        ...prev,
        loading: true
      }))

      if (authenticated && permission.canViewProduct()) {
        const response = await Axios.get('/api/product/new-products', {
          params: {
            page: pageState.page,
            perPage: pageState.pageSize
          }
        })
        if (response.status === 200) {
          setPageState(prev => ({
            ...prev,
            data: response.data.products,
            category: response.data.category,
            total: response.data.total,
            loading: false
          }))
        }
      }
    } catch (error) {
      console.error(error)
      setPageState(prev => ({
        ...prev,
        loading: false
      }))
      Swal.fire({
        icon: 'error',
        title: 'เกิดข้อผิดพลาด',
        text:
          error?.response?.data?.message || 'เกิดข้อผิดพลาดในการดึงข้อมูลสินค้า'
      })
    }
  }

  const totalPages = Math.ceil(pageState.total / pageState.pageSize)

  const handlePageSizeChange = event => {
    const newSize = parseInt(event.target.value)
    setPageState(prevState => ({ ...prevState, pageSize: newSize }))
  }

  const [selectedItems, setSelectedItems] = useState([])
  const [selectAll, setSelectAll] = useState(false)

  const toggleItem = index => {
    const selectedIndex = selectedItems.indexOf(index)
    if (selectedIndex === -1) {
      setSelectedItems([...selectedItems, index])
    } else {
      const updatedSelectedItems = [...selectedItems]
      updatedSelectedItems.splice(selectedIndex, 1)
      setSelectedItems(updatedSelectedItems)
    }
  }

  const toggleSelectAll = () => {
    if (selectAll) {
      setSelectedItems([])
    } else {
      const allIndices = Array.from(
        { length: pageState.data.length },
        (_, i) => i
      )
      setSelectedItems(allIndices)
    }
    setSelectAll(!selectAll)
  }

  const selectAllRef = useRef()

  useEffect(() => {
    selectAllRef.current.indeterminate =
      selectedItems.length > 0 && selectedItems.length < pageState.data.length
  }, [selectedItems, pageState.data.length])

  return (
    <>
      <>
        <div className='md:flex justify-between  rounded-t-lg bg-white'>
          <div className='md:flex my-6 items-center mx-2'>
            <div className='md:px-2 w-full md:w-[23rem] '>
              <label htmlFor='' className='text-[0.7rem] text-black/80 ml-1'>
                ค้นหา
              </label>
              <input
                type='text'
                placeholder='กรอกรายละเอียด...'
                className='input-primary '
                name=''
                id=''
              />
            </div>
            <div className='flex flex-col md:mr-2'>
              <label
                htmlFor=''
                className='text-[0.7rem] text-black/80 ml-1 mt-1'
              >
                ประเภท
              </label>
              <select
                name=''
                className='lg:w-[8rem] input-primary cursor-pointer'
                id=''
              >
                <option value=''>ทั้งหมด</option>
                {pageState?.category?.map(category => (
                  <option key={category.cat_id} value={category.cat_id}>
                    {category.cat_name}
                  </option>
                ))}
              </select>
            </div>
            <div className='flex flex-col md:mr-2'>
              <label
                htmlFor=''
                className='text-[0.7rem] text-black/80 md:ml-1 mt-1'
              >
                ค้นหาด้วย
              </label>
              <select name='' className='input-primary cursor-pointer' id=''>
                <option value=''>ทั้งหมด</option>
                <option value=''>ชื่อ</option>
                <option value=''>บาร์โค้ด</option>
                <option value=''>ราคาซื้อ</option>
                <option value=''>ราคาขาย </option>
                <option value=''>คงเหลือ</option>
              </select>
            </div>
            <div className='flex flex-col md:mr-2'>
              <label
                htmlFor=''
                className='text-[0.7rem] text-black/80 ml-1 mt-1'
              >
                เรียงจาก
              </label>
              <select name='' className='input-primary cursor-pointer' id=''>
                <option value=''>ทั้งหมด</option>
                <option value=''>มากไปน้อย</option>
                <option value=''>น้อยไปมาก</option>
              </select>
            </div>

            <div className=''>
              <label htmlFor='' className='text-white'>
                .
              </label>
              <button className='btn-primary w-full justify-center py-[7px] mb-1 px-5 flex items-center gap-1'>
                <p>ค้นหา</p>
                <IoSearch className='mt-[1px]' />
              </button>
            </div>
          </div>
          <div className='flex gap-3 items-center md:w-1/4 w-full justify-end pr-2'>
            {selectedItems.length !== 0 && (
              <div>
                <RiDeleteBin5Line
                  className='hover:scale-110 cursor-pointer  text-red-500'
                  size={30}
                />
              </div>
            )}
            <div className='flex items-center my-2'>
              <label htmlFor='pageSizeSelect' className='mr-3 text-sm'>
                แสดง:
              </label>
              <select
                id='pageSizeSelect'
                onChange={handlePageSizeChange}
                value={pageState.pageSize}
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
                <th className='px-3 rounded-tl-lg bg-[#ECEFF1]'>
                  <input
                    type='checkbox'
                    className='cursor-pointer md:w-4 md:h-4'
                    checked={selectAll}
                    onChange={toggleSelectAll}
                    ref={selectAllRef}
                  />
                </th>
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
              {pageState?.data?.map(
                (
                  {
                    prod_image,
                    prod_name,
                    prod_barcode,
                    category,
                    prod_status,
                    prod_cost,
                    prod_sale,
                    prod_quantity,
                    product_unit,
                    createdAt
                  },
                  index
                ) => {
                  return (
                    <tr
                      key={index}
                      className='hover:bg-[#f5f5ff] border-b-[1px] text-center cursor-pointer text-black'
                    >
                      <td className='px-3 py-1 bg-[#ECEFF1]'>
                        <input
                          type='checkbox'
                          className='md:w-4 md:h-4 cursor-pointer'
                          checked={selectedItems.includes(index)}
                          onChange={() => toggleItem(index)}
                        />
                      </td>
                      <td className='px-3 py-1'>{index + 1}</td>
                      <td className='px-3 py-1'>
                        <div className='flex justify-center w-[50px] h-[50px] items-center'>
                          <img
                            src={prod_image}
                            alt='product'
                            className='w-[50px] h-[50px] rounded-sm object-cover'
                          />
                        </div>
                      </td>
                      <td
                        style={{
                          maxWidth: '200px',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap'
                        }}
                        className='px-3 py-1 truncate'
                      >
                        {prod_name}
                      </td>
                      <td className='px-3 py-1 '>
                        <div className='flex justify-center items-center z-0'>
                          {prod_barcode !== '' ? (
                            <Barcode
                              className='w-[90px] h-[50px]'
                              value={prod_barcode?.toString()}
                            />
                          ) : (
                            <div className='text-black/70 text-sm'>ไม่มี</div>
                          )}
                        </div>
                      </td>
                      <td className='px-3 py-1'>{category?.cat_name}</td>
                      <td className='px-3 py-1'>
                        <div className='toggle-switch'>
                          <input
                            type='checkbox'
                            id='statusToggle'
                            className='toggle-input'
                            checked={prod_status === 'active'}
                          />
                          <label
                            htmlFor='statusToggle'
                            className='toggle-label'
                          ></label>
                        </div>
                      </td>

                      <td className='px-3 text-lg py-1 font-bold text-[#4C49ED]'>
                        ฿{prod_cost}
                      </td>
                      <td className='px-3 text-lg py-1 font-bold text-green-600'>
                        ฿{prod_sale}
                      </td>
                      <td className='px-3 text-lg py-1'>
                        {prod_quantity} ({product_unit?.unit_name})
                      </td>
                      <td className='px-3 text-sm py-1'>
                        {formatUTCtoThai(createdAt)}
                      </td>
                      <td className='px-3 py-1 '>
                        <div className='flex justify-center gap-2 items-center rounded-md'>
                          <div className='border p-1 rounded-md flex items-center justify-center'>
                            <LuPencilLine
                              className='hover:scale-110 pb-1 text-black/70 hover:text-[#4C49ED]'
                              size={25}
                            />
                          </div>
                          |
                          <div className='border p-1 rounded-md flex items-center justify-center'>
                            <RiDeleteBin5Line
                              className='hover:scale-110 pb-1 text-black/70 hover:text-red-500'
                              size={25}
                            />
                          </div>
                        </div>
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
          lable={`รายการสินค้าใหม่ ${
            pageState.page * pageState.pageSize - pageState.pageSize + 1
          } - ${Math.min(
            pageState.page * pageState.pageSize,
            pageState.total
          )} จาก ${pageState.total} รายการ`}
        />
      </>
    </>
  )
}

export default NewProduct
