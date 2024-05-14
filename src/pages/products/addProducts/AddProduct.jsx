import styled from 'styled-components'
import Axios from '../../../libs/Axios'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import AddNewProduct from './AddNewProduct'
import AddExistingProduct from './AddExistingProduct'
import { useAuth } from '../../../contexts/AuthProvider'

const StyledDiv = styled.div`
  height: calc(100vh - 5rem); /* Default height */
  @media (max-width: 640px) {
    height: calc(
      100vh - 8rem
    ); /* Height when screen size is less than or equal to 640px */
  }
  overflow-y: scroll;
`

function AddProduct () {
  const navigate = useNavigate()
  const [categories, setCategories] = useState()
  const [units, setUnits] = useState()
  const { authenticated } = useAuth()

  const getProductCategories = async () => {
    try {
      const response = await Axios.get('/api/product/categories')
      if (response.status === 200) {
        setCategories(response.data.categories)
        return response.data.categories
      }
    } catch (err) {
      console.error(err)
    }
  }

  const getProductUnit = async () => {
    try {
      const response = await Axios.get('/api/product/units')
      if (response.status === 200) {
        setUnits(response.data.units)
        return response.data.units
      }
    } catch (err) {
      console.error(err)
    }
  }

  const [searchParams] = useSearchParams({
    tab: 'new-product'
  })

  useEffect(() => {
    if (!authenticated) {
      return
    }

    navigate(`/product/add-product?tab=${searchParams.get('tab')}`)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams])

  useEffect(() => {
    getProductCategories()
    getProductUnit()
  },[])

  return (
    <StyledDiv>
      <div className='rounded-md'>
        <div className='bg-white shadow-sm rounded-md p-2 md:flex md:flex-row justify-between'>
          <div className='pb-3 md:mb-0 mt-1'>
            <h1 className='text-primary font-bold text-[1.4rem]'>
              <Link className='hover:underline' to='/product'>
                จัดการสินค้า
              </Link>
              <Link> &gt; เพิ่มสินค้า</Link>
            </h1>
          </div>
        </div>
        <div className='mt-2 bg-white py-2 px-2 rounded-md'>
          <div className='flex gap-5'>
            <Link
              className={`py-2 ${
                searchParams.get('tab') === 'new-product' &&
                'border-b-4 border-[#4C49ED] text-primary'
              }`}
              to='/product/add-product?tab=new-product'
            >
              สินค้าใหม่
            </Link>
            <Link
              className={`py-2 ${
                searchParams.get('tab') === 'existing-product' &&
                'border-b-4 border-[#4C49ED] text-primary'
              }`}
              to='/product/add-product?tab=existing-product'
            >
              สินค้าเดิม
            </Link>
            <hr />
          </div>
        </div>
        <div className='mt-1 h-full'>
          {searchParams.get('tab') === 'new-product' && (
            <AddNewProduct categories={categories} units={units} />
          )}
          {searchParams.get('tab') === 'existing-product' && (
            <AddExistingProduct categories={categories} units={units} />
          )}
        </div>
      </div>
    </StyledDiv>
  )
}

export default AddProduct
