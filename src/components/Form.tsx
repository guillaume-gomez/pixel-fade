import { useContext, useState, useEffect } from "react";
import InputFileWithPreview from "./InputFileWithPreview";
import Range from "./Range";
import Select from "./Select";
import sample from '/spectrum-colors-arranged-by-chance-III.jpg';
import { resizeImage, getAverageBackground } from "../utils";
import { useSpring, animated } from '@react-spring/web';
import { SettingsContext } from "../SettingsContext";
import { type GeometryType } from "../Three/ParticleWithBufferGeometry/InstancedBufferGeometry.tsx";


function Form() {
  const {
    image, setImage,
    setWidth,
    setHeight,
    geometryType, setGeometryType,
    size, setSize,
    spacing, setSpacing,
    fbmFrequency, setFbmFrequency,
    fbmSpeed, setFbmSpeed,
    fbmAmplitude, setFbmAmplitude,
    setBackgroundColor,
    luminance, setLuminance,
    firstRender, setFirstRender,
    timerIntroInMs
  } = useContext(SettingsContext);
  const [collapse, setCollapse] = useState<boolean>(false);

  const springsForm = useSpring({
    transformOrigin: "top",
    height: "auto",
    maxHeight: collapse ? 0 : "inherit",
    transform: collapse ? "scaleY(0)": "scaleY(1)",
    opacity: collapse ? 0 : 1,
  });

  const springsIcon = useSpring({
    stroke: "white",
    strokeWidth: "2px",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    d: collapse ? "M 2,4 L 8,12 L 14,4" : "M 2,14 L 8,4 L 14,14"
  });

  useEffect(() => {
    setTimeout(() => {
      startDefaultImage();
    }, timerIntroInMs);

  }, []);

  function scrollIntoCanvas() {
    const element = document.getElementById("three-js-renderer");
    if(!element) {
      return;
    }

    element.scrollIntoView({ behavior: "smooth" });
  }

  function uploadImage(newImage: HTMLImageElement) {
    setBackgroundColor(getAverageBackground(newImage));

    // if width is wider limit the width or vise versa
    const expectedWidth = newImage.width > newImage.height ? 
      200 :
      Math.floor(newImage.width/newImage.height * 200)
    ;
    // same computation as below but for the height
    const expectedHeight = newImage.width > newImage.height ?
      Math.floor(newImage.height/newImage.width * 200) :
      200
    ;
    
    const resizedImage = resizeImage(newImage, expectedWidth, expectedHeight);
    setImage(resizedImage);
    
    setWidth(expectedWidth);
    setHeight(expectedHeight);

    scrollIntoCanvas();

    setFirstRender(false);
  }

  function startDefaultImage() {
    const image = new Image();
    image.onload = () => {
      uploadImage(image);  
    }
    image.src = sample;
  }

  if(firstRender) {
    return <></>;
  }

  return (
    <div className="card bg-base-300 text-white gap-2 shadow-lg glass bg-transparent" style={{padding: "0.75rem"}}>
      <div
        className="card-header flex justify-between items-center bg-base-100 rounded hover:cursor-pointer"
        onClick={() => setCollapse(!collapse)}
      >
        <span className="px-2">Settings</span>
        <button
          className="btn btn-ghost"
          onClick={() => setCollapse(!collapse)}>
            <svg viewBox="0 0 16 16" width={20} height={20}>
              <animated.path
                style={springsIcon}
                d={springsIcon.d}
              />
            </svg>
        </button>
      </div> 
       
      <animated.div style={springsForm} className="card-body p-0">
        <InputFileWithPreview 
          onChange={uploadImage}
          value={image}
        />
     
        <Select
          label="geometry type"
          value={geometryType}
          onChange={(newValue) => setGeometryType(newValue as GeometryType)}
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
          label="Spacing"
          value={spacing}
          onChange={(value) => setSpacing(value)}
          min={1.0}
          max={5.0}
          step={0.01}
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
          
      </animated.div>      
    </div>
  );
}

export default Form;