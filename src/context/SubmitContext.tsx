import React, { createContext, useState, useContext, ReactNode } from 'react';
import {formValuesType} from '@/type/formType';

type SubmittedValuesContextType = {
  submittedValues: formValuesType;
  setSubmittedValues: React.Dispatch<React.SetStateAction<formValuesType>>;
}

const SubmittedValuesContext = createContext<SubmittedValuesContextType | undefined>(undefined);

export const useSubmittedValues = (): SubmittedValuesContextType => {
  const context = useContext(SubmittedValuesContext);
  if (!context) {
    throw new Error('useSubmittedValues must be used within a SubmittedValuesProvider');
  }
  return context;
};

type SubmittedValuesProviderProps = {
  children: ReactNode;
}

export const SubmittedValuesProvider: React.FC<SubmittedValuesProviderProps> = ({ children }) => {
  const [submittedValues, setSubmittedValues] = useState<formValuesType>({});
  
  return (
    <SubmittedValuesContext.Provider value={{ submittedValues, setSubmittedValues }}>
      {children}
    </SubmittedValuesContext.Provider>
  );
};
