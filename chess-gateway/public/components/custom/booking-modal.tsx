"use client"

import { useState, useRef, useEffect } from 'react';
import { FaCheckCircle, FaTimes } from 'react-icons/fa';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import PayPalButton from './paypal-button';
import { useCreateBooking } from '@/modules/booking/hooks';

interface BookingModalProps {
    isOpen: boolean;
    onClose: () => void;
    coach: {
        id: string;
        name: string;
        price?: number;
        currency?: string;
    };
    onBookingComplete?: (details: any) => void;
}

export default function BookingModal({ isOpen, onClose, coach, onBookingComplete }: BookingModalProps) {
    const [step, setStep] = useState<'booking' | 'payment' | 'success'>('booking');
    const [numberOfLessons, setNumberOfLessons] = useState<number>(1);
    const [_isProcessing, setIsProcessing] = useState(false);
    const [bookingDetails, setBookingDetails] = useState<any>(null);
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    // Customer information state
    const [customerEmail, setCustomerEmail] = useState<string>('');
    const [customerPhone, setCustomerPhone] = useState<string>('');
    const [customerName, setCustomerName] = useState<string>('');

    // Error states
    const [emailError, setEmailError] = useState<string>('');
    const [phoneError, setPhoneError] = useState<string>('');
    const [nameError, setNameError] = useState<string>('');

    const { createBooking } = useCreateBooking();

    // Reset scroll position when modal opens
    useEffect(() => {
        if (isOpen && scrollContainerRef.current) {
            scrollContainerRef.current.scrollTop = 0;
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const totalAmount = (coach.price || 0) * numberOfLessons;
    const currencySymbol = coach.currency === 'USD' ? '$' :
        coach.currency === 'EUR' ? '€' :
            coach.currency === 'GBP' ? '£' : '$';

    const validateEmail = (email: string) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    };

    const validatePhone = (phone: string) => {
        // Basic phone validation - at least 10 digits, allows +, -, spaces, parentheses
        const re = /^[\+]?[(]?[0-9]{1,4}[)]?[-\s\.]?[(]?[0-9]{1,4}[)]?[-\s\.]?[0-9]{1,5}[-\s\.]?[0-9]{1,5}$/;
        return re.test(phone) && phone.replace(/\D/g, '').length >= 10;
    };

    const validateName = (name: string) => {
        return name.trim().length >= 2;
    };

    const validateForm = () => {
        let isValid = true;

        // Validate Email
        if (!customerEmail) {
            setEmailError('Email is required');
            isValid = false;
        } else if (!validateEmail(customerEmail)) {
            setEmailError('Please enter a valid email address');
            isValid = false;
        } else {
            setEmailError('');
        }

        if (!customerPhone) {
            setPhoneError('Phone number is required');
            isValid = false;
        } else if (!validatePhone(customerPhone)) {
            setPhoneError('Please enter a valid phone number (at least 10 digits)');
            isValid = false;
        } else {
            setPhoneError('');
        }

        if (!customerName) {
            setNameError('Full name is required');
            isValid = false;
        } else if (!validateName(customerName)) {
            setNameError('Please enter a valid name (at least 2 characters)');
            isValid = false;
        } else {
            setNameError('');
        }

        return isValid;
    };

    const handleBookingSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (validateForm()) {
            setStep('payment');
            if (scrollContainerRef.current) {
                scrollContainerRef.current.scrollTop = 0;
            }
        }
    };

    const handlePaymentSuccess = async (orderDetails: any) => {
        setIsProcessing(true);

        try {
            const bookingInput = {
                coachId: coach.id,
                customerEmail,
                customerPhone,
                customerName,
                duration: numberOfLessons,
                amount: totalAmount,
                currency: coach.currency || 'USD',
                orderId: orderDetails.id,
                payerId: orderDetails.payer?.payer_id
            };

            console.log('Creating booking with:', bookingInput);

            const result = await createBooking(bookingInput);

            if (result?.ok) {
                // Check if a new user was created (you might want to add this to your response)
                if (result.isNewUser) {
                    console.log('New user account created for:', customerEmail);
                    // You could show a different message or store this info
                }

                setBookingDetails({
                    ...bookingInput,
                    _id: result.bookingId,
                    isNewUser: result.isNewUser // if your backend returns this
                });

                setStep('success');

                if (scrollContainerRef.current) {
                    scrollContainerRef.current.scrollTop = 0;
                }

                if (onBookingComplete) {
                    onBookingComplete({
                        ...bookingInput,
                        isNewUser: result.isNewUser
                    });
                }
            } else {
                throw new Error(result?.message || 'Failed to create booking');
            }
        } catch (error) {
            console.error('Booking failed:', error);
            alert('Booking failed. Please contact support.');
        } finally {
            setIsProcessing(false);
        }
    }

    const handlePaymentError = (error: any) => {
        console.error('Payment failed:', error);
        alert('Payment failed. Please try again.');
    };

    const handlePaymentCancel = () => {
        setStep('booking');
    };

    const lessonOptions = Array.from({ length: 10 }, (_, i) => i + 1);

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

            <div className="flex min-h-full items-center justify-center p-4">
                <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-2xl flex flex-col max-h-[90vh]">
                    <div className="sticky top-0 z-10 bg-white rounded-t-xl border-b border-gray-200">
                        <div className="flex items-center justify-between p-6">
                            <div>
                                <h2 className="text-xl font-semibold text-gray-900">
                                    {step === 'booking' && 'Book Lessons'}
                                    {step === 'payment' && 'Complete Payment'}
                                    {step === 'success' && 'Booking Confirmed!'}
                                </h2>
                                {step === 'booking' && (
                                    <div className="flex flex-col mt-2">
                                        <div className="flex gap-1">
                                            <span className="text-md font-medium text-black">
                                                Coach:
                                            </span>
                                            <span className="text-md font-medium uppercase underline underline-offset-2 text-gray-700">
                                                {coach.name}
                                            </span>
                                        </div>

                                        <span className="inline-flex mt-1 text-sm px-2 py-0.5 font-medium bg-orange-100 text-orange-700 rounded-md w-fit">
                                            {currencySymbol}{coach.price?.toFixed(2)} per lesson
                                        </span>
                                    </div>
                                )}
                            </div>
                            <button
                                onClick={onClose}
                                className="text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                <FaTimes className="w-5 h-5" />
                            </button>
                        </div>
                    </div>

                    <div
                        ref={scrollContainerRef}
                        className="flex-1 overflow-y-auto p-6 -mt-4"
                        style={{ maxHeight: 'calc(90vh - 180px)' }}
                    >
                        {step === 'booking' && (
                            <form onSubmit={handleBookingSubmit} className="space-y-4">
                                <div className="bg-white rounded-lg border border-gray-200 p-3">
                                    <h3 className="text-sm font-medium text-gray-900 mb-4">Your Information</h3>

                                    {/* Email Field */}
                                    <div className="mb-4">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Email Address <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="email"
                                            value={customerEmail}
                                            onChange={(e) => {
                                                setCustomerEmail(e.target.value);
                                                if (emailError) setEmailError('');
                                            }}
                                            className={`w-full px-3 py-1 text-sm placeholder:text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${emailError ? 'border-red-500' : 'border-gray-300'
                                                }`}
                                            placeholder="your@email.com"
                                            required
                                        />
                                        {emailError && (
                                            <p className="mt-1 text-xs text-red-600">{emailError}</p>
                                        )}
                                    </div>

                                    {/* Phone Number Field - Now Required */}
                                    <div className="mb-4">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Phone Number <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="tel"
                                            value={customerPhone}
                                            onChange={(e) => {
                                                setCustomerPhone(e.target.value);
                                                if (phoneError) setPhoneError('');
                                            }}
                                            className={`w-full px-3 py-1 text-sm placeholder:text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${phoneError ? 'border-red-500' : 'border-gray-300'
                                                }`}
                                            placeholder="+1 234 567 8900"
                                            required
                                        />
                                        {phoneError && (
                                            <p className="mt-1 text-xs text-red-600">{phoneError}</p>
                                        )}
                                        <p className="mt-1 text-xs text-gray-500">
                                            Include country code for international numbers
                                        </p>
                                    </div>

                                    {/* Full Name Field - Now Required */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Full Name <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            value={customerName}
                                            onChange={(e) => {
                                                setCustomerName(e.target.value);
                                                if (nameError) setNameError('');
                                            }}
                                            className={`w-full px-3 py-1 text-sm placeholder:text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${nameError ? 'border-red-500' : 'border-gray-300'
                                                }`}
                                            placeholder="John Doe"
                                            required
                                        />
                                        {nameError && (
                                            <p className="mt-1 text-xs text-red-600">{nameError}</p>
                                        )}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Number of Lessons (1-10)
                                    </label>
                                    <div className="grid grid-cols-5 gap-2">
                                        {lessonOptions.map((lessons) => (
                                            <button
                                                key={lessons}
                                                type="button"
                                                onClick={() => setNumberOfLessons(lessons)}
                                                className={`p-3 rounded-lg text-center transition-colors ${numberOfLessons === lessons
                                                    ? 'bg-blue-600 text-white'
                                                    : 'bg-gray-50 hover:bg-gray-100 text-gray-700'
                                                    }`}
                                            >
                                                <div className="font-semibold">{lessons}</div>
                                                <div className="text-xs">lesson{lessons > 1 ? 's' : ''}</div>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </form>
                        )}

                        {step === 'payment' && (
                            <div className="space-y-6">
                                {/* Booking Summary */}
                                <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                                    <div className="flex justify-between">
                                        <span className="text-sm text-gray-600">Coach</span>
                                        <span className="text-sm font-medium text-gray-900">{coach.name}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-sm text-gray-600">Customer</span>
                                        <span className="text-sm font-medium text-gray-900">
                                            {customerName}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-sm text-gray-600">Email</span>
                                        <span className="text-sm font-medium text-gray-900">
                                            {customerEmail}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-sm text-gray-600">Phone</span>
                                        <span className="text-sm font-medium text-gray-900">
                                            {customerPhone}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-sm text-gray-600">Lessons</span>
                                        <span className="text-sm font-medium text-gray-900">
                                            {numberOfLessons} lesson{numberOfLessons > 1 ? 's' : ''}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-sm text-gray-600">Price per lesson</span>
                                        <span className="text-sm font-medium text-gray-900">
                                            {currencySymbol}{coach.price?.toFixed(2)}
                                        </span>
                                    </div>
                                </div>

                                {/* PayPal Button */}
                                <div className="py-4">
                                    <PayPalButton
                                        amount={totalAmount}
                                        currency={coach.currency || 'USD'}
                                        coachName={coach.name}
                                        coachId={coach.id}
                                        onSuccess={handlePaymentSuccess}
                                        onError={handlePaymentError}
                                        onCancel={handlePaymentCancel}
                                    />
                                </div>

                                {/* Back Button */}
                                <button
                                    onClick={() => setStep('booking')}
                                    className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                                >
                                    ← Back to booking
                                </button>
                            </div>
                        )}

                        {step === 'success' && (
                            <div className="text-center py-8 space-y-6">
                                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                                    <FaCheckCircle className="w-10 h-10 text-green-600" />
                                </div>

                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                        Booking Confirmed!
                                    </h3>
                                    <p className="text-sm text-gray-600">
                                        Your {numberOfLessons} lesson{numberOfLessons > 1 ? 's' : ''} with {coach.name} {numberOfLessons === 1 ? 'has' : 'have'} been confirmed.
                                    </p>
                                    {numberOfLessons > 1 && (
                                        <p className="text-xs text-gray-500 mt-2">
                                            You have booked a package of {numberOfLessons} lessons. The coach will contact you to schedule the sessions.
                                        </p>
                                    )}
                                </div>

                                <div className="bg-gray-50 p-4 rounded-lg text-left">
                                    <div className="flex justify-between mb-2">
                                        <span className="text-sm text-gray-600">Name</span>
                                        <span className="text-sm font-medium text-gray-900">
                                            {customerName}
                                        </span>
                                    </div>
                                    <div className="flex justify-between mb-2">
                                        <span className="text-sm text-gray-600">Email</span>
                                        <span className="text-sm font-medium text-gray-900">
                                            {customerEmail}
                                        </span>
                                    </div>
                                    <div className="flex justify-between mb-2">
                                        <span className="text-sm text-gray-600">Phone</span>
                                        <span className="text-sm font-medium text-gray-900">
                                            {customerPhone}
                                        </span>
                                    </div>
                                    <div className="flex justify-between mb-2">
                                        <span className="text-sm text-gray-600">Transaction ID</span>
                                        <span className="text-sm font-mono text-gray-900">
                                            {bookingDetails?.orderId?.slice(-8)}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-sm text-gray-600">Amount Paid</span>
                                        <span className="text-sm font-semibold text-gray-900">
                                            {currencySymbol}{totalAmount.toFixed(2)}
                                        </span>
                                    </div>
                                </div>

                                <p className="text-sm text-gray-500">
                                    A confirmation email has been sent to {customerEmail}.
                                </p>
                                <p className="text-xs text-gray-400">
                                    The coach will contact you shortly at {customerPhone}.
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Sticky Footer - Only show for booking step */}
                    {step === 'booking' && (
                        <div className="sticky bottom-0 z-10 bg-white border-t border-gray-200 rounded-b-xl p-6">
                            {/* Price Summary */}
                            <div className="flex justify-between items-center mb-4">
                                <div>
                                    <span className="text-sm text-gray-600 font-bold">Total Amount</span>
                                    <p className="text-xs underline underline-offset-2 text-gray-500">
                                        {numberOfLessons} lesson{numberOfLessons > 1 ? 's' : ''} × {currencySymbol}{coach.price?.toFixed(2)}
                                    </p>
                                </div>
                                <span className="text-2xl font-bold text-gray-900">
                                    Total: <span className='underline underline-offset-4'>{currencySymbol}{totalAmount.toFixed(2)}</span>
                                </span>
                            </div>

                            {/* Actions */}
                            <div className="flex gap-3">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={onClose}
                                    className="flex-1"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    onClick={handleBookingSubmit}
                                    disabled={!customerEmail || !customerPhone || !customerName}
                                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                                >
                                    Proceed to Payment
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}