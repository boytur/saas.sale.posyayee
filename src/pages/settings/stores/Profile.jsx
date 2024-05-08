import { useState, useEffect } from 'react';
import userDecode from "../../../libs/userDecode";

function Profile() {

    document.title = "โปรไฟล์ร้าน 💸 การตั้งค่า";

    const initialStoreName = (userDecode())?.user?.store?.store_name || 'ยังไม่ระบุ';
    const initialStoreTaxId = (userDecode())?.user?.store?.store_taxid || 'ยังไม่ระบุ';
    const initialStoreAddress = (userDecode())?.user?.store?.store_address || 'ยังไม่ระบุ';
    const initialStorePhone = (userDecode())?.user?.store?.store_phone || 'ยังไม่ระบุ';

    const [storeName, setStoreName] = useState(initialStoreName);
    const [storeTaxId, setStoreTaxId] = useState(initialStoreTaxId);
    const [storeAddress, setStoreAddress] = useState(initialStoreAddress);
    const [storePhone, setStorePhone] = useState(initialStorePhone);
    const [isModified, setIsModified] = useState(false);


    const [currentImage, setCurrentImage] = useState((userDecode())?.user?.store?.store_image);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setCurrentImage(URL.createObjectURL(file));
            setIsModified(true);
        }
    };

    const handleImageDrop = (e) => {
        e.preventDefault();
        const file = e.dataTransfer.files[0];
        if (file) {
            setCurrentImage(URL.createObjectURL(file));
            setIsModified(true);
        }
    };

    const handleDragOver = (e) => {
        e.preventDefault();
    };

    useEffect(() => {
        const isNameModified = initialStoreName !== storeName;
        const isTaxIdModified = initialStoreTaxId !== storeTaxId;
        const isAddressModified = initialStoreAddress !== storeAddress;
        const isPhoneModified = initialStorePhone !== storePhone;

        setIsModified(isNameModified || isTaxIdModified || isAddressModified || isPhoneModified);
    }, [initialStoreName, initialStoreTaxId, initialStoreAddress, initialStorePhone, storeName, storeTaxId, storeAddress, storePhone]);

    const handleInputChange = (e, setter) => {
        setter(e.target.value);
    };

    const handleSaveButtonClick = () => {
        // ทำสิ่งที่ต้องการเมื่อปุ่มบันทึกข้อมูลถูกคลิก
    };

    return (
        <div className="w-full h-full px-4 bg-white rounded-md mb-32">
            <div className="w-full">
                <h1 className="text-[2rem] font-bold text-gray-700 mb-2">โปรไฟล์ร้าน</h1>
                <hr />
            </div>
            <div className="w-full mt-2">
                <div className='w-full flex justify-center mb-6 ' onDrop={(e) => handleImageDrop(e)} onDragOver={(e) => handleDragOver(e)}>
                    <div className='relative hover:opacity-95 flex justify-center flex-col text-center'>
                        <img className='w-[15rem] h-[15rem] object-cover rounded-full border-primary border-[2px]' src={currentImage} alt="" />
                        <input id="upload-image" accept="image/*" className='opacity-0 absolute bottom-7 cursor-pointer w-full h-full' type="file" onChange={handleImageChange} />
                        <p className="text-sm text-gray-500 mt-2">คลิกเพื่อเลือกรูปหรือลากและวางไฟล์</p>
                    </div>
                </div>

                <div className="flex gap-2 w-full mt-6">
                    <div className="w-full">
                        <label htmlFor="" className="text-black/70 text-sm ml-1">ชื่อร้าน</label>
                        <input
                            value={storeName}
                            onChange={(e) => {
                                handleInputChange(e, setStoreName);
                                setIsModified(true);
                            }}
                            className="input-primary"
                            type="text"
                            name=""
                            id=""
                        />
                    </div>
                    <div className="w-full">
                        <label htmlFor="" className="text-black/70 text-sm ml-1">เลขประจำตัวผู้เสียภาษี</label>
                        <input
                            value={storeTaxId}
                            onChange={(e) => {
                                handleInputChange(e, setStoreTaxId);
                                setIsModified(true);
                            }}
                            className="input-primary"
                            type="text"
                            name=""
                            id=""
                        />
                    </div>
                </div>
                <div className="flex gap-2">
                    <div className="w-full mt-2">
                        <label htmlFor="" className="text-black/70 text-sm ml-1">ที่อยู่ร้าน</label>
                        <input
                            value={storeAddress}
                            onChange={(e) => {
                                handleInputChange(e, setStoreAddress);
                                setIsModified(true);
                            }}
                            className="input-primary"
                            type="text"
                            name=""
                            id=""
                        />
                    </div>
                    <div className="w-full mt-2">
                        <label htmlFor="" className="text-black/70 text-sm ml-1">เบอร์โทรร้าน</label>
                        <input
                            value={storePhone}
                            onChange={(e) => {
                                handleInputChange(e, setStorePhone);
                                setIsModified(true);
                            }}
                            className="input-primary"
                            type="text"
                            name=""
                            id=""
                        />
                    </div>
                </div>
                {isModified && (
                    <button onClick={() => handleSaveButtonClick()} className="w-full md:w-fit btn-primary mt-6 px-3 py-2">
                        บันทึกข้อมูล
                    </button>
                )}
            </div>
        </div >
    );
}

export default Profile;
