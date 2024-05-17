import { useEffect } from 'react';

const useBarcodeScanner = (onBarcodeScanned) => {
  useEffect(() => {
    let barcode = "";
    let interval;

    const thaiToNumber = {
      "ๅ": "1",
      "/": "2",
      "-": "3",
      "ภ": "4",
      "ถ": "5",
      "ุ": "6",
      "ึ": "7",
      "ค": "8",
      "ต": "9",
      "จ": "0"
    };

    const handleKeyDown = (event) => {
      if (interval) {
        clearInterval(interval);
      }
      if (event.code === "Enter") {
        if (barcode) {
          onBarcodeScanned(barcode);
        }
        barcode = "";
        return;
      }
      if (event.code !== "Shift") {
        const key = event.key;
        if (thaiToNumber[key]) {
          barcode += thaiToNumber[key];
        } else {
          barcode += key;
        }
      }
      interval = setInterval(() => (barcode = ""), 200);
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [onBarcodeScanned]);
};

export default useBarcodeScanner;
