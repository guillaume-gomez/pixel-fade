import { useContext, useState } from "react";
import InputFileWithPreview from "./InputFileWithPreview";
import Range from ".//Range";
import Select from "./Select";
import { resizeImage, getAverageBackground } from "../utils";

import { SettingsContext } from "../SettingsContext";


function Form() {
  const {
    image, setImage,
    width, setWidth,
    height, setHeight,
    geometryType, setGeometryType,
    size, setSize,
    fbmFrequency, setFbmFrequency,
    fbmSpeed, setFbmSpeed,
    fbmAmplitude, setFbmAmplitude,
    backgroundColor, setBackgroundColor,
    luminance, setLuminance
  } = useContext(SettingsContext);
  const [collapse, setCollapse] = useState<boolean>(false);

  function uploadImage(newImage: HTMLImageElement) {
    setBackgroundColor(getAverageBackground(newImage));
    const expectedWidth = 200;
    const expectedHeight = Math.floor(newImage.height/newImage.width * 200);
    
    const resizedImage = resizeImage(newImage, expectedWidth, expectedHeight);
    setImage(resizedImage);
    
    setWidth(expectedWidth);
    setHeight(expectedHeight);
  }

  return (
    <div className="card bg-base-300 text-white gap-2" style={{padding: "0.75rem"}}>
      <div className="card-header flex justify-between bg-base-100 rounded">
        <span>Settings</span>
        <button onClick={() => setCollapse(!collapse)}> X </button>
      </div> 
      
        {!collapse && <div className="card-body p-0">
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
          max={30}
          step={0.1}
          float={true}
        /> 
        <Range 
          label="Luminance"
          value={luminance}
          onChange={(value) => setLuminance(value)}
          min={1.0}
          max={4.0}
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
      }
    </div>
  );
}

export default Form;