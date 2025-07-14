import { createContext, useContext, useState } from "react";

export interface SelectedTemplate {
  subject: string;
  message: string;
  filename?: string;
  variables?: string[];
  source?: "template" | "ai";
}

const TemplateContext = createContext<{
  selectedTemplate: SelectedTemplate | null;
  setSelectedTemplate: (t: SelectedTemplate | null) => void;
}>({
  selectedTemplate: null,
  setSelectedTemplate: () => {},
});

export const useTemplate = () => useContext(TemplateContext);

export const TemplateProvider = ({ children }: { children: React.ReactNode }) => {
  const [selectedTemplate, setSelectedTemplate] = useState<SelectedTemplate | null>(null);
  return (
    <TemplateContext.Provider value={{ selectedTemplate, setSelectedTemplate }}>
      {children}
    </TemplateContext.Provider>
  );
};