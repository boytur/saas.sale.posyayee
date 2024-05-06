import { useState } from "react";
import styled from "styled-components";
import { AiFillPlusCircle } from "react-icons/ai";
import AllProduct from "./AllProduct";
import OutStock from "./OutStock";
import NewProduct from "./NewProduct";
import { IoPrint } from "react-icons/io5";
import { Link } from "react-router-dom";
import InActiveProduct from "./InActiveProduct";
import { useSearchParams } from "react-router-dom";

const StyledDiv = styled.div`
  height: calc(100vh - 5rem); /* Default height */
  @media (max-width: 640px) {
    height: calc(100vh - 8rem); /* Height when screen size is less than or equal to 640px */
  }
  overflow-y: scroll;
`;

function Product() {
  document.title = "จัดการสินค้า 💸 POSYAYEE";

  const [searchParams] = useSearchParams({ tab: 'show-all-products' });
  const initialTab = searchParams.get('tab');

  const [pageState, setPageState] = useState({
    showAllProduct: initialTab === 'show-all-products',
    showOutStock: initialTab === 'show-out-stock-products',
    showNewProduct: initialTab === 'show-new-products',
    showInActiveProduct: initialTab === 'show-in-active-products'
  });

  return (
    <StyledDiv className="w-full rounded-md">
      <div className="rounded-md">
        <div className="bg-white shadow-sm rounded-md p-2 md:flex md:flex-row justify-between">
          <div className="pb-3 md:mb-0 mt-1">
            <h1 className="text-primary font-bold text-[1.4rem]">จัดการสินค้า</h1>
          </div>
          <div className="flex gap-5 justify-between items-center ">
            <div className="flex flex-col justify-center items-center  hover:scale-105" >
              <IoPrint className="cursor-pointer" size={30} />
              <p className="text-[0.7rem] text-black/80">พิมพ์บาร์โค้ด</p>
            </div>
            <div>
              <Link to="/product/add-product" className="btn-primary py-3 flex gap-1 items-center px-3 ">
                <p className=" text-sm">เพิ่มสินค้า</p>
                <AiFillPlusCircle className="mt-[2px]" />
              </Link>
            </div>

          </div>
        </div>
        <div className="mt-2 bg-white rounded-md px-2">
          <div className="flex pt-4">
            <Link to="/product?tab=show-all-products"
              className={` py-2 ${pageState.showAllProduct ? 'border-b-4 border-[#4C49ED] text-primary' : ''}`}
              onClick={() => setPageState(prevState => ({ ...prevState, showAllProduct: true, showOutStock: false, showNewProduct: false, showInActiveProduct: false }))}>
              สินค้าทั้งหมด
            </Link>
            <Link to="/product?tab=show-out-stock-products"
              className={`mx-2 py-2 px-4  ${pageState.showOutStock ? 'border-b-4 border-[#4C49ED] text-primary' : ''}`}
              onClick={() => setPageState(prevState => ({ ...prevState, showAllProduct: false, showOutStock: true, showNewProduct: false, showInActiveProduct: false }))}>
              สินค้าใกล้หมด
            </Link>
            <Link to="/product?tab=show-new-products"
              className={`mx-2 py-2 px-4  ${pageState.showNewProduct ? 'border-b-4 border-[#4C49ED] text-primary' : ''}`}
              onClick={() => setPageState(prevState => ({ ...prevState, showAllProduct: false, showOutStock: false, showNewProduct: true, showInActiveProduct: false }))}>
              สินค้าใหม่
            </Link>
            <Link to="/product?tab=show-in-active-products"
              className={`mx-2 py-2 px-4  ${pageState.showInActiveProduct ? 'border-b-4 border-[#4C49ED] text-primary' : ''}`}
              onClick={() => setPageState(prevState => ({ ...prevState, showAllProduct: false, showOutStock: false, showNewProduct: false, showInActiveProduct: true }))}>
              สินค้าปิดใช้งาน
            </Link>
          </div>
          <hr />
        </div>
        {pageState.showAllProduct && <AllProduct />}
        {pageState.showOutStock && <OutStock />}
        {pageState.showNewProduct && <NewProduct />}
        {pageState.showInActiveProduct && <InActiveProduct />}
      </div>
    </StyledDiv>
  );
}

export default Product;
