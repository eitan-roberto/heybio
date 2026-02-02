import { CSSProperties } from "react";
import { cn } from "@/lib/utils";

type SvgAssetProps = {
  src: string;                // "/branding/logo-text.svg"
  height?: number | string;   // 28 | "1.75rem"
  width?: number | string;    // optional override
  className?: string;
  color?: string;             // defaults to currentColor
};

export function SvgAsset({
  src,
  height,
  width,
  className,
  color = "currentColor",
}: SvgAssetProps) {
  const style: CSSProperties = {
    height,
    width,
    color,
  };

  return (
    <img
      src={src}
      alt=""
      draggable={false}
      className={cn(
        "inline-block max-w-none select-none",
        !width && height && "w-auto",
        !height && width && "h-auto",
        className
      )}
      style={style}
    />
  );
}
