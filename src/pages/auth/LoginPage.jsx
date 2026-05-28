import Aside from "@/components/shared/auth/Aside";
import LoginForm from "@/components/shared/auth/LoginForm";
import { Button } from "@/components/ui/button";
import React from "react";
import { Link } from "react-router-dom";

const LoginPage = () => {
  return (
    <div className="h-screen md:flex">
      <Aside />
      <div className="flex md:w-1/2 h-screen justify-center py-10 items-center bg-white relative">
        <Button asChild variant="ghost" className="absolute top-10 right-10">
          <Link to="/register">Register</Link>
        </Button>
        <LoginForm />
      </div>
    </div>
  );
};

export default LoginPage;
