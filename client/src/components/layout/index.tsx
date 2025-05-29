import type { PropsWithChildren } from "react";
import { Breadcrumb } from "../breadcrumb";
import { AppSidebar } from "../sidebar";

export const Layout: React.FC<PropsWithChildren> = ({ children }) => {
  return (
    <div className="layout">
      <AppSidebar />
      <div className="content">
        <Breadcrumb />
        {/* <ApiStatus /> */}
        <div className="page-content">
          {children}
        </div>
      </div>
    </div>
  );
};
