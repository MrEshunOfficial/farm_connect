// SearchableCurrencyList.tsx
import React, { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useCurrency } from "@/hooks/currencyContext";
import { RefreshCcw } from "lucide-react";

export const SearchableCurrencyList: React.FC = () => {
  const { currencies, loading, error, refreshCurrencies } = useCurrency();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredCurrencies = currencies.filter(
    (currency) =>
      currency.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      currency.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return <div>Loading currencies...</div>;
  }

  if (error) {
    return (
      <div className="space-y-4">
        <p className="text-red-500">Error: {error.message}</p>
        <Button onClick={refreshCurrencies} variant="outline">
          <RefreshCcw className="mr-2 h-4 w-4" />
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Available Currencies</h2>
        <Button onClick={refreshCurrencies} variant="outline" size="sm">
          <RefreshCcw className="mr-2 h-4 w-4" />
          Refresh
        </Button>
      </div>

      <Input
        type="search"
        placeholder="Search currencies..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-full"
      />

      <ScrollArea className="h-96 rounded-md border">
        <div className="p-4">
          {filteredCurrencies.map((currency) => (
            <div
              key={currency.code}
              className="flex items-center py-2 hover:bg-gray-50 rounded px-2"
            >
              <span className="font-medium w-16">{currency.code}</span>
              <span className="text-gray-600">{currency.name}</span>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};
