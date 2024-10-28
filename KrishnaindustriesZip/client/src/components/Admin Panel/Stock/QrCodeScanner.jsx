import React, { useState } from "react";
// import QRCode from "qrcode.react";
import { TextField, Button, Grid, Container, IconButton, Input } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DownloadIcon from "@mui/icons-material/Download";
import jsQR from "jsqr";
import { QrReader } from "react-qr-reader";

const QrCodeScanner= () => {
  const [text, setText] = useState("");
  const [qrData, setQRData] = useState("");
  const [image, setImage] = useState(null);
  const [imageScanResult, setImageScanResult] = useState("");
  const [scanResult, setScanResult] = useState("");
  const [cameraSize, setCameraSize] = useState({ width: 320, height: 240 }); // Default size

  // Function to handle QR code generation
  const handleGenerateQRCode = () => {
    setQRData(text);
  };

  // Function to handle QR code image upload
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const imgURL = URL.createObjectURL(file);
      setImage(imgURL);
    }
  };

  // Function to decode the QR code from the uploaded image
  const decodeQRCode = () => {
    if (image) {
      const img = document.createElement("img");
      img.src = image;
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");
        canvas.width = img.width;
        canvas.height = img.height;
        context.drawImage(img, 0, 0, img.width, img.height);
        const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
        const code = jsQR(imageData.data, canvas.width, canvas.height);
        if (code) {
          setImageScanResult(code.data);
        } else {
          setImageScanResult("Failed to decode QR code.");
        }
      };
    }
  };

  // Function to handle QR code scanning
  const handleScan = (result) => {
    if (result) {
      setScanResult(result.text);
    }
  };

  const handleError = (error) => {
    console.error(error);
  };

  // Function to download the generated QR code as an image
  const handleDownloadQRCode = () => {
    const canvas = document.getElementById("qr-code");
    const pngUrl = canvas
      .toDataURL("image/png")
      .replace("image/png", "image/octet-stream");
    const downloadLink = document.createElement("a");
    downloadLink.href = pngUrl;
    downloadLink.download = `${qrData}.png`;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  };

  return (
    <Container>
      <h1 style={{ textAlign: "center" }}>QR Code Reader & Generator</h1>
      <Grid container spacing={3} justifyContent="center">
        {/* QR Code Generation Section */}
        <Grid item xs={12} md={6}>
          <h2>Create QR Code</h2>
          <TextField
            label="Enter text"
            variant="outlined"
            fullWidth
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <IconButton
            color="primary"
            onClick={handleGenerateQRCode}
            style={{ marginTop: "10px" }}
          >
            <AddIcon />
          </IconButton>
          <div style={{ marginTop: "20px", textAlign: "center" }}>
            {qrData && (
              <>
                <QRCode id="qr-code" value={qrData} />
                <div style={{ marginTop: "10px" }}>
                  <Button
                    variant="contained"
                    color="primary"
                    startIcon={<DownloadIcon />}
                    onClick={handleDownloadQRCode}
                  >
                    Download QR Code
                  </Button>
                </div>
              </>
            )}
          </div>
        </Grid>

        {/* QR Code Image Upload and Scanning Section */}
        <Grid item xs={12} md={6}>
          <h2>Upload and Scan QR Code</h2>
          <Input
            type="file"
            inputProps={{ accept: "image/*" }}
            onChange={handleFileUpload}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={decodeQRCode}
            style={{ marginTop: "10px" }}
          >
            Scan Uploaded QR Code
          </Button>
          <div style={{ marginTop: "20px", textAlign: "center" }}>
            {image && (
              <>
                <img
                  src={image}
                  alt="Uploaded QR Code"
                  style={{ maxWidth: "100%", maxHeight: "300px", marginBottom: "10px" }}
                />
                {imageScanResult && (
                  <TextField
                    label="Upload Scan Result"
                    variant="outlined"
                    fullWidth
                    value={imageScanResult}
                    disabled
                  />
                )}
              </>
            )}
          </div>
        </Grid>

        {/* QR Code Scanner Section */}
        <Grid item xs={12}>
          <h2>Scan QR Code</h2>
          <QrReader
            onResult={handleScan}
            onError={handleError}
            style={{ width: cameraSize.width, height: cameraSize.height, marginBottom: "20px" }}
          />
          <div style={{ textAlign: "center" }}>
            {scanResult && (
              <TextField
                label="Scan Result"
                variant="outlined"
                fullWidth
                value={scanResult}
                disabled
              />
            )}
          </div>
        </Grid>
      </Grid>
    </Container>
  );
};

export default QrCodeScanner;
