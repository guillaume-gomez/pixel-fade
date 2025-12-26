import { createContext, useContext, useState, ReacNode } from 'react';
import { type GeometryType } from "./Three/InstancedBufferGeometry";

export const SettingsContext = createContext(null);

interface Props {
  children: ReacNode;
}

function SettingsContextWrapper({children}: Props) {
  const [image, setImage] = useState<HTMLImageElement>();
  const [width, setWidth] =  useState<number>(200);
  const [height, setHeight] =  useState<number>(200);
  const [geometryType, setGeometryType] = useState<GeometryType>("rounded");
  const [size, setSize] = useState<number>(1.0);
  const [fbmFrequency, setFbmFrequency] = useState<number>(1.0);
  const [fbmSpeed, setFbmSpeed] = useState<number>(10.0);
  const [fbmAmplitude, setFbmAmplitude] = useState<number>(0.8);
  const [backgroundColor, setBackgroundColor] = useState<string>("#222");

  return (
    <SettingsContext value={{
      image, setImage,
      width, setWidth,
      height, setHeight,
      geometryType, setGeometryType,
      size, setSize,
      fbmFrequency, setFbmFrequency,
      fbmSpeed, setFbmSpeed,
      fbmAmplitude, setFbmAmplitude,
      backgroundColor, setBackgroundColor
    }}>
      {children}
    </SettingsContext >
  );
}

export default SettingsContextWrapper;