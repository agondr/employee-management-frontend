import { Link, NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import { History } from "lucide-react";
import Logo from "@/assets/img/DarkWorkForceProLogo.svg";
import DropDownAvatar from "./DropDownAvatar";

const Navbar = () => {
  const currentUser = useSelector((state) => state.auth.user);
  const isAdmin = currentUser?.status === "admin";
  const navLinks = [
    { path: "/overview", label: "Overview" },
    { path: "/employees", label: "Employees" },
    { path: "/tasks", label: "Tasks" },
    ...(isAdmin ? [{ path: "/dashboard/audit-logs", label: "Audit Logs", icon: History }] : []),
  ];
  return (
    <nav className="flex justify-between items-center py-4 px-5 container mx-auto">
      <ul className="flex items-center gap-10">
        <li>
          <Link to={"/overview"}>
            <img src={Logo} alt="WorkForce Pro logo" />
          </Link>
        </li>
        {navLinks.map((link, index) => (
          <li key={index}>
            <NavLink
              aria-label="User menu"
              to={link.path}
              className={({ isActive }) =>
                isActive
                  ? "inline-flex items-center gap-2 text-slate-900 font-medium"
                  : "inline-flex items-center gap-2 text-muted-foreground font-normal"
              }
            >
              {link.icon && <link.icon className="h-4 w-4" />}
              {link.label}
            </NavLink>
          </li>
        ))}
      </ul>
      <DropDownAvatar />
    </nav>
  );
};

export default Navbar;
