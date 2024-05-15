import Product from './Product'
import Scan from './Scan'
import Axios from '../../libs/Axios'
import { useEffect, useState } from 'react'
import { useAuth } from '../../contexts/AuthProvider'
import Swal from 'sweetalert2'
import StyledDiv from '../../components/styleDiv/StyledDiv'

function Sale () {
  document.title = 'ขายของหน้าร้าน 💸 POSYAYEE'

  const { authenticated } = useAuth()

  const [products, setProducts] = useState()
  const [categories, setCategories] = useState()
  const [carts, setCarts] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  // คัดลอกรายการสินค้าที่มีอยู่แล้วเข้าพร้อมตัวใหม่
  const onClickAddToCart = newProduct => {
    // ตรวจสอบว่าสินค้าที่จะเพิ่มเข้ามาในตะกร้ามีอยู่แล้วหรือไม่
    const existingProductIndex = carts.findIndex(
      product => product.prod_id === newProduct.prod_id
    )

    if (existingProductIndex !== -1) {
      // ถ้ามีสินค้าที่มีอยู่แล้วในตะกร้า ให้ปรับปรุงจำนวนสินค้าในตะกร้า
      const updatedCarts = [...carts]
      updatedCarts[existingProductIndex].quantity += 1
      setCarts(updatedCarts)
    } else {
      setCarts([...carts, { ...newProduct, quantity: 1 }])
    }
  }

  const fecthAllProducts = async () => {
    try {
      setIsLoading(true)
      const response = await Axios.get(`/api/product/all-products`)
      if (response.status === 200) {
        setProducts(response.data.products)
        setCategories(response.data.categories)
        setIsLoading(false)
      }
    } catch (e) {
      setIsLoading(false)
      Swal.fire({
        title: 'เกิดข้อผิดพลาด',
        icon: 'error',
        text: e?.response?.data?.message
      })
    }
  }

  useEffect(() => {
    if (!authenticated) {
      return
    }
    fecthAllProducts()
  }, [authenticated])

  return (
    <StyledDiv className='w-full flex gap-1'>
      <Product
        categories={categories}
        isLoading={isLoading}
        products={products}
        onClickAddToCart={onClickAddToCart}
      />
      <Scan carts={carts} setCarts={setCarts} />
    </StyledDiv>
  )
}

export default Sale
