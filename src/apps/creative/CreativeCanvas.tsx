import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { AppHeader } from '../../shared/components/AppHeader';

const colors = [
  { name: 'Red', hex: '#FF0000' },
  { name: 'Blue', hex: '#0000FF' },
  { name: 'Yellow', hex: '#FFD700' },
  { name: 'Green', hex: '#00FF00' },
  { name: 'Purple', hex: '#9370DB' },
  { name: 'Orange', hex: '#FF8C00' },
  { name: 'Pink', hex: '#FF69B4' },
  { name: 'Black', hex: '#000000' },
];

const instruments = [
  { name: 'Piano C', emoji: '🎹', frequency: 261.63 },
  { name: 'Piano D', emoji: '🎹', frequency: 293.66 },
  { name: 'Piano E', emoji: '🎹', frequency: 329.63 },
  { name: 'Piano F', emoji: '🎹', frequency: 349.23 },
  { name: 'Piano G', emoji: '🎹', frequency: 392.00 },
  { name: 'Drum', emoji: '🥁', frequency: 100 },
  { name: 'Bell', emoji: '🔔', frequency: 800 },
  { name: 'Horn', emoji: '📯', frequency: 440 },
];

export const CreativeCanvas: React.FC = () => {
  const [mode, setMode] = useState<'draw' | 'music'>('draw');
  const [selectedColor, setSelectedColor] = useState(colors[0].hex);
  const [brushSize, setBrushSize] = useState(10);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
    }
  }, []);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    draw(e);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing && e.type !== 'mousedown' && e.type !== 'touchstart') return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    let clientX, clientY;

    if ('touches' in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    const x = clientX - rect.left;
    const y = clientY - rect.top;

    ctx.fillStyle = selectedColor;
    ctx.beginPath();
    ctx.arc(x, y, brushSize, 0, Math.PI * 2);
    ctx.fill();
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
    }
  };

  const playNote = (frequency: number) => {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.frequency.value = frequency;
    oscillator.type = 'sine';

    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.5);
  };

  return (
    <div className="min-h-screen bg-theme-bg p-4 md:p-8">
      {/* Header */}
      <div className="mb-6">
        <AppHeader title="Creative Canvas" emoji="🎨" />
      </div>

      {/* Mode Selector */}
      <div className="flex justify-center gap-4 mb-6">
        <button
          onClick={() => setMode('draw')}
          className={`
            px-8 py-4 rounded-2xl text-2xl font-bold transition-all
            ${mode === 'draw'
              ? 'bg-blue-500 text-white scale-110 shadow-lg'
              : 'bg-white text-theme-text hover:scale-105'
            }
          `}
        >
          <span className="text-4xl mr-2">✏️</span>
          Draw
        </button>

        <button
          onClick={() => setMode('music')}
          className={`
            px-8 py-4 rounded-2xl text-2xl font-bold transition-all
            ${mode === 'music'
              ? 'bg-purple-500 text-white scale-110 shadow-lg'
              : 'bg-white text-theme-text hover:scale-105'
            }
          `}
        >
          <span className="text-4xl mr-2">🎵</span>
          Music
        </button>
      </div>

      {/* Drawing Mode */}
      {mode === 'draw' && (
        <div className="max-w-5xl mx-auto">
          {/* Color Palette */}
          <div className="mb-4">
            <h3 className="text-xl font-bold text-theme-text mb-2">Choose Color:</h3>
            <div className="flex gap-3 flex-wrap">
              {colors.map((color) => (
                <button
                  key={color.hex}
                  onClick={() => setSelectedColor(color.hex)}
                  className={`
                    w-16 h-16 rounded-full shadow-lg transition-all
                    ${selectedColor === color.hex ? 'scale-125 ring-4 ring-theme-primary' : 'hover:scale-110'}
                  `}
                  style={{ backgroundColor: color.hex }}
                />
              ))}
            </div>
          </div>

          {/* Brush Size */}
          <div className="mb-4">
            <h3 className="text-xl font-bold text-theme-text mb-2">Brush Size:</h3>
            <div className="flex gap-3">
              {[5, 10, 20, 30].map((size) => (
                <button
                  key={size}
                  onClick={() => setBrushSize(size)}
                  className={`
                    px-6 py-3 rounded-xl text-lg font-bold transition-all
                    ${brushSize === size
                      ? 'bg-theme-primary text-white scale-110'
                      : 'bg-white text-theme-text hover:scale-105'
                    }
                  `}
                >
                  {size}px
                </button>
              ))}
            </div>
          </div>

          {/* Canvas */}
          <div className="bg-white rounded-3xl p-4 shadow-2xl mb-4">
            <canvas
              ref={canvasRef}
              width={800}
              height={600}
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              onMouseLeave={stopDrawing}
              onTouchStart={startDrawing}
              onTouchMove={draw}
              onTouchEnd={stopDrawing}
              className="w-full border-4 border-gray-200 rounded-2xl cursor-crosshair touch-none"
            />
          </div>

          {/* Controls */}
          <div className="flex gap-4 justify-center">
            <button
              onClick={clearCanvas}
              className="px-8 py-4 bg-red-500 text-white rounded-2xl text-xl font-bold hover:bg-red-600 transition-colors shadow-lg"
            >
              🗑️ Clear
            </button>
          </div>
        </div>
      )}

      {/* Music Mode */}
      {mode === 'music' && (
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-theme-text text-center mb-8">
            Tap to Make Music! 🎵
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {instruments.map((instrument, index) => (
              <motion.button
                key={instrument.name}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => playNote(instrument.frequency)}
                className="aspect-square bg-gradient-to-br from-purple-400 to-pink-500 rounded-3xl shadow-2xl hover:shadow-3xl transition-all flex flex-col items-center justify-center p-6"
              >
                <div className="text-8xl mb-2">{instrument.emoji}</div>
                <div className="text-xl font-bold text-white">{instrument.name}</div>
              </motion.button>
            ))}
          </div>

          <div className="mt-8 text-center text-2xl text-theme-text-secondary">
            No wrong notes - just have fun! 🌈
          </div>
        </div>
      )}
    </div>
  );
};
