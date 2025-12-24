import { useState } from 'react';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import './App.css';
import InputFileWithPreview from "./components/InputFileWithPreview";
import Range from "./components/Range";
import Select from "./components/Select";
import { resizeImage } from "./utils";
import ThreejsRenderer from "./Three/ThreejsRenderer";
import { type GeometryType } from "./Three/InstancedBufferGeometry";

function App() {
  const [count, setCount] = useState(0)
  const [image, setImage] = useState<HTMLImageElement>();
  const [originalImage, setOriginalImage] = useState<HTMLImageElement>();
  const [width, setWidth] =  useState<number>(200);
  const [height, setHeight] =  useState<number>(200);
  
  const [geometryType, setGeometryType] = useState<GeometryType>("rounded");
  const [size, setSize] = useState<number>(1.0);
  const [fbmFrequency, setFbmFrequency] = useState<number>(1.0);
  const [fbmSpeed, setFbmSpeed] = useState<number>(10.0);
  const [fbmAmplitude, setFbmAmplitude] = useState<number>(0.8);
  
  function uploadImage(newImage: HTMLImageElement) {
    const expectedWidth = 200;
    const expectedHeight = Math.floor(newImage.height/newImage.width * 200);
    
    const resizedImage = resizeImage(newImage, expectedWidth, expectedHeight);
    setImage(resizedImage);
    
    setWidth(expectedWidth);
    setHeight(expectedHeight);

    setOriginalImage(newImage);
  }

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
      <div>
        <InputFileWithPreview 
          onChange={uploadImage}
          value={image}
        />
        <Select
          label="geometry type"
          value={geometryType}
          onChange={(newValue) => setGeometryType(newValue)}
          options={
            [
              {value: "rounded", label: "Rounded"},
              {value: "rectangle", label: "Rectangle"},
              {value: "circle", label: "Circle"}
            ]
          }
        />
        <Range 
          label="Size"
          value={size}
          onChange={(value) => setSize(value)}
          min={0.1}
          max={5.0}
          step={0.1}
          float={true}
        /> 
        <Range 
          label="fbmFrequency"
          value={fbmFrequency}
          onChange={(value) => setFbmFrequency(value)}
          min={0.1}
          max={100.0}
          step={0.1}
          float={true}
        /> 
        <Range 
          label="fbmSpeed"
          value={fbmSpeed}
          onChange={(value) => setFbmSpeed(value)}
          min={0.1}
          max={100.0}
          step={0.1}
          float={true}
        /> 
        <Range 
          label="fbmAmplitude"
          value={fbmAmplitude}
          onChange={(value) => setFbmAmplitude(value)}
          min={0.1}
          max={10.0}
          step={0.1}
          float={true}
        /> 
      </div>

      <div style={{width: "800px", height: "100vh", background: "transparent"}}>
        {
          image?.src && (
            <ThreejsRenderer
              backgroundColor="#333"
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
