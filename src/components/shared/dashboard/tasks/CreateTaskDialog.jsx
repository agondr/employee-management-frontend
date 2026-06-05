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
import { MoveDownRight, MoveRight, MoveUpRight, Plus } from "lucide-react";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { apiFetch } from "@/lib/apiFetch";
import { addTask } from "@/store/tasksSlice";
import { useSelector } from "react-redux";
import { TaskUsersMultiSelect } from "./TaskUsersMultiSelect";

const formSchema = z.object({
  title: z.string().min(2, {
    message: "Title name must be at least 2 characters.",
  }),
  status: z.string({
    required_error: "Please select a status.",
  }),
  priority: z.string({
    required_error: "Please select priority.",
  }),
  assignedUserIds: z.array(z.number()).optional().default([])
});

function CreateTaskDialog() {
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const { data: employees } = useSelector((state) => state.employees);
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      status: "",
      priority: "",
      assignedUserIds: [],
    },
  });

  const onSubmit = async (values) => {
    setLoading(true);
    try {
      const result = await apiFetch(
        "/api/tasks/create",
        {
          method: "POST",
          body: JSON.stringify(values),
        },
        dispatch
      );

      dispatch(addTask(result));
      toast.success("Success", {
        description: "Task has ben created successfuly",
      });
      form.reset();
    } catch (error) {

      toast.error("Error", {
        description: error.message || "Failed to create task",
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
          Create New Task
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create new Task</DialogTitle>
          <DialogDescription>
            Provide Task detials you want to create.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Task title</FormLabel>
                  <FormControl>
                    <Input placeholder="Task title" {...field} value={field.value || ""} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Task status</FormLabel>

                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select task status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="todo">
                        <MoveDownRight />
                        ToDo
                      </SelectItem>
                      <SelectItem value="in-progress">
                        <MoveRight />
                        InProgress
                      </SelectItem>
                      <SelectItem value="done">
                        <MoveUpRight />
                        Done
                      </SelectItem>
                    </SelectContent>
                  </Select>

                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="priority"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Task priority</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select priority" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Low">
                        <MoveDownRight />
                        Low
                      </SelectItem>
                      <SelectItem value="Medium">
                        <MoveRight />
                        Medium
                      </SelectItem>
                      <SelectItem value="Hight">
                        <MoveUpRight />
                        Hight
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="assignedUserIds"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Assigned to</FormLabel>
                  <FormControl>
                    <TaskUsersMultiSelect
                      employees={employees}
                      value={field.value || []}
                      onChange={field.onChange}
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
              <Button type="submit">Save Changes</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export default CreateTaskDialog;
