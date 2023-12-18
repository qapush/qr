import React, { useState } from 'react';
import axios from 'axios';

function App() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    company: '',
    jobTitle: ''
  });
  const [qrCode, setQrCode] = useState('');
  const [jpegBase64, setJpegBase64] = useState('');
  const [name, setName] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/.netlify/functions/qr', formData);
      setQrCode(response.data.qrCodeUrl);
      setJpegBase64(response.data.jpegBase64);
      setName(response.data.name);
    } catch (error) {
      console.error('Error generating QR code:', error);
    }
  };

  const handleDownload = () => {
    const blob = new Blob([getJpegURL(jpegBase64)], { type: 'image/jpeg' });
    const downloadUrl = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = `${name}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(downloadUrl);
  };

  return (
    <div className="App">
      <form onSubmit={handleSubmit}>
        <input type="text" name="name" required value={formData.name} onChange={handleChange} placeholder="Name*" />
        <input type="text" name="phone" required value={formData.phone} onChange={handleChange} placeholder="Phone*" />
        <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email" />
        <input type="text" name="company" value={formData.company} onChange={handleChange} placeholder="Company" />
        <input type="text" name="jobTitle" value={formData.jobTitle} onChange={handleChange} placeholder="Job Title" />
        <button type="submit">Generate QR Code</button>
      </form>
      {qrCode && <img src={qrCode} alt="QR Code" />}
      {jpegBase64 && <><img src={`data:image/jpeg;base64,${jpegBase64}`} style={{display: 'none'}} alt="jpg" /> <button onClick={handleDownload} >Download</button></>}
    </div>
  );
}

export default App;

function getJpegURL(jpegBase64){

  const byteString = atob(jpegBase64);
  const ab = new ArrayBuffer(byteString.length);
  const ia = new Uint8Array(ab);
  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }
  console.log(new Blob([ab], { type: 'image/jpeg', }));
  return new Blob([ab], { type: 'image/jpeg', });
}