import React, { useRef, useState } from "react";

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

const AssetTransferForm: React.FC<AssetTransferFormProps> = ({
  data,
  onDataChange,
  isRequesterOnly = true,
}) => {
  const receivedSigCanvasRef = useRef<HTMLCanvasElement>(null);
  const releasedSigCanvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [activeCanvas, setActiveCanvas] = useState<
    "received" | "released" | null
  >(null);

  const initializeCanvas = (
    canvasRef: React.RefObject<HTMLCanvasElement>,
    signature: string,
  ) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      if (signature && signature.startsWith("data:image")) {
        const img = new Image();
        img.onload = () => {
          ctx.drawImage(img, 0, 0);
        };
        img.src = signature;
      }
    }
  };

  React.useEffect(() => {
    initializeCanvas(receivedSigCanvasRef, data.receivedBySignature);
  }, [data.receivedBySignature]);

  React.useEffect(() => {
    initializeCanvas(releasedSigCanvasRef, data.releasedBySignature);
  }, [data.releasedBySignature]);

  const startDrawing = (
    e:
      | React.MouseEvent<HTMLCanvasElement>
      | React.TouchEvent<HTMLCanvasElement>,
    side: "received" | "released",
  ) => {
    const canvas =
      side === "received"
        ? receivedSigCanvasRef.current
        : releasedSigCanvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = ("clientX" in e ? e.clientX : e.touches[0].clientX) - rect.left;
    const y = ("clientY" in e ? e.clientY : e.touches[0].clientY) - rect.top;

    ctx.beginPath();
    ctx.moveTo(x, y);
    setIsDrawing(true);
    setActiveCanvas(side);
  };

  const draw = (
    e:
      | React.MouseEvent<HTMLCanvasElement>
      | React.TouchEvent<HTMLCanvasElement>,
  ) => {
    if (!isDrawing) return;

    const canvas =
      activeCanvas === "received"
        ? receivedSigCanvasRef.current
        : releasedSigCanvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = ("clientX" in e ? e.clientX : e.touches[0].clientX) - rect.left;
    const y = ("clientY" in e ? e.clientY : e.touches[0].clientY) - rect.top;

    ctx.lineWidth = 1.5;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.strokeStyle = "#000000";
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    if (!isDrawing) return;
    setIsDrawing(false);

    if (activeCanvas === "received") {
      const canvas = receivedSigCanvasRef.current;
      if (canvas) {
        const signatureData = canvas.toDataURL("image/png");
        onDataChange({
          ...data,
          receivedBySignature: signatureData,
        });
      }
    } else if (activeCanvas === "released") {
      const canvas = releasedSigCanvasRef.current;
      if (canvas) {
        const signatureData = canvas.toDataURL("image/png");
        onDataChange({
          ...data,
          releasedBySignature: signatureData,
        });
      }
    }
    setActiveCanvas(null);
  };

  const clearSignature = (side: "received" | "released") => {
    const canvasRef =
      side === "received" ? receivedSigCanvasRef : releasedSigCanvasRef;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      onDataChange({
        ...data,
        [side === "received" ? "receivedBySignature" : "releasedBySignature"]:
          "",
      });
    }
  };

  return (
    <div className="w-full bg-white border-2 border-black p-8">
      {/* Title */}
      <div className="text-center mb-8 pb-4 border-b-2 border-black">
        <h2 className="text-lg font-bold tracking-wide">ASSET TRANSFER FORM</h2>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-2 gap-8">
        {/* LEFT SIDE - ASSETS RECEIVED BY */}
        <div className="border-r-2 border-black pr-8">
          <div className="mb-8">
            <h3 className="text-sm font-bold tracking-widest mb-6 border-b border-black pb-2">
              ASSETS RECEIVED BY:
            </h3>

            {/* Name Field */}
            <div className="mb-8">
              <label className="text-xs font-bold tracking-wider block mb-2">
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
                className="w-full border-b-2 border-black bg-transparent px-0 py-1 text-sm focus:outline-none"
                placeholder="_______________________________"
              />
            </div>

            {/* Signature Box */}
            <div>
              <label className="text-xs font-bold tracking-wider block mb-2">
                SIGNATURE:
              </label>
              <div className="border-2 border-black bg-white">
                <canvas
                  ref={receivedSigCanvasRef}
                  width={180}
                  height={80}
                  onMouseDown={(e) => startDrawing(e, "received")}
                  onMouseMove={draw}
                  onMouseUp={stopDrawing}
                  onMouseLeave={stopDrawing}
                  onTouchStart={(e) => startDrawing(e, "received")}
                  onTouchMove={draw}
                  onTouchEnd={stopDrawing}
                  className="w-full cursor-crosshair block bg-white"
                />
              </div>
              <button
                type="button"
                onClick={() => clearSignature("received")}
                className="mt-2 text-xs underline text-black hover:font-semibold"
              >
                Clear
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE - ASSETS RELEASED BY */}
        <div
          className={`pl-8 ${isRequesterOnly ? "opacity-50 pointer-events-none" : ""}`}
        >
          <div className="mb-8">
            <h3 className="text-sm font-bold tracking-widest mb-6 border-b border-black pb-2">
              ASSETS RELEASED BY:
              {isRequesterOnly && (
                <span className="text-xs font-normal ml-2 text-gray-600">
                  (Staff Only)
                </span>
              )}
            </h3>

            {/* Name Field */}
            <div className="mb-8">
              <label className="text-xs font-bold tracking-wider block mb-2">
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
                disabled={isRequesterOnly}
                className="w-full border-b-2 border-black bg-transparent px-0 py-1 text-sm focus:outline-none disabled:opacity-50"
                placeholder="_______________________________"
              />
            </div>

            {/* Signature Box */}
            <div>
              <label className="text-xs font-bold tracking-wider block mb-2">
                SIGNATURE:
              </label>
              <div className="border-2 border-black bg-white">
                <canvas
                  ref={releasedSigCanvasRef}
                  width={180}
                  height={80}
                  onMouseDown={(e) =>
                    !isRequesterOnly && startDrawing(e, "released")
                  }
                  onMouseMove={draw}
                  onMouseUp={stopDrawing}
                  onMouseLeave={stopDrawing}
                  onTouchStart={(e) =>
                    !isRequesterOnly && startDrawing(e, "released")
                  }
                  onTouchMove={draw}
                  onTouchEnd={stopDrawing}
                  className={`w-full block bg-white ${!isRequesterOnly ? "cursor-crosshair" : "cursor-not-allowed"}`}
                />
              </div>
              {!isRequesterOnly && (
                <button
                  type="button"
                  onClick={() => clearSignature("released")}
                  className="mt-2 text-xs underline text-black hover:font-semibold"
                >
                  Clear
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Date Field */}
      <div className="mt-8 pt-8 border-t-2 border-black flex items-center gap-2">
        <label className="text-sm font-bold tracking-wider whitespace-nowrap">
          DATE:
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
          className="px-3 py-2 text-sm border-b-2 border-black bg-white focus:outline-none focus:bg-gray-50 disabled:opacity-50"
        />
      </div>
    </div>
  );
};

export default AssetTransferForm;
