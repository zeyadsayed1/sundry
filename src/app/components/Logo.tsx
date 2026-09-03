import Image from "next/image";
import logoSvg from "@/app/icon.svg";

import type { LogoProps } from "./Logo.types";

export default function Logo({
  size = 36,
  showName = true,
  nameClassName = "text-[#F2EEE5] font-extrabold text-xl tracking-tight group-hover:text-[#F0AA4C] transition-colors duration-200",
}: LogoProps) {
  return (
    <span className="flex items-center gap-2.5">
      <Image
        src={logoSvg}
        alt="Sundry logo"
        width={size}
        height={size}
        priority
      />
      {showName && <span className={nameClassName}>Sundry</span>}
    </span>
  );
}
