import { useState, useContext } from 'react';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import './App.css';
import Form from "./components/Form";
import { resizeImage, getAverageBackground } from "./utils";
import ThreejsRenderer from "./Three/ThreejsRenderer";
import { type GeometryType } from "./Three/InstancedBufferGeometry";

import { SettingsContext } from "./SettingsContext";

function App() {
  const [count, setCount] = useState(0)
  
  const {
    image, setImage,
    width, setWidth,
    height, setHeight,
    geometryType, setGeometryType,
    size, setSize,
    fbmFrequency, setFbmFrequency,
    fbmSpeed, setFbmSpeed,
    fbmAmplitude, setFbmAmplitude,
    backgroundColor, setBackgroundColor
  } = useContext(SettingsContext);

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <Form />

      <div>
        {
          image?.src && (
            <ThreejsRenderer
              backgroundColor={backgroundColor}
              width={width}
              height={height}
              base64Texture={image?.src}
              config={{
                geometryType,
                size,
                fbmFrequency,
                fbmSpeed,
                fbmAmplitude,
                optimised: true
              }}
            />
          )
        }
      </div>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}

export default App
