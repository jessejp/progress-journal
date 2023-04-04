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
    <div className="flex w-screen flex-col rounded-xl bg-red-400 p-2">
      <div
        className="flex flex-row justify-center align-middle text-lg"
        onClick={toggleAccordion}
      >
        <h3 className="text-lg">{title}</h3>
        <div className="mx-2 font-bold">{isOpen ? "-" : "+"}</div>
      </div>
      {isOpen && <div className="">{children}</div>}
    </div>
  );
};

export default Accordion;
