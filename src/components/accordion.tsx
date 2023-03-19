import React, { useState } from "react";

interface AccordionProps {
  title: string;
  children: React.ReactNode;
}

const Accordion: React.FC<AccordionProps> = ({ title, children }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleAccordion = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="flex flex-col p-2 bg-red-400 rounded-xl w-screen">
      <div className="flex flex-row justify-center align-middle text-lg" onClick={toggleAccordion}>
        <h3 className="text-lg">{title}</h3>
        <div className="font-bold mx-2">{isOpen ? "-" : "+"}</div>
      </div>
      {isOpen && (
        <div className="">{children}</div>
      )}
    </div>
  );
};

export default Accordion;
