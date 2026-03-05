import { createContext, useState, type ReactNode } from 'react';
import { type GeometryType } from "./Three/ParticleWithBufferGeometry/InstancedBufferGeometry.tsx";

export interface SettingsContextParams {
  image: HTMLImageElement;
  width: number;
  height: number;
  geometryType: GeometryType;
  size: number;
  fbmFrequency: number;
  fbmSpeed: number;
  fbmAmplitude: number;
  backgroundColor: string;
  luminance: number;
  firstRender: boolean;
  setImage: (newImage: HTMLImageElement) => void;
  setWidth: (newWidth: number) => void;
  setHeight: (newHeight: number) => void;
  setSize: (size: number) => void;
  setGeometryType: (geometryType: GeometryType) => void;
  setFbmFrequency: (fbmFrequency: number)  => void;
  setFbmSpeed: (fbmFrequency: number)  => void;
  setFbmAmplitude: (fbmFrequency: number)  => void;
  setBackgroundColor: (backgroundColor: string) => void;
  setLuminance: (luminance: number) => void;
  setFirstRender: (render: boolean) => void;
  timerIntroInMs: number;
}
export const SettingsContext = createContext<SettingsContextParams>(null);

interface Props {
  children: ReactNode;
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
  const [luminance, setLuminance] = useState<number>(1.1);
  const [firstRender, setFirstRender] = useState<boolean>(true);

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
      backgroundColor, setBackgroundColor,
      luminance, setLuminance,
      firstRender, setFirstRender,
      timerIntroInMs: 8000
    }}>
      {children}
    </SettingsContext >
  );
}

export default SettingsContextWrapper;