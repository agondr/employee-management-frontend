import Aside from "@/components/shared/auth/Aside";
import RegisterForm from "@/components/shared/auth/RegisterForm";
import { Button } from "@/components/ui/button";
import React from "react";
import { Link } from "react-router-dom";

const RegisterPage = () => {
  return (
    <div className="h-screen md:flex">
      <Aside />
      <div className="flex md:w-1/2 h-screen justify-center py-10 items-center bg-white relative">
        <Button asChild variant="ghost" className="absolute top-10 right-10">
          <Link to="/login">Login</Link>
        </Button>
        <RegisterForm />
      </div>
    </div>
  );
};

export default RegisterPage;
