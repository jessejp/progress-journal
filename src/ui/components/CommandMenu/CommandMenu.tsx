import React, {
  type PropsWithChildren,
  useState,
  useEffect,
  useRef,
} from "react";

interface CommandMenuProps extends PropsWithChildren {
  button: React.ReactNode;
}

const CommandMenu: React.FC<CommandMenuProps> = ({ button, children }) => {
  const menuRef = useRef<HTMLDivElement>(null);
  const [showCommandMenu, setShowCommandMenu] = useState(false);

  useEffect(() => {
    if (!showCommandMenu) return;

    const closeMenu = (event: MouseEvent) => {
      if (
        showCommandMenu &&
        menuRef.current &&
        event.target !== null &&
        !menuRef.current?.contains(event.target as Node)
      )
        setShowCommandMenu(false);
    };
    window.addEventListener("mousedown", closeMenu);

    return () => window.removeEventListener("mousedown", closeMenu);
  }, [showCommandMenu]);

  return (
    <div className="relative h-fit w-fit" ref={menuRef}>
      {!!button && (
        <>
          {React.cloneElement(button as React.ReactElement, {
            action: (e: MouseEvent) => {
              e.preventDefault();
              setShowCommandMenu((state) => !state);
            },
          })}
        </>
      )}
      {!!showCommandMenu && (
        <div className="absolute -left-6 bottom-6 flex min-w-[13rem] flex-col items-start rounded-md bg-neutral-500 px-2 py-1.5 shadow">
          {children}
        </div>
      )}
    </div>
  );
};

export default CommandMenu;
