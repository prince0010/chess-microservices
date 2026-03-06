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

interface StatusUpdateCustomerEmailProps {
    customerName?: string;
    coachName: string;
    oldStatus: string;
    newStatus: string;
    orderId: string;
}

export const StatusUpdateCustomerEmail = ({
    customerName,
    coachName,
    oldStatus,
    newStatus,
    orderId,
}: StatusUpdateCustomerEmailProps) => {
    const getStatusMessage = () => {
        if (newStatus === 'completed') {
            return "Your lesson has been marked as completed. We hope you enjoyed it!";
        } else if (newStatus === 'confirmed') {
            return "Your booking has been confirmed! The coach will contact you soon.";
        } else {
            return `Your booking status has been updated from ${oldStatus} to ${newStatus}.`;
        }
    };

    const getStatusColor = (status: string) => {
        const colors: Record<string, string> = {
            pending: '#92400e',
            confirmed: '#1e40af',
            completed: '#065f46',
            cancelled: '#991b1b',
            refunded: '#5b21b6',
        };
        return colors[status] || '#4a5568';
    };

    return (
        <Html>
            <Head />
            <Preview>Your booking status has been updated</Preview>
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
                        <Heading style={h1}>Booking Status Updated</Heading>

                        <Text style={greeting}>
                            Hello {customerName || 'there'},
                        </Text>

                        <Text style={paragraph}>
                            Your booking with <strong>{coachName}</strong> has been updated.
                        </Text>

                        <Section style={detailsBox}>
                            <Heading style={h2}>Status Change</Heading>
                            <Row style={detailRow}>
                                <Column style={detailLabel}>Order ID:</Column>
                                <Column style={detailValue}>{orderId.slice(-8)}</Column>
                            </Row>
                            <Row style={detailRow}>
                                <Column style={detailLabel}>Previous Status:</Column>
                                <Column style={detailValue}>{oldStatus}</Column>
                            </Row>
                            <Row style={detailRow}>
                                <Column style={detailLabel}>New Status:</Column>
                                <Column style={detailValue}>
                                    <span style={{ ...statusBadge, backgroundColor: `${getStatusColor(newStatus)}20`, color: getStatusColor(newStatus) }}>
                                        {newStatus}
                                    </span>
                                </Column>
                            </Row>
                        </Section>

                        <Section style={messageBox}>
                            <Text style={messageText}>
                                {getStatusMessage()}
                            </Text>
                        </Section>

                        <Hr style={hr} />

                        <Text style={footer}>
                            Questions? Contact us at{' '}
                            <Link href="mailto:info@we-chess.com" style={link}>info@we-chess.com</Link>
                        </Text>
                    </Section>
                </Container>
            </Body>
        </Html>
    );
};

export default StatusUpdateCustomerEmail;

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
    color: '#2563eb',
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

const messageBox = {
    backgroundColor: '#e6f7ff',
    borderRadius: '8px',
    padding: '24px',
    margin: '24px 0',
    border: '1px solid #91d5ff',
};

const messageText = {
    color: '#0050b3',
    fontSize: '16px',
    lineHeight: '1.5',
    margin: '0',
    textAlign: 'center' as const,
};

const statusBadge = {
    padding: '4px 12px',
    borderRadius: '9999px',
    fontSize: '14px',
    fontWeight: '600',
    display: 'inline-block',
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