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

interface StatusUpdateAdminEmailProps {
    coachName: string;
    coachEmail: string;
    customerEmail: string;
    customerName?: string;
    oldStatus: string;
    newStatus: string;
    orderId: string;
    amount?: number;
    currency?: string;
}

export const StatusUpdateAdminEmail = ({
    coachName,
    coachEmail,
    customerEmail,
    customerName,
    oldStatus,
    newStatus,
    orderId,
    amount,
    currency,
}: StatusUpdateAdminEmailProps) => {
    const currencySymbol = currency === 'USD' ? '$' : currency === 'EUR' ? '€' : '£';

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
            <Preview>Status Update: {orderId}</Preview>
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
                        <Heading style={headerTitle}>Booking Status Updated</Heading>
                    </Section>

                    <Section style={contentSection}>
                        <Section style={summaryBox}>
                            <Text style={summaryTitle}>📋 Status Change Details</Text>
                            <Text style={summaryItem}>
                                <strong>Coach:</strong> {coachName} ({coachEmail})
                            </Text>
                            <Text style={summaryItem}>
                                <strong>Customer:</strong> {customerName || customerEmail}
                            </Text>
                            <Text style={summaryItem}>
                                <strong>Order ID:</strong> {orderId}
                            </Text>
                            {amount && currency && (
                                <Text style={summaryItem}>
                                    <strong>Amount:</strong> {currencySymbol}{amount.toFixed(2)}
                                </Text>
                            )}
                        </Section>

                        <Section style={statusBox}>
                            <Heading style={h2}>Status Transition</Heading>
                            <Row style={statusRow}>
                                <Column style={statusColumn}>
                                    <Text style={statusLabel}>From</Text>
                                    <Text style={{ ...statusValue, color: getStatusColor(oldStatus) }}>
                                        {oldStatus}
                                    </Text>
                                </Column>
                                <Column style={statusColumn}>
                                    <Text style={statusArrow}>→</Text>
                                </Column>
                                <Column style={statusColumn}>
                                    <Text style={statusLabel}>To</Text>
                                    <Text style={{ ...statusValue, color: getStatusColor(newStatus) }}>
                                        {newStatus}
                                    </Text>
                                </Column>
                            </Row>
                        </Section>

                        <Section style={statsBox}>
                            <Heading style={h2}>Quick Stats</Heading>
                            <Row style={statsRow}>
                                <Column style={statsColumn}>
                                    <Text style={statsLabel}>Coach</Text>
                                    <Text style={statsValue}>{coachName}</Text>
                                </Column>
                                <Column style={statsColumn}>
                                    <Text style={statsLabel}>Order ID</Text>
                                    <Text style={statsValue}>{orderId.slice(-8)}</Text>
                                </Column>
                                <Column style={statsColumn}>
                                    <Text style={statsLabel}>Status</Text>
                                    <Text style={{ ...statsValue, color: getStatusColor(newStatus) }}>
                                        {newStatus}
                                    </Text>
                                </Column>
                            </Row>
                        </Section>

                        <Hr style={hr} />

                        <Text style={footer}>
                            This is an automated notification from We Chess.
                            <br />
                            View the full details in the admin dashboard.
                        </Text>
                    </Section>
                </Container>
            </Body>
        </Html>
    );
};

export default StatusUpdateAdminEmail;

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
    padding: '30px',
    backgroundColor: '#2563eb',
    borderTopLeftRadius: '8px',
    borderTopRightRadius: '8px',
};

const logo = {
    margin: '0 auto 20px',
};

const headerTitle = {
    color: '#ffffff',
    fontSize: '24px',
    fontWeight: '600',
    margin: '0',
    textAlign: 'center' as const,
};

const contentSection = {
    padding: '30px',
};

const summaryBox = {
    backgroundColor: '#eff6ff',
    borderRadius: '8px',
    padding: '24px',
    marginBottom: '24px',
};

const summaryTitle = {
    color: '#1e40af',
    fontSize: '18px',
    fontWeight: '600',
    margin: '0 0 16px',
};

const summaryItem = {
    color: '#2d3748',
    fontSize: '15px',
    margin: '8px 0',
    lineHeight: '1.5',
};

const statusBox = {
    backgroundColor: '#ffffff',
    borderRadius: '8px',
    padding: '24px',
    marginBottom: '24px',
    border: '1px solid #e2e8f0',
};

const h2 = {
    color: '#2d3748',
    fontSize: '18px',
    fontWeight: '600',
    margin: '0 0 16px',
};

const statusRow = {
    margin: '0 -8px',
};

const statusColumn = {
    padding: '0 8px',
    textAlign: 'center' as const,
    verticalAlign: 'middle' as const,
};

const statusLabel = {
    color: '#718096',
    fontSize: '14px',
    margin: '0 0 4px',
};

const statusValue = {
    fontSize: '18px',
    fontWeight: '600',
    margin: '0',
    textTransform: 'capitalize' as const,
};

const statusArrow = {
    fontSize: '24px',
    fontWeight: '300',
    color: '#94a3b8',
    margin: '0',
};

const statsBox = {
    backgroundColor: '#ffffff',
    borderRadius: '8px',
    padding: '24px',
    border: '1px solid #e2e8f0',
};

const statsRow = {
    margin: '0 -8px',
};

const statsColumn = {
    padding: '0 8px',
    textAlign: 'center' as const,
};

const statsLabel = {
    color: '#718096',
    fontSize: '14px',
    margin: '0 0 4px',
};

const statsValue = {
    color: '#1a202c',
    fontSize: '20px',
    fontWeight: '600',
    margin: '0',
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