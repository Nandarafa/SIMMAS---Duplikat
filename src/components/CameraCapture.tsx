'use client';

import { useEffect, useRef, useState } from 'react';
import { Camera, RotateCcw, X } from 'lucide-react';

interface CameraCaptureProps {
  onCapture: (photoDataUrl: string) => void;
  onClose: () => void;
  title?: string;
  subtitle?: string;
}

export default function CameraCapture({ onCapture, onClose, title = "Ambil Foto", subtitle = "Silakan ambil foto selfie di lokasi magang Anda." }: CameraCaptureProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  
  const [isCameraReady, setIsCameraReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('environment');

  useEffect(() => {
    startCamera();
    return () => {
      stopCamera();
    };
  }, [facingMode]);

  const startCamera = async () => {
    try {
      setError(null);
      setIsCameraReady(false);

      // Stop existing stream if any
      stopCamera();

      // Request camera access
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: facingMode,
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        },
        audio: false
      });

      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        setIsCameraReady(true);
      }
    } catch (err: any) {
      console.error('Camera error:', err);
      setError(err.message || 'Gagal mengakses kamera. Pastikan izin kamera sudah diberikan.');
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
  };

  const handleCapture = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    if (!context) return;

    // Set canvas size to match video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Draw the current video frame to canvas
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Convert canvas to data URL
    const photoDataUrl = canvas.toDataURL('image/jpeg', 0.9);
    setCapturedPhoto(photoDataUrl);
  };

  const handleRetake = () => {
    setCapturedPhoto(null);
  };

  const handleConfirm = () => {
    if (capturedPhoto) {
      onCapture(capturedPhoto);
      stopCamera();
      onClose();
    }
  };

  const toggleCamera = () => {
    setFacingMode(prev => prev === 'user' ? 'environment' : 'user');
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center">
              <Camera className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h3 className="font-bold text-slate-800">{title}</h3>
              <p className="text-xs text-slate-500">{subtitle}</p>
            </div>
          </div>
          <button
            onClick={() => {
              stopCamera();
              onClose();
            }}
            className="text-slate-400 hover:text-slate-600 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Camera Preview / Captured Photo */}
        <div className="p-5">
          <div className="relative bg-slate-100 rounded-xl overflow-hidden" style={{ aspectRatio: '4/3' }}>
            {!capturedPhoto ? (
              <>
                {/* Live Video Stream */}
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover"
                />
                
                {/* Error Message */}
                {error && (
                  <div className="absolute inset-0 flex items-center justify-center p-4 bg-slate-900/90">
                    <div className="text-center text-white">
                      <p className="font-semibold mb-2">Kamera Tidak Tersedia</p>
                      <p className="text-sm mb-4">{error}</p>
                      <button
                        onClick={startCamera}
                        className="px-4 py-2 bg-white text-slate-900 rounded-lg font-medium text-sm"
                      >
                        Coba Lagi
                      </button>
                    </div>
                  </div>
                )}

                {/* Loading */}
                {!isCameraReady && !error && (
                  <div className="absolute inset-0 flex items-center justify-center bg-slate-900/50">
                    <div className="text-center text-white">
                      <div className="w-10 h-10 border-4 border-white/30 border-t-white rounded-full animate-spin mx-auto mb-2" />
                      <p className="text-sm">Meminta izin kamera...</p>
                    </div>
                  </div>
                )}

                {/* Flip Camera Button */}
                {isCameraReady && (
                  <button
                    onClick={toggleCamera}
                    className="absolute top-3 right-3 w-10 h-10 rounded-full bg-black/50 backdrop-blur-sm text-white hover:bg-black/70 transition flex items-center justify-center"
                    title="Ganti Kamera"
                  >
                    <RotateCcw className="w-5 h-5" />
                  </button>
                )}

                {/* Capture Button Overlay */}
                {isCameraReady && (
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
                    <button
                      onClick={handleCapture}
                      className="w-16 h-16 rounded-full bg-white border-4 border-white shadow-lg hover:scale-105 active:scale-95 transition flex items-center justify-center"
                    >
                      <Camera className="w-6 h-6 text-slate-700" />
                    </button>
                  </div>
                )}
              </>
            ) : (
              /* Captured Photo Preview */
              <img
                src={capturedPhoto}
                alt="Preview"
                className="w-full h-full object-cover"
              />
            )}
          </div>
        </div>

        {/* Hidden Canvas for Capture */}
        <canvas ref={canvasRef} className="hidden" />

        {/* Footer Buttons */}
        <div className="px-5 py-4 border-t border-slate-200 flex gap-3">
          {!capturedPhoto ? (
            <button
              onClick={() => {
                stopCamera();
                onClose();
              }}
              className="flex-1 px-4 py-2.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-sm transition"
            >
              Batal
            </button>
          ) : (
            <>
              <button
                onClick={handleRetake}
                className="flex-1 px-4 py-2.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-sm transition"
              >
                Ulangi
              </button>
              <button
                onClick={handleConfirm}
                className="flex-1 px-4 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm transition"
              >
                Gunakan Foto
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
