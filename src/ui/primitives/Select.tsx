import clsx from "clsx";
import Image from "next/image";
import React, { type PropsWithChildren, forwardRef } from "react";

interface SelectProps extends PropsWithChildren {
  id: string;
  value: string;
  onChange?: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  formProps?: any;
  error?: string;
  disabled?: boolean;
}
type Ref = HTMLSelectElement;

const Select = forwardRef<Ref, SelectProps>(function Select(
  { id, value, children, onChange, formProps, error, disabled },
  ref
) {
  return (
    <>
      <div className="relative flex w-fit min-w-[8.875rem]">
        <select
          ref={ref}
          id={id}
          className={clsx(
            "grow rounded-md px-3 py-2 text-sm leading-6 text-slate-900",
            {
              "border-2 border-red-600": !!error,
              "border-2 border-transparent": !error,
            }
          )}
          value={value}
          onChange={onChange}
          disabled={disabled}
          {...formProps}
        >
          {children}
        </select>
        <Image
          width={1}
          height={1}
          className="absolute right-2 top-[0.875rem] h-4 w-4"
          role="presentation"
          alt="select menu arrow"
          src="/icons/chevron-down.svg"
        />
      </div>
      {!!error && (
        <div className="flex w-full flex-grow justify-end">
          <p className="w-fit text-red-600 max-sm:order-3">{error}</p>
        </div>
      )}
    </>
  );
});

export default Select;
