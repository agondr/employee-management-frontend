import Navbar from "@/components/shared/navbar/Navbar";

const Layout = ({ children }) => {
  return (
    <div className="container mx-auto ">
      <Navbar />
      <hr />
      <main className="px-5">{children}</main>
    </div>
  );
};

export default Layout;
