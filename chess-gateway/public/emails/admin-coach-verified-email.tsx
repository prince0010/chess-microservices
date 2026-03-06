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

interface AdminCoachVerifiedEmailProps {
    coachName: string;
    coachEmail: string;
    coachPhone: string;
    reviewedBy: string;
    price?: number;
    currency?: string;
    chessTitle?: string;
    fideId?: string;
}

export const AdminCoachVerifiedEmail = ({
    coachName,
    coachEmail,
    coachPhone,
    reviewedBy,
    price,
    currency = "USD",
    chessTitle,
    fideId,
}: AdminCoachVerifiedEmailProps) => {
    const currencySymbol = currency === 'USD' ? '$' : currency === 'EUR' ? '€' : '£';

    return (
        <Html>
            <Head />
            <Preview>Coach Verified: {coachName}</Preview>
            <Body style={main}>
                <Container style={container}>
                    <Section style={headerSection}>
                        <Img
                            src={CLOUDINARY_LOGO_URL}
                            width="150"
                            alt="We Chess"
                            style={logo}
                        />
                        <Heading style={headerTitle}>Coach Verified ✅</Heading>
                    </Section>

                    <Section style={contentSection}>
                        <Section style={summaryBox}>
                            <Text style={summaryTitle}>📋 Coach Details</Text>
                            <Row style={detailRow}>
                                <Column style={detailLabel}>Name:</Column>
                                <Column style={detailValue}>{coachName}</Column>
                            </Row>
                            <Row style={detailRow}>
                                <Column style={detailLabel}>Email:</Column>
                                <Column style={detailValue}>{coachEmail}</Column>
                            </Row>
                            <Row style={detailRow}>
                                <Column style={detailLabel}>Phone:</Column>
                                <Column style={detailValue}>{coachPhone}</Column>
                            </Row>
                            {chessTitle && chessTitle !== 'NONE' && (
                                <Row style={detailRow}>
                                    <Column style={detailLabel}>Chess Title:</Column>
                                    <Column style={detailValue}>{chessTitle}</Column>
                                </Row>
                            )}
                            {fideId && (
                                <Row style={detailRow}>
                                    <Column style={detailLabel}>FIDE ID:</Column>
                                    <Column style={detailValue}>{fideId}</Column>
                                </Row>
                            )}
                            {price && (
                                <Row style={detailRow}>
                                    <Column style={detailLabel}>Hourly Rate:</Column>
                                    <Column style={detailValue}>{currencySymbol}{price}/hour</Column>
                                </Row>
                            )}
                        </Section>

                        <Section style={infoBox}>
                            <Text style={infoText}>
                                <strong>Reviewed by:</strong> {reviewedBy}
                            </Text>
                            <Text style={infoText}>
                                <strong>Review Date:</strong> {new Date().toLocaleDateString()}
                            </Text>
                        </Section>

                        <Section style={statsBox}>
                            <Heading style={h2}>Next Steps</Heading>
                            <Text style={paragraph}>
                                The coach has been notified and can now log in to their dashboard.
                            </Text>
                            <Text style={paragraph}>
                                They can now:
                            </Text>
                            <ul style={list}>
                                <li style={listItem}>Set their availability</li>
                                <li style={listItem}>Receive bookings from students</li>
                                <li style={listItem}>Manage their profile</li>
                            </ul>
                        </Section>

                        <Hr style={hr} />

                        <Text style={footer}>
                            This is an automated notification from We Chess.
                            <br />
                            View all coaches in the{' '}
                            <Link href="https://we-chess.com/admin/coaches" style={link}>
                                admin dashboard
                            </Link>.
                        </Text>
                    </Section>
                </Container>
            </Body>
        </Html>
    );
};


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
    backgroundColor: '#10b981',
    borderTopLeftRadius: '8px',
    borderTopRightRadius: '8px',
    textAlign: 'center' as const,
};

const headerSectionRejected = {
    padding: '30px',
    backgroundColor: '#ef4444',
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
    fontSize: '18px',
    fontWeight: '600',
    margin: '0 0 16px',
};

const detailRow = {
    marginBottom: '12px',
};

const detailLabel = {
    color: '#64748b',
    fontSize: '15px',
    fontWeight: '500',
    width: '120px',
};

const detailValue = {
    color: '#1e293b',
    fontSize: '15px',
    fontWeight: '600',
};

const infoBox = {
    backgroundColor: '#f1f5f9',
    borderRadius: '8px',
    padding: '16px',
    marginBottom: '24px',
};

const infoText = {
    color: '#334155',
    fontSize: '15px',
    margin: '4px 0',
    lineHeight: '1.5',
};

const rejectionBox = {
    backgroundColor: '#fee2e2',
    borderRadius: '8px',
    padding: '24px',
    marginBottom: '24px',
    border: '1px solid #fecaca',
};

const rejectionTitle = {
    color: '#991b1b',
    fontSize: '16px',
    fontWeight: '600',
    margin: '0 0 8px',
};

const rejectionText = {
    color: '#7f1d1d',
    fontSize: '16px',
    fontStyle: 'italic' as const,
    margin: '0',
    lineHeight: '1.5',
};

const statsBox = {
    backgroundColor: '#f0f9ff',
    borderRadius: '8px',
    padding: '24px',
    marginBottom: '24px',
    border: '1px solid #bae6fd',
};

const h2 = {
    color: '#0369a1',
    fontSize: '18px',
    fontWeight: '600',
    margin: '0 0 12px',
};

const paragraph = {
    color: '#334155',
    fontSize: '15px',
    lineHeight: '1.5',
    margin: '0 0 8px',
};

const list = {
    margin: '8px 0 0',
    paddingLeft: '20px',
};

const listItem = {
    color: '#334155',
    fontSize: '14px',
    margin: '4px 0',
};

const link = {
    color: '#2563eb',
    textDecoration: 'underline',
};

const hr = {
    borderColor: '#e2e8f0',
    margin: '30px 0',
};

const footer = {
    color: '#64748b',
    fontSize: '14px',
    lineHeight: '1.5',
    textAlign: 'center' as const,
};

export default AdminCoachVerifiedEmail;
