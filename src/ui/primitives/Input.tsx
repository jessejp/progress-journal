import clsx from "clsx";
import React from "react";

interface InputProps {
  id: string;
  placeholder: string;
  formProps: any;
  inputType: string;
  error: string | undefined;
}

const Input: React.FC<InputProps> = ({
  id,
  placeholder,
  formProps,
  inputType,
  error,
}) => {
  return (
    <>
      <input
        id={id}
        placeholder={placeholder}
        type={inputType}
        className={clsx(
          "w-full rounded-md px-3 py-2 text-base text-slate-900",
          {
            "border-2 border-red-600": !!error,
            "border-2 border-transparent": !error,
          }
        )}
        {...formProps}
      />
      {!!error && (
        <div className="flex w-full flex-grow justify-end">
          <p className="w-fit text-red-600 max-sm:order-3">{error}</p>
        </div>
      )}
    </>
  );
};

export default Input;
