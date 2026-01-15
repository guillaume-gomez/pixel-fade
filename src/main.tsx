import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import SettingsContextWrapper from "./SettingsContext";

import Scene from "./Three/FBO/Scene";

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <SettingsContextWrapper>
      {/*<App />*/}
      <Scene />
    </SettingsContextWrapper>
  </StrictMode>,
)
