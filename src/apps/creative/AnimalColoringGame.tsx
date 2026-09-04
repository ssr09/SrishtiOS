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

interface ColoringMemory {
  savedPagesRef: React.MutableRefObject<Record<string, string>>;
  historiesRef: React.MutableRefObject<Record<string, string[]>>;
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
  { id: 'monkey', name: 'Monkey', emoji: '🐵', imageSrc: '/coloring/animals/monkey.png' },
  { id: 'cow-calf', name: 'Cow & Calf', emoji: '🐄', imageSrc: '/coloring/animals/cow-calf.png' },
  { id: 'horse-foal', name: 'Horse & Foal', emoji: '🐴', imageSrc: '/coloring/animals/horse-foal.png' },
  { id: 'deer-fawn', name: 'Deer & Fawn', emoji: '🦌', imageSrc: '/coloring/animals/deer-fawn.png' },
  { id: 'sheep-lamb', name: 'Sheep & Lamb', emoji: '🐑', imageSrc: '/coloring/animals/sheep-lamb.png' },
  { id: 'goat-kid', name: 'Goat & Kid', emoji: '🐐', imageSrc: '/coloring/animals/goat-kid.png' },
  { id: 'bear-cub', name: 'Bear & Cub', emoji: '🐻', imageSrc: '/coloring/animals/bear-cub.png' },
  { id: 'bluey-bingo', name: 'Bluey & Bingo', emoji: '🐶', imageSrc: '/coloring/animals/bluey-bingo.png' },
];

const paletteGroups = [
  { name: 'white', colors: ['#ffffff', '#f3f4f6', '#d1d5db'] },
  { name: 'black', colors: ['#6b7280', '#303030', '#000000'] },
  { name: 'pink', colors: ['#f9a8d4', '#f75c9b', '#ff0066'] },
  { name: 'orange', colors: ['#fed7aa', '#ff7a00', '#c2410c'] },
  { name: 'brown', colors: ['#f2b85b', '#b9853d', '#7a3d00'] },
  { name: 'red', colors: ['#fca5a5', '#d90000', '#7f0000'] },
  { name: 'yellow', colors: ['#fff7ad', '#ffd60a', '#d6a900'] },
  { name: 'green', colors: ['#bbf7d0', '#279600', '#063f08'] },
  { name: 'blue', colors: ['#93c5fd', '#1111a5', '#06145f'] },
  { name: 'purple', colors: ['#d8b4fe', '#a83272', '#581c87'] },
];

const paletteColors = paletteGroups.flatMap(group => group.colors);

const colorNames: Record<string, string> = {
  '#ffffff': 'white',
  '#f3f4f6': 'soft white',
  '#d1d5db': 'light gray',
  '#6b7280': 'gray',
  '#000000': 'deep black',
  '#f9a8d4': 'light pink',
  '#ffd60a': 'yellow',
  '#fff7ad': 'light yellow',
  '#d6a900': 'dark yellow',
  '#ff7a00': 'orange',
  '#fed7aa': 'light orange',
  '#c2410c': 'dark orange',
  '#bbf7d0': 'light green',
  '#93c5fd': 'light blue',
  '#d8b4fe': 'light purple',
  '#fca5a5': 'light red',
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
  '#06145f': 'dark blue',
  '#ff0066': 'hot pink',
  '#7a3d00': 'dark brown',
  '#581c87': 'dark purple',
};

const hexToRgb = (hex: string): [number, number, number] => {
  const normalized = hex.replace('#', '');
  return [
    Number.parseInt(normalized.slice(0, 2), 16),
    Number.parseInt(normalized.slice(2, 4), 16),
    Number.parseInt(normalized.slice(4, 6), 16),
  ];
};

const getBrushCursor = (color: string) => {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32"><path d="M16 2a14 14 0 1 1 0 28 14 14 0 1 1 0-28Zm0 5a9 9 0 1 0 0 18 9 9 0 1 0 0-18Z" fill="${color}" fill-rule="evenodd"/><circle cx="16" cy="16" r="14" fill="none" stroke="#111827" stroke-width="1.5"/><circle cx="16" cy="16" r="9" fill="none" stroke="#111827" stroke-width="1.5"/><path d="M13 16h6M16 13v6" fill="none" stroke="#ffffff" stroke-width="4" stroke-linecap="round"/><path d="M13 16h6M16 13v6" fill="none" stroke="#111827" stroke-width="2" stroke-linecap="round"/></svg>`;
  return `url("data:image/svg+xml;utf8,${encodeURIComponent(svg)}") 16 16, crosshair`;
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
    memory: ColoringMemory;
    onFill: () => void;
    onUndoAvailabilityChange: (canUndo: boolean) => void;
  }
>(({ animal, selectedColor, memory, onFill, onUndoAvailabilityChange }, ref) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const sourceImageRef = useRef<HTMLImageElement | null>(null);
  const outlineMaskRef = useRef<Uint8Array | null>(null);
  const { savedPagesRef, historiesRef } = memory;

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
      style={{ cursor: getBrushCursor(selectedColor) }}
    />
  );
});

AnimalColoringCanvas.displayName = 'AnimalColoringCanvas';

export const AnimalColoringGame: React.FC = () => {
  const [selectedAnimalId, setSelectedAnimalId] = useState(animalPresets[0].id);
  const [isColoring, setIsColoring] = useState(false);
  const [selectedColor, setSelectedColor] = useState(paletteColors[1]);
  const [canUndo, setCanUndo] = useState(false);
  const canvasHandleRef = useRef<CanvasHandle | null>(null);
  const savedPagesRef = useRef<Record<string, string>>({});
  const historiesRef = useRef<Record<string, string[]>>({});
  const { playSelectSound, playFillSound } = useColoringSounds();

  const coloringMemory = useMemo(
    () => ({
      savedPagesRef,
      historiesRef,
    }),
    []
  );

  const selectedAnimal = useMemo(
    () => animalPresets.find(animal => animal.id === selectedAnimalId) ?? animalPresets[0],
    [selectedAnimalId]
  );

  const chooseAnimal = (animalId: string) => {
    setSelectedAnimalId(animalId);
    setIsColoring(true);
    setCanUndo((historiesRef.current[animalId] ?? []).length > 0);
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

  if (!isColoring) {
    return (
      <div className="min-h-screen bg-theme-bg p-4 md:p-8 flex flex-col gap-6 overflow-y-auto">
        <AppHeader title="Color Animals" emoji="🦏" />

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 max-w-7xl mx-auto w-full">
          {animalPresets.map(animal => (
            <button
              key={animal.id}
              onClick={() => chooseAnimal(animal.id)}
              className="bg-white rounded-3xl p-3 shadow-xl border-4 border-transparent hover:border-theme-primary focus-visible:border-theme-primary outline-none transition-all hover:-translate-y-1"
            >
              <img
                src={animal.imageSrc}
                alt=""
                className="w-full aspect-square object-cover rounded-2xl border-2 border-gray-100"
                draggable={false}
              />
              <div className="text-2xl md:text-3xl font-black text-theme-text mt-3">
                {animal.emoji} {animal.name}
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-theme-bg p-4 md:p-6 flex flex-col gap-4 overflow-y-auto">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <AppHeader title={`Color ${selectedAnimal.name}`} emoji={selectedAnimal.emoji} />
        <button
          onClick={() => {
            setIsColoring(false);
            playSelectSound();
          }}
          className="px-5 py-3 rounded-2xl bg-white text-theme-text text-xl font-bold shadow-md border-2 border-gray-200"
        >
          Choose Animal
        </button>
      </div>

      <div className="grid xl:grid-cols-[minmax(0,1fr)_276px] gap-4 flex-1 items-start">
        <div
          className="bg-white rounded-3xl shadow-2xl border-4 border-gray-900 overflow-hidden aspect-square mx-auto w-full"
          style={{ maxWidth: 'min(100%, calc(100vh - 180px), 920px)' }}
        >
          <AnimalColoringCanvas
            ref={canvasHandleRef}
            animal={selectedAnimal}
            selectedColor={selectedColor}
            memory={coloringMemory}
            onFill={playFillSound}
            onUndoAvailabilityChange={setCanUndo}
          />
        </div>

        <div className="bg-white rounded-3xl shadow-xl p-4 flex xl:flex-col gap-4 overflow-x-auto xl:overflow-visible">
          <div className="flex xl:flex-col gap-2 shrink-0">
            {paletteGroups.map(group => (
              <div
                key={group.name}
                className="grid grid-cols-[4.75rem_repeat(3,3rem)] items-center gap-2"
              >
                <div className="text-sm font-black uppercase text-gray-500">{group.name}</div>
                {group.colors.map(color => (
                  <button
                    key={color}
                    aria-label={`Choose ${colorNames[color]}`}
                    data-testid={`palette-color-${color}`}
                    onClick={() => chooseColor(color)}
                    className={`w-12 h-12 rounded-2xl border-4 shadow-md shrink-0 transition-transform ${selectedColor === color ? 'border-gray-900 scale-110' : 'border-gray-200'}`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            ))}
          </div>

          <div className="flex xl:flex-col gap-3 ml-auto xl:ml-0 shrink-0">
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
