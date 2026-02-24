import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Camera, Upload } from 'lucide-react';

const DetectionView = ({ orderId, orderParts, selectedModel, settings, onVerificationComplete }) => {

    const fileInputRef = useRef(null);
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const [isCameraOpen, setIsCameraOpen] = useState(false);
    const [devices, setDevices] = useState([]);
    const [selectedDeviceId, setSelectedDeviceId] = useState('');

    useEffect(() => {
        const getDevices = async () => {
            try {
                const allDevices = await navigator.mediaDevices.enumerateDevices();
                const videoDevices = allDevices.filter(device => device.kind === 'videoinput');
                setDevices(videoDevices);
                if (videoDevices.length > 0 && !selectedDeviceId) {
                    setSelectedDeviceId(videoDevices[0].deviceId);
                }
            } catch (err) {
                console.error("Error enumerating devices:", err);
            }
        };
        getDevices();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            handleVerification(file);
        }
    };

    const startCamera = async (deviceId = selectedDeviceId) => {
        setIsCameraOpen(true);
        try {
            if (videoRef.current && videoRef.current.srcObject) {
                videoRef.current.srcObject.getTracks().forEach(track => track.stop());
            }
            const constraints = {
                video: deviceId ? { deviceId: { exact: deviceId } } : true
            };
            const stream = await navigator.mediaDevices.getUserMedia(constraints);
            if (videoRef.current) videoRef.current.srcObject = stream;

            // Refresh to get full device labels after permission is granted
            const allDevices = await navigator.mediaDevices.enumerateDevices();
            const videoDevices = allDevices.filter(device => device.kind === 'videoinput');
            setDevices(videoDevices);
            if (!deviceId && videoDevices.length > 0) {
                setSelectedDeviceId(videoDevices[0].deviceId);
            }
        } catch (err) {
            console.error("Error accessing camera:", err);
        }
    };

    const handleDeviceChange = (e) => {
        const newDeviceId = e.target.value;
        setSelectedDeviceId(newDeviceId);
        if (isCameraOpen) {
            startCamera(newDeviceId);
        }
    };

    const captureImage = () => {
        if (videoRef.current && canvasRef.current) {
            const context = canvasRef.current.getContext('2d');
            context.drawImage(videoRef.current, 0, 0, 640, 480);
            canvasRef.current.toBlob(blob => {
                const file = new File([blob], "capture.jpg", { type: "image/jpeg" });
                handleVerification(file);
                stopCamera();
            }, 'image/jpeg');
        }
    };

    const stopCamera = () => {
        if (videoRef.current && videoRef.current.srcObject) {
            videoRef.current.srcObject.getTracks().forEach(track => track.stop());
        }
        setIsCameraOpen(false);
    };

    const handleVerification = async (file) => {
        const formData = new FormData();
        formData.append('order_id', orderId);
        formData.append('parts', JSON.stringify(orderParts));
        formData.append('model_name', selectedModel);

        // Add Settings
        formData.append('img_size', settings.img_size);
        formData.append('conf_thres', settings.conf_thres);
        formData.append('iou_thres', settings.iou_thres);

        formData.append('file', file);

        try {
            const res = await axios.post('http://localhost:8000/verify', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            onVerificationComplete(res.data);
        } catch (err) {
            console.error(err);
            alert('Verification Failed');
        }
    };

    return (
        <div className="p-4 border rounded shadow bg-white">
            <h3 className="text-lg font-bold mb-4">Detect Scene</h3>

            {!isCameraOpen ? (
                <div className="flex space-x-4">
                    <button
                        onClick={() => fileInputRef.current.click()}
                        className="flex items-center px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                        <Upload className="mr-2" /> Upload Image
                    </button>
                    <input
                        type="file"
                        ref={fileInputRef}
                        className="hidden"
                        accept="image/*"
                        onChange={handleFileUpload}
                    />

                    <button
                        onClick={startCamera}
                        className="flex items-center px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                    >
                        <Camera className="mr-2" /> Use Camera
                    </button>
                </div>
            ) : (
                <div>
                    {devices.length > 0 && (
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Select Camera</label>
                            <select
                                value={selectedDeviceId}
                                onChange={handleDeviceChange}
                                className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                            >
                                {devices.map((device, idx) => (
                                    <option key={device.deviceId} value={device.deviceId}>
                                        {device.label || `Camera ${idx + 1}`}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}
                    <video ref={videoRef} autoPlay playsInline width="640" height="480" className="mb-2 border"></video>
                    <canvas ref={canvasRef} width="640" height="480" className="hidden"></canvas>
                    <div className="flex space-x-4">
                        <button
                            onClick={captureImage}
                            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                        >
                            Capture & Verify
                        </button>
                        <button
                            onClick={stopCamera}
                            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                        >
                            Close Camera
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DetectionView;
