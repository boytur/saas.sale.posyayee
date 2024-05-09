import Swal from "sweetalert2";
import Axios from "../../../libs/Axios";
import Permission from "../../../libs/Permission";
import { useEffect, useState } from "react";
import Pagination from "../../../components/pagination/Pagination";
import GetOrderCheckoutPage from "../../../libs/getOrderCheckoutPage";


function Payment() {

  document.title = "ค่าใช้จ่าย 💸 การตั้งค่า";

  const [pageState, setPageState] = useState({
    'isLoading': false,
    'data': [],
    'total': 0,
    'page': 1,
    'pageSize': 10
  });

  const totalPages = Math.ceil(pageState.total / pageState.pageSize);

  const [openOrder, setOpenOrder] = useState(null);

  const fetchPayments = async () => {
    try {
      const permission = new Permission();
      if (permission.canGetOrderOpenOrder()) {

        setPageState((prev) => ({
          ...prev,
          isLoading: true,
        }));

        const response = await Axios.get('/api/payment/get-order', {
          params: {
            page: pageState.page,
            perPage: pageState.pageSize,
          },
        });

        if (response.status === 200) {
          setPageState((prev) => ({
            ...prev,
            isLoading: false,
            data: response.data.order,
            total: response.data.total
          }));
          setOpenOrder(response.data.order.filter(order => order.order_status === "open"));
        }
      }
    }
    catch (err) {
      console.log(err);
      Swal.fire({
        'title': 'เกิดข้อผิดพลาด',
        'icon': "error",
        'text': err?.response?.data?.message
      });
    }
  }

  useEffect(() => {
    fetchPayments();
  }, []);


  return (
    <div className="w-full h-full px-4 bg-white rounded-md mb-32">
      <div className="w-full">
        <h1 className="text-[2rem] font-bold text-gray-700 mb-2">ค่าใช้จ่าย</h1>
        <hr />
      </div>
      {pageState.isLoading &&
        <div className="w-full flex justify-center mt-12">
          <div className="loader"></div>
        </div>
      }
      <div className="w-full mt-6">
        <div>
          <p className="mb-2">ค่าใช้จ่ายรอชำระ</p>
          {openOrder?.length > 0 && !pageState.isLoading ? (
            <div className="w-full rounded-md overflow-x-scroll">
              <table className="w-full border">
                <tr className="bg-gray-200 text-[0.7rem]">
                  <th className="py-2 px-4">หมายเลขออเดอร์</th>
                  <th className="py-2 px-4">ชื่อออเดอร์</th>
                  <th className="py-2 px-4">โน็ต</th>
                  <th className="py-2 px-4">ราคา</th>
                  <th className="py-2 px-4">สถานะ</th>
                  <th className="py-2 px-4">การกระทำ</th>
                </tr>
                {openOrder?.map((order) => (
                  <tr className="border-t text-sm md:text-lg hover:bg-[#f5f5ff] text-center cursor-pointer" key={order.order_id}>
                    <td className="py-2 px-4">{order.order_no}</td>
                    <td className="py-2 px-4">{order.order_title}</td>
                    <td className="py-2 px-4">{order.order_note}</td>
                    <td className="py-2 px-4">฿{(order.order_price).toFixed(2)}</td>
                    <td className="py-2 px-4">
                      {order.order_status === "open" ? (
                        <div className="bg-yellow-800/20 rounded-full text-black text-sm p-1 px-4">
                          <p>ค้างชำระ</p>
                        </div>
                      ) : (
                        ""
                      )}
                    </td>
                    <td className="py-2 px-4">
                      <button onClick={() => GetOrderCheckoutPage(order.order_id)} className="btn-primary text-sm p-2">ชำระเงิน</button>
                    </td>
                  </tr>
                ))}
              </table>
            </div>
          ) : (
            <p className="text-center text-gray-500">ไม่มีรายการค้างชำระ</p>
          )}
        </div>

        <div className="mt-8">
          <p className="mb-2">ประวัติการชำระเงิน</p>
          {!pageState.isLoading && ((pageState.data).filter(order => order.order_status === "complete").length > 0) ?

            <div className="w-full rounded-md overflow-x-scroll">
              <table className="w-full border">
                <tr className="bg-gray-200 text-[0.7rem]">
                  <th className="py-2 px-4">หมายเลขออเดอร์</th>
                  <th className="py-2 px-4">ชื่อออเดอร์</th>
                  <th className="py-2 px-4">โน็ต</th>
                  <th className="py-2 px-4">ราคา</th>
                  <th className="py-2 px-4">สถานะ</th>
                </tr>
                {pageState?.data
                  ?.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                  .filter(order => order.order_status !== "open")
                  .map(order => (
                    <tr className="border-t text-sm md:text-lg text-center hover:bg-[#f5f5ff]" key={order.order_id}>
                      <td className="py-2 px-4">{order.order_no}</td>
                      <td className="py-2 px-4">{order.order_title}</td>
                      <td className="py-2 px-4">{order.order_note}</td>
                      <td className="py-2 px-4">฿{(order.order_price).toFixed(2)}</td>
                      <td className="py-2 px-4">
                        {order.order_status === "open" ? (
                          <div className="bg-yellow-800 rounded-md text-white  p-1">
                            <p>ค้างชำระ</p>
                          </div>
                        ) : (
                          <div className="bg-green-500/30 rounded-full text-black text-sm p-1">
                            <p>ชำระแล้ว</p>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
              </table>
            </div>
            : <p className="text-center text-gray-500">ไม่มีประวัติการชำระเงิน</p>}
        </div>

        {((pageState.data).filter(order => order.order_status === "complete").length > 0) &&
          <Pagination
            totalPages={totalPages}
            pageState={pageState}
            setPageState={setPageState}
            lable={`ประวัติการชำระเงินทั้งหมด ${(pageState.data).filter(order => order.order_status === "complete")?.length} รายการ`}
          />
        }

      </div>
    </div>
  )
}

export default Payment;
