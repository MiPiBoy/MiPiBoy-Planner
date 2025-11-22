import { createContext, useContext, useState, useEffect } from 'react';

export const SettingContext = createContext();

export function SettingProvider({ children }) {

// effectStatus
const [effectStatus, setEffectStatus] = useState(() => {
  const saved = localStorage.getItem('effectStatus');
  return saved === 'false' ? false : true;
});

useEffect(() => {
  localStorage.setItem('effectStatus', effectStatus);
}, [effectStatus]);


// mobileOptimizedMode
const [mobileOptimizedMode, setMobileOptimizedMode] = useState(() => {
  const saved = localStorage.getItem('mobileOptimizedMode');
  return saved === 'false' ? false : true;
});

useEffect(() => {
  localStorage.setItem('mobileOptimizedMode', mobileOptimizedMode);
}, [mobileOptimizedMode]);


  return (
    <SettingContext.Provider value={{
      effectStatus,
      setEffectStatus,
      mobileOptimizedMode,
      setMobileOptimizedMode
    }}>
      {children}
    </SettingContext.Provider>
  );
}

export const useSettingContext = () => useContext(SettingContext);