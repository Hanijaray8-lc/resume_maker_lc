import { createContext, useContext, useState } from "react";
const SectionContext = createContext();

export const SectionProvider = ({ children }) => {
  const [sections, setSections] = useState([]); // Selected sections
  const [currentIndex, setCurrentIndex] = useState(0); // Current section index

  const setSelectedSections = (list) => {
    setSections(list);
    setCurrentIndex(0); // Reset to first page
  };

  const goNext = () => {
    if (currentIndex < sections.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const goBack = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const currentSection = sections[currentIndex] || null;

  return (
    <SectionContext.Provider
      value={{ sections, setSelectedSections, currentIndex, currentSection, goNext, goBack }}
    >
      {children}
    </SectionContext.Provider>
  );
};

export const useSections = () => useContext(SectionContext);
