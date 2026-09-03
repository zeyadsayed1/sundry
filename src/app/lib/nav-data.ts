import type { NavLink } from "./nav-data.types";

export type { NavChild, NavLink } from "./nav-data.types";

export const NAV_LINKS: NavLink[] = [
  {
    label: "Home",
    href: "/",
  },
  {
    label: "Categories",
    href: "/categories",
  },
  {
    label: "Brands",
    href: "/brands",
  },
  {
    label: "Products",
    href: "/shop",
  },
];
