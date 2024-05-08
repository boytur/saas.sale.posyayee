import { useState, useEffect, useRef } from "react";
import { IoSearch } from "react-icons/io5";
import Swal from "sweetalert2";
import { useAuth } from "../../contexts/AuthProvider";
import Permission from "../../libs/Permission";
import Axios from "../../libs/Axios";
import { MdOutlineNavigateNext } from "react-icons/md";
import { MdOutlineNavigateBefore } from "react-icons/md";
import { LuPencilLine } from "react-icons/lu";
import { RiDeleteBin5Line } from "react-icons/ri";
import Barcode from 'react-barcode';
import { Link } from "react-router-dom";
import formatUTCtoThai from "../../libs/formatUTCtoThai";

function AllProduct() {
    const { authenticated } = useAuth();
    const permission = new Permission();

    const [pageState, setPageState] = useState({
        data: [],
        category: [],
        page: 1,
        pageSize: 10,
        total: 0,
        loading: false,
    });

    useEffect(() => {
        fetchProducts();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pageState.page, pageState.pageSize, authenticated]);

    const fetchProducts = async () => {
        try {
            setPageState((prev) => ({
                ...prev,
                loading: true,
            }));

            if (authenticated && permission.canViewProduct()) {
                const response = await Axios.get("/api/product/products", {
                    params: {
                        page: pageState.page,
                        perPage: pageState.pageSize,
                    },
                });
                if (response.status === 200) {
                    setPageState((prev) => ({
                        ...prev,
                        data: response.data.products,
                        category: response.data.category,
                        total: response.data.total,
                        loading: false,
                    }));
                }
            }
        } catch (error) {
            console.error(error);
            setPageState((prev) => ({
                ...prev,
                loading: false,
            }));
            Swal.fire({
                icon: "error",
                title: "เกิดข้อผิดพลาด",
                text: error?.response?.data?.message || "เกิดข้อผิดพลาดในการดึงข้อมูลสินค้า",
            });
        }
    };

    const totalPages = Math.ceil(pageState.total / pageState.pageSize);

    const handlePageSizeChange = (event) => {
        const newSize = parseInt(event.target.value);
        setPageState((prevState) => ({ ...prevState, pageSize: newSize }));
    };

    const [selectedItems, setSelectedItems] = useState([]);
    const [selectAll, setSelectAll] = useState(false);

    const toggleItem = (index) => {
        const selectedIndex = selectedItems.indexOf(index);
        if (selectedIndex === -1) {
            setSelectedItems([...selectedItems, index]);
        } else {
            const updatedSelectedItems = [...selectedItems];
            updatedSelectedItems.splice(selectedIndex, 1);
            setSelectedItems(updatedSelectedItems);
        }
    };

    const toggleSelectAll = () => {
        if (selectAll) {
            setSelectedItems([]);
        } else {
            const allIndices = Array.from({ length: pageState.data.length }, (_, i) => i);
            setSelectedItems(allIndices);
        }
        setSelectAll(!selectAll);
    };

    const selectAllRef = useRef();

    useEffect(() => {
        selectAllRef.current.indeterminate = selectedItems.length > 0 && selectedItems.length < pageState.data.length;
    }, [selectedItems, pageState.data.length]);

    return (
        <>

            <>
                <div className="md:flex justify-between  rounded-t-lg bg-white">
                    <div className="md:flex my-6 items-center mx-2">
                        <div className="md:px-2 w-full md:w-[23rem] ">
                            <label htmlFor="" className="text-[0.7rem] text-black/80 ml-1">ค้นหา</label>
                            <input type="text" placeholder="กรอกรายละเอียด..." className="input-primary " name="" id="" />
                        </div>
                        <div className="flex flex-col md:mr-2">
                            <label htmlFor="" className="text-[0.7rem] text-black/80 ml-1 mt-1">ประเภท</label>
                            <select name="" className="md:w-[8rem] w-full input-primary cursor-pointer" id="">
                                <option value="">ทั้งหมด</option>
                                {pageState?.category?.map((category) =>
                                    <option key={category.cat_id} value={category.cat_id}>{category.cat_name}</option>
                                )}
                            </select>
                        </div>
                        <div className="flex flex-col md:mr-2">
                            <label htmlFor="" className="text-[0.7rem] text-black/80 md:ml-1 mt-1">ค้นหาด้วย</label>
                            <select name="" className="input-primary cursor-pointer" id="">
                                <option value="">ทั้งหมด</option>
                                <option value="">ชื่อ</option>
                                <option value="">บาร์โค้ด</option>
                                <option value="">ราคาซื้อ</option>
                                <option value="">ราคาขาย	</option>
                                <option value="">คงเหลือ</option>
                            </select>
                        </div>
                        <div className="flex flex-col md:mr-2">
                            <label htmlFor="" className="text-[0.7rem] text-black/80 ml-1 mt-1">เรียงจาก</label>
                            <select name="" className="input-primary cursor-pointer" id="">
                                <option value="">ทั้งหมด</option>
                                <option value="">มากไปน้อย</option>
                                <option value="">น้อยไปมาก</option>
                            </select>
                        </div>

                        <div className="">
                            <label htmlFor="" className="text-white">.</label>
                            <button className="btn-primary w-full justify-center py-[7px] mb-1 px-5 flex items-center gap-1">
                                <p>ค้นหา</p>
                                <IoSearch className="mt-[1px]" />
                            </button>
                        </div>
                    </div>
                    <div className="flex gap-3 items-center md:w-1/4 w-full justify-end pr-2">
                        {selectedItems.length !== 0 &&
                            <div>
                                <RiDeleteBin5Line className="hover:scale-110 cursor-pointer  text-red-500" size={30} />
                            </div>
                        }
                        <div className="flex items-center my-2">
                            <label htmlFor="pageSizeSelect" className="mr-3 text-sm">แสดง:</label>
                            <select id="pageSizeSelect"
                                onChange={handlePageSizeChange} value={pageState.pageSize}
                                className="border border-gray-300 rounded-md py-2  cursor-pointer input-primary">
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
                <div className="w-full overflow-x-scroll">
                    <table className="w-full border-collapse">
                        <thead className="h-[3rem] rounded-t-md">
                            <tr className="bg-gray-100 text-sm md:text-md">
                                <th className="px-3 rounded-tl-lg">
                                    <input type="checkbox" className="cursor-pointer md:w-4 md:h-4" checked={selectAll} onChange={toggleSelectAll} ref={selectAllRef} />
                                </th>
                                <th className="rounded-tl-lg">ลำดับ</th>
                                <th className="w-[50px] h-[50px]">รูปภาพ</th>
                                <th>ชื่อ</th>
                                <th>บาร์โค้ด</th>
                                <th>ประเภท</th>
                                <th>สถานะ</th>
                                <th>ต้นทุน</th>
                                <th>ราคาขาย</th>
                                <th>คงเหลือ</th>
                                <th>เพิ่มเมื่อ</th>
                                <th className="rounded-tr-lg">การกระทำ</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white">
                            {pageState?.data?.map((product, index) => (
                                <tr key={index} className="hover:bg-[#f5f5ff] border-b-[1px] text-center cursor-pointer">
                                    <td className="px-3 py-1">
                                        <input type="checkbox" className="md:w-4 md:h-4 cursor-pointer" checked={selectedItems.includes(index)} onChange={() => toggleItem(index)} />
                                    </td>
                                    <td className="px-3 py-1">{index + 1}</td>
                                    <td className="px-3 py-1">
                                        <div className="flex justify-center w-[50px] h-[50px] items-center">
                                            <img src={product.prod_image} alt="product" className="w-[50px] h-[50px] rounded-sm object-cover" />
                                        </div>
                                    </td>
                                    <td className="px-3 py-1 truncate">{product.prod_name}</td>
                                    <td className="px-3 py-1 ">
                                        <div className="flex justify-center items-center z-0">
                                            {product.prod_barcode !== "" ?
                                                <Barcode className="w-[90px] h-[50px]" value={product.prod_barcode.toString()} />
                                                : <div className="text-black/70 text-sm">ไม่มี</div>
                                            }
                                        </div>
                                    </td>
                                    <td className="px-3 py-1">{product?.category?.cat_name}</td>
                                    <td className="px-3 py-1">
                                        <div className="toggle-switch">
                                            <input type="checkbox" id="statusToggle" className="toggle-input" checked={product?.prod_status === 'active'} />
                                            <label htmlFor="statusToggle" className="toggle-label"></label>
                                        </div>
                                    </td>

                                    <td className="px-3 text-lg py-1 font-bold text-[#4C49ED]">฿{product.prod_cost}</td>
                                    <td className="px-3 text-lg py-1 font-bold text-green-600">฿{product.prod_sale}</td>
                                    <td className="px-3 text-lg py-1">{product.prod_quantity} ({product?.product_unit?.unit_name})</td>
                                    <td className="px-3 text-sm py-1">{formatUTCtoThai(product?.createdAt)}</td>
                                    <td className="px-3 py-1 ">
                                        <div className="flex justify-center gap-2 items-center rounded-md">
                                            <div className="border p-1 rounded-md flex items-center justify-center">
                                                <LuPencilLine className="hover:scale-110 pb-1 text-black/70 hover:text-[#4C49ED]" size={25} />
                                            </div>
                                            |
                                            <div className="border p-1 rounded-md flex items-center justify-center">
                                                <RiDeleteBin5Line className="hover:scale-110 pb-1 text-black/70 hover:text-red-500" size={25} />
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {pageState.total > 0 && !pageState.loading ?

                    <div className="mt-4 flex flex-col gap-2 justify-center items-center pb-12">
                        <div className="mt-2">
                            สินค้าทั้งหมด {pageState.total} อย่าง
                        </div>
                        <div className="mb-12">
                            <button
                                onClick={() => setPageState((prevState) => ({ ...prevState, page: Math.max(1, prevState.page - 1) }))}
                                disabled={pageState.page === 1}
                                className="font-bold py-2 px-3 rounded-md border">
                                <MdOutlineNavigateBefore />
                            </button>
                            <span className="ml-2">
                                {Array.from({ length: Math.min(6, totalPages) }, (_, i) => {
                                    const pageNumber = i + 1;
                                    return (
                                        <button
                                            key={pageNumber}
                                            onClick={() => setPageState((prevState) => ({ ...prevState, page: pageNumber }))}
                                            className={`py-2 px-3 rounded-md border ${pageNumber === pageState.page ? 'bg-[#E4E3FF] text-primary' : ''}`}>
                                            {pageNumber}
                                        </button>
                                    );
                                })}
                                {totalPages > 6 && <span className="py-2 px-3">...</span>}
                            </span>
                            <button
                                onClick={() =>
                                    setPageState((prevState) => ({ ...prevState, page: Math.min(totalPages, prevState.page + 1) }))
                                }
                                disabled={pageState.page === totalPages}
                                className="font-bold py-2 px-3 rounded-md ml-2 border">
                                <MdOutlineNavigateNext />
                            </button>
                        </div>
                    </div>
                    :
                    <div className="w-full flex flex-col items-center mt-5 justify-center">
                        {pageState.loading ?
                            <div className="flex justify-center mt-12">
                                <div className="loader w-full"></div>
                            </div>
                            :
                            <>
                                <p>ร้านของคุณยังไม่มีสินค้าค่ะ</p>
                                <Link className="mt-5 underline text-red-500" to="/product/add-product">เพิ่มสินค้า</Link>
                            </>
                        }
                    </div>
                }
            </>
        </>
    )
}

export default AllProduct