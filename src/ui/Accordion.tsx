import clsx from "clsx";
import React, { useState } from "react";

interface AccordionProps {
  title: string;
  children: React.ReactNode;
  defaultOpen: boolean;
}

const Accordion: React.FC<AccordionProps> = ({
  title,
  children,
  defaultOpen = false,
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  const toggleAccordion = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div
      className={clsx(
        "my-2 flex flex-row flex-wrap items-center gap-2 rounded bg-slate-600 p-4 sm:justify-start",
        {
          "bg-slate-700": !isOpen,
          "bg-slate-600": !!isOpen,
        }
      )}
    >
      <div
        className="flex w-full grow flex-row justify-between align-middle text-lg"
        onClick={toggleAccordion}
      >
        <h3 className="text-lg text-zinc-200">{title}</h3>
        <div className="mx-2 font-bold">{isOpen ? "-" : "+"}</div>
      </div>
      {isOpen && (
          <>{children}</>
      )}
    </div>
  );
};

export default Accordion;
