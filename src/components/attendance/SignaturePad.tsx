import React, { useRef, useEffect } from 'react';

interface SignaturePadProps {
    onSignatureChange: (signature: string) => void;
    loading: boolean;
}

const SignaturePad: React.FC<SignaturePadProps> = ({ onSignatureChange, loading }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let isDrawing = false;
        let lastX = 0;
        let lastY = 0;

        const startDrawing = (e: MouseEvent | TouchEvent) => {
            if (loading) return;
            isDrawing = true;
            const rect = canvas.getBoundingClientRect();
            const clientX = 'touches' in e ? e.touches[0].clientX : (e as MouseEvent).clientX;
            const clientY = 'touches' in e ? e.touches[0].clientY : (e as MouseEvent).clientY;
            lastX = clientX - rect.left;
            lastY = clientY - rect.top;
        };

        const draw = (e: MouseEvent | TouchEvent) => {
            if (!isDrawing || !ctx || loading) return;
            if ('touches' in e) e.preventDefault();

            const rect = canvas.getBoundingClientRect();
            const clientX = 'touches' in e ? e.touches[0].clientX : (e as MouseEvent).clientX;
            const clientY = 'touches' in e ? e.touches[0].clientY : (e as MouseEvent).clientY;
            const currentX = clientX - rect.left;
            const currentY = clientY - rect.top;

            ctx.lineWidth = 2;
            ctx.lineCap = 'round';
            ctx.strokeStyle = '#730051';
            ctx.beginPath();
            ctx.moveTo(lastX, lastY);
            ctx.lineTo(currentX, currentY);
            ctx.stroke();

            lastX = currentX;
            lastY = currentY;
        };

        const stopDrawing = () => {
            if (isDrawing) {
                isDrawing = false;
                onSignatureChange(canvas.toDataURL());
            }
        };

        const handleMouseUp = () => stopDrawing();
        const handleTouchEnd = () => stopDrawing();

        canvas.addEventListener('mousedown', startDrawing);
        canvas.addEventListener('mousemove', draw);
        window.addEventListener('mouseup', handleMouseUp);
        canvas.addEventListener('touchstart', startDrawing, { passive: false });
        canvas.addEventListener('touchmove', draw, { passive: false });
        window.addEventListener('touchend', handleTouchEnd);

        return () => {
            canvas.removeEventListener('mousedown', startDrawing);
            canvas.removeEventListener('mousemove', draw);
            window.removeEventListener('mouseup', handleMouseUp);
            canvas.removeEventListener('touchstart', startDrawing);
            canvas.removeEventListener('touchmove', draw);
            window.removeEventListener('touchend', handleTouchEnd);
        };
    }, [onSignatureChange, loading]);

    const clearSignature = () => {
        const canvas = canvasRef.current;
        if (canvas) {
            const ctx = canvas.getContext('2d');
            if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
        onSignatureChange('');
    };

    return (
        <div className="border border-gray-200 rounded-lg p-2 bg-white">
            <div className="flex items-center justify-between mb-1.5 px-1">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">✍ Draw your signature</span>
                <button
                    type="button"
                    disabled={loading}
                    onClick={clearSignature}
                    className="text-[10px] font-semibold text-gray-400 hover:text-red-500 transition-colors px-2 py-0.5 rounded"
                >
                    Clear
                </button>
            </div>
            <canvas
                ref={canvasRef}
                width={400}
                height={120}
                className="w-full rounded-md cursor-crosshair"
                style={{
                    height: '100px',
                    background: '#fafafa',
                    border: '1px dashed #e5e7eb',
                    touchAction: 'none'
                }}
            />
        </div>
    );
};

export default SignaturePad;
