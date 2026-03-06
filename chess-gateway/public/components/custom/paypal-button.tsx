"use client"

import { useEffect, useRef, useState } from 'react';
import { FaSpinner } from 'react-icons/fa';

declare global {
    interface Window {
        paypal?: any;
    }
}

interface PayPalButtonProps {
    amount: number;
    currency: string;
    coachName: string;
    coachId: string;
    onSuccess: (details: any) => void;
    onError: (error: any) => void;
    onCancel?: () => void;
}

export default function PayPalButton({
    amount,
    currency,
    coachName,
    coachId,
    onSuccess,
    onError,
    onCancel
}: PayPalButtonProps) {
    const [sdkLoaded, setSdkLoaded] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const paypalRef = useRef<HTMLDivElement>(null);
    const buttonRendered = useRef(false);

    useEffect(() => {
        // Load PayPal SDK
        if (!window.paypal && !buttonRendered.current) {
            const script = document.createElement('script');
            script.src = `https://www.paypal.com/sdk/js?client-id=${process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID}&currency=${currency}`;
            script.async = true;

            script.onload = () => {
                setSdkLoaded(true);
                setIsLoading(false);
            };

            script.onerror = () => {
                setError('Failed to load PayPal SDK');
                setIsLoading(false);
                onError(new Error('Failed to load PayPal SDK'));
            };

            document.body.appendChild(script);
        } else if (window.paypal) {
            setSdkLoaded(true);
            setIsLoading(false);
        }

        return () => {
            // Cleanup
            buttonRendered.current = false;
        };
    }, [currency, onError]);

    useEffect(() => {
        if (sdkLoaded && window.paypal && paypalRef.current && !buttonRendered.current) {
            try {
                buttonRendered.current = true;

                window.paypal.Buttons({
                    createOrder: (data: any, actions: any) => {
                        return actions.order.create({
                            purchase_units: [{
                                description: `Chess Coaching Session with ${coachName}`,
                                amount: {
                                    currency_code: currency,
                                    value: amount.toFixed(2),
                                    breakdown: {
                                        item_total: {
                                            currency_code: currency,
                                            value: amount.toFixed(2)
                                        }
                                    }
                                },
                                items: [{
                                    name: `1 Hour Coaching - ${coachName}`,
                                    unit_amount: {
                                        currency_code: currency,
                                        value: amount.toFixed(2)
                                    },
                                    quantity: '1',
                                    description: `Private chess coaching session with ${coachName}`
                                }],
                                custom_id: coachId,
                                invoice_id: `COACH-${coachId}-${Date.now()}`
                            }],
                            application_context: {
                                shipping_preference: 'NO_SHIPPING',
                                user_action: 'PAY_NOW',
                                brand_name: 'We Chess'
                            }
                        });
                    },
                    onApprove: async (data: any, actions: any) => {
                        try {
                            const order = await actions.order.capture();
                            onSuccess(order);
                        } catch (err) {
                            onError(err);
                        }
                    },
                    onCancel: () => {
                        if (onCancel) onCancel();
                    },
                    onError: (err: any) => {
                        onError(err);
                    },
                    style: {
                        layout: 'vertical',
                        color: 'blue',
                        shape: 'rect',
                        label: 'pay'
                    }
                }).render(paypalRef.current);
            } catch (err) {
                setError('Failed to render PayPal button');
                onError(err);
            }
        }
    }, [sdkLoaded, amount, currency, coachName, coachId, onSuccess, onError, onCancel]);

    if (error) {
        return (
            <div className="text-sm text-red-600 p-4 bg-red-50 rounded-lg">
                {error}
            </div>
        );
    }

    if (isLoading) {
        return (
            <div className="flex items-center justify-center p-4">
                <FaSpinner className="w-5 h-5 animate-spin text-gray-400" />
                <span className="ml-2 text-sm text-gray-600">Loading PayPal...</span>
            </div>
        );
    }

    return <div ref={paypalRef} className="w-full" />;
}