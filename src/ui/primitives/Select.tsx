import Image from "next/image";
import React, { type PropsWithChildren } from "react";

interface SelectProps extends PropsWithChildren {
  id: string;
  value: string;
  onChange?: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  formProps?: any;
}

const Select: React.FC<SelectProps> = ({
  id,
  value,
  children,
  onChange,
  formProps,
}) => {
  return (
    <div className="relative flex w-fit min-w-[8.875rem]">
      <select
        id={id}
        className="grow rounded-md px-3 py-2 text-sm leading-6 text-slate-900"
        value={value}
        onChange={onChange}
        {...formProps}
      >
        {children}
      </select>
      <Image
        width={1}
        height={1}
        className="absolute right-2 top-[0.6875rem] h-4 w-4"
        role="presentation"
        alt="select menu arrow"
        src="/icons/chevron-down.svg"
      />
    </div>
  );
};

export default Select;
