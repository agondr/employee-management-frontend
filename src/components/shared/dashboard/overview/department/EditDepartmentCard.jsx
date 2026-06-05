import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";
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
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Check, Loader2 } from "lucide-react";
import { apiFetch } from "@/lib/apiFetch";
import { useDispatch } from "react-redux";
import { updateDepartment } from "@/store/departmentsSlice";

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Department name must be at least 2 characters.",
  }),
});

function EditDepartmentCard() {
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const dispatch = useDispatch();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    },
  });

  useEffect(() => {
    const fetchDepartment = async () => {

      try {
        const result = await apiFetch(`/api/departments/${id}`, {}, dispatch);

        form.reset({ name: result.name });
      } catch (error) {
        toast.error("Error", {
          description: error.message || "An error occurred while loading the department.",
        });
      }
    };
    fetchDepartment();
  }, [id, form]);

  const onSubmit = async (values) => {
    setLoading(true);
    try {
      const result = await apiFetch(
        `/api/departments/${id}`,
        {
          method: "PUT",
          body: JSON.stringify(values),
        },
        dispatch
      );

      dispatch(updateDepartment(result));
      toast.success("Success", {
        description: "Department updated successfully.",
      });
      form.reset({ name: result.name });
    } catch (error) {
      toast.error("Error", {
        description: error.message || "An error occurred while updating the department.",
      });
    } finally {
      setLoading(false);
    }
  }
  if (notFound) {
    return (
      <Card className="lg:w-96 w-full text-red-500">
        <CardHeader>
          <CardTitle>Department Not Found</CardTitle>
          <CardDescription>
            The department you are trying to edit does not exist.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-center text-red-500 font-bold">
            Please check the department ID and try again.
          </p>
        </CardContent>
      </Card>
    );
  }
  return (
    <Card className="lg:w-96 w-full">
      <CardHeader>
        <CardTitle>Edit Department</CardTitle>
        <CardDescription>Update the department{"'"}s</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Department name</FormLabel>
                  <FormControl>
                    <Input placeholder="Department name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={loading}>
              {loading ? <Loader2 className="animate-spin" /> : <Check className="w-4 h-4" />} Update Department
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

export default EditDepartmentCard;
