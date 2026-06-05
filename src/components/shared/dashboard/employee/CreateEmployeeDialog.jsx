import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus } from "lucide-react";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useDispatch } from "react-redux";
import { useState } from "react";
import { apiFetch } from "@/lib/apiFetch";
import { addEmployees } from "@/store/employeesSlice";

const formSchema = z.object({
  username: z.string().min(2, {
    message: "Username name must be at least 2 characters.",
  }),
  email: z.string().email({ message: "Invalid email address." }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters." }),
});

function CreateEmployeeDialog() {
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const form = useForm({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (values) => {
    setLoading(true);
    try {
      const result = await apiFetch(
        "/api/auth/register",
        {
          method: "POST",
          body: JSON.stringify(values),
        },
        dispatch
      );
      const newEmployee = {
        user_id: result.id,
        user_name: result.username,
        email: result.email,
        status: result.status,
        department_name: "Unassigned",
      };
      dispatch(addEmployees(newEmployee));

      toast.success("Success", {
        description: "Employee has ben created successfuly",
      });
      form.reset();
    } catch (error) {
      toast.error("Error", {
        description: error.message || "Failed to create Employee",
      });
    } finally {
      setLoading(false);
    }
  }
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          <Plus />
          Create New Employee
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create new Employee</DialogTitle>
          <DialogDescription>
            Provide employee detials you want to create.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input placeholder="Username" autoComplete="username" {...field} value={field.value || ""} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>E-mail</FormLabel>
                  <FormControl>
                    <Input placeholder="email@example.com" autoComplete="email" {...field} value={field.value || ""} />
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
                    <Input type="password" placeholder="password" autoComplete="new-password" {...field} value={field.value || ""} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button type="submit">Save Changes</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export default CreateEmployeeDialog;
