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
    image,
    geometryType,
    size,
    fbmFrequency,
    fbmSpeed,
    fbmAmplitude,
    luminance
  } = useContext(SettingsContext);

  return (
    <div className="w-full h-screen">
      <div className="lg:absolute md:static lg:top-8 lg:left-8 lg:max-w-xs md:max-w-full md:w-full z-10">
        <Form />
      </div>

      <div className="w-full h-full">
        {
          image?.src && (
            <ThreejsRenderer
              base64Texture={image?.src}
              config={{
                geometryType,
                size,
                fbmFrequency,
                fbmSpeed,
                fbmAmplitude,
                luminance,
                optimised: true
              }}
            />
          )
        }
      </div>
      <div className="card">
         <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
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
    </div>
  )
}

export default App
