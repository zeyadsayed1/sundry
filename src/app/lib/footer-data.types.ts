import type { IconType } from "react-icons";

export interface FooterNavLink {
  label: string;
  href: string;
}

export interface FooterSection {
  heading: string;
  links: FooterNavLink[];
}

export interface SocialLink {
  icon: IconType;
  label: string;
  href: string;
}
