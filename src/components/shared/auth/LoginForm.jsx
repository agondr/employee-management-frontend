import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { useDispatch } from "react-redux";
import { useState } from "react";
import { login } from "@/store/authSlice";
import { useNavigate } from "react-router-dom";

// Skema e Formes ku i tregojme se qfar impute ka me pas forma dhe qfar validime ka me i kontrollu
const formSchema = z.object({
  email: z.string().email({ message: "Please enter valid email address" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters long" }),
});

const LoginForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState(null);
  // Definimi i formes ne baze te skemes dhe vlera default
  const form = useForm({
    resolver: zodResolver(formSchema),
  });
  //   Funksioni i dërgimit të formës - Submitimi i formës

  const onSubmit = async (data) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setErrorMessage(errorData.message || "Login failed");
        throw new Error(errorData.message || "Login failed");
      }

      const responseData = await response.json();

      // Store the token and user data in localStorage
      localStorage.setItem("token", responseData.token);
      localStorage.setItem("user", JSON.stringify(responseData.user));

      // Dispatch the login action with the form data
      dispatch(login(responseData.user));
      navigate("/overview", { replace: true });
    } catch (error) {
      console.error(error);
    }
    // Dispatch the login action with the form data
    // dispatch(login(data));
  };

  return (
    // {/* Forma nga shadcn */}
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2 w-96">
        <div className="text-center">
          <h1 className="text-primary font-bold text-2xl mb-1">Login</h1>
          <p className="text-sm font-normal text-muted-foreground">
            Welcome back! Please Login to continue.
          </p>
        </div>
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>E-mail</FormLabel>
              <FormControl>
                <Input
                  placeholder="email@example.com"
                  autoComplete="email"
                  {...field}
                  value={field.value || ""}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input
                  type={"password"}
                  placeholder="******"
                  autoComplete="current-password"
                  {...field}
                  value={field.value || ""}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {errorMessage && <p className="text-red-500 text-sm">{errorMessage}</p>}
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
};

export default LoginForm;
