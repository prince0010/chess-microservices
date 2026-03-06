import {
    Body,
    Container,
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
    Column,
} from '@react-email/components';
import * as React from 'react';
import { CLOUDINARY_LOGO_URL } from './pending';

interface AdminNewBookingEmailProps {
    coachName: string;
    coachEmail: string;
    customerEmail: string;
    customerName?: string;
    customerPhone?: string;
    duration: number;
    amount: number;
    currency: string;
    orderId: string;
    isNewUser?: boolean;
}

export const AdminNewBookingEmail = ({
    coachName,
    coachEmail,
    customerEmail,
    customerName,
    customerPhone,
    duration,
    amount,
    currency,
    orderId,
    isNewUser,
}: AdminNewBookingEmailProps) => {
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
                            style={logo}
                        />
                        <Heading style={headerTitle}>New Booking Notification 💰</Heading>
                    </Section>

                    <Section style={contentSection}>
                        <Section style={summaryBox}>
                            <Text style={summaryTitle}>📋 Booking Summary</Text>

                            <Heading style={h2}>Coach Information</Heading>
                            <Row style={detailRow}>
                                <Column style={detailLabel}>Name:</Column>
                                <Column style={detailValue}>{coachName}</Column>
                            </Row>
                            <Row style={detailRow}>
                                <Column style={detailLabel}>Email:</Column>
                                <Column style={detailValue}>{coachEmail}</Column>
                            </Row>

                            <Heading style={h2}>Customer Information</Heading>
                            <Row style={detailRow}>
                                <Column style={detailLabel}>Name:</Column>
                                <Column style={detailValue}>{customerName || customerEmail}</Column>
                            </Row>
                            <Row style={detailRow}>
                                <Column style={detailLabel}>Email:</Column>
                                <Column style={detailValue}>{customerEmail}</Column>
                            </Row>
                            {customerPhone && (
                                <Row style={detailRow}>
                                    <Column style={detailLabel}>Phone:</Column>
                                    <Column style={detailValue}>{customerPhone}</Column>
                                </Row>
                            )}

                            <Heading style={h2}>Booking Details</Heading>
                            <Row style={detailRow}>
                                <Column style={detailLabel}>Duration:</Column>
                                <Column style={detailValue}>{duration} hour{duration > 1 ? 's' : ''}</Column>
                            </Row>
                            <Row style={detailRow}>
                                <Column style={detailLabel}>Amount:</Column>
                                <Column style={detailValue}>{currencySymbol}{amount.toFixed(2)}</Column>
                            </Row>
                            <Row style={detailRow}>
                                <Column style={detailLabel}>Order ID:</Column>
                                <Column style={detailValue}>{orderId}</Column>
                            </Row>
                        </Section>

                        {isNewUser && (
                            <Section style={newUserBox}>
                                <Text style={newUserText}>
                                    ⭐ <strong>New User Created:</strong> A new user account was automatically created for this customer.
                                </Text>
                            </Section>
                        )}

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
                                    <Text style={statsLabel}>Hours</Text>
                                    <Text style={statsValue}>{duration}h</Text>
                                </Column>
                            </Row>
                        </Section>

                        <Section style={actionBox}>
                            <Text style={actionText}>
                                View this booking in the{' '}
                                <Link href="https://we-chess.com/admin/bookings" style={link}>
                                    admin dashboard
                                </Link>
                            </Text>
                        </Section>

                        <Hr style={hr} />

                        <Text style={footer}>
                            This is an automated notification from We Chess.
                            <br />
                            All confirmation emails have been sent to the customer and coach.
                        </Text>
                    </Section>
                </Container>
            </Body>
        </Html>
    );
};

export default AdminNewBookingEmail;

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
    backgroundColor: '#059669',
    borderTopLeftRadius: '8px',
    borderTopRightRadius: '8px',
    textAlign: 'center' as const,
};

const logo = {
    margin: '0 auto 20px',
};

const headerTitle = {
    color: '#ffffff',
    fontSize: '24px',
    fontWeight: '600',
    margin: '0',
};

const contentSection = {
    padding: '30px',
};

const summaryBox = {
    backgroundColor: '#f8fafc',
    borderRadius: '8px',
    padding: '24px',
    marginBottom: '24px',
    border: '1px solid #e2e8f0',
};

const summaryTitle = {
    color: '#1e293b',
    fontSize: '20px',
    fontWeight: '700',
    margin: '0 0 20px',
    textAlign: 'center' as const,
};

const h2 = {
    color: '#334155',
    fontSize: '16px',
    fontWeight: '600',
    margin: '16px 0 8px',
    paddingBottom: '4px',
    borderBottom: '1px solid #e2e8f0',
};

const detailRow = {
    marginBottom: '8px',
};

const detailLabel = {
    color: '#64748b',
    fontSize: '14px',
    fontWeight: '500',
    width: '100px',
};

const detailValue = {
    color: '#1e293b',
    fontSize: '14px',
    fontWeight: '500',
};

const newUserBox = {
    backgroundColor: '#fef3c7',
    borderRadius: '8px',
    padding: '16px',
    marginBottom: '24px',
    border: '1px solid #fcd34d',
};

const newUserText = {
    color: '#92400e',
    fontSize: '14px',
    margin: '0',
    textAlign: 'center' as const,
};

const statsBox = {
    backgroundColor: '#f1f5f9',
    borderRadius: '8px',
    padding: '24px',
    marginBottom: '24px',
};

const statsRow = {
    margin: '0 -8px',
};

const statsColumn = {
    padding: '0 8px',
    textAlign: 'center' as const,
};

const statsLabel = {
    color: '#64748b',
    fontSize: '12px',
    margin: '0 0 4px',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.05em',
};

const statsValue = {
    color: '#0f172a',
    fontSize: '18px',
    fontWeight: '700',
    margin: '0',
};

const actionBox = {
    backgroundColor: '#e0f2fe',
    borderRadius: '8px',
    padding: '16px',
    marginBottom: '24px',
    textAlign: 'center' as const,
};

const actionText = {
    color: '#0369a1',
    fontSize: '14px',
    margin: '0',
};

const link = {
    color: '#2563eb',
    textDecoration: 'underline',
    fontWeight: '500',
};

const hr = {
    borderColor: '#e2e8f0',
    margin: '24px 0',
};

const footer = {
    color: '#64748b',
    fontSize: '12px',
    lineHeight: '1.5',
    textAlign: 'center' as const,
};