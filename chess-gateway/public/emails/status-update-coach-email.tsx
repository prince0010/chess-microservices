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

interface StatusUpdateCoachEmailProps {
    coachName: string;
    customerEmail: string;
    oldStatus: string;
    newStatus: string;
    orderId: string;
}

export const StatusUpdateCoachEmail = ({
    coachName,
    customerEmail,
    oldStatus,
    newStatus,
    orderId,
}: StatusUpdateCoachEmailProps) => {
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
            <Preview>Booking status updated: {orderId}</Preview>
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
                            Hello {coachName},
                        </Text>

                        <Text style={paragraph}>
                            A booking with <strong>{customerEmail}</strong> has been updated.
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

                        <Hr style={hr} />

                        <Text style={footer}>
                            Need assistance? Contact us at{' '}
                            <Link href="mailto:info@we-chess.com" style={link}>info@we-chess.com</Link>
                        </Text>
                    </Section>
                </Container>
            </Body>
        </Html>
    );
};

export default StatusUpdateCoachEmail;

const main = {
    backgroundColor: '#f6f9fc',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
};

const container = {
    backgroundColor: '#ffffff',
    margin: '0 auto',
    padding: '20px 0',
    borderRadius: '8px',
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
    margin: '0 0 16px',
};

const paragraph = {
    color: '#4a5568',
    fontSize: '16px',
    lineHeight: '1.5',
    margin: '0 0 12px',
};

const detailsBox = {
    backgroundColor: '#f8fafc',
    borderRadius: '8px',
    padding: '24px',
    margin: '24px 0',
    border: '1px solid #e2e8f0',
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
    textAlign: 'center' as const,
};