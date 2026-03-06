// emails/coach-account-created.tsx

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
import { CLOUDINARY_LOGO_URL } from './pending';

interface CoachAccountCreatedEmailProps {
    firstName: string;
    lastName: string;
    email: string;
    username: string;
    password: string;
    loginUrl: string;
}

export const CoachAccountCreatedEmail = ({
    firstName,
    lastName,
    email,
    username,
    password,
    loginUrl,
}: CoachAccountCreatedEmailProps) => {
    const fullName = `${firstName} ${lastName}`;

    return (
        <Html>
            <Head />
            <Preview>Your We Chess Coach Account Has Been Created!</Preview>
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
                            Congratulations! Your coach application has been approved and we've created an account for you.
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

                            {/* Password (same for both) */}
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

                        {/* Quick Tips */}
                        <Section style={tipsSection}>
                            <Heading style={tipsTitle}>📝 Quick Tips:</Heading>
                            <Text style={listItem}>• Use <strong>either your username or email</strong> to log in</Text>
                            <Text style={listItem}>• Your username is: <strong>{username}</strong></Text>
                            <Text style={listItem}>• Your email is: <strong>{email}</strong></Text>
                            <Text style={listItem}>• Change your password after first login</Text>
                            <Text style={listItem}>• Complete your profile to attract students</Text>
                        </Section>

                        {/* What's Next */}
                        <Section style={whatsNextSection}>
                            <Heading style={whatsNextTitle}>🚀 What you can do now:</Heading>
                            <Text style={listItem}>• View your bookings and schedule</Text>
                            <Text style={listItem}>• Update your profile information</Text>
                            <Text style={listItem}>• Manage your availability</Text>
                            <Text style={listItem}>• Track your earnings</Text>
                        </Section>

                        <Hr style={hr} />

                        {/* Footer */}
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

export default CoachAccountCreatedEmail;

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

const whatsNextSection = {
    borderTop: '1px solid #dee2e6',
    marginTop: '30px',
    paddingTop: '20px',
};

const whatsNextTitle = {
    color: '#333333',
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