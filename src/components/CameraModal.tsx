'use client';

import { useState, useRef, useEffect } from 'react';
import { Camera, X, RotateCcw, Check } from 'lucide-react';

interface CameraModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCapture: (photo: string) => void;
  title?: string;
}

export default function CameraModal({ isOpen, onClose, onCapture, title = "Ambil Foto" }: CameraModalProps) {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Start camera when modal opens
  useEffect(() => {
    if (isOpen) {
      startCamera();
    }
    return () => {
      if (stream) {
        stopCamera();
      }
    };
  }, [isOpen]);

  // Update video source when stream changes
  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  const startCamera = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Stop any existing stream first
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }

      // Check if getUserMedia is supported
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Camera not supported in this browser');
      }

      // Try different camera configurations
      const configurations = [
        // First try: environment camera with high quality
        {
          video: { 
            facingMode: 'environment',
            width: { ideal: 1280 },
            height: { ideal: 720 }
          }
        },
        // Fallback 1: any camera with medium quality
        {
          video: { 
            width: { ideal: 640 },
            height: { ideal: 480 }
          }
        },
        // Fallback 2: basic video only
        {
          video: true
        }
      ];

      let mediaStream = null;
      for (const config of configurations) {
        try {
          console.log('Trying camera config:', config);
          mediaStream = await navigator.mediaDevices.getUserMedia(config);
          break;
        } catch (configError) {
          console.log('Camera config failed:', configError);
          continue;
        }
      }

      if (!mediaStream) {
        throw new Error('Unable to access camera with any configuration');
      }
      
      setStream(mediaStream);
      
      // Set video source and ensure it plays
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        
        // Wait for video to load and then play
        const playPromise = videoRef.current.play();
        if (playPromise !== undefined) {
          playPromise.catch(playError => {
            console.error('Error playing video:', playError);
          });
        }
      }
    } catch (err: any) {
      console.error('Error accessing camera:', err);
      let errorMessage = 'Tidak dapat mengakses kamera. ';
      
      if (err.name === 'NotAllowedError') {
        errorMessage += 'Silakan izinkan akses kamera di browser Anda.';
      } else if (err.name === 'NotFoundError') {
        errorMessage += 'Kamera tidak ditemukan.';
      } else if (err.name === 'NotSupportedError') {
        errorMessage += 'Browser tidak mendukung akses kamera.';
      } else {
        errorMessage += 'Pastikan kamera tersedia dan tidak digunakan aplikasi lain.';
      }
      
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current && stream) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      
      if (ctx && video.videoWidth > 0 && video.videoHeight > 0) {
        // Set canvas dimensions to match video
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        
        // Draw current video frame to canvas
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        // Convert to base64
        const base64 = canvas.toDataURL('image/jpeg', 0.8);
        setCapturedPhoto(base64);
        
        // Stop the video stream after capture
        stopCamera();
      } else {
        setError('Video belum siap. Tunggu sebentar dan coba lagi.');
      }
    }
  };

  const retakePhoto = () => {
    setCapturedPhoto(null);
    // Restart camera for new photo
    startCamera();
  };

  const confirmPhoto = () => {
    if (capturedPhoto) {
      onCapture(capturedPhoto);
      handleClose();
    }
  };

  const handleClose = () => {
    setCapturedPhoto(null);
    stopCamera();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Blurred Background */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-md"
        onClick={handleClose}
      />
      
      <div className="relative bg-black rounded-2xl shadow-xl w-full max-w-md mx-4 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 bg-white">
          <h3 className="text-lg font-bold text-slate-800">{title}</h3>
          <button
            onClick={handleClose}
            className="text-slate-400 hover:text-slate-600 transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Camera View */}
        <div className="relative aspect-[4/3] bg-black flex items-center justify-center overflow-hidden">
          {isLoading && (
            <div className="text-white text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-2"></div>
              <p className="text-sm">Memuat kamera...</p>
              <p className="text-xs text-white/70 mt-1">Silakan izinkan akses kamera</p>
            </div>
          )}

          {error && (
            <div className="text-white text-center p-4">
              <Camera className="h-12 w-12 mx-auto mb-4 text-red-400" />
              <p className="text-sm mb-4">{error}</p>
              <div className="space-y-2">
                <button
                  onClick={startCamera}
                  className="block w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition"
                >
                  Coba Lagi
                </button>
                <p className="text-xs text-white/70">
                  Pastikan browser mengizinkan akses kamera
                </p>
              </div>
            </div>
          )}

          {stream && !capturedPhoto && !isLoading && !error && (
            <>
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
                onLoadedMetadata={() => {
                  // Ensure video is playing when metadata loads
                  if (videoRef.current) {
                    videoRef.current.play().catch(console.error);
                  }
                }}
              />
              
              {/* Video overlay for better UX */}
              <div className="absolute inset-0 pointer-events-none">
                {/* Camera guidelines */}
                <div className="absolute inset-4 border-2 border-white/30 rounded-lg"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-1 h-1 bg-white/50 rounded-full"></div>
              </div>
            </>
          )}

          {capturedPhoto && (
            <>
              <img
                src={capturedPhoto}
                alt="Captured"
                className="w-full h-full object-cover"
              />
              
              {/* Delete button overlay */}
              <button
                onClick={() => setCapturedPhoto(null)}
                className="absolute top-4 right-4 bg-red-500/80 backdrop-blur-md border-2 border-white rounded-full p-2 hover:bg-red-600/80 transition"
                title="Hapus foto"
              >
                <X className="h-5 w-5 text-white" />
              </button>
            </>
          )}

          {/* Capture Overlay */}
          {stream && !isLoading && !error && !capturedPhoto && (
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
              <button
                onClick={capturePhoto}
                disabled={!stream}
                className="bg-white/20 backdrop-blur-md border-4 border-white rounded-full p-4 hover:bg-white/30 transition disabled:opacity-50"
              >
                <Camera className="h-8 w-8 text-white" />
              </button>
            </div>
          )}
          
          {/* Retake/Confirm buttons for captured photo */}
          {capturedPhoto && (
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
              <div className="flex gap-4">
                <button
                  onClick={retakePhoto}
                  className="bg-red-500/80 backdrop-blur-md border-2 border-white rounded-full p-3 hover:bg-red-500 transition"
                >
                  <RotateCcw className="h-6 w-6 text-white" />
                </button>
                <button
                  onClick={confirmPhoto}
                  className="bg-green-500/80 backdrop-blur-md border-2 border-white rounded-full p-3 hover:bg-green-500 transition"
                >
                  <Check className="h-6 w-6 text-white" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Hidden canvas for capture */}
        <canvas ref={canvasRef} className="hidden" />

        {/* Instructions */}
        <div className="bg-white px-5 py-3 text-center">
          <p className="text-sm text-slate-600">
            {!capturedPhoto 
              ? 'Arahkan kamera ke objek dan tekan tombol kamera untuk mengambil foto'
              : 'Tekan ✓ untuk menggunakan foto ini, ↻ untuk mengambil ulang, atau ✕ untuk menghapus'
            }
          </p>
        </div>
      </div>
    </div>
  );
}