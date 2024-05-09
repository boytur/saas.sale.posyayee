/* eslint-disable react/no-unescaped-entities */
import { FaPlusCircle } from "react-icons/fa";
import {
  Button,
  Dialog,
  DialogBody,
  DialogFooter,
} from "@material-tailwind/react";
import { useEffect, useState } from "react";

function Employee() {

  document.title = "พนักงาน 💸 การตั้งค่า";

  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(!open);

  const [payload, setPayload] = useState({
    'user_fname': '',
    'user_lname': '',
    'user_phone': '',
    'user_role': ''
  });

  useEffect(() => {
    console.log(payload);
  })
  return (
    <div className="w-full h-full px-4 bg-white rounded-md mb-32">

      <div>
        <Dialog   open={open} handler={handleOpen}>
          <div className=" font-bold text-primary p-4 text-[1.5rem] text-center px-4">
            <h1>เพิ่มพนักงาน</h1>
            <hr />
          </div>
          <DialogBody>
            <div className="mx-6 text-black">
              <div>
                <label htmlFor="" className=" text-sm ">ชื่อจริง</label>
                <input
                  onChange={(e) => setPayload(prve => ({ ...prve, user_fname: e.target.value }))}
                  value={payload.user_fname}
                  type="text"
                  className="input-primary"
                  placeholder="สมชาย" />
              </div>
              <div>
                <label htmlFor="" className=" text-sm">นามสกุล</label>
                <input
                  onChange={(e) => setPayload(prve => ({ ...prve, user_lname: e.target.value }))}
                  value={payload.user_lname}
                  type="text"
                  className="input-primary"
                  placeholder="สายเสมอ" />
              </div>
              <div>
                <label htmlFor="" className=" text-sm">เบอร์โทรศัพท์</label>
                <input
                  onChange={(e) => setPayload(prve => ({ ...prve, user_phone: e.target.value }))}
                  value={payload.user_phone}
                  type="text"
                  className="input-primary"
                  placeholder="09XXXXXXXX" />
              </div>
              <div>
                <label htmlFor="" className="text-sm">ตำแหน่ง</label>
                <select
                  onChange={(e) => setPayload(prve => ({ ...prve, user_role: e.target.value }))}
                  value={payload.user_role}
                  className="input-primary cursor-pointer"
                  name=""
                  id="">
                  <option value="manager">ผู้จัดการ</option>
                  <option value="employee">พนักงาน</option>
                </select>
              </div>
              <div>
                <p className="text-sm mt-4">- ตำแหน่ง "ผู้จัดการ" จะมีความสามารถเหมือนเจ้าของร้าน</p>
                <p className="text-sm mt-1">- รหัสผ่านผู้ใช้งานเริ่มต้นจะเป็น "เบอร์โทรศัพท์" และสามารถแก้ไขภายหลังได้</p>
              </div>
            </div>
          </DialogBody>
          <DialogFooter>
            <Button
              variant="text"
              color="red"
              onClick={handleOpen}
              className="mr-1"
            >
              <span>ยกเลิก</span>
            </Button>
            <button className="btn-primary p-[7px] px-6" onClick={handleOpen}>
              <span>ยืนยัน</span>
            </button>
          </DialogFooter>
        </Dialog>
      </div>

      <div className="w-full">
        <h1 className="text-[2rem] font-bold text-black mb-2">พนักงาน</h1>
        <hr />
        <div className="w-full mt-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-black">พนักงานทั้งหมด 1 คน (รวมเจ้าของ)</h1>
            </div>
            <button onClick={() => setOpen(true)} className="btn-primary p-2 hidden md:flex items-center gap-2">
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
          <button onClick={handleOpen} className="btn-primary flex gap-2 items-center md:hidden p-2 w-full justify-center mt-6">
            <h1 className="text-white">เพิ่มพนักงาน</h1>
            <FaPlusCircle />
          </button>
        </div>
      </div>
    </div>
  )
}

export default Employee