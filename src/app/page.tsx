"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ApiStatus } from "@/app/components/api-inspector/api-status";
import { CreateCustomerForm } from "@/app/components/api-inspector/create-customer-form";
import { CreateAccountForm } from "@/app/components/api-inspector/create-account-form";
import { MakeTransactionForm } from "@/app/components/api-inspector/make-transaction-form";
import { CheckBalanceForm } from "@/app/components/api-inspector/check-balance-form";
import { GetStatementForm } from "@/app/components/api-inspector/get-statement-form";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function ApiInspectorPage() {
  const [result, setResult] = useState<string>(
    "Click an action to see API results..."
  );
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { toast } = useToast();

  const handleApiCall = async (apiCall: () => Promise<any>) => {
    setIsLoading(true);
    setResult("Sending request to the API...");
    try {
      const data = await apiCall();
      setResult(JSON.stringify(data, null, 2));
    } catch (error: any) {
      const errorMessage = error.message || "An unknown error occurred.";
      setResult(JSON.stringify({ error: errorMessage }, null, 2));
      toast({
        variant: "destructive",
        title: "API Error",
        description: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-background min-h-screen text-foreground font-body">
      <header className="py-8">
        <h1 className="text-4xl md:text-5xl font-headline font-extrabold text-center bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent/80">
          API Inspector
        </h1>
        <p className="text-center text-muted-foreground mt-2">
          A sleek and modern interface to test your financial API.
        </p>
      </header>
      <main className="container mx-auto px-4 pb-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          <div className="flex flex-col gap-6">
            <ApiStatus onApiCall={handleApiCall} />
            <CreateCustomerForm onApiCall={handleApiCall} />
            <CreateAccountForm onApiCall={handleApiCall} />
            <MakeTransactionForm onApiCall={handleApiCall} />
            <CheckBalanceForm onApiCall={handleApiCall} />
            <GetStatementForm onApiCall={handleApiCall} />
          </div>
          <div className="lg:sticky lg:top-8">
            <Card className="h-full shadow-lg shadow-primary/10">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  API Result
                  {isLoading && (
                    <Loader2 className="h-5 w-5 animate-spin text-primary" />
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-black/20 rounded-lg p-4 h-[calc(90vh-10rem)] max-h-[750px] overflow-auto border border-border">
                  <pre className="text-sm whitespace-pre-wrap break-all">
                    {result}
                  </pre>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
