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

interface CustomerBookingEmailProps {
    customerName?: string;
    coachName: string;
    coachEmail: string;
    coachWhatsapp?: string;
    lessonCount: number;
    amount: number;
    currency: string;
    orderId: string;
}

export const CustomerBookingEmail = ({
    customerName,
    coachName,
    coachEmail,
    coachWhatsapp,
    lessonCount,
    amount,
    currency,
    orderId,
}: CustomerBookingEmailProps) => {
    const currencySymbol = currency === 'USD' ? '$' : currency === 'EUR' ? '€' : '£';

    return (
        <Html>
            <Head />
            <Preview>Your chess lesson booking with {coachName} is confirmed!</Preview>
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
                        <Heading style={h1}>Booking Successfully! 🎉</Heading>

                        <Text style={greeting}>
                            Hello {customerName || 'there'},
                        </Text>

                        <Text style={paragraph}>
                            Great news! Your chess lesson with <strong>{coachName}</strong> has been successfully created. Please wait for the Coach to Contact you through Email or Contact your Coach through Coaches Email.
                        </Text>

                        <Section style={detailsBox}>
                            <Heading style={h2}>Lesson Details</Heading>
                            <Row style={detailRow}>
                                <Column style={detailLabel}>Lessons:</Column>
                                <Column style={detailValue}>{lessonCount} lesson{lessonCount > 1 ? 's' : ''}</Column>
                            </Row>
                            <Row style={detailRow}>
                                <Column style={detailLabel}>Amount Paid:</Column>
                                <Column style={detailValue}>{currencySymbol}{amount.toFixed(2)}</Column>
                            </Row>
                            <Row style={detailRow}>
                                <Column style={detailLabel}>Transaction ID:</Column>
                                <Column style={detailValue}>{orderId.slice(-8)}</Column>
                            </Row>
                        </Section>

                        <Section style={contactBox}>
                            <Heading style={h2}>Contact Your Coach</Heading>
                            <Text style={paragraph}>
                                Please reach out to your coach to schedule your lesson:
                            </Text>

                            <Section style={contactInfo}>
                                <Text style={contactItem}>
                                    📧 Email: <Link href={`mailto:${coachEmail}`} style={link}>{coachEmail}</Link>
                                </Text>
                                {coachWhatsapp && (
                                    <Text style={contactItem}>
                                        💬 WhatsApp: <Link href={`https://wa.me/${coachWhatsapp}`} style={link}>{coachWhatsapp}</Link>
                                    </Text>
                                )}
                            </Section>

                            <Text style={note}>
                                <strong>Note:</strong> Please contact your coach within 24 hours to arrange the exact timing for your lesson.
                            </Text>
                        </Section>

                        <Hr style={hr} />
                        <Text style={footer}>
                            Thank you for choosing We Chess! For any questions or concerns, please contact us at{' '}
                            <Link href="mailto:info@we-chess.com" style={link}>
                                info@we-chess.com
                            </Link>
                            . Please note that the email address wechesspayment@gmail.com is intended for notification purposes only.
                        </Text>

                    </Section>
                </Container>
            </Body>
        </Html>
    );
};

export default CustomerBookingEmail;

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
    color: '#1a1e24',
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

const contactBox = {
    backgroundColor: '#ebf8ff',
    borderRadius: '8px',
    padding: '24px',
    margin: '24px 0',
    border: '1px solid #90cdf4',
};

const contactInfo = {
    marginTop: '16px',
    marginBottom: '16px',
};

const contactItem = {
    color: '#2c5282',
    fontSize: '16px',
    margin: '8px 0',
};

const link = {
    color: '#3182ce',
    fontWeight: '600',
    textDecoration: 'underline',
};

const note = {
    color: '#2b6cb0',
    fontSize: '14px',
    fontStyle: 'italic' as const,
    margin: '16px 0 0',
    padding: '12px',
    backgroundColor: '#e6f7ff',
    borderRadius: '4px',
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