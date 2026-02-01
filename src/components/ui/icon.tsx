import { CSSProperties } from "react";
import { cn } from "@/lib/utils";

export enum IconSize {
  TINY = "tiny",      // 12px / w-3 h-3
  SMALL = "small",    // 16px / w-4 h-4
  MEDIUM = "medium",  // 20px / w-5 h-5
  LARGE = "large",    // 24px / w-6 h-6
  XLARGE = "xlarge",  // 32px / w-8 h-8
}

const getIconSizeClass = (size?: IconSize): string => {
  if (!size) return "";

  const sizeMap: Record<IconSize, string> = {
    [IconSize.TINY]: "w-3 h-3",
    [IconSize.SMALL]: "w-4 h-4",
    [IconSize.MEDIUM]: "w-5 h-5",
    [IconSize.LARGE]: "w-6 h-6",
    [IconSize.XLARGE]: "w-8 h-8",
  };
  return sizeMap[size];
};

interface IconProps {
  icon: string;
  size?: IconSize;
  folder?: string;
  className?: string;
}

export function Icon({
  icon,
  size,
  folder = "icons",
  className,
}: IconProps) {
  const iconStyles: CSSProperties = {
    backgroundColor: "currentColor",
    maskImage: `url(/${folder}/${icon}.svg)`,
    WebkitMaskImage: `url(/${folder}/${icon}.svg)`,
    maskSize: "cover",
    WebkitMaskSize: "cover",
    maskRepeat: "no-repeat",
    WebkitMaskRepeat: "no-repeat",
    maskPosition: "center",
    WebkitMaskPosition: "center",
  };

  return (
    <div
      className={cn("flex-shrink-0 inline-block", getIconSizeClass(size), className)}
      style={iconStyles}
    />
  );
}
