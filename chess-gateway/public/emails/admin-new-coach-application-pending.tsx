import {
    Body,
    pixelBasedPreset,
    Tailwind,
    Img,
    Html,
    Head,
    Heading,
    Container,
    Font,
    Section,
    Text,
    Hr,
    Row,
    Column,
} from "@react-email/components"

export const CLOUDINARY_LOGO_URL = "https://res.cloudinary.com/depmbnwrx/image/upload/v1771131766/logo-metatag_o432ru.png"

const AdminNewCoachApplicationEmail = ({
    name,
    email,
    phoneNumber,
    chessTitle,
    fideId,
    languages,
    bio,
    hourlyRate,
    currency
}: {
    name: string;
    email: string;
    phoneNumber: string;
    chessTitle?: string;
    fideId?: string;
    languages: string[];
    bio: string;
    hourlyRate?: number;
    currency?: string;
}) => {
    const currencySymbol = currency === 'USD' ? '$' : currency === 'EUR' ? '€' : '£';

    return (
        <Tailwind
            config={{
                presets: [pixelBasedPreset],
                theme: {
                    extend: {
                        colors: {
                            primary: "#facc16",
                        },
                    },
                },
            }}
        >
            <Html lang="en" className="bg-white">
                <Head>
                    <Font
                        fontFamily="Roboto"
                        fallbackFontFamily="Verdana"
                        webFont={{
                            url: "https://fonts.gstatic.com/s/roboto/v27/KFOmCnqEu92Fr1Mu4mxKKTU1Kg.woff2",
                            format: "woff2",
                        }}
                        fontWeight={400}
                        fontStyle="normal"
                    />
                </Head>

                <Body className="bg-gray-200 p-4">
                    <Container className="bg-white max-w-[640px] mx-auto rounded shadow-sm">

                        {/* Header */}
                        <Section className="text-center bg-primary/20 p-6">
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
                            <Heading className="text-2xl font-bold m-0">
                                New Coach Application
                            </Heading>
                            <Text className="text-sm text-gray-600 mt-2">
                                Pending Review
                            </Text>
                        </Section>

                        {/* Content */}
                        <Section className="p-8 text-gray-800">
                            <Text className="text-base font-semibold">
                                Dear Admin,
                            </Text>

                            <Text className="text-base mt-4">
                                A new coach application has been submitted and is pending review.
                            </Text>

                            {/* Applicant Details Box */}
                            <Section className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 my-6">
                                <Heading className="text-lg font-bold text-yellow-800 m-0 mb-4">
                                    Applicant Details
                                </Heading>

                                <Row className="mb-3">
                                    <Column className="w-32">
                                        <Text className="text-sm font-medium text-gray-600 m-0">Full Name:</Text>
                                    </Column>
                                    <Column>
                                        <Text className="text-sm font-semibold text-gray-900 m-0">{name}</Text>
                                    </Column>
                                </Row>

                                <Row className="mb-3">
                                    <Column className="w-32">
                                        <Text className="text-sm font-medium text-gray-600 m-0">Email:</Text>
                                    </Column>
                                    <Column>
                                        <Text className="text-sm text-gray-900 m-0">{email}</Text>
                                    </Column>
                                </Row>

                                <Row className="mb-3">
                                    <Column className="w-32">
                                        <Text className="text-sm font-medium text-gray-600 m-0">Phone:</Text>
                                    </Column>
                                    <Column>
                                        <Text className="text-sm text-gray-900 m-0">{phoneNumber}</Text>
                                    </Column>
                                </Row>

                                {chessTitle && chessTitle !== 'NONE' && (
                                    <Row className="mb-3">
                                        <Column className="w-32">
                                            <Text className="text-sm font-medium text-gray-600 m-0">Chess Title:</Text>
                                        </Column>
                                        <Column>
                                            <Text className="text-sm font-semibold text-blue-600 m-0">{chessTitle}</Text>
                                        </Column>
                                    </Row>
                                )}

                                {fideId && (
                                    <Row className="mb-3">
                                        <Column className="w-32">
                                            <Text className="text-sm font-medium text-gray-600 m-0">FIDE ID:</Text>
                                        </Column>
                                        <Column>
                                            <Text className="text-sm text-gray-900 m-0">{fideId}</Text>
                                        </Column>
                                    </Row>
                                )}

                                {hourlyRate && currency && (
                                    <Row className="mb-3">
                                        <Column className="w-32">
                                            <Text className="text-sm font-medium text-gray-600 m-0">Hourly Rate:</Text>
                                        </Column>
                                        <Column>
                                            <Text className="text-sm font-semibold text-green-600 m-0">
                                                {currencySymbol}{hourlyRate}/hour
                                            </Text>
                                        </Column>
                                    </Row>
                                )}

                                <Row className="mb-3">
                                    <Column className="w-32">
                                        <Text className="text-sm font-medium text-gray-600 m-0">Languages:</Text>
                                    </Column>
                                    <Column>
                                        <Text className="text-sm text-gray-900 m-0">
                                            {languages.join(', ')}
                                        </Text>
                                    </Column>
                                </Row>

                                {/* <Row className="mb-3">
                                    <Column className="w-32">
                                        <Text className="text-sm font-medium text-gray-600 m-0">Bio:</Text>
                                    </Column>
                                    <Column>
                                        <Text className="text-sm text-gray-700 m-0 italic">
                                            &ldquo;{bio.length > 100 ? `${bio.substring(0, 100)}...` : bio}&rdquo;
                                        </Text>
                                    </Column>
                                </Row> */}
                            </Section>

                            {/* Action Required Box */}
                            <Section className="bg-blue-50 border border-blue-200 rounded-lg p-6 my-6">
                                <Heading className="text-lg font-bold text-blue-800 m-0 mb-2">
                                    Action Required
                                </Heading>
                                <Text className="text-base text-blue-700">
                                    Please review this application in the admin dashboard:
                                </Text>
                                <ul className="list-disc pl-6 mt-2 text-blue-700">
                                    <li className="text-sm">Check the coach's CV (attached separately)</li>
                                    <li className="text-sm">Verify qualifications and experience</li>
                                    <li className="text-sm">Approve or reject the application</li>
                                    <li className="text-sm">Set hourly rate if approved</li>
                                </ul>
                            </Section>

                            {/* Quick Stats */}
                            <Section className="bg-gray-50 rounded-lg p-4 my-6">
                                <Row>
                                    <Column align="center">
                                        <Text className="text-xs text-gray-500 m-0">Status</Text>
                                        <Text className="text-sm font-bold text-yellow-600 m-0">PENDING</Text>
                                    </Column>
                                    <Column align="center">
                                        <Text className="text-xs text-gray-500 m-0">Applied</Text>
                                        <Text className="text-sm font-bold text-gray-900 m-0">
                                            {new Date().toLocaleDateString()}
                                        </Text>
                                    </Column>
                                    <Column align="center">
                                        <Text className="text-xs text-gray-500 m-0">Dashboard</Text>
                                        <Text className="text-sm font-bold text-blue-600 m-0">
                                            <a href="https://we-chess.com/admin/coaches" style={{ color: '#2563eb', textDecoration: 'underline' }}>
                                                View All
                                            </a>
                                        </Text>
                                    </Column>
                                </Row>
                            </Section>

                            <Text className="text-base mt-4">
                                Please review this application at your earliest convenience.
                            </Text>

                            <Section className="mt-8">
                                <Row>
                                    <Text className="text-sm font-medium m-0">
                                        Best regards,
                                    </Text>
                                </Row>
                                <Row>
                                    <Text className="text-sm font-bold m-0">
                                        The We Chess System
                                    </Text>
                                </Row>
                            </Section>
                        </Section>

                        <Hr />

                        {/* Footer */}
                        <Section className="text-center p-4">
                            <Text className="text-xs text-gray-500">
                                © 2026 We Chess. All rights reserved.
                            </Text>
                            <Text className="text-xs text-gray-400 mt-1">
                                This is an automated notification from the We Chess platform.
                            </Text>
                        </Section>

                    </Container>
                </Body>
            </Html>
        </Tailwind>
    )
}

const logo = {
    margin: '0 auto 20px',
};

export default AdminNewCoachApplicationEmail