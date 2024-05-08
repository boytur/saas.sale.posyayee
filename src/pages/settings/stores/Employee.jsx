import { FaPlusCircle } from "react-icons/fa";

function Employee() {

  document.title = "พนักงาน 💸 การตั้งค่า";

  return (
    <div className="w-full h-full px-4 bg-white rounded-md mb-32">
      <div className="w-full">
        <h1 className="text-[2rem] font-bold text-gray-700 mb-2">พนักงาน</h1>
        <hr />
        <div className="w-full mt-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-black">พนักงานทั้งหมด 1 คน (รวมเจ้าของ)</h1>
            </div>
            <button className="btn-primary p-2 hidden md:flex items-center gap-2">
              <h1 className="text-white">เพิ่มพนักงาน</h1>
              <FaPlusCircle />
            </button>
          </div>
          <div className="w-full mt-3 flex gap-3 items-center">
            <div>
              <img className="w-[4rem] h-[4rem] rounded-full" src="https://cwdaust.com.au/wpress/wp-content/uploads/2015/04/placeholder-store.png" alt="" />
            </div>
            <div>
              <h1 className="text-primary font-bold text-[2rem]">ปิยะวัฒน์ วงค์ญาติ</h1>
              <p className="text-black/70 text-sm">เจ้าของร้าน</p>
            </div>
          </div>
          <button className="btn-primary flex items-center md:hidden p-2 w-full justify-center mt-6"> 
            <h1 className="text-white">เพิ่มพนักงาน</h1>
            <FaPlusCircle />
          </button>
        </div>
      </div>
    </div>
  )
}

export default Employee