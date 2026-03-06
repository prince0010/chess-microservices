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
} from "@react-email/components"
import { CLOUDINARY_LOGO_URL } from "./pending";

interface RejectedCoachEmailProps {
    name: string;
    rejectionReason: string;
}

const RejectedCoachEmail = ({ name, rejectionReason }: RejectedCoachEmailProps) => {
    return (
        <Tailwind
            config={{
                presets: [pixelBasedPreset],
                theme: {
                    extend: {
                        colors: {
                            primary: "#facc16",
                            error: "#dc2626",
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
                        <Section className="text-center bg-error/10 p-6">
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
                            <Heading className="text-2xl font-bold m-0 text-error">
                                Application Status Update
                            </Heading>
                        </Section>

                        {/* Content */}
                        <Section className="p-8 text-gray-800">
                            <Text className="text-base">
                                Dear <strong>{name || "Applicant"}</strong>,
                            </Text>

                            <Text className="text-base mt-4">
                                Thank you for your interest in becoming a coach at <strong>We Chess</strong>.
                            </Text>

                            <Text className="text-base mt-2">
                                After careful review of your application, we regret to inform you that we are
                                <span className="font-bold text-error"> unable to approve your application</span> at this time.
                            </Text>

                            {/* Rejection Reason Box */}
                            <Section className="bg-error/5 rounded-lg p-6 mt-6 border border-error/20">
                                <Heading className="text-base font-bold m-0 mb-2 text-error">
                                    Reason for Rejection:
                                </Heading>
                                <Text className="text-base italic bg-white p-4 rounded-md border-l-4 border-error">
                                    "{rejectionReason}"
                                </Text>
                            </Section>

                            {/* Suggestions Section */}
                            <Section className="mt-6">
                                <Heading className="text-lg font-bold m-0 mb-3">
                                    Suggestions for Improvement:
                                </Heading>
                                <Row className="mb-2">
                                    <Text className="text-base m-0">• Review and update your qualifications and experience</Text>
                                </Row>
                                <Row className="mb-2">
                                    <Text className="text-base m-0">• Ensure your CV/resume is complete and up-to-date</Text>
                                </Row>
                                <Row className="mb-2">
                                    <Text className="text-base m-0">• Verify your FIDE ID and chess credentials</Text>
                                </Row>
                                <Row className="mb-2">
                                    <Text className="text-base m-0">• Add more detailed information about your teaching experience</Text>
                                </Row>
                            </Section>

                            <Text className="text-base mt-4">
                                You are welcome to address the issues mentioned above and reapply after 30 days.
                                We encourage you to strengthen your application based on this feedback.
                            </Text>

                            {/* <Section className="text-center mt-8">
                                <a
                                    href={`${process.env.NEXT_PUBLIC_APP_URL}/coach/apply`}
                                    className="bg-gray-600 text-white px-8 py-3 rounded-md font-medium no-underline inline-block hover:bg-gray-700"
                                >
                                    Reapply After 30 Days
                                </a>
                            </Section> */}

                            <Text className="text-base mt-6">
                                If you believe this decision was made in error or have any questions,
                                please don't hesitate to contact our support team.
                            </Text>

                            {/* <Section className="text-center mt-4">
                                <a
                                    href={`${process.env.NEXT_PUBLIC_APP_URL}/support`}
                                    className="text-blue-600 text-sm underline"
                                >
                                    Contact Support
                                </a>
                            </Section> */}

                            <Section className="mt-8">
                                <Row>
                                    <Text className="text-sm font-medium m-0">
                                        Best regards,
                                    </Text>
                                </Row>
                                <Row>
                                    <Text className="text-sm font-bold m-0">
                                        The We Chess Team
                                    </Text>
                                </Row>
                            </Section>
                        </Section>

                        <Hr />

                        <Section className="text-center p-4">
                            <Text className="text-xs text-gray-500">
                                © 2026 We Chess. All rights reserved.
                            </Text>
                            <Text className="text-xs text-gray-500 mt-1">
                                You received this email regarding your coach application status.
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

export default RejectedCoachEmail;