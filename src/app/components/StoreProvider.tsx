"use client";

import { Provider } from "react-redux";
import { store } from "@/redux/store";
import type { StoreProviderProps } from "./StoreProvider.types";

export default function StoreProvider({ children }: StoreProviderProps) {
  return <Provider store={store}>{children}</Provider>;
}
