import React, { ReactNode } from "react";
import Navbar from "../ui/Navbar";

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <>
     
        <div>
            <Navbar />
        <div >{children}</div>
      </div>
    </>
  );
};

export default Layout;
