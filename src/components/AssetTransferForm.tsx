import React, { useRef, useEffect, useCallback } from "react";
import SignatureCanvas from "react-signature-canvas";

interface AssetTransferData {
  receivedByName: string;
  receivedBySignature: string;
  releasedByName: string;
  releasedBySignature: string;
  date?: string;
}

interface AssetTransferFormProps {
  data: AssetTransferData;
  onDataChange: (data: AssetTransferData) => void;
  isRequesterOnly?: boolean;
}

const SignatureField: React.FC<{
  label: string;
  signatureData: string;
  onEnd: (dataUrl: string) => void;
  onClear: () => void;
  disabled?: boolean;
}> = ({ label, signatureData, onEnd, onClear, disabled }) => {
  const sigRef = useRef<SignatureCanvas>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const resizeCanvas = useCallback(() => {
    if (!sigRef.current || !containerRef.current) return;
    const canvas = sigRef.current.getCanvas();
    const container = containerRef.current;
    const ratio = Math.max(window.devicePixelRatio || 1, 1);
    const width = container.offsetWidth;
    const height = window.innerWidth < 768 ? 100 : 150; // Extremely compact on mobile

    canvas.width = width * ratio;
    canvas.height = height * ratio;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.scale(ratio, ratio);
    }

    // Restore signature if exists
    if (signatureData && signatureData.startsWith("data:image")) {
      sigRef.current.fromDataURL(signatureData, {
        width,
        height,
        ratio: 1,
      });
    }
  }, [signatureData]);

  useEffect(() => {
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);
    return () => window.removeEventListener("resize", resizeCanvas);
  }, [resizeCanvas]);

  // Load existing signature when data changes externally
  useEffect(() => {
    if (!sigRef.current) return;
    if (signatureData && signatureData.startsWith("data:image")) {
      const container = containerRef.current;
      if (!container) return;
      sigRef.current.fromDataURL(signatureData, {
        width: container.offsetWidth,
        height: window.innerWidth < 768 ? 100 : 150,
        ratio: 1,
      });
    } else if (!signatureData) {
      sigRef.current.clear();
    }
  }, [signatureData]);

  const handleEnd = () => {
    if (!sigRef.current || disabled) return;
    const dataUrl = sigRef.current.toDataURL("image/png");
    onEnd(dataUrl);
  };

  const handleClear = () => {
    if (sigRef.current) {
      sigRef.current.clear();
    }
    onClear();
  };

  return (
    <div>
      <label className="text-xs font-bold tracking-wider block mb-2 text-gray-700">
        {label}
      </label>
      <div
        ref={containerRef}
        className={`relative border-2 rounded-lg overflow-hidden transition-colors ${
          disabled
            ? "border-gray-200 bg-gray-50"
            : "border-[#730051]/30 bg-white hover:border-[#730051]/50"
        }`}
      >
        <SignatureCanvas
          ref={sigRef}
          penColor="#1a1a2e"
          minWidth={1.5}
          maxWidth={3}
          velocityFilterWeight={0.7}
          canvasProps={{
            className: `w-full block ${disabled ? "cursor-not-allowed opacity-40" : "cursor-crosshair"}`,
            style: { height: window.innerWidth < 768 ? "100px" : "150px", touchAction: "none" },
          }}
          onEnd={handleEnd}
          onBegin={() => {
            if (disabled && sigRef.current) {
              // Prevent drawing when disabled
              sigRef.current.off();
              setTimeout(() => sigRef.current?.on(), 0);
            }
          }}
        />
        {!disabled && !signatureData && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <span className="text-gray-300 text-sm italic">Sign here</span>
          </div>
        )}
      </div>
      {!disabled && (
        <button
          type="button"
          onClick={handleClear}
          className="mt-2 text-xs font-medium text-[#730051] hover:text-[#5a0040] hover:underline transition-colors"
        >
          Clear signature
        </button>
      )}
    </div>
  );
};

const AssetTransferForm: React.FC<AssetTransferFormProps> = ({
  data,
  onDataChange,
  isRequesterOnly = true,
}) => {
  return (
    <div className="w-full bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
      {/* Title */}
      <div className="bg-gradient-to-r from-[#730051] to-[#a0006e] px-4 py-2 sm:px-6 sm:py-4">
        <h2 className="text-xs sm:text-lg font-bold tracking-wide text-white text-center uppercase">
          Asset Transfer Form
        </h2>
      </div>

      {/* Two Column Layout - stacks on mobile */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-0 md:divide-x divide-gray-200">
        {/* LEFT SIDE - ASSETS RECEIVED BY */}
        <div className="p-3 sm:p-6">
          <div className="mb-1">
            <h3 className="text-xs sm:text-sm font-bold tracking-wide text-[#730051] mb-0.5">
              ASSETS RECEIVED BY
            </h3>
            <div className="h-0.5 w-8 bg-[#730051]/30 rounded-full mb-3"></div>
          </div>

          {/* Name Field */}
          <div className="mb-3 sm:mb-6">
            <label className="text-[10px] sm:text-xs font-bold tracking-wider block mb-1 text-gray-700">
              NAME:
            </label>
            <input
              type="text"
              value={data.receivedByName}
              onChange={(e) =>
                onDataChange({
                  ...data,
                  receivedByName: e.target.value,
                })
              }
              className="w-full border-b border-gray-300 focus:border-[#730051] bg-transparent px-0 py-1 text-sm transition-colors focus:outline-none"
              placeholder="Enter full name"
            />
          </div>

          {/* Signature */}
          <SignatureField
            label="SIGNATURE:"
            signatureData={data.receivedBySignature}
            onEnd={(dataUrl) =>
              onDataChange({ ...data, receivedBySignature: dataUrl })
            }
            onClear={() =>
              onDataChange({ ...data, receivedBySignature: "" })
            }
          />
        </div>

        {/* Divider and RIGHT SIDE - ASSETS RELEASED BY (Conditional) */}
        {!isRequesterOnly && (
          <>
            <div className="md:hidden border-t border-gray-200"></div>
            <div className="p-3 sm:p-6">
              <div className="mb-1">
                <h3 className="text-xs sm:text-sm font-bold tracking-wide text-[#730051] mb-0.5">
                  ASSETS RELEASED BY
                </h3>
                <div className="h-0.5 w-8 bg-[#730051]/30 rounded-full mb-3"></div>
              </div>

              {/* Name Field */}
              <div className="mb-3 sm:mb-6">
                <label className="text-[10px] sm:text-xs font-bold tracking-wider block mb-1 text-gray-700">
                  NAME:
                </label>
                <input
                  type="text"
                  value={data.releasedByName}
                  onChange={(e) =>
                    onDataChange({
                      ...data,
                      releasedByName: e.target.value,
                    })
                  }
                  className="w-full border-b border-gray-300 focus:border-[#730051] bg-transparent px-0 py-1 text-sm transition-colors focus:outline-none"
                  placeholder="Enter full name"
                />
              </div>

              {/* Signature */}
              <SignatureField
                label="SIGNATURE:"
                signatureData={data.releasedBySignature}
                onEnd={(dataUrl) =>
                  onDataChange({ ...data, releasedBySignature: dataUrl })
                }
                onClear={() =>
                  onDataChange({ ...data, releasedBySignature: "" })
                }
              />
            </div>
          </>
        )}
      </div>

      {/* Date Field */}
      <div className="px-4 sm:px-6 py-2 sm:py-4 border-t border-gray-200 bg-gray-50/50 flex flex-col sm:flex-row items-start sm:items-center gap-1 sm:gap-2">
        <label className="text-[10px] sm:text-sm font-bold tracking-wider text-gray-700 whitespace-nowrap uppercase">
          Date:
        </label>
        <input
          type="date"
          value={data.date || ""}
          onChange={(e) =>
            onDataChange({
              ...data,
              date: e.target.value,
            })
          }
          disabled={isRequesterOnly && !data.date}
          className="px-2 py-1 text-xs sm:text-sm border border-gray-300 rounded bg-white focus:outline-none focus:ring-1 focus:ring-[#730051]/20 focus:border-[#730051] disabled:opacity-50 w-full sm:w-auto"
        />
      </div>
    </div>
  );
};

export default AssetTransferForm;
