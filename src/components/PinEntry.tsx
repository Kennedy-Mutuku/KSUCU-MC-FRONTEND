import React, { useState, useRef, useEffect } from 'react';
import styles from '../styles/pinEntry.module.css';

interface PinEntryProps {
    onSubmit: (pin: string) => void;
    onCancel: () => void;
    isSetup?: boolean;
    error?: string;
    loading?: boolean;
}

const PinEntry: React.FC<PinEntryProps> = ({ onSubmit, onCancel, isSetup = false, error, loading }) => {
    const [pin, setPin] = useState<string[]>(['', '', '', '']);
    const [confirmPin, setConfirmPin] = useState<string[]>(['', '', '', '']);
    const [step, setStep] = useState<'enter' | 'confirm'>('enter');
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
    const confirmInputRefs = useRef<(HTMLInputElement | null)[]>([]);

    useEffect(() => {
        // Focus first input on mount
        inputRefs.current[0]?.focus();
    }, []);

    const handleChange = (index: number, value: string, isConfirm: boolean = false) => {
        if (!/^\d*$/.test(value)) return; // Only allow digits

        const newPin = isConfirm ? [...confirmPin] : [...pin];
        newPin[index] = value.slice(-1); // Only take the last digit

        if (isConfirm) {
            setConfirmPin(newPin);
        } else {
            setPin(newPin);
        }

        // Auto-focus next input
        if (value && index < 3) {
            const refs = isConfirm ? confirmInputRefs : inputRefs;
            refs.current[index + 1]?.focus();
        }

        // Auto-submit when all digits entered
        if (index === 3 && value) {
            const fullPin = newPin.join('');
            if (fullPin.length === 4) {
                if (isSetup && step === 'enter') {
                    // Move to confirm step
                    setTimeout(() => {
                        setStep('confirm');
                        confirmInputRefs.current[0]?.focus();
                    }, 200);
                } else if (isSetup && step === 'confirm') {
                    // Check if PINs match
                    const originalPin = pin.join('');
                    if (originalPin === fullPin) {
                        onSubmit(fullPin);
                    } else {
                        setConfirmPin(['', '', '', '']);
                        confirmInputRefs.current[0]?.focus();
                    }
                } else {
                    onSubmit(fullPin);
                }
            }
        }
    };

    const handleKeyDown = (index: number, e: React.KeyboardEvent, isConfirm: boolean = false) => {
        if (e.key === 'Backspace') {
            const currentPin = isConfirm ? confirmPin : pin;
            const refs = isConfirm ? confirmInputRefs : inputRefs;

            if (!currentPin[index] && index > 0) {
                refs.current[index - 1]?.focus();
            }
        }
    };

    const handleSubmit = () => {
        const fullPin = (step === 'confirm' ? confirmPin : pin).join('');
        if (fullPin.length === 4) {
            if (isSetup && step === 'enter') {
                setStep('confirm');
                confirmInputRefs.current[0]?.focus();
            } else if (isSetup && step === 'confirm') {
                const originalPin = pin.join('');
                if (originalPin === fullPin) {
                    onSubmit(fullPin);
                } else {
                    setConfirmPin(['', '', '', '']);
                    confirmInputRefs.current[0]?.focus();
                }
            } else {
                onSubmit(fullPin);
            }
        }
    };

    const renderPinInputs = (pinArray: string[], isConfirm: boolean = false) => {
        const refs = isConfirm ? confirmInputRefs : inputRefs;
        return (
            <div className={styles.pinInputs}>
                {pinArray.map((digit, index) => (
                    <input
                        key={index}
                        ref={(el) => (refs.current[index] = el)}
                        type="password"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleChange(index, e.target.value, isConfirm)}
                        onKeyDown={(e) => handleKeyDown(index, e, isConfirm)}
                        className={styles.pinInput}
                        disabled={loading}
                    />
                ))}
            </div>
        );
    };

    return (
        <div className={styles.overlay}>
            <div className={styles.modal}>
                <h2 className={styles.title}>
                    {isSetup
                        ? (step === 'enter' ? 'Set Minutes PIN' : 'Confirm PIN')
                        : 'Enter Minutes PIN'
                    }
                </h2>
                <p className={styles.subtitle}>
                    {isSetup
                        ? (step === 'enter'
                            ? 'Create a 4-digit PIN to protect the Minutes section'
                            : 'Re-enter the PIN to confirm')
                        : 'Enter your 4-digit PIN to access Minutes'
                    }
                </p>

                {step === 'enter' && renderPinInputs(pin)}
                {step === 'confirm' && renderPinInputs(confirmPin, true)}

                {error && <p className={styles.error}>{error}</p>}
                {isSetup && step === 'confirm' && confirmPin.join('').length === 4 && pin.join('') !== confirmPin.join('') && (
                    <p className={styles.error}>PINs do not match</p>
                )}

                <div className={styles.actions}>
                    <button
                        className={styles.cancelButton}
                        onClick={onCancel}
                        disabled={loading}
                    >
                        Cancel
                    </button>
                    <button
                        className={styles.submitButton}
                        onClick={handleSubmit}
                        disabled={loading || (step === 'enter' ? pin : confirmPin).join('').length !== 4}
                    >
                        {loading ? 'Verifying...' : (isSetup ? (step === 'enter' ? 'Next' : 'Set PIN') : 'Unlock')}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PinEntry;
