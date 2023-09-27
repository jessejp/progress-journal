import clsx from "clsx";
import React, { useState, useRef, useEffect } from "react";
import { useAutoAnimate } from "@formkit/auto-animate/react";

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
  const [animationParent] = useAutoAnimate({ duration: 125 });
  const [isOpen, setIsOpen] = useState(defaultOpen);

  const toggleAccordion = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div
      ref={animationParent}
      className="flex w-full flex-col gap-3 rounded-md bg-neutral-700 p-3"
    >
      <div
        className="flex w-full grow flex-row justify-between align-middle"
        onClick={toggleAccordion}
      >
        <h3 className="text-base text-slate-100">{title}</h3>
        <div className="text-slate-100">{isOpen ? "-" : "+"}</div>
      </div>
      {isOpen && <>{children}</>}
    </div>
  );
};

export default Accordion;
