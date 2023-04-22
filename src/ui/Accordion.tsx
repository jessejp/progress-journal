import clsx from "clsx";
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
    <div
      className={clsx(" px-4 py-2", {
        "bg-slate-700": !isOpen,
        "bg-slate-600": !!isOpen,
      })}
    >
      <div
        className="flex w-full grow flex-row justify-between align-middle text-lg"
        onClick={toggleAccordion}
      >
        <h3 className="text-lg text-zinc-200">{title}</h3>
        <div className="mx-2 font-bold">{isOpen ? "-" : "+"}</div>
      </div>
      {isOpen && (
        <div className="mt-2 flex flex-row flex-wrap justify-evenly gap-2 sm:justify-start">
          {children}
        </div>
      )}
    </div>
  );
};

export default Accordion;
