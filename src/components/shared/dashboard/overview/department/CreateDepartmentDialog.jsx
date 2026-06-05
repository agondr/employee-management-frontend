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
import { addDepartment } from "@/store/departmentsSlice";
import { apiFetch } from "@/lib/apiFetch";

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Department name must be at least 2 characters.",
  }),
});

function CreateDepartmentDialog() {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const form = useForm({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const result = await apiFetch(
        "/api/departments",
        {
          method: "POST",
          body: JSON.stringify(data),
        },
        dispatch
      );
      dispatch(addDepartment(result));
      toast.success("Success", {
        description: `Department "${result.name}" created successfully!`,
      });
      form.reset();
    } catch (error) {
      toast.error("Error", {
        description:
          error.message || "An error occurred while creating the department.",
      });
    } finally {
      setLoading(false);
    }
  };
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          <Plus />
          Create New Departments
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create new Department</DialogTitle>
          <DialogDescription>
            Provide department detials you want to create.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Department name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Department name"
                      {...field}
                      value={field.value || ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button type="submit" disabled={loading}>
                {loading ? "Creating..." : "Create"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export default CreateDepartmentDialog;
