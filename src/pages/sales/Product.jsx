import { CiSearch } from "react-icons/ci";
/* eslint-disable react/prop-types */
function Product({ products }) {

  let productNobarcode = products?.filter((p) => p.prod_barcode === "1234567890123");

  return (
    <div className="w-full h-full rounded-md p-1 bg-white">
      <div className="h-full overflow-auto flex justify-evenly flex-wrap gap-2">
        <div className="w-full">
          <div className="flex gap-2 mx-2">
            <div className="w-full">
              <label className="text-[0.7rem]  ml-1 text-gray-500" htmlFor="">ค้นหาสินค้า</label>
              <div className="relative flex items-center w-full">
                <input
                  placeholder="กรอกรายละเอียด....."
                  className="input-primary md:text-lg text-[0.8rem] w-full md:h-[3rem] mb-2 rounded-lg px-2 md:pl-12 pl-6">
                </input>
                <CiSearch className=" absolute md:pl-3 text-[1.3rem] md:text-[2.5rem] pl-2 mb-2" />
              </div>
            </div>

            {/* categories */}
            <div className="w-2/4 ">
              <label className="text-[0.7rem]  ml-1 text-gray-500" htmlFor="">ค้นหาจาก</label>
              <select className="input-primary md:h-[3rem] text-[0.8rem] md:text-[1rem] cursor-pointer">
                <option value="">ชื่อ</option>
                <option value="">บาร์โค้ด</option>
                <option value="">ราคา</option>
              </select>
            </div>

            {/* sort */}
            <div className="w-2/4 ">
              <label className="text-[0.7rem]  ml-1 text-gray-500" htmlFor="">ประเภท</label>
              <select className="input-primary md:h-[3rem] text-[0.8rem] md:text-[1rem] cursor-pointer">
                <option>ประเภท</option>
                <option value="">1</option>
                <option value="">3</option>
              </select>
            </div>

          </div>
        </div>
        {productNobarcode?.map((product) => (
          <div key={product.prod_id} className="md:w-[8rem] md:-[10rem] h-[10rem] w-[10rem] items-center md:flex md:flex-col rounded-md p-1 bg-white cursor-pointer shadow-md hover:border-primary border-[2px]">
            <div className="md:w-full h-[5rem]">
              <img src={product.prod_image} alt={product.prod_name} className="w-full h-full object-cover" />
            </div>
            <div className="w-full mt-2 px-1 truncate ">
              {product.prod_name}
            </div>
            <div className="w-full md:block mt-1 px-1 text-[1.2rem] font-bold text-primary">
              ฿{product.prod_sale.toFixed(2)}
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}

export default Product;
