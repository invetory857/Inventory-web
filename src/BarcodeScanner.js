import React, { useEffect, useRef } from "react";
import { Html5Qrcode } from "html5-qrcode";

export default function BarcodeScanner({ onScan }) {
  const scannerRef = useRef(null);
  const html5QrcodeScanner = useRef(null);

  useEffect(() => {
    let isScannerRunning = false;

    if (!scannerRef.current) return;

    html5QrcodeScanner.current = new Html5Qrcode(scannerRef.current.id);

    Html5Qrcode.getCameras()
      .then((devices) => {
        if (devices && devices.length) {
          const cameraId = devices[0].id;
          html5QrcodeScanner.current
            .start(
              cameraId,
              { fps: 10, qrbox: 250 },
              (decodedText) => {
                onScan(decodedText);
              },
              (errorMessage) => {
                // Här kan du logga eller hantera skannerfel om du vill
                // console.log("Skannerfel:", errorMessage);
              }
            )
            .then(() => {
              isScannerRunning = true;
            })
            .catch((err) => {
              console.error("Kan inte starta skannern:", err);
            });
        } else {
          console.error("Ingen kamera hittades");
        }
      })
      .catch((err) => {
        console.error("Kunde inte hämta kameror:", err);
      });

    return () => {
      if (html5QrcodeScanner.current && isScannerRunning) {
        html5QrcodeScanner.current.stop().catch((err) => {
          console.error("Fel vid stopp av skanner:", err);
        });
      }
    };
  }, [onScan]);

  return <div id="reader" ref={scannerRef} style={{ width: "100%" }} />;
}
