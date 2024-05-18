import Product from './Product'
import Scan from './Scan'
import Axios from '../../libs/Axios'
import { useEffect, useState } from 'react'
import { useAuth } from '../../contexts/AuthProvider'
import Swal from 'sweetalert2'
import StyledDiv from '../../components/styleDiv/StyledDiv'
import useBarcodeScanner from '../../libs/useBarcodeScanner'

function Sale () {
  document.title = 'ขายของหน้าร้าน 💸 POSYAYEE'

  const { authenticated } = useAuth()

  const [products, setProducts] = useState()
  const [categories, setCategories] = useState()
  const [carts, setCarts] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  const [discount, setDiscount] = useState([])

  const checkPromotion = existingProduct => {
    const newQuantity = existingProduct.quantity + 1

    if (
      existingProduct.promotion &&
      newQuantity % existingProduct.promotion.promo_prod_amount === 0
    ) {
      if (discount.length === 0) {
        const base_price =
          existingProduct.promotion.promo_prod_amount *
          existingProduct.prod_sale
        const promotion = existingProduct.promotion

        const newDiscount = [
          {
            base_price,
            prod_name: existingProduct.prod_name,
            prod_id: existingProduct.prod_id,
            promotion
          }
        ]

        setDiscount(newDiscount)
      } else {
        const base_price =
          existingProduct.promotion.promo_prod_amount *
          existingProduct.prod_sale
        const promotion = existingProduct.promotion
        discount.push({
          prod_name: existingProduct.prod_name,
          base_price,
          prod_id: existingProduct.prod_id,
          promotion
        })
      }
    }
  }

  // คัดลอกรายการสินค้าที่มีอยู่แล้วเข้าพร้อมตัวใหม่
  const onClickAddToCart = newProduct => {
    // ตรวจสอบว่าสินค้าที่จะเพิ่มเข้ามาในตะกร้ามีอยู่แล้วหรือไม่
    const existingProductIndex = carts.findIndex(
      product => product.prod_id === newProduct.prod_id
    )

    // สินค้ามีอยู่ในตะกร้าแล้ว
    if (existingProductIndex !== -1) {
      const updatedCarts = [...carts]
      const existingProduct = updatedCarts[existingProductIndex]

      checkPromotion(existingProduct)

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

  const handleBarcodeScan = barcode => {
    console.log(`Barcode : ${barcode}`)
    const scannedProduct = products.find(
      product => product.prod_barcode.trim() === barcode
    )

    if (scannedProduct) {
      console.log(`สินค้าคือ: 
       ${scannedProduct.prod_name}
       ${scannedProduct.prod_sale}`)
      onClickAddToCart(scannedProduct)
    } else {
      console.log('==== ไม่พบสินค้า! ====')
    }
  }

  useBarcodeScanner(handleBarcodeScan)

  return (
    <StyledDiv className='w-full flex gap-1'>
      <Product
        categories={categories}
        isLoading={isLoading}
        products={products}
        onClickAddToCart={onClickAddToCart}
        checkPromotion={checkPromotion}
      />
      <Scan
        carts={carts}
        setCarts={setCarts}
        discount={discount}
        setDiscount={setDiscount}
      />
    </StyledDiv>
  )
}

export default Sale
