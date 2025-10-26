"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
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
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Wallet, Send } from "lucide-react";

const formSchema = z.object({
  accountId: z.string().min(1, { message: "Account ID is required." }),
});

type CheckBalanceFormProps = {
  onApiCall: (apiCall: () => Promise<any>) => void;
};

export function CheckBalanceForm({ onApiCall }: CheckBalanceFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      accountId: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    const { accountId } = values;
    const apiCall = async () => {
      const response = await fetch(`/proxy/accounts/${accountId}/balance`);
      if (!response.ok) {
        const errorData = await response
          .json()
          .catch(() => ({ message: response.statusText }));
        throw new Error(errorData.message || "Failed to check balance");
      }
      return response.json();
    };
    onApiCall(apiCall);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wallet /> Check Balance
        </CardTitle>
        <CardDescription>GET /accounts/:accountId/balance</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="accountId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Account ID</FormLabel>
                  <FormControl>
                    <Input placeholder="Account's unique ID" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full">
              <Send className="mr-2 h-4 w-4" /> Check Balance
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
