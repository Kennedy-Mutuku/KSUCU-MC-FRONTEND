import React, { useRef, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignature } from '@fortawesome/free-solid-svg-icons';

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
            e.preventDefault();
            const rect = canvas.getBoundingClientRect();
            const clientX = 'touches' in e ? e.touches[0].clientX : (e as MouseEvent).clientX;
            const clientY = 'touches' in e ? e.touches[0].clientY : (e as MouseEvent).clientY;
            const currentX = clientX - rect.left;
            const currentY = clientY - rect.top;

            ctx.lineWidth = 2.5;
            ctx.lineCap = 'round';
            ctx.strokeStyle = '#00c6ff';
            ctx.shadowBlur = 1;
            ctx.shadowColor = '#00c6ff';
            ctx.beginPath();
            ctx.moveTo(lastX, lastY);
            ctx.lineTo(currentX, currentY);
            ctx.stroke();

            lastX = currentX;
            lastY = currentY;

            onSignatureChange(canvas.toDataURL());
        };

        const stopDrawing = () => {
            isDrawing = false;
        };

        canvas.addEventListener('mousedown', startDrawing);
        canvas.addEventListener('mousemove', draw);
        window.addEventListener('mouseup', stopDrawing);
        canvas.addEventListener('touchstart', startDrawing, { passive: false });
        canvas.addEventListener('touchmove', draw, { passive: false });
        window.addEventListener('touchend', stopDrawing);

        return () => {
            canvas.removeEventListener('mousedown', startDrawing);
            canvas.removeEventListener('mousemove', draw);
            window.removeEventListener('mouseup', stopDrawing);
            canvas.removeEventListener('touchstart', startDrawing);
            canvas.removeEventListener('touchmove', draw);
            window.removeEventListener('touchend', stopDrawing);
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
        <div style={{
            border: '2px solid rgba(0, 198, 255, 0.3)',
            borderRadius: '12px',
            padding: '8px',
            background: 'rgba(255, 255, 255, 0.05)'
        }}>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', color: 'rgba(255, 255, 255, 0.8)' }}>
                <FontAwesomeIcon icon={faSignature} /> Digital Signature *
            </label>
            <canvas
                ref={canvasRef}
                width={400}
                height={140}
                style={{
                    width: '100%',
                    height: '140px',
                    borderRadius: '8px',
                    background: 'rgba(0, 0, 0, 0.2)',
                    cursor: 'crosshair',
                    touchAction: 'none'
                }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '8px' }}>
                <small style={{ color: 'rgba(255, 255, 255, 0.6)' }}>✍️ Please sign in the box</small>
                <button
                    type="button"
                    disabled={loading}
                    onClick={clearSignature}
                    style={{
                        padding: '5px 12px',
                        background: 'rgba(255,255,255,0.1)',
                        color: 'white',
                        border: '1px solid rgba(255,255,255,0.2)',
                        borderRadius: '15px',
                        fontSize: '0.75rem',
                        cursor: 'pointer'
                    }}
                >
                    Clear Signature
                </button>
            </div>
        </div>
    );
};

export default SignaturePad;
