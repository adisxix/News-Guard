import Header from "./header";
import Footer from "./footer";
import { Outlet } from "react-router-dom";


const AppLayout = () => {
  return (
    <main className="min-h-screen bg-[#FDF0D5] flex flex-col">
      <Header />
      <div className="flex-1">
        <Outlet />
      </div>
      <Footer />
    </main>
  );
};

export default AppLayout;