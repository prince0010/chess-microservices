import {
    Body,
    Container,
    Column,
    Head,
    Heading,
    Hr,
    Html,
    Img,
    Link,
    Preview,
    Row,
    Section,
    Text,
} from '@react-email/components';
import * as React from 'react';
import { CLOUDINARY_LOGO_URL } from './pending';

interface CancelCustomerEmailProps {
    customerName?: string;
    coachName: string;
    amount: number;
    currency: string;
    orderId: string;
    reason?: string;
}

export const CancelCustomerEmail = ({
    customerName,
    coachName,
    amount,
    currency,
    orderId,
    reason,
}: CancelCustomerEmailProps) => {
    const currencySymbol = currency === 'USD' ? '$' : currency === 'EUR' ? '€' : '£';

    return (
        <Html>
            <Head />
            <Preview>Your booking with {coachName} has been cancelled</Preview>
            <Body style={main}>
                <Container style={container}>
                    <Section style={headerSection}>
                        <Img
                            src={CLOUDINARY_LOGO_URL}
                            width="150"
                            alt="We Chess"
                            style={{
                                height: "auto",
                                maxWidth: "100%",
                                ...logo,
                            }}
                        />
                    </Section>

                    <Section style={contentSection}>
                        <Heading style={h1}>Booking Cancelled</Heading>

                        <Text style={greeting}>
                            Hello {customerName || 'there'},
                        </Text>

                        <Text style={paragraph}>
                            Your booking with <strong>{coachName}</strong> has been cancelled.
                        </Text>

                        {reason && (
                            <Section style={reasonBox}>
                                <Text style={paragraph}>
                                    <strong>Reason for cancellation:</strong> {reason}
                                </Text>
                            </Section>
                        )}

                        <Section style={detailsBox}>
                            <Heading style={h2}>Booking Details</Heading>
                            <Row style={detailRow}>
                                <Column style={detailLabel}>Order ID:</Column>
                                <Column style={detailValue}>{orderId.slice(-8)}</Column>
                            </Row>
                            <Row style={detailRow}>
                                <Column style={detailLabel}>Amount:</Column>
                                <Column style={detailValue}>{currencySymbol}{amount.toFixed(2)}</Column>
                            </Row>
                        </Section>

                        <Section style={refundBox}>
                            <Heading style={h2}>Refund Information</Heading>
                            <Text style={paragraph}>
                                Your refund will be processed within 5-10 business days and will be credited back to your original payment method.
                            </Text>
                        </Section>

                        <Hr style={hr} />

                        <Text style={footer}>
                            Questions about your refund? Contact us at{' '}
                            <Link href="mailto:info@we-chess.com" style={link}>info@we-chess.com</Link>
                        </Text>
                    </Section>
                </Container>
            </Body>
        </Html>
    );
};

export default CancelCustomerEmail;

const main = {
    backgroundColor: '#f6f9fc',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
};

const container = {
    backgroundColor: '#ffffff',
    margin: '0 auto',
    padding: '20px 0',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
    maxWidth: '600px',
};

const headerSection = {
    padding: '20px 30px',
    borderBottom: '1px solid #eaeef2',
};

const logo = {
    margin: '0 auto',
};

const contentSection = {
    padding: '30px',
};

const h1 = {
    color: '#dc2626',
    fontSize: '28px',
    fontWeight: '600',
    lineHeight: '1.25',
    margin: '0 0 20px',
    textAlign: 'center' as const,
};

const h2 = {
    color: '#2d3748',
    fontSize: '20px',
    fontWeight: '600',
    margin: '0 0 16px',
};

const greeting = {
    color: '#4a5568',
    fontSize: '16px',
    lineHeight: '1.5',
    margin: '0 0 16px',
};

const paragraph = {
    color: '#4a5568',
    fontSize: '16px',
    lineHeight: '1.5',
    margin: '0 0 16px',
};

const detailsBox = {
    backgroundColor: '#f8fafc',
    borderRadius: '8px',
    padding: '24px',
    margin: '24px 0',
    border: '1px solid #e2e8f0',
};

const reasonBox = {
    backgroundColor: '#fee2e2',
    borderRadius: '8px',
    padding: '24px',
    margin: '24px 0',
    border: '1px solid #fecaca',
};

const refundBox = {
    backgroundColor: '#fef3c7',
    borderRadius: '8px',
    padding: '24px',
    margin: '24px 0',
    border: '1px solid #fde68a',
};

const detailRow = {
    marginBottom: '12px',
};

const detailLabel = {
    color: '#718096',
    fontSize: '15px',
    fontWeight: '500',
    width: '120px',
};

const detailValue = {
    color: '#1a202c',
    fontSize: '15px',
    fontWeight: '600',
};

const link = {
    color: '#3182ce',
    textDecoration: 'underline',
};

const hr = {
    borderColor: '#e2e8f0',
    margin: '30px 0',
};

const footer = {
    color: '#718096',
    fontSize: '14px',
    lineHeight: '1.5',
    textAlign: 'center' as const,
};