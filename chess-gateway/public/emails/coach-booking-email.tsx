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

interface CoachBookingEmailProps {
    coachName: string;
    customerName?: string;
    customerEmail: string;
    amount: number;
    currency: string;
    orderId: string;
    lessonCount: number;
}

export const CoachBookingEmail = ({
    coachName,
    customerName,
    customerEmail,
    amount,
    currency,
    lessonCount,
    orderId,
}: CoachBookingEmailProps) => {
    const currencySymbol = currency === 'USD' ? '$' : currency === 'EUR' ? '€' : '£';

    return (
        <Html>
            <Head />
            <Preview>New booking from {customerEmail}</Preview>
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
                        <Heading style={h1}>New Booking Alert! 🎯</Heading>

                        <Text style={greeting}>
                            Hello {coachName},
                        </Text>

                        <Text style={paragraph}>
                            Great news! You have a new booking from <strong>{customerEmail}</strong>.
                        </Text>

                        <Section style={detailsBox}>
                            <Heading style={h2}>Booking Details</Heading>

                            <Row style={detailRow}>
                                <Column style={detailLabel}>Customer:</Column>
                                <Column style={detailValue}>
                                    {customerName || customerEmail}
                                </Column>
                            </Row>
                            <Row style={detailRow}>
                                <Column style={detailLabel}>Email:</Column>
                                <Column style={detailValue}>
                                    <Link href={`mailto:${customerEmail}`} style={link}>
                                        {customerEmail}
                                    </Link>
                                </Column>
                            </Row>
                            <Row style={detailRow}>
                                <Column style={detailLabel}>Lessons:</Column>
                                <Column style={detailValue}>{lessonCount} lesson{lessonCount > 1 ? 's' : ''}</Column>
                            </Row>
                            <Row style={detailRow}>
                                <Column style={detailLabel}>Amount:</Column>
                                <Column style={detailValue}>{currencySymbol}{amount.toFixed(2)}</Column>
                            </Row>
                            <Row style={detailRow}>
                                <Column style={detailLabel}>Transaction ID:</Column>
                                <Column style={detailValue}>{orderId.slice(-8)}</Column>
                            </Row>
                        </Section>

                        <Section style={actionBox}>
                            <Heading style={h2}>Next Steps</Heading>
                            <Text style={paragraph}>
                                1. Contact the customer within 24 hours
                            </Text>
                            <Text style={paragraph}>
                                2. Confirm the exact time and platform for the lesson
                            </Text>
                            <Text style={paragraph}>
                                3. Prepare your lesson materials
                            </Text>
                        </Section>

                        <Hr style={hr} />

                        <Text style={footer}>
                            Thank you for being part of We Chess! If you have any questions, please contact us at{' '}
                            {/* <Link href="mailto:info@we-chess.com" style={link}>info@we-chess.com</Link> */}
                            <Link href="mailto:info@we-chess.com" style={link}>info@we-chess.com</Link>
                        </Text>
                    </Section>
                </Container>
            </Body>
        </Html>
    );
};

export default CoachBookingEmail;

// Styles (same as above, adjust as needed)
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
    color: '#1a1e24',
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

const actionBox = {
    backgroundColor: '#fef3c7',
    borderRadius: '8px',
    padding: '24px',
    margin: '24px 0',
    border: '1px solid #fbbf24',
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