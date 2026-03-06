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

interface AdminBookingEmailProps {
    coachName: string;
    coachEmail: string;
    customerEmail: string;
    customerPhone?: string;
    duration: number;
    lessonCount: number;
    amount: number;
    currency: string;
    orderId: string;
}

export const AdminBookingEmail = ({
    coachName,
    coachEmail,
    customerEmail,
    customerPhone,
    duration,
    amount,
    lessonCount,
    currency,
    orderId,
}: AdminBookingEmailProps) => {
    const currencySymbol = currency === 'USD' ? '$' : currency === 'EUR' ? '€' : '£';

    return (
        <Html>
            <Head />
            <Preview>New Booking: {coachName} - {customerEmail}</Preview>
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
                        <Heading style={headerTitle}>New Booking Notification</Heading>
                    </Section>

                    <Section style={contentSection}>
                        <Section style={summaryBox}>
                            <Text style={summaryTitle}>📋 Booking Summary</Text>
                            <Text style={summaryItem}>
                                <strong>Coach:</strong> {coachName} ({coachEmail})
                            </Text>
                            <Text style={summaryItem}>
                                <strong>Customer:</strong> {customerEmail}
                                {customerPhone && ` • ${customerPhone}`}
                            </Text>
                            <Text style={summaryItem}>
                                <strong>Lessons:</strong> {lessonCount} lesson{lessonCount > 1 ? 's' : ''}
                            </Text>
                            <Text style={summaryItem}>
                                <strong>Amount:</strong> {currencySymbol}{amount.toFixed(2)}
                            </Text>
                            <Text style={summaryItem}>
                                <strong>Transaction ID:</strong> {orderId}
                            </Text>
                        </Section>

                        <Section style={statsBox}>
                            <Heading style={h2}>Quick Stats</Heading>
                            <Row style={statsRow}>
                                <Column style={statsColumn}>
                                    <Text style={statsLabel}>Coach</Text>
                                    <Text style={statsValue}>{coachName}</Text>
                                </Column>
                                <Column style={statsColumn}>
                                    <Text style={statsLabel}>Revenue</Text>
                                    <Text style={statsValue}>{currencySymbol}{amount.toFixed(2)}</Text>
                                </Column>
                                <Column style={statsColumn}>
                                    <Text style={statsLabel}>Lessons</Text>
                                    <Text style={statsValue}>{lessonCount} lesson{lessonCount > 1 ? 's' : ''}</Text>
                                </Column>
                            </Row>
                        </Section>

                        <Hr style={hr} />

                        <Text style={footer}>
                            This is an automated notification from We Chess.
                            <br />
                            View the full booking details in the admin dashboard.
                        </Text>
                    </Section>
                </Container>
            </Body>
        </Html>
    );
};

export default AdminBookingEmail;

// Add necessary styles
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
    backgroundColor: '#1a202c',
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
    backgroundColor: '#ebf4ff',
    borderRadius: '8px',
    padding: '24px',
    marginBottom: '24px',
};

const summaryTitle = {
    color: '#2c5282',
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

const statsBox = {
    backgroundColor: '#ffffff',
    borderRadius: '8px',
    padding: '24px',
    border: '1px solid #e2e8f0',
};

const h2 = {
    color: '#2d3748',
    fontSize: '18px',
    fontWeight: '600',
    margin: '0 0 16px',
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