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
    Section,
    Text,
} from '@react-email/components';
import * as React from 'react';

const CLOUDINARY_LOGO_URL = "https://res.cloudinary.com/depmbnwrx/image/upload/v1771131766/logo-metatag_o432ru.png";

interface UserAccountCreatedEmailProps {
    firstName: string;
    lastName: string;
    email: string;
    username: string;
    password: string;
    loginUrl: string;
    coachName: string;
}

export const UserAccountCreatedEmail = ({
    firstName,
    lastName,
    email,
    username,
    password,
    loginUrl,
    coachName,
}: UserAccountCreatedEmailProps) => {
    const fullName = `${firstName} ${lastName}`;

    return (
        <Html>
            <Head />
            <Preview>Your We Chess Account Has Been Created!</Preview>
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
                        <Heading style={headerTitle}>Welcome to We Chess!</Heading>
                    </Section>

                    <Section style={contentSection}>
                        <Heading style={greeting}>Hello {fullName}!</Heading>

                        <Text style={paragraph}>
                            Thank you for booking a lesson with {coachName}! We've automatically created an account for you so you can track your bookings and progress.
                        </Text>

                        <Section style={credentialsBox}>
                            <Heading style={credentialsTitle}>🔐 Your Login Credentials</Heading>

                            <Section style={loginOptionsBox}>
                                <Text style={loginOptionsTitle}>You can log in using EITHER:</Text>

                                <Section style={optionRow}>
                                    <Text style={optionLabel}>Option 1 - Username:</Text>
                                    <Text style={optionValue}>{username}</Text>
                                </Section>

                                <Section style={optionDivider}>
                                    <Text style={dividerText}>OR</Text>
                                </Section>

                                <Section style={optionRow}>
                                    <Text style={optionLabel}>Option 2 - Email:</Text>
                                    <Text style={optionValue}>{email}</Text>
                                </Section>
                            </Section>

                            <Section style={passwordSection}>
                                <Text style={credentialLabel}>Password (for both options):</Text>
                                <Text style={credentialValue}>{password}</Text>
                            </Section>

                            <Section style={warningBox}>
                                <Text style={warningText}>
                                    ⚠️ Please save this password and change it after your first login for security.
                                </Text>
                            </Section>
                        </Section>

                        <Section style={ctaSection}>
                            <Link href={loginUrl} style={button}>
                                Login to Your Dashboard →
                            </Link>
                        </Section>

                        <Section style={tipsSection}>
                            <Heading style={tipsTitle}>📝 What you can do now:</Heading>
                            <Text style={listItem}>• View your booking history</Text>
                            <Text style={listItem}>• Track your lesson progress</Text>
                            <Text style={listItem}>• Leave reviews for coaches</Text>
                            <Text style={listItem}>• Book more lessons easily</Text>
                        </Section>

                        {/* NEW: Reviews Information Section */}
                        <Section style={reviewsSection}>
                            <Heading style={reviewsTitle}>⭐ Share Your Experience</Heading>
                            <Text style={reviewsText}>
                                After your lesson with {coachName}, you can log in to your account and leave a review! Here's how:
                            </Text>

                            <Section style={stepBox}>
                                <Text style={stepNumber}>1️⃣</Text>
                                <Text style={stepText}>Log in to your account using your username or email</Text>
                            </Section>

                            <Section style={stepBox}>
                                <Text style={stepNumber}>2️⃣</Text>
                                <Text style={stepText}>Go to "My Learning Dashboard" to see your booking</Text>
                            </Section>

                            <Section style={stepBox}>
                                <Text style={stepNumber}>3️⃣</Text>
                                <Text style={stepText}>Click the three dots (⋯) next to your completed booking</Text>
                            </Section>

                            <Section style={stepBox}>
                                <Text style={stepNumber}>4️⃣</Text>
                                <Text style={stepText}>Select "Leave a Review" and rate your coach</Text>
                            </Section>

                            <Text style={reviewsNote}>
                                Your feedback helps other students find the right coach and helps coaches improve!
                            </Text>
                        </Section>

                        <Hr style={hr} />

                        <Section style={footerSection}>
                            <Text style={footerText}>
                                © {new Date().getFullYear()} We Chess. All rights reserved.
                            </Text>
                            <Text style={footerText}>
                                This email was sent to {email}
                            </Text>
                        </Section>
                    </Section>
                </Container>
            </Body>
        </Html>
    );
};

export default UserAccountCreatedEmail;

// Styles
const main = {
    backgroundColor: '#f4f4f4',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    padding: '20px 0',
};

const container = {
    backgroundColor: '#ffffff',
    margin: '0 auto',
    maxWidth: '600px',
    borderRadius: '10px',
    overflow: 'hidden' as const,
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
};

const headerSection = {
    backgroundColor: '#4F46E5',
    padding: '30px',
    textAlign: 'center' as const,
};

const logo = {
    margin: '0 auto 20px',
};

const headerTitle = {
    color: '#ffffff',
    fontSize: '28px',
    fontWeight: '600',
    margin: '0',
};

const contentSection = {
    padding: '40px 30px',
};

const greeting = {
    color: '#333333',
    fontSize: '24px',
    fontWeight: '600',
    margin: '0 0 20px',
};

const paragraph = {
    color: '#666666',
    fontSize: '16px',
    lineHeight: '1.6',
    margin: '0 0 25px',
};

const credentialsBox = {
    backgroundColor: '#f8f9fa',
    borderLeft: '4px solid #4F46E5',
    padding: '25px',
    margin: '25px 0',
    borderRadius: '8px',
};

const credentialsTitle = {
    color: '#333333',
    fontSize: '18px',
    fontWeight: '600',
    margin: '0 0 20px',
    textAlign: 'center' as const,
};

const loginOptionsBox = {
    backgroundColor: '#ffffff',
    padding: '20px',
    borderRadius: '8px',
    marginBottom: '20px',
    border: '1px solid #e0e0e0',
};

const loginOptionsTitle = {
    color: '#4F46E5',
    fontSize: '16px',
    fontWeight: '600',
    margin: '0 0 15px',
    textAlign: 'center' as const,
};

const optionRow = {
    margin: '15px 0',
    padding: '10px',
    backgroundColor: '#f5f5f5',
    borderRadius: '6px',
};

const optionLabel = {
    color: '#666666',
    fontSize: '14px',
    fontWeight: '500',
    margin: '0 0 5px',
};

const optionValue = {
    fontFamily: 'monospace',
    backgroundColor: '#e9ecef',
    padding: '10px 15px',
    borderRadius: '6px',
    color: '#333333',
    fontSize: '16px',
    fontWeight: '600',
    margin: '5px 0 0',
    border: '1px solid #dee2e6',
    wordBreak: 'break-all' as const,
};

const optionDivider = {
    textAlign: 'center' as const,
    margin: '10px 0',
    position: 'relative' as const,
};

const dividerText = {
    backgroundColor: '#ffffff',
    color: '#999999',
    fontSize: '14px',
    fontWeight: '600',
    padding: '0 10px',
    display: 'inline-block',
};

const passwordSection = {
    marginTop: '20px',
    padding: '15px',
    backgroundColor: '#fff3cd',
    borderRadius: '6px',
    borderLeft: '4px solid #ffc107',
};

const credentialLabel = {
    color: '#856404',
    fontSize: '14px',
    fontWeight: '600',
    margin: '0 0 8px',
};

const credentialValue = {
    fontFamily: 'monospace',
    backgroundColor: '#ffffff',
    padding: '10px 15px',
    borderRadius: '6px',
    color: '#333333',
    fontSize: '16px',
    fontWeight: '600',
    margin: '0',
    border: '1px solid #ffc107',
    wordBreak: 'break-all' as const,
};

const warningBox = {
    backgroundColor: '#fff3cd',
    padding: '12px',
    borderRadius: '6px',
    marginTop: '15px',
};

const warningText = {
    color: '#856404',
    fontSize: '14px',
    margin: '0',
};

const ctaSection = {
    margin: '30px 0',
    textAlign: 'center' as const,
};

const button = {
    backgroundColor: '#4F46E5',
    color: '#ffffff',
    padding: '14px 32px',
    borderRadius: '6px',
    fontSize: '16px',
    fontWeight: '600',
    textDecoration: 'none',
    display: 'inline-block',
};

const tipsSection = {
    backgroundColor: '#e8f4fd',
    padding: '20px',
    borderRadius: '8px',
    margin: '20px 0',
};

const tipsTitle = {
    color: '#0369a1',
    fontSize: '16px',
    fontWeight: '600',
    margin: '0 0 12px',
};

const listItem = {
    color: '#666666',
    fontSize: '14px',
    lineHeight: '1.6',
    margin: '8px 0',
};

// NEW: Reviews Section Styles
const reviewsSection = {
    backgroundColor: '#fef9e7',
    padding: '25px',
    borderRadius: '12px',
    margin: '25px 0',
    border: '1px solid #fbbf24',
};

const reviewsTitle = {
    color: '#92400e',
    fontSize: '18px',
    fontWeight: '600',
    margin: '0 0 15px',
    textAlign: 'center' as const,
};

const reviewsText = {
    color: '#78350f',
    fontSize: '15px',
    lineHeight: '1.5',
    margin: '0 0 15px',
    textAlign: 'center' as const,
};

const stepBox = {
    display: 'flex' as const,
    alignItems: 'center' as const,
    gap: '12px',
    margin: '12px 0',
    padding: '8px 12px',
    backgroundColor: '#ffffff',
    borderRadius: '8px',
    border: '1px solid #fde68a',
};

const stepNumber = {
    fontSize: '20px',
    minWidth: '32px',
    margin: '0',
};

const stepText = {
    color: '#4b5563',
    fontSize: '14px',
    lineHeight: '1.4',
    margin: '0',
};

const reviewsNote = {
    color: '#92400e',
    fontSize: '14px',
    fontStyle: 'italic' as const,
    margin: '15px 0 0',
    textAlign: 'center' as const,
    padding: '10px',
    backgroundColor: '#fff7e6',
    borderRadius: '6px',
};

const hr = {
    borderColor: '#dee2e6',
    margin: '30px 0',
};

const footerSection = {
    textAlign: 'center' as const,
};

const footerText = {
    color: '#999999',
    fontSize: '12px',
    margin: '5px 0',
};