import React, { useState } from "react";
import { ChevronDown } from "lucide-react";

interface CollapsibleTermsProps {
  title?: string;
  summary?: string;
  content: string;
  className?: string;
}

const CollapsibleTermsAndConditions: React.FC<CollapsibleTermsProps> = ({
  title = "Terms and Conditions",
  summary = "Please review our terms and conditions before proceeding",
  content,
  className = "",
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      toggleExpanded();
    }
  };

  return (
    <div
      className={`w-full max-w-4xl mx-auto ${className}`}
      role="region"
      aria-label="Terms and Conditions Section"
    >
      {/* Collapsible Header */}
      <button
        onClick={toggleExpanded}
        onKeyDown={handleKeyDown}
        aria-expanded={isExpanded}
        aria-controls="terms-content"
        className={`
          w-full px-4 sm:px-6 py-4 sm:py-5
          flex items-center justify-between
          rounded-lg sm:rounded-xl
          transition-all duration-300 ease-in-out
          ${
            isExpanded
              ? "bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-300 shadow-md"
              : "bg-white border-2 border-gray-200 hover:border-blue-300 shadow-sm hover:shadow-md"
          }
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
          cursor-pointer
          group
        `}
      >
        {/* Header Content */}
        <div className="text-left flex-1">
          <h3
            className={`
              text-base sm:text-lg font-bold
              transition-colors duration-300
              ${
                isExpanded
                  ? "text-blue-900"
                  : "text-gray-800 group-hover:text-blue-700"
              }
            `}
          >
            {title}
          </h3>
          <p
            className={`
              text-xs sm:text-sm mt-1
              transition-colors duration-300
              ${
                isExpanded
                  ? "text-blue-700"
                  : "text-gray-600 group-hover:text-gray-700"
              }
            `}
          >
            {summary}
          </p>
        </div>

        {/* Arrow Indicator */}
        <div
          className={`
            ml-4 flex-shrink-0
            transition-transform duration-500 ease-in-out
            ${isExpanded ? "rotate-180" : "rotate-0"}
          `}
          aria-hidden="true"
        >
          <ChevronDown
            size={24}
            className={`
              transition-colors duration-300
              ${isExpanded ? "text-blue-600" : "text-gray-600 group-hover:text-blue-600"}
            `}
          />
        </div>
      </button>

      {/* Expandable Content */}
      <div
        id="terms-content"
        className={`
          overflow-visible
          transition-all duration-500 ease-in-out
          ${isExpanded ? "max-h-full opacity-100 visible" : "max-h-0 opacity-0 invisible"}
        `}
        style={{
          overflow: isExpanded ? "visible" : "hidden",
          maxHeight: isExpanded ? "none" : "0px",
        }}
      >
        <div
          className={`
            px-4 sm:px-6 py-4 sm:py-6
            bg-gradient-to-b from-blue-50 to-white
            border-2 border-t-0 border-blue-300 rounded-b-lg sm:rounded-b-xl
            transition-all duration-500 ease-in-out
            ${isExpanded ? "translate-y-0" : "-translate-y-2"}
          `}
          style={{
            display: isExpanded ? "block" : "none",
          }}
        >
          {/* Content with Scrolling */}
          <div
            className={`
              max-h-96 overflow-y-auto
              prose prose-sm sm:prose max-w-none
              text-gray-700 text-sm sm:text-base leading-relaxed
              pb-4
            `}
            style={{
              scrollBehavior: "smooth",
            }}
          >
            {/* If content is HTML string, use dangerouslySetInnerHTML, otherwise render as text */}
            {typeof content === "string" && content.includes("<") ? (
              <div dangerouslySetInnerHTML={{ __html: content }} />
            ) : (
              <div className="whitespace-pre-wrap">{content}</div>
            )}
          </div>

          {/* Footer with Accept Button - Always Visible */}
          <div
            className="mt-8 pt-8 border-t-2 border-gray-400 flex flex-col-reverse sm:flex-row gap-4 justify-end items-stretch w-full"
            style={{ display: "flex", visibility: "visible" }}
          >
            <button
              onClick={() => setIsExpanded(false)}
              className={`
                px-10 py-3
                rounded-full font-bold text-base
                transition-all duration-300
                bg-gradient-to-r from-red-600 to-red-700 text-white
                hover:shadow-lg active:scale-95
                focus:outline-none focus:ring-3 focus:ring-red-500 focus:ring-offset-2
                border-none shadow-md hover:transform hover:-translate-y-0.5
                cursor-pointer
              `}
              style={{ display: "block", visibility: "visible" }}
            >
              Close
            </button>
            <button
              className={`
                px-10 py-3
                rounded-full font-bold text-base text-white
                transition-all duration-300
                bg-gradient-to-r from-purple-700 to-cyan-500
                hover:shadow-lg active:scale-95
                shadow-md hover:transform hover:-translate-y-0.5
                focus:outline-none focus:ring-3 focus:ring-purple-500 focus:ring-offset-2
                border-none
                cursor-pointer
              `}
              style={{ display: "block", visibility: "visible" }}
            >
              I Agree
            </button>
          </div>
        </div>
      </div>

      {/* Indicator Dot */}
      {!isExpanded && (
        <div className="mt-2 flex justify-center">
          <div className="text-xs text-gray-500 flex items-center gap-2">
            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse"></div>
            Click to read more
          </div>
        </div>
      )}
    </div>
  );
};

export default CollapsibleTermsAndConditions;
