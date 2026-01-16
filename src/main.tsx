import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import Scene from "./Three/FBO/Scene";
import SettingsContextWrapper from "./SettingsContext";

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <SettingsContextWrapper>
      {/*<App />*/}
      <Scene />
    </SettingsContextWrapper>
  </StrictMode>,
)
