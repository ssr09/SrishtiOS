import React, {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react';
import { AppHeader } from '../../shared/components/AppHeader';

interface AnimalPreset {
  id: string;
  name: string;
  emoji: string;
  imageSrc: string;
}

interface CanvasHandle {
  clear: () => void;
  undo: () => void;
}

const animalPresets: AnimalPreset[] = [
  { id: 'rhino', name: 'Rhino', emoji: '🦏', imageSrc: '/coloring/animals/rhino.png' },
  { id: 'lion', name: 'Lion', emoji: '🦁', imageSrc: '/coloring/animals/lion.png' },
  { id: 'crocodile', name: 'Crocodile', emoji: '🐊', imageSrc: '/coloring/animals/crocodile.png' },
  { id: 'tiger', name: 'Tiger', emoji: '🐯', imageSrc: '/coloring/animals/tiger.png' },
  { id: 'zebra', name: 'Zebra', emoji: '🦓', imageSrc: '/coloring/animals/zebra.png' },
  { id: 'elephant', name: 'Elephant', emoji: '🐘', imageSrc: '/coloring/animals/elephant.png' },
  { id: 'giraffe', name: 'Giraffe', emoji: '🦒', imageSrc: '/coloring/animals/giraffe.png' },
  { id: 'hippo', name: 'Hippo', emoji: '🦛', imageSrc: '/coloring/animals/hippo.png' },
];

const paletteColors = [
  '#ffffff',
  '#ffd60a',
  '#ff7a00',
  '#98d800',
  '#5ee9e9',
  '#f75c9b',
  '#f2b85b',
  '#d90000',
  '#279600',
  '#0ea5a5',
  '#a83272',
  '#b9853d',
  '#303030',
  '#7f0000',
  '#063f08',
  '#1111a5',
  '#ff0066',
  '#7a3d00',
];

const colorNames: Record<string, string> = {
  '#ffffff': 'white',
  '#ffd60a': 'yellow',
  '#ff7a00': 'orange',
  '#98d800': 'lime',
  '#5ee9e9': 'aqua',
  '#f75c9b': 'pink',
  '#f2b85b': 'tan',
  '#d90000': 'red',
  '#279600': 'green',
  '#0ea5a5': 'teal',
  '#a83272': 'purple',
  '#b9853d': 'brown',
  '#303030': 'black',
  '#7f0000': 'dark red',
  '#063f08': 'dark green',
  '#1111a5': 'blue',
  '#ff0066': 'hot pink',
  '#7a3d00': 'dark brown',
};

const hexToRgb = (hex: string): [number, number, number] => {
  const normalized = hex.replace('#', '');
  return [
    Number.parseInt(normalized.slice(0, 2), 16),
    Number.parseInt(normalized.slice(2, 4), 16),
    Number.parseInt(normalized.slice(4, 6), 16),
  ];
};

const useColoringSounds = () => {
  const selectAudioRef = useRef<HTMLAudioElement | null>(null);
  const fillAudioRef = useRef<HTMLAudioElement | null>(null);

  const playClip = (audioRef: React.MutableRefObject<HTMLAudioElement | null>, src: string) => {
    try {
      if (!audioRef.current) {
        audioRef.current = new Audio(src);
      }

      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(() => {
        // Browser audio restrictions should not block coloring.
      });
    } catch {
      // Audio feedback is helpful but not required.
    }
  };

  const playSelectSound = () => {
    playClip(selectAudioRef, '/sounds/ui/color-select.mp3');
  };

  const playFillSound = () => {
    playClip(fillAudioRef, '/sounds/ui/color-fill.mp3');
  };

  return { playSelectSound, playFillSound };
};

const buildOutlineMask = (imageData: ImageData) => {
  const mask = new Uint8Array(imageData.width * imageData.height);
  const { data } = imageData;

  for (let pixel = 0; pixel < mask.length; pixel += 1) {
    const index = pixel * 4;
    const alpha = data[index + 3];
    const luminance = data[index] * 0.299 + data[index + 1] * 0.587 + data[index + 2] * 0.114;
    mask[pixel] = alpha > 40 && luminance < 150 ? 1 : 0;
  }

  return mask;
};

const isNearColor = (
  data: Uint8ClampedArray,
  index: number,
  targetRed: number,
  targetGreen: number,
  targetBlue: number,
  targetAlpha: number
) => {
  const tolerance = 46;
  return (
    Math.abs(data[index] - targetRed) <= tolerance &&
    Math.abs(data[index + 1] - targetGreen) <= tolerance &&
    Math.abs(data[index + 2] - targetBlue) <= tolerance &&
    Math.abs(data[index + 3] - targetAlpha) <= 80
  );
};

const floodFillCanvas = (
  canvas: HTMLCanvasElement,
  clientX: number,
  clientY: number,
  selectedColor: string,
  outlineMask: Uint8Array | null
) => {
  const context = canvas.getContext('2d', { willReadFrequently: true });
  if (!context || !outlineMask || canvas.width === 0 || canvas.height === 0) return false;

  const bounds = canvas.getBoundingClientRect();
  const x = Math.floor(((clientX - bounds.left) / bounds.width) * canvas.width);
  const y = Math.floor(((clientY - bounds.top) / bounds.height) * canvas.height);

  if (x < 0 || y < 0 || x >= canvas.width || y >= canvas.height) return false;

  const startPixel = y * canvas.width + x;
  if (outlineMask[startPixel]) return false;

  const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
  const { data } = imageData;
  const startIndex = startPixel * 4;
  const targetRed = data[startIndex];
  const targetGreen = data[startIndex + 1];
  const targetBlue = data[startIndex + 2];
  const targetAlpha = data[startIndex + 3];
  const [fillRed, fillGreen, fillBlue] = hexToRgb(selectedColor);

  if (
    Math.abs(targetRed - fillRed) < 4 &&
    Math.abs(targetGreen - fillGreen) < 4 &&
    Math.abs(targetBlue - fillBlue) < 4
  ) {
    return false;
  }

  const visited = new Uint8Array(canvas.width * canvas.height);
  const queue = new Int32Array(canvas.width * canvas.height);
  let readIndex = 0;
  let writeIndex = 0;
  let changedPixels = 0;

  queue[writeIndex] = startPixel;
  writeIndex += 1;
  visited[startPixel] = 1;

  while (readIndex < writeIndex) {
    const pixel = queue[readIndex];
    readIndex += 1;

    if (outlineMask[pixel]) continue;

    const index = pixel * 4;
    if (!isNearColor(data, index, targetRed, targetGreen, targetBlue, targetAlpha)) continue;

    data[index] = fillRed;
    data[index + 1] = fillGreen;
    data[index + 2] = fillBlue;
    data[index + 3] = 255;
    changedPixels += 1;

    const px = pixel % canvas.width;
    const py = Math.floor(pixel / canvas.width);
    const neighbors = [
      px > 0 ? pixel - 1 : -1,
      px < canvas.width - 1 ? pixel + 1 : -1,
      py > 0 ? pixel - canvas.width : -1,
      py < canvas.height - 1 ? pixel + canvas.width : -1,
    ];

    for (const neighbor of neighbors) {
      if (neighbor >= 0 && !visited[neighbor]) {
        visited[neighbor] = 1;
        queue[writeIndex] = neighbor;
        writeIndex += 1;
      }
    }
  }

  if (changedPixels === 0) return false;

  context.putImageData(imageData, 0, 0);
  return true;
};

const AnimalColoringCanvas = forwardRef<
  CanvasHandle,
  {
    animal: AnimalPreset;
    selectedColor: string;
    onFill: () => void;
    onUndoAvailabilityChange: (canUndo: boolean) => void;
  }
>(({ animal, selectedColor, onFill, onUndoAvailabilityChange }, ref) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const sourceImageRef = useRef<HTMLImageElement | null>(null);
  const outlineMaskRef = useRef<Uint8Array | null>(null);
  const savedPagesRef = useRef<Record<string, string>>({});
  const historiesRef = useRef<Record<string, string[]>>({});

  const updateUndoAvailability = useCallback(() => {
    onUndoAvailabilityChange((historiesRef.current[animal.id] ?? []).length > 0);
  }, [animal.id, onUndoAvailabilityChange]);

  const drawDataUrl = useCallback(
    (dataUrl: string, onDone?: () => void) => {
      const canvas = canvasRef.current;
      const context = canvas?.getContext('2d', { willReadFrequently: true });
      if (!canvas || !context) return;

      const image = new Image();
      image.onload = () => {
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.drawImage(image, 0, 0, canvas.width, canvas.height);
        onDone?.();
      };
      image.src = dataUrl;
    },
    []
  );

  const drawBaseImage = useCallback(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d', { willReadFrequently: true });
    const sourceImage = sourceImageRef.current;
    if (!canvas || !context || !sourceImage) return;

    canvas.width = sourceImage.naturalWidth;
    canvas.height = sourceImage.naturalHeight;
    context.fillStyle = '#ffffff';
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.drawImage(sourceImage, 0, 0, canvas.width, canvas.height);

    const originalData = context.getImageData(0, 0, canvas.width, canvas.height);
    outlineMaskRef.current = buildOutlineMask(originalData);

    const savedPage = savedPagesRef.current[animal.id];
    if (savedPage) {
      drawDataUrl(savedPage);
    }
  }, [animal.id, drawDataUrl]);

  const pushHistory = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const history = historiesRef.current[animal.id] ?? [];
    historiesRef.current[animal.id] = [...history.slice(-19), canvas.toDataURL('image/png')];
    updateUndoAvailability();
  }, [animal.id, updateUndoAvailability]);

  const saveCurrentPage = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    savedPagesRef.current[animal.id] = canvas.toDataURL('image/png');
  }, [animal.id]);

  const clear = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || !sourceImageRef.current) return;

    pushHistory();
    delete savedPagesRef.current[animal.id];
    drawBaseImage();
    updateUndoAvailability();
  }, [animal.id, drawBaseImage, pushHistory, updateUndoAvailability]);

  const undo = useCallback(() => {
    const history = historiesRef.current[animal.id] ?? [];
    const previousPage = history[history.length - 1];
    if (!previousPage) return;

    historiesRef.current[animal.id] = history.slice(0, -1);
    savedPagesRef.current[animal.id] = previousPage;
    drawDataUrl(previousPage, updateUndoAvailability);
  }, [animal.id, drawDataUrl, updateUndoAvailability]);

  useImperativeHandle(ref, () => ({ clear, undo }), [clear, undo]);

  useEffect(() => {
    let isCurrentAnimal = true;
    const image = new Image();
    image.onload = () => {
      if (!isCurrentAnimal) return;

      sourceImageRef.current = image;
      drawBaseImage();
      updateUndoAvailability();
    };
    image.src = animal.imageSrc;

    return () => {
      isCurrentAnimal = false;
    };
  }, [animal.imageSrc, drawBaseImage, updateUndoAvailability]);

  const fillAtPoint = (clientX: number, clientY: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const snapshot = canvas.toDataURL('image/png');
    const didFill = floodFillCanvas(canvas, clientX, clientY, selectedColor, outlineMaskRef.current);

    if (!didFill) return;

    const history = historiesRef.current[animal.id] ?? [];
    historiesRef.current[animal.id] = [...history.slice(-19), snapshot];
    saveCurrentPage();
    updateUndoAvailability();
    onFill();
  };

  return (
    <canvas
      ref={canvasRef}
      role="img"
      aria-label={`${animal.name} coloring page`}
      data-testid="animal-coloring-canvas"
      onPointerDown={event => {
        event.preventDefault();
        fillAtPoint(event.clientX, event.clientY);
      }}
      className="block h-full w-full touch-none bg-white"
    />
  );
});

AnimalColoringCanvas.displayName = 'AnimalColoringCanvas';

export const AnimalColoringGame: React.FC = () => {
  const [selectedAnimalId, setSelectedAnimalId] = useState(animalPresets[0].id);
  const [selectedColor, setSelectedColor] = useState(paletteColors[1]);
  const [canUndo, setCanUndo] = useState(false);
  const canvasHandleRef = useRef<CanvasHandle | null>(null);
  const { playSelectSound, playFillSound } = useColoringSounds();

  const selectedAnimal = useMemo(
    () => animalPresets.find(animal => animal.id === selectedAnimalId) ?? animalPresets[0],
    [selectedAnimalId]
  );

  const chooseAnimal = (animalId: string) => {
    setSelectedAnimalId(animalId);
    playSelectSound();
  };

  const chooseColor = (color: string) => {
    setSelectedColor(color);
    playSelectSound();
  };

  const clearAnimal = () => {
    canvasHandleRef.current?.clear();
    playSelectSound();
  };

  const undo = () => {
    canvasHandleRef.current?.undo();
    playSelectSound();
  };

  return (
    <div className="min-h-screen bg-theme-bg p-4 md:p-8 flex flex-col gap-5 overflow-y-auto">
      <AppHeader title="Color Animals" emoji="🦏" />

      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
        {animalPresets.map(animal => {
          const isSelected = animal.id === selectedAnimal.id;
          return (
            <button
              key={animal.id}
              onClick={() => chooseAnimal(animal.id)}
              className={`bg-white rounded-2xl p-2 shadow-md border-4 transition-all ${isSelected ? 'border-theme-primary scale-105' : 'border-transparent'}`}
            >
              <img
                src={animal.imageSrc}
                alt=""
                className="w-full aspect-square object-cover rounded-xl border-2 border-gray-100"
                draggable={false}
              />
              <div className="text-base md:text-lg font-bold text-theme-text mt-1">
                {animal.emoji} {animal.name}
              </div>
            </button>
          );
        })}
      </div>

      <div className="grid lg:grid-cols-[1fr_260px] gap-5 flex-1">
        <div className="bg-white rounded-3xl shadow-2xl border-4 border-gray-900 overflow-hidden min-h-[420px] aspect-square max-h-[min(72vh,900px)] mx-auto w-full max-w-[900px]">
          <AnimalColoringCanvas
            ref={canvasHandleRef}
            animal={selectedAnimal}
            selectedColor={selectedColor}
            onFill={playFillSound}
            onUndoAvailabilityChange={setCanUndo}
          />
        </div>

        <div className="bg-white rounded-3xl shadow-xl p-4 md:p-5 flex lg:flex-col gap-4 overflow-x-auto">
          <div className="flex lg:grid lg:grid-cols-3 gap-3">
            {paletteColors.map(color => (
              <button
                key={color}
                aria-label={`Choose ${colorNames[color]}`}
                data-testid={`palette-color-${color}`}
                onClick={() => chooseColor(color)}
                className={`w-14 h-14 md:w-16 md:h-16 rounded-2xl border-4 shadow-md shrink-0 transition-transform ${selectedColor === color ? 'border-gray-900 scale-110' : 'border-gray-200'}`}
                style={{ backgroundColor: color }}
              />
            ))}
          </div>

          <div className="flex lg:flex-col gap-3 ml-auto lg:ml-0">
            <button
              onClick={undo}
              disabled={!canUndo}
              className="px-5 py-4 rounded-2xl bg-blue-500 text-white text-xl font-bold shadow-md disabled:bg-gray-300 disabled:text-gray-500"
            >
              Undo
            </button>
            <button
              onClick={clearAnimal}
              className="px-5 py-4 rounded-2xl bg-rose-500 text-white text-xl font-bold shadow-md"
            >
              Clear
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
