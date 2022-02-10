import './App.css';
import { useState, useEffect, useCallback, useRef } from 'react';
import produce from 'immer';
function App() {

  const numRows = 25;
  const numCols = 40;

  const [grid, setGrid] = useState(() => {

    const rows = [];

    for (let i = 0; i < numRows; i++) {

      rows.push(Array.from(Array(numCols), () => 0));
    }

    return rows;
  })


  const operation = [[0, 1], [0, -1], [1, -1], [1, 0], [1, 1], [-1, -1], [-1, 0], [-1, 1]]
  const [running, setRunning] = useState(false);
  const [reset, setReset] = useState(false);

  useEffect(() => {
    setGrid(() => {

      const rows = [];

      for (let i = 0; i < numRows; i++) {

        rows.push(Array.from(Array(numCols), () => 0));
      }

      return rows;
    })
  }, [reset]);
  const runningRef = useRef();

  runningRef.current = running;

  const runSimulation = useCallback(() => {
    if (!runningRef.current) {
      return;
    }
    setGrid(g => {
      return produce(g, gridCopy => {
        for (let i = 0; i < numRows; i++) {
          for (let j = 0; j < numCols; j++) {
            let neighbours = 0;
            operation.forEach(([x, y]) => {
              const newI = i + x;
              const newJ = j + y;
              if (newI >= 0 && newI < numRows && newJ > 0 && newJ < numCols) {
                neighbours += g[newI][newJ];
              }

            })
            if (neighbours < 2 || neighbours > 3) {
              gridCopy[i][j] = 0;
            } else if (g[i][j] === 0 && neighbours === 3) {
              gridCopy[i][j] = 1;
            }

          }
        }
      })
    });

    setTimeout(runSimulation, 100);
  }, []);

  return (
    <div>
      <div style={{ textAlign: 'center' }}>
        <h1>Conway's Game of Life</h1>
      </div>
      <div class="button-container">
        <button onClick={() => {
          setRunning(true);
          runningRef.current = true;
          runSimulation();
        }}
          disabled={running}>Start</button>
        <button onClick={() => {
          setRunning(false);
          runningRef.current = false;
        }}>Stop</button>
        <button onClick={() => {
          setReset(!reset);
          setRunning(false);

        }}>Reset</button>
      </div>
      <div style={{
        width: '50%',
        margin: 'auto',
        display: 'grid',
        gridTemplateColumns: `repeat(${numCols},20px)`
      }}>
        {grid.map((rows, i) => {
          return rows.map((cols, j) => {
            return <div
              key={`${i} - ${j}`}
              onClick={() => {
                const newGrid = produce(grid, gridCopy => {
                  gridCopy[i][j] = gridCopy[i][j] ? 0 : 1;
                })

                setGrid(newGrid);
              }}
              style={{
                height: 20,
                width: 20,
                backgroundColor: grid[i][j] ? 'rgb(0, 189, 0)' : undefined,
                border: "solid 0.5px black",
                cursor: 'pointer'
              }
              }
            />
          })
        })}
      </div>
    </div>
  );
}

export default App;
