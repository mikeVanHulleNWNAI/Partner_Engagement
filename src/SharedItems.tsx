import { useState, createContext, ReactNode, useContext, Dispatch, SetStateAction } from "react";

interface SharedItemsContextType {
    busyCount: number;
    setBusyCount: Dispatch<SetStateAction<number>>;
}

export const SharedItemsContext = createContext<SharedItemsContextType | undefined>(undefined);

export const useSharedItems = () => {
  const context = useContext(SharedItemsContext);
  if (!context) {
    throw new Error('useSharedItems must be used within a SharedItems provider');
  }
  return context;
};

interface SharedItemsProps {
    children: ReactNode;
}

export const SharedItems = ({ children }: SharedItemsProps) => {
    const [busyCount, setBusyCount] = useState(0);

    return (
        <SharedItemsContext.Provider value={{ busyCount, setBusyCount }}>
            {children}
        </SharedItemsContext.Provider>
    );
};