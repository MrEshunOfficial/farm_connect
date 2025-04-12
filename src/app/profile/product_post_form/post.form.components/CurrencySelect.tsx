// CurrencySelect.tsx
import React, { useState, ChangeEvent } from "react";
import { useCurrency } from "@/hooks/currencyContext";

interface Currency {
  code: string;
  name: string;
}

interface CurrencySelectProps {
  label?: string;
  placeholder?: string;
  onChange?: (currencyCode: string) => void;
  value?: string;
  watch?: string;
}

export const CurrencySelect: React.FC<CurrencySelectProps> = ({
  label = "Select Currency",
  placeholder = "Search currencies...",
  onChange,
  value,
  watch,
}) => {
  const { currencies, loading, error } = useCurrency();
  const [searchValue, setSearchValue] = useState<string>("");
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);

  // Use value prop to control the selected state
  const selectedCurrency = value || "";

  // Initialize searchValue with the matching currency when value changes
  React.useEffect(() => {
    if (value && currencies) {
      const currency = currencies.find((curr: Currency) => curr.code === value);
      if (currency) {
        setSearchValue(`${currency.code} - ${currency.name}`);
      }
    }
  }, [value, currencies]);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchValue(value);
    setIsDropdownOpen(true);
    const selected = currencies.find(
      (curr: Currency) => `${curr.code} - ${curr.name}` === value
    );
    if (selected) {
      onChange?.(selected.code);
    }
  };

  const handleCurrencySelect = (currency: Currency) => {
    setSearchValue(`${currency.code} - ${currency.name}`);
    setIsDropdownOpen(false);
    onChange?.(currency.code);
  };

  const filteredCurrencies = currencies
    ? currencies.filter((currency: Currency) =>
        `${currency.code} - ${currency.name}`
          .toLowerCase()
          .includes(searchValue.toLowerCase())
      )
    : [];

  if (loading)
    return <div className="text-gray-500 dark:text-gray-400">Loading...</div>;
  if (error)
    return (
      <div className="text-red-500 dark:text-red-400">
        Error: {error.message}
      </div>
    );
  if (!currencies)
    return (
      <div className="text-gray-500 dark:text-gray-400">No currencies</div>
    );

  return (
    <div className="space-y-4">
      <div className="flex flex-col space-y-2 relative">
        <label
          htmlFor="currency"
          className="flex items-center gap-2 text-sm font-medium dark:text-gray-200"
        >
          <span>
            {label} {watch ? `(${watch})` : ""}
          </span>
          <span>
            {selectedCurrency && (
              <div className="text-sm text-gray-600 dark:text-gray-400">
                ({selectedCurrency})
              </div>
            )}
            *
          </span>
        </label>
        <input
          type="text"
          id="currency"
          value={searchValue}
          onChange={handleInputChange}
          placeholder={placeholder}
          className="px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 dark:focus:ring-blue-400"
          onFocus={() => setIsDropdownOpen(true)}
          onBlur={() => setTimeout(() => setIsDropdownOpen(false), 200)}
        />
        {isDropdownOpen && (
          <div className="absolute top-full z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-80 overflow-y-auto dark:bg-gray-800 dark:border-gray-700">
            {filteredCurrencies.map((currency: Currency) => (
              <div
                key={currency.code}
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer dark:hover:bg-gray-700"
                onMouseDown={() => handleCurrencySelect(currency)}
              >
                {currency.code} - {currency.name}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CurrencySelect;
