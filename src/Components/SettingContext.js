import { createContext, useContext, useState, useEffect } from 'react';

export const SettingContext = createContext();

export function SettingProvider({ children }) {

  const [effectStatus, setEffectStatus] = useState(() => {
    const saved = localStorage.getItem('effectStatus');
    return saved === 'false' ? false : true;
  });

  useEffect(() => {
    localStorage.setItem('effectStatus', effectStatus);
  }, [effectStatus]);

  return (
    <SettingContext.Provider value={{
      effectStatus,
      setEffectStatus
    }}>
      {children}
    </SettingContext.Provider>
  );
}

export const useSettingContext = () => useContext(SettingContext);