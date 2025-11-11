import Header from "./Header";
import Footer from "./Footer";
import { ReactNode } from "react";

interface LayoutProps {
  children: ReactNode;
}

function Layout({ children }: LayoutProps) {
  return (
    <div className="flex flex-col min-h-screen overflow-x-hidden">
      <Header />
      <main className="flex-grow container mx-auto sm:p-4 bg-[#FFFEF0]/50">
        {children}
      </main>
      <Footer />
    </div>
  );
}

export default Layout;
