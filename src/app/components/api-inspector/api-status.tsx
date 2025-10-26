"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Power, Send } from "lucide-react";

type ApiStatusProps = {
  onApiCall: (apiCall: () => Promise<any>) => void;
};

export function ApiStatus({ onApiCall }: ApiStatusProps) {
  const checkStatus = () => {
    const apiCall = async () => {
      const response = await fetch("/proxy/");
      if (!response.ok) {
        const errorData = await response
          .json()
          .catch(() => ({ message: response.statusText }));
        throw new Error(errorData.message || "API is not responsive");
      }
      return response.json();
    };
    onApiCall(apiCall);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Power /> API Status
        </CardTitle>
        <CardDescription>GET /</CardDescription>
      </CardHeader>
      <CardContent>
        <Button onClick={checkStatus} className="w-full" variant="secondary">
          <Send className="mr-2 h-4 w-4" />
          Check API Status
        </Button>
      </CardContent>
    </Card>
  );
}
