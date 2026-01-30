import React, { useState, useEffect } from 'react';
import axiosInstance from '../config/axios';
import { FaTimes, FaSpinner, FaCheckCircle } from 'react-icons/fa';

interface MinistryRegistrationModalProps {
    isOpen: boolean;
    onClose: () => void;
    ministryName: string;
}

interface FormData {
    fullName: string;
    phoneNumber: string;
    gender: string;
    yearOfStudy: string;
    course: string;
    reasonForJoining: string;
}

const MinistryRegistrationModal: React.FC<MinistryRegistrationModalProps> = ({ isOpen, onClose, ministryName }) => {
    const [formData, setFormData] = useState<FormData>({
        fullName: '',
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
        if (isOpen) {
            document.body.style.overflow = 'hidden';
            // Small timeout to trigger enter animation
            setTimeout(() => setAnimate(true), 10);
        } else {
            document.body.style.overflow = 'unset';
            setAnimate(false);
            setSuccess(false);
            setError('');
            setFormData({
                fullName: '',
                phoneNumber: '',
                gender: '',
                yearOfStudy: '',
                course: '',
                reasonForJoining: ''
            });
        }
    }, [isOpen]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        // Basic fields validation
        if (!formData.fullName || !formData.phoneNumber || !formData.gender || !formData.yearOfStudy || !formData.course || !formData.reasonForJoining) {
            setError('Please fill in all fields.');
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
                <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 relative">
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors"
                    >
                        <FaTimes size={20} />
                    </button>
                    <h2 className="text-2xl font-bold text-white mb-1">Join {ministryName}</h2>
                    <p className="text-blue-100 text-sm">Fill in your details to get started</p>
                </div>

                {/* Content */}
                <div className="p-6 md:p-8 max-h-[85vh] overflow-y-auto">
                    {success ? (
                        <div className="flex flex-col items-center justify-center py-8 text-center animate-fadeIn">
                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4 text-green-600">
                                <FaCheckCircle size={32} />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-800 mb-2">Thank You!</h3>
                            <p className="text-gray-600 mb-6 leading-relaxed">
                                A leader may contact you to help you settle into the ministry. <br />
                                Thank you for your willingness to serve. May God bless you.
                            </p>
                            <button
                                onClick={onClose}
                                className="w-full py-3 px-4 bg-gray-800 hover:bg-gray-900 text-white rounded-lg font-semibold transition-colors"
                            >
                                Close
                            </button>
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
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                                    placeholder="e.g. John Doe"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                                <input
                                    type="tel"
                                    name="phoneNumber"
                                    value={formData.phoneNumber}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
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
                                        <option value="Other">Other</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Year of Study</label>
                                    <select
                                        name="yearOfStudy"
                                        value={formData.yearOfStudy}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
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
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
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
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all resize-none"
                                    placeholder="Why do you want to join this ministry?"
                                    required
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className={`w-full py-3 px-4 mt-6 rounded-lg font-bold text-white shadow-lg transform transition-all 
                  ${isLoading ? 'bg-indigo-400 cursor-not-allowed' : 'bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 hover:-translate-y-0.5 hover:shadow-xl'}
                `}
                            >
                                {isLoading ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <FaSpinner className="animate-spin" /> Processing...
                                    </span>
                                ) : (
                                    'Submit Application'
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
