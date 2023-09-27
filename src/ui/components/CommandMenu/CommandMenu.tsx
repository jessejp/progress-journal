import React, {
  type PropsWithChildren,
  useState,
  useEffect,
  useRef,
} from "react";
import Button, {
  type ButtonIntent,
  type ButtonVariant,
} from "../../primitives/Button";

interface CommandMenuProps extends PropsWithChildren {
  button: {
    text?: string;
    intent: ButtonIntent;
    variant: ButtonVariant;
    icon: string;
  };
}

const CommandMenu: React.FC<CommandMenuProps> = ({ button, children }) => {
  const menuRef = useRef<HTMLDivElement>(null);
  const { intent, variant, icon } = button;
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
      <Button
        intent={intent}
        variant={variant}
        icon={icon}
        action={(e) => {
          e.preventDefault();
          setShowCommandMenu((state) => !state);
        }}
      >
        {button.text}
      </Button>
      {!!showCommandMenu && (
        <div className="absolute bottom-6 -left-6 flex min-w-[13rem] flex-col items-start rounded-md bg-neutral-500 px-2 py-1.5 shadow">
          {children}
        </div>
      )}
    </div>
  );
};

export default CommandMenu;
