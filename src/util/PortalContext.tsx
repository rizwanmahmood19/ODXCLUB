import React, { createContext, useState } from 'react';
import { noop } from './noop';

type PortalContextState = {
  gates: Record<string, JSX.Element>;
  teleport: (gateName: string, element: JSX.Element | null) => void;
};

export const PortalContext = createContext<PortalContextState>({
  gates: {},
  teleport: noop,
});

export const PortalProvider: React.FC = ({ children }) => {
  const [gates, setGates] = useState({});
  const teleport = (gateName: string, element: JSX.Element | null) => {
    setGates({ ...gates, [gateName]: element });
  };
  return (
    <PortalContext.Provider value={{ gates, teleport }}>
      {children}
    </PortalContext.Provider>
  );
};

export const PortalGate: React.FC<{
  gateName: string;
  children?: (
    teleport: (gateName: string, element: JSX.Element | null) => void,
  ) => JSX.Element;
}> = ({ children, gateName }) => (
  <PortalContext.Consumer>
    {({ gates, teleport }) => {
      return (
        <>
          {gates[gateName]}
          {children && children(teleport)}
        </>
      );
    }}
  </PortalContext.Consumer>
);
