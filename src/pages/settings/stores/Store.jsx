import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Profile from "./Profile";
import Payment from "./Payment";
import { useLocation } from "react-router";
import Product from "./Product";
import Package from "./Package";
import Bill from "./Bill";
import { CiSettings } from "react-icons/ci";
import { CiBoxes } from "react-icons/ci";
import { CiReceipt } from "react-icons/ci";
import { CiCreditCard1 } from "react-icons/ci";
import { CiWallet } from "react-icons/ci";
import Employee from "./Employee";
import { IoPersonAddOutline } from "react-icons/io5";

function Store() {

  const location = useLocation();
  const [highlightedSection, setHighlightedSection] = useState("");

  useEffect(() => {

    const hashValue = location.hash.substr(1);
    if (hashValue) {
      setHighlightedSection(hashValue);
    }
  }, [location.hash]);

  return (
    <div>
      <div className="flex justify-center w-full">
        <div style={{ height: "calc(100vh - 5rem)" }} className="md:flex md:flex-row flex flex-col rounded-md w-full ">
          <div className="bg-white md:w-[17rem]  px-4 rounded-md">
            <h1 className="text-primary text-[1.5rem] font-bold text-center my-6">ตั้งค่าร้านค้า</h1>
            <ul className="py-4">
              <li className={`cursor-pointer py-2 px-2 flex items-center gap-2 ${highlightedSection === "profile" || highlightedSection === "" ? "bg-[#E4E3FF] text-primary rounded-md" : ""}`} onClick={() => setHighlightedSection("profile")}>
                <CiSettings size={30} />
                <Link className="w-full h-full text-lg" to="#profile">โปรไฟล์ร้าน</Link>
              </li>
              <li className={`py-2 px-2 cursor-pointer flex items-center gap-2 mt-2 ${highlightedSection === "employee" ? "bg-[#E4E3FF] text-primary rounded-md" : ""}`} onClick={() => setHighlightedSection("employee")}>
                <IoPersonAddOutline size={27} />
                <Link className="w-full h-full text-lg" to="#employee">พนักงาน</Link>
              </li>
              <li className={`py-2 px-2 cursor-pointer flex items-center gap-2 mt-2 ${highlightedSection === "product" ? "bg-[#E4E3FF] text-primary rounded-md" : ""}`} onClick={() => setHighlightedSection("product")}>
                <CiBoxes size={30} />
                <Link className="w-full h-full text-lg" to="#product">สินค้า</Link>
              </li>
              <li className={`py-2 px-2 cursor-pointer flex items-center gap-2 mt-2 ${highlightedSection === "bill" ? "bg-[#E4E3FF] text-primary rounded-md" : ""}`} onClick={() => setHighlightedSection("bill")}>
                <CiReceipt size={30} />
                <Link className="w-full h-full text-lg" to="#bill">ใบเสร็จ</Link>
              </li>
              <li className={`py-2 px-2 cursor-pointer flex items-center gap-2 mt-2 ${highlightedSection === "payment" ? "bg-[#E4E3FF] text-primary rounded-md" : ""}`} onClick={() => setHighlightedSection("payment")}>
                <CiCreditCard1 size={30} />
                <Link className="w-full h-full text-lg" to="#payment">ค่าใช้จ่าย</Link>
              </li>
              <li className={`py-2 px-2 cursor-pointer flex items-center gap-2 mt-2 ${highlightedSection === "package" ? "bg-[#E4E3FF] text-primary rounded-md" : ""}`} onClick={() => setHighlightedSection("package")}>
                <CiWallet size={28} />
                <Link className="w-full h-full text-lg" to="#package">แพ็คเกจ</Link>
              </li>
            </ul>
          </div>

          <div className="w-full h-full mx-1">
            <div className="flex w-full h-full bg-white rounded-md">
              <div className="w-full h-full ">
                {
                  highlightedSection === "profile" &&
                  <section id="profile" className="py-4 w-full h-full">
                    <Profile />
                  </section>
                }
                {
                  highlightedSection === "employee" &&
                  <section id="employee" className="py-4 w-full h-full">
                    <Employee />
                  </section>
                }
                {
                  highlightedSection === "payment" &&
                  <section id="payment" className="py-4 w-full">
                    <Payment />
                  </section>
                }
                {
                  highlightedSection === "bill" &&
                  <section id="bill" className="py-4 w-full">
                    <Bill />
                  </section>
                }
                {
                  highlightedSection === "package" &&
                  <section id="package" className="py-4 w-full">
                    <Package />
                  </section>
                }
                {
                  highlightedSection === "product" &&
                  <section id="payment" className="py-4 w-full">
                    <Product />
                  </section>
                }
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Store;
