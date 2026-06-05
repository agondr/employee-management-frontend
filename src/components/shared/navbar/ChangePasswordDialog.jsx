import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff } from "lucide-react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { changePassword } from "@/store/authSlice";

const formSchema = z
  .object({
    currentPassword: z.string().min(6),
    newPassword: z.string().min(6, {
      message: "Password must be at least 6 characters long",
    }),
    confirmPassword: z.string().min(6),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

const defaultValues = {
  currentPassword: "",
  newPassword: "",
  confirmPassword: "",
};

function PasswordInput({ field, visible, onToggle, autoComplete }) {
  return (
    <div className="relative">
      <Input
        type={visible ? "text" : "password"}
        autoComplete={autoComplete}
        className="pr-10"
        {...field}
        value={field.value || ""}
      />
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="absolute right-0 top-0 h-9 w-9 text-muted-foreground hover:text-foreground"
        onClick={onToggle}
      >
        {visible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        <span className="sr-only">
          {visible ? "Hide password" : "Show password"}
        </span>
      </Button>
    </div>
  );
}

function ChangePasswordDialog({ open, onOpenChange }) {
  const dispatch = useDispatch();
  const [submitting, setSubmitting] = useState(false);
  const [visibleFields, setVisibleFields] = useState({
    currentPassword: false,
    newPassword: false,
    confirmPassword: false,
  });

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const toggleVisibility = (fieldName) => {
    setVisibleFields((current) => ({
      ...current,
      [fieldName]: !current[fieldName],
    }));
  };

  const handleOpenChange = (nextOpen) => {
    if (!nextOpen) {
      form.reset(defaultValues);
    }

    onOpenChange(nextOpen);
  };

  const onSubmit = async (values) => {
    setSubmitting(true);

    try {
      await dispatch(
        changePassword({
          currentPassword: values.currentPassword,
          newPassword: values.newPassword,
        }),
      ).unwrap();

      toast.success("Password updated successfully");
      form.reset(defaultValues);
      onOpenChange(false);
    } catch (error) {
      toast.error(error || "Failed to update password");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>Change Password</DialogTitle>
          <DialogDescription>
            Update the password used to access your account.
          </DialogDescription>
        </DialogHeader>

        <Separator />

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="currentPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Current Password</FormLabel>
                  <FormControl>
                    <PasswordInput
                      field={field}
                      visible={visibleFields.currentPassword}
                      autoComplete="current-password"
                      onToggle={() => toggleVisibility("currentPassword")}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="newPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New Password</FormLabel>
                  <FormControl>
                    <PasswordInput
                      field={field}
                      visible={visibleFields.newPassword}
                      autoComplete="new-password"
                      onToggle={() => toggleVisibility("newPassword")}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Password</FormLabel>
                  <FormControl>
                    <PasswordInput
                      field={field}
                      visible={visibleFields.confirmPassword}
                      autoComplete="new-password"
                      onToggle={() => toggleVisibility("confirmPassword")}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                disabled={submitting}
                onClick={() => handleOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={submitting}>
                {submitting ? "Updating..." : "Change Password"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export default ChangePasswordDialog;
