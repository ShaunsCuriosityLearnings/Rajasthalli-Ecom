"use client";

import { useRef } from "react";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { userFormSchema, UserFormValues } from "@repo/types";
import {
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetClose,
} from "@/components/ui/sheet";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import { Button } from "./ui/button";

const AddUser = () => {
  const router = useRouter();
  const { getToken } = useAuth();
  const closeRef = useRef<HTMLButtonElement>(null);

  const form = useForm<UserFormValues>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      address: "",
      city: "",
    },
  });

  const mutation = useMutation({
    mutationFn: async (payload: any) => {
      const token = await getToken();
      const baseUrl = process.env.NEXT_PUBLIC_USER_SERVICE_URL || "http://localhost:8004";

      const res = await fetch(`${baseUrl}/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.message || "Failed to create user");
      }
      return res.json();
    },
    onSuccess: () => {
      form.reset();
      router.refresh();
      closeRef.current?.click();
    },
    onError: (error: any) => {
      console.error("Error creating user:", error);
      alert(error.message || "An error occurred. Please try again.");
    },
  });

  const onSubmit = (values: UserFormValues) => {
    const [firstName, ...lastNameParts] = values.fullName.trim().split(/\s+/);
    const lastName = lastNameParts.join(" ") || "";
    // Generate a temporary strong password meeting Clerk constraints
    const password = Math.random().toString(36).slice(-8) + "Aa1!";

    const payload = {
      emailAddress: [values.email],
      phoneNumber: [values.phone],
      firstName,
      lastName,
      password,
      publicMetadata: {
        address: values.address,
        city: values.city,
      },
    };

    mutation.mutate(payload);
  };

  return (
    <SheetContent className="overflow-y-auto">
      <SheetHeader>
        <SheetTitle className="mb-4">Add User</SheetTitle>
        <SheetDescription asChild>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 pb-6">
              <FormField
                control={form.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="John Doe" />
                    </FormControl>
                    <FormDescription>Enter user full name.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="john.doe@example.com" />
                    </FormControl>
                    <FormDescription>
                      Only admin can see your email.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="+1234567890" />
                    </FormControl>
                    <FormDescription>
                      Only admin can see your phone number (optional)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="123 Main St" />
                    </FormControl>
                    <FormDescription>
                      Enter user address (optional)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>City</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="New York" />
                    </FormControl>
                    <FormDescription>
                      Enter user city (optional)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={mutation.isPending} className="w-full">
                {mutation.isPending ? "Submitting..." : "Submit"}
              </Button>

              <SheetClose asChild>
                <button ref={closeRef} className="hidden" type="button" />
              </SheetClose>
            </form>
          </Form>
        </SheetDescription>
      </SheetHeader>
    </SheetContent>
  );
};

export default AddUser;
