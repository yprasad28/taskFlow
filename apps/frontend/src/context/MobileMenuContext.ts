import { createContext } from "react";

export interface MobileMenuContextType {
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
}

export const MobileMenuContext = createContext<MobileMenuContextType>({
  mobileOpen: false,
  setMobileOpen: () => {},
});
