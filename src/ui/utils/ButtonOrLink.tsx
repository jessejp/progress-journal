import type { MouseEventHandler, PropsWithChildren } from "react";
import Link from "next/link";
import Image from "next/image";
import { type ButtonIntent } from "../primitives/Button";

interface Props {
  className: string;
  action?: MouseEventHandler | undefined;
  intent: ButtonIntent;
  link?: string;
  icon?: string;
  disabled?: boolean;
}

const ButtonOrLink: React.FC<PropsWithChildren<Props>> = ({
  children,
  className,
  action,
  link,
  icon,
  intent,
}) => {
  if (link) {
    return (
      <Link href={link} className={className}>
        {icon && (
          <Image
            src={`/icons/${icon}`}
            width={1}
            height={1}
            alt={`${icon.split(".")[0]} icon`}
            className="h-4 w-4"
          />
        )}
        {children}
      </Link>
    );
  } else if (action || !link) {
    return (
      <button
        onClick={action}
        className={className}
        disabled={intent === "disabled"}
      >
        {icon && (
          <Image
            src={`/icons/${icon}`}
            width={1}
            height={1}
            alt={`${icon.split(".")[0]} icon`}
            className="h-4 w-4"
          />
        )}
        {children}
      </button>
    );
  } else {
    return null;
  }
};

export default ButtonOrLink;
