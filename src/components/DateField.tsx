import React from "react";

interface DateFieldProps {
  value?: string;
  onChange?: (date: string) => void;
  readOnly?: boolean;
}

const DateField: React.FC<DateFieldProps> = ({
  value = "",
  onChange,
  readOnly = false,
}) => {
  return (
    <div className="w-full bg-white border-2 border-gray-400 p-6 rounded-sm">
      {/* Label and Input Line */}
      <div className="flex items-center gap-6">
        <label className="text-sm font-bold tracking-wider whitespace-nowrap">
          DATE:
        </label>

        {/* Input Method 1: Date Picker */}
        <input
          type="date"
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          disabled={readOnly}
          className="flex-1 border-b-2 border-black bg-transparent px-2 py-1 text-sm focus:outline-none disabled:opacity-50"
        />
      </div>

      {/* Alternative: Manual Line for Handwriting */}
      <div className="mt-4 pt-4 border-t border-gray-300">
        <p className="text-xs text-gray-500 mb-2">
          Or write date manually below:
        </p>
        <div className="flex items-center">
          <span className="text-xs font-bold mr-4 text-gray-700">DATE:</span>
          <div className="flex-1 border-b-2 border-black h-6"></div>
        </div>
      </div>
    </div>
  );
};

export default DateField;
