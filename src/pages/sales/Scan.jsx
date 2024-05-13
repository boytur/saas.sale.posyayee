/* eslint-disable react/prop-types */
import { RiDeleteBin5Line } from "react-icons/ri";
import { CiCircleMinus, CiCirclePlus } from "react-icons/ci";
import { MdShoppingCart } from "react-icons/md";
import { useEffect } from "react";
// eslint-disable-next-line react/prop-types
function Scan({ carts, setCarts }) {

    const incrementQuantity = (prod_id) => {
        const existingProductIndex = carts.findIndex(product => product.prod_id === prod_id);
        const updatedCarts = [...carts];
        updatedCarts[existingProductIndex].quantity += 1;
        setCarts(updatedCarts);

    };

    const decrementQuantity = (prod_id) => {
        const existingProductIndex = carts.findIndex(product => product.prod_id === prod_id);
        const updatedCarts = [...carts];
        updatedCarts[existingProductIndex].quantity -= 1;
        setCarts(updatedCarts);
    };

    const deleteProductFromCart = (prod_id) => {
        const indexToDelete = carts.findIndex((prod) => prod.prod_id === prod_id);
        if (indexToDelete !== -1) {
            // eslint-disable-next-line no-unused-vars
            const deletedItem = carts[indexToDelete];
            const updatedItems = [...carts];
            updatedItems.splice(indexToDelete, 1);
            setCarts(updatedItems);
        }
    }
    let totalPrice = carts.reduce(
        (total, item) => total + item.prod_sale * item.quantity,
        0
    );

    useEffect(() => {
        function handleKeyDown(event) {
            // เช็คว่าถ้ากดปุ่ม F12
            if (event.keyCode === 107 || event.key === '=' || event.key === 'ช') {
                // เรียกฟังก์ชันที่เปิด Popup หรือทำสิ่งที่คุณต้องการทำ
                console.log("F12");
            }
        }
        // เพิ่ม event listener เมื่อคอมโพเนนต์ถูก mount
        window.addEventListener('keydown', handleKeyDown);

        // คืนค่าฟังก์ชันที่ใช้ในการลบ event listener เมื่อคอมโพเนนต์ถูก unmount
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        }
    }, [])


    return (
        <>
            <div className="lg:hidden absolute bottom-24 right-7">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-200 to-purple-200 rounded-full filter blur-[20px]"></div>
                <div className="relative bg-white p-2 rounded-full">
                    <div>
                        <MdShoppingCart size={50} />
                    </div>
                    <div className="absolute bg-red-500 w-7 h-7 flex items-center justify-center rounded-full right-10 top-0 text-white">
                        <p>{carts?.length}</p></div>
                </div>
            </div>
            <div className="w-full hidden lg:block h-full">
                <div className="w-full h-full bg-white rounded-md">
                    <table className="w-full border-collapse mb-1">
                        <thead>
                            <tr>
                                <th style={{ width: "40%" }} className="py-2 px-4 bg-gray-100 rounded-tl-md">ชื่อ</th>
                                <th style={{ width: "24%" }} className="py-2 px-4 bg-gray-100">ราคา</th>
                                <th style={{ width: "18%" }} className="py-2 px-4 bg-gray-100">จำนวน</th>
                                <th style={{ width: "18%" }} className="py-2 px-4 bg-gray-100">ลบ</th>
                            </tr>
                        </thead>
                    </table>
                    <div
                        className="overflow-y-scroll w-full"
                        style={{ height: "calc(100vh - 18.2rem)" }}
                    >
                        <tbody className="overflow-y-scroll w-full pb-6">
                            {carts?.map((prod) => (
                                <tr key={prod.prod_id} className="text-center cursor-pointer hover:bg-[#e4e3ff42]">
                                    <td style={{ width: "40%" }} className="py-1 px-4 text-left border-b-[1px]">
                                        <div className="flex items-center gap-2 w-full">
                                            <img className="w-12 h-12 rounded-sm" src="https://image.posyayee.shop/placeholder.png" alt="" />
                                            <p style={{ maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{prod.prod_name}</p>
                                        </div>
                                    </td>
                                    <td style={{ width: "25%" }} className="py-2 px-4 border-b-[1px]">
                                        <h1 className="text-primary font-bold text-[1.2rem]">฿{(prod.prod_sale).toFixed(2)}</h1>
                                    </td>
                                    <td style={{ width: "16%" }} className="py-2 px-4 border-b-[1px]">
                                        <div className='flex items-center gap-2 justify-center'>
                                            <button className='p-1 px-[10px] rounded-lg border-[1px] hover:scale-105 hover:bg-[#E4E3FF] hover:text-primary'
                                                onClick={() => decrementQuantity(prod.prod_id)}>
                                                <CiCircleMinus size={20} />
                                            </button>
                                            <span>{prod.quantity}</span>
                                            <button className='p-1 px-[10px] rounded-lg border-[1px] hover:scale-105 hover:bg-[#E4E3FF] hover:text-primary'
                                                onClick={() => incrementQuantity(prod.prod_id)}>
                                                <CiCirclePlus size={20} />
                                            </button>
                                        </div>
                                    </td>
                                    <td style={{ width: "15%" }} className="py-2 px-4 border-b-[1px]">
                                        <div className="flex justify-center items-center">
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
                    <div className="bg-gray-100">
                        <div className="flex justify-between mx-6 items-center mt-2">
                            <h1>ราคาสินค้า</h1>
                            <h1 className="">{totalPrice.toLocaleString("en-US")}</h1>
                        </div>
                        <div className="flex justify-between mx-6 items-center">
                            <h1>ส่วนลด</h1>
                            <h1 className="">00.00</h1>
                        </div>
                        <div className="flex justify-between mx-6 items-center">
                            <h1>ราคารวม</h1>
                            <h1 className="text-[2.5rem] font-bold text-primary">{totalPrice.toLocaleString("en-US")}</h1>
                        </div>
                    </div>
                    <div className="flex gap-2 justify-between w-full">
                        <div className="w-full">
                            <button className="btn-warnning w-full py-4">ยกเลิก (-)</button>
                        </div>
                        <div className="w-full">
                            <button className="btn-primary w-full py-4 text-[1rem]">จ่าย (+)</button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Scan;