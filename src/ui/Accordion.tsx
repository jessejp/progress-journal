import React, { type HTMLAttributes, useState } from "react";

interface AccordionProps {
  title: string;
  children: React.ReactNode;
}

const Accordion: React.FC<HTMLAttributes<AccordionProps>> = ({
  title,
  children,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleAccordion = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="flex flex-row flex-wrap justify-around gap-2 bg-slate-600 px-4 py-2 sm:justify-start">
      <div
        className="flex flex-row justify-center align-middle text-lg"
        onClick={toggleAccordion}
      >
        <h3 className="text-lg text-zinc-200">{title}</h3>
        <div className="mx-2 font-bold">{isOpen ? "-" : "+"}</div>
      </div>
      {isOpen && <>{children}</>}
    </div>
  );
};

export default Accordion;
