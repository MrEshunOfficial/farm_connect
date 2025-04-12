"use client";

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from "react";

// types
export interface Currency {
  code: string;
  name: string;
}

interface CurrencyContextState {
  currencies: Currency[];
  loading: boolean;
  error: Error | null;
}

interface CurrencyContextValue extends CurrencyContextState {
  refreshCurrencies: () => Promise<void>;
}

// Initial state with empty array for currencies
const initialState: CurrencyContextState = {
  currencies: [],
  loading: true,
  error: null,
};

// Create context with default value
const CurrencyContext = createContext<CurrencyContextValue>({
  ...initialState,
  refreshCurrencies: async () => {},
});

export const CurrencyProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [state, setState] = useState<CurrencyContextState>(initialState);

  const fetchCurrencies = async () => {
    try {
      const response = await fetch(
        "https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies.json"
      );

      if (!response.ok) {
        throw new Error("Failed to fetch currencies");
      }

      const data = await response.json();

      // Ensure data exists before transformation
      if (!data) {
        throw new Error("No data received from API");
      }

      // Transform the data into our Currency type with type safety
      const currencies: Currency[] = Object.entries(data).map(
        ([code, name]) => ({
          code,
          name: String(name), // Ensure name is string
        })
      );

      setState((prev) => ({
        ...prev,
        currencies: currencies || [], // Fallback to empty array if undefined
        loading: false,
        error: null,
      }));
    } catch (error) {
      console.error("Error fetching currencies:", error);
      setState((prev) => ({
        ...prev,
        currencies: [], // Reset to empty array on error
        loading: false,
        error: error instanceof Error ? error : new Error("An error occurred"),
      }));
    }
  };

  const refreshCurrencies = useCallback(async () => {
    setState((prev) => ({ ...prev, loading: true, error: null }));
    await fetchCurrencies();
  }, []);

  useEffect(() => {
    fetchCurrencies();
  }, []);

  const value = {
    ...state,
    refreshCurrencies,
  };

  return (
    <CurrencyContext.Provider value={value}>
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error("useCurrency must be used within a CurrencyProvider");
  }
  return context;
};

export default CurrencyProvider;
