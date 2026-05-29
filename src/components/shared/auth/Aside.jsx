import Logo from "@/assets/img/WorkForceProLogo.svg";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
const Aside = () => {
  return (
    <div className="relativ overflow-hidden md:flex w-1/2 bg-primary flex-col justify-between hidden p-10">
      <img src={Logo} alt="WorkForcePro Logo" className="w-56" />
      <div className="space-y-1">
        <h1 className="text-white font-bold text-4xl font-sans">
          WorkForce Pro
        </h1>
        <p className="text-white">The must CRM in the world!</p>
        <Button variant={"secondary"} className="mt-3" asChild>
          <Link to="/">Home Page</Link>
        </Button>
      </div>
    </div>
  );
};

export default Aside;
