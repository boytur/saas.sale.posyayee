import { useState } from "react";
import styled from "styled-components";
import { AiFillPlusCircle } from "react-icons/ai";
import AllProduct from "./AllProduct";
import OutStock from "./OutStock";
import NewProduct from "./NewProduct";
import { IoPrint } from "react-icons/io5";

const StyledDiv = styled.div`
  height: calc(100vh - 5rem); /* Default height */
  @media (max-width: 640px) {
    height: calc(100vh - 8rem); /* Height when screen size is less than or equal to 640px */
  }
  overflow-y: scroll;
`;

function Product() {
  document.title = "จัดการสินค้า 💸 POSYAYEE";

  const [pageState, setPageState] = useState({
    showAllProduct: true,
    showOutStock: false,
    showNewProduct: false
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
              <button className="btn-primary py-3 flex gap-1 items-center px-3 ">
                <p className=" text-sm">เพิ่มสินค้า</p>
                <AiFillPlusCircle className="mt-[2px]" />
              </button>
            </div>
            
          </div>
        </div>
        <div className="mt-2 bg-white rounded-md px-2">
          <div className="flex pt-4">
            <button
              className={` py-2 ${pageState.showAllProduct ? 'border-b-4 border-[#4C49ED]' : ''}`}
              onClick={() => setPageState(prevState => ({ ...prevState, showAllProduct: true, showOutStock: false, showNewProduct: false }))}>
              สินค้าทั้งหมด
            </button>
            <button
              className={`mx-2 py-2 px-4  ${pageState.showOutStock ? 'border-b-4 border-[#4C49ED]' : ''}`}
              onClick={() => setPageState(prevState => ({ ...prevState, showAllProduct: false, showOutStock: true, showNewProduct: false }))}>
              สินค้าใกล้หมด
            </button>
            <button
              className={`mx-2 py-2 px-4  ${pageState.showNewProduct ? 'border-b-4 border-[#4C49ED]' : ''}`}
              onClick={() => setPageState(prevState => ({ ...prevState, showAllProduct: false, showOutStock: false, showNewProduct: true }))}>
              สินค้าใหม่
            </button>
          </div>
          <hr />
        </div>
        {pageState.showAllProduct && <AllProduct />}
        {pageState.showOutStock && <OutStock />}
        {pageState.showNewProduct && <NewProduct />}
      </div>
    </StyledDiv>
  );
}

export default Product;
