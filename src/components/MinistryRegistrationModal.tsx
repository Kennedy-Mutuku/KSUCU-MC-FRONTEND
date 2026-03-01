import React, { useState, useEffect } from 'react';
import axiosInstance from '../config/axios';
import { FaTimes, FaSpinner, FaCheckCircle } from 'react-icons/fa';

interface MinistryRegistrationModalProps {
    isOpen: boolean;
    onClose: () => void;
    ministryName: string;
    joinPath?: string;
}

interface FormData {
    fullName: string;
    registrationNumber: string;
    phoneNumber: string;
    gender: string;
    yearOfStudy: string;
    course: string;
    reasonForJoining: string;
}

const MinistryRegistrationModal: React.FC<MinistryRegistrationModalProps> = ({ isOpen, onClose, ministryName, joinPath }) => {
    const [formData, setFormData] = useState<FormData>({
        fullName: '',
        registrationNumber: '',
        phoneNumber: '',
        gender: '',
        yearOfStudy: '',
        course: '',
        reasonForJoining: ''
    });

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [animate, setAnimate] = useState(false);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await axiosInstance.get('/commitmentForm/user-details');
                const { username, phone, regNo, registrationNumber, reg } = response.data;
                const autoRegNo = (regNo || registrationNumber || reg || "").toString().trim();
                console.log('Detected registration number for modal:', autoRegNo);

                setFormData(prev => ({
                    ...prev,
                    fullName: username || prev.fullName,
                    phoneNumber: phone || prev.phoneNumber,
                    registrationNumber: autoRegNo || prev.registrationNumber
                }));
            } catch (err) {
                console.error('Error fetching user data for modal:', err);
            }
        };

        if (isOpen) {
            document.body.style.overflow = 'hidden';
            fetchUserData();
            // Small timeout to trigger enter animation
            setTimeout(() => setAnimate(true), 10);
        } else {
            document.body.style.overflow = 'unset';
            setAnimate(false);
            setSuccess(false);
            setError('');
            setFormData({
                fullName: '',
                registrationNumber: '',
                phoneNumber: '',
                gender: '',
                yearOfStudy: '',
                course: '',
                reasonForJoining: ''
            });
        }
    }, [isOpen]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        let value = e.target.value;

        // Phone number numeric-only validation
        if (e.target.name === 'phoneNumber') {
            value = value.replace(/[^0-9]/g, '');
        }

        setFormData({
            ...formData,
            [e.target.name]: value
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        // Basic fields validation
        if (!formData.fullName || !formData.registrationNumber || !formData.phoneNumber || !formData.gender || !formData.yearOfStudy || !formData.course || !formData.reasonForJoining) {
            setError('Please fill in all fields.');
            setIsLoading(false);
            return;
        }

        if (formData.phoneNumber.length < 10) {
            setError('Phone number must be at least 10 digits.');
            setIsLoading(false);
            return;
        }

        try {
            await axiosInstance.post('/api/ministry-registration/submit', {
                ...formData,
                ministry: ministryName
            });
            setSuccess(true);
        } catch (err: any) {
            console.error('Submission Error:', err);
            setError(err.response?.data?.error || 'Failed to submit registration. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${animate ? 'opacity-100' : 'opacity-0'}`} onClick={onClose}>
            <div
                className={`bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden transform transition-all duration-300 ${animate ? 'scale-100 translate-y-0' : 'scale-95 translate-y-4'}`}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="bg-gradient-to-r from-[#730051] to-[#8B1C3F] p-6 relative">
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors"
                    >
                        <FaTimes size={20} />
                    </button>
                    <h2 className="text-2xl font-bold text-white mb-1">Join {ministryName}</h2>
                    <p className="text-purple-100 text-sm">Fill in your details to get started</p>
                </div>

                {/* Content */}
                <div className="p-6 md:p-8 max-h-[85vh] overflow-y-auto">
                    {success ? (
                        <div className="flex flex-col items-center justify-center py-8 text-center animate-fadeIn">
                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4 text-green-600">
                                <FaCheckCircle size={32} />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-800 mb-2">Registration Successful!</h3>
                            <p className="text-gray-600 mb-6 leading-relaxed">
                                You have successfully joined the <strong>{ministryName}</strong>.
                                {joinPath && (
                                    <>
                                        <br />
                                        To finalize your joining process, please sign the commitment form.
                                    </>
                                )}
                            </p>

                            <div className="flex flex-col gap-3 w-full">
                                {joinPath && (
                                    <button
                                        onClick={() => {
                                            onClose();
                                            window.location.href = joinPath;
                                        }}
                                        className="w-full py-3 px-4 bg-gradient-to-r from-[#730051] to-[#8B1C3F] hover:shadow-lg text-white rounded-lg font-bold transition-all transform hover:-translate-y-0.5"
                                    >
                                        Sign Commitment
                                    </button>
                                )}
                                <button
                                    onClick={onClose}
                                    className="w-full py-3 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-semibold transition-colors"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-4">
                            {error && (
                                <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-200">
                                    {error}
                                </div>
                            )}

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                                <input
                                    type="text"
                                    name="fullName"
                                    value={formData.fullName}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#730051] focus:border-[#730051] outline-none transition-all"
                                    placeholder="e.g. John Doe"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Registration Number</label>
                                <input
                                    type="text"
                                    name="registrationNumber"
                                    value={formData.registrationNumber}
                                    onChange={handleChange}
                                    disabled={!!formData.registrationNumber}
                                    className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#730051] focus:border-[#730051] outline-none transition-all ${!!formData.registrationNumber ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                                    placeholder="Enter your registration number"
                                    required
                                    readOnly={!!formData.registrationNumber}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                                <input
                                    type="tel"
                                    name="phoneNumber"
                                    value={formData.phoneNumber}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#730051] focus:border-[#730051] outline-none transition-all"
                                    placeholder="e.g. 0712345678"
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                                    <select
                                        name="gender"
                                        value={formData.gender}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                                        required
                                    >
                                        <option value="">Select</option>
                                        <option value="Male">Male</option>
                                        <option value="Female">Female</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Year of Study</label>
                                    <select
                                        name="yearOfStudy"
                                        value={formData.yearOfStudy}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#730051] focus:border-[#730051] outline-none transition-all"
                                        required
                                    >
                                        <option value="">Select</option>
                                        <option value="Year 1">Year 1</option>
                                        <option value="Year 2">Year 2</option>
                                        <option value="Year 3">Year 3</option>
                                        <option value="Year 4">Year 4</option>
                                        <option value="Year 5">Year 5</option>
                                        <option value="Year 6">Year 6</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Course</label>
                                <input
                                    type="text"
                                    name="course"
                                    value={formData.course}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#730051] focus:border-[#730051] outline-none transition-all"
                                    placeholder="e.g. BSc. Computer Science"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Reason for Joining</label>
                                <textarea
                                    name="reasonForJoining"
                                    value={formData.reasonForJoining}
                                    onChange={handleChange}
                                    rows={3}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#730051] focus:border-[#730051] outline-none transition-all resize-none"
                                    placeholder="Why do you want to join this ministry?"
                                    required
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className={`w-full py-3 px-4 mt-6 rounded-lg font-bold text-white shadow-lg transform transition-all 
                  ${isLoading ? 'bg-purple-400 cursor-not-allowed' : 'bg-gradient-to-r from-[#730051] to-[#8B1C3F] hover:from-[#8B1C3F] hover:to-[#730051] hover:-translate-y-0.5 hover:shadow-xl'}
                `}
                            >
                                {isLoading ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <FaSpinner className="animate-spin" /> Processing...
                                    </span>
                                ) : (
                                    'Join Ministry'
                                )}
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MinistryRegistrationModal;
