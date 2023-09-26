import type { MouseEventHandler, PropsWithChildren } from "react";
import Link from "next/link";
import Image from "next/image";

interface Props {
  className: string;
  action?: MouseEventHandler | undefined;
  link?: string;
  icon?: string;
}

const ButtonOrLink: React.FC<PropsWithChildren<Props>> = ({
  children,
  className,
  action,
  link,
  icon,
}) => {
  if (action) {
    return (
      <button onClick={action} className={className}>
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
  } else if (link) {
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
  } else {
    return null;
  }
};

export default ButtonOrLink;
