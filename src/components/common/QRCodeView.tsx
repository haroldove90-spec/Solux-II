import React from 'react';

interface QRCodeProps {
  value: string;
  size?: number;
}

export const QRCodeView: React.FC<QRCodeProps> = ({ value, size = 180 }) => {
  // Deterministic pattern generator based on string hash for a realistic scannable-look QR code
  const getCells = () => {
    let hash = 0;
    for (let i = 0; i < value.length; i++) {
      hash = (hash << 5) - hash + value.charCodeAt(i);
      hash |= 0;
    }

    const gridSize = 21;
    const cells: boolean[][] = Array(gridSize)
      .fill(false)
      .map(() => Array(gridSize).fill(false));

    // Finder patterns (top-left, top-right, bottom-left 7x7)
    const placeFinder = (r: number, c: number) => {
      for (let i = 0; i < 7; i++) {
        for (let j = 0; j < 7; j++) {
          if (
            i === 0 ||
            i === 6 ||
            j === 0 ||
            j === 6 ||
            (i >= 2 && i <= 4 && j >= 2 && j <= 4)
          ) {
            cells[r + i][c + j] = true;
          }
        }
      }
    };

    placeFinder(0, 0);
    placeFinder(0, 14);
    placeFinder(14, 0);

    // Timing lines
    for (let i = 8; i < 13; i++) {
      cells[6][i] = i % 2 === 0;
      cells[i][6] = i % 2 === 0;
    }

    // Pseudorandom data bits derived from URL content
    let currentHash = Math.abs(hash);
    for (let r = 0; r < gridSize; r++) {
      for (let c = 0; c < gridSize; c++) {
        // Skip finder areas
        if (
          (r < 8 && c < 8) ||
          (r < 8 && c >= 13) ||
          (r >= 13 && c < 8) ||
          r === 6 ||
          c === 6
        ) {
          continue;
        }
        currentHash = (currentHash * 9301 + 49297) % 233280;
        cells[r][c] = currentHash % 100 > 48;
      }
    }

    return { gridSize, cells };
  };

  const { gridSize, cells } = getCells();
  const cellSize = size / gridSize;

  return (
    <div
      className="bg-white p-3 rounded-2xl border border-slate-200 shadow-sm inline-block"
      style={{ width: size + 24, height: size + 24 }}
    >
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {cells.map((row, r) =>
          row.map((active, c) => {
            if (!active) return null;
            return (
              <rect
                key={`${r}-${c}`}
                x={c * cellSize}
                y={r * cellSize}
                width={cellSize + 0.3}
                height={cellSize + 0.3}
                fill="#000000"
                rx={0.5}
              />
            );
          })
        )}
      </svg>
    </div>
  );
};
