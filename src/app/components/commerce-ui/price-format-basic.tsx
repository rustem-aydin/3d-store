"use client";
import NumberFlow from "@number-flow/react";

const PriceFormat_Basic = ({
  value,
  className = "text-xl font-black text-purple-800 dark:text-purple-300",
}: {
  value: number;
  className?: string;
}) => {
  return (
    <NumberFlow
      format={{
        style: "currency",
        currency: "TRY",
        trailingZeroDisplay: "stripIfInteger",
      }}
      value={value}
      className={className}
    />
  );
};

export default PriceFormat_Basic;
