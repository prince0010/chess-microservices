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

interface VerifiedCoachEmailProps {
    name: string;
    price: number;
    currency: string;
}

const VerifiedCoachEmail = ({ name, price, currency }: VerifiedCoachEmailProps) => {
    const currencySymbol = currency === "USD" ? "$" : currency === "EUR" ? "€" : "₱";

    return (
        <Tailwind
            config={{
                presets: [pixelBasedPreset],
                theme: {
                    extend: {
                        colors: {
                            primary: "#facc16",
                            success: "#16a34a",
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
                        <Section className="text-center bg-success/10 p-6">
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
                            <Heading className="text-2xl font-bold m-0 text-success">
                                Application Approved! 🎉
                            </Heading>
                        </Section>

                        {/* Content */}
                        <Section className="p-8 text-gray-800">
                            <Text className="text-base">
                                Dear <strong>{name || "Coach"}</strong>,
                            </Text>

                            <Text className="text-base mt-4">
                                Great news! Your coach application has been <span className="font-bold text-success">reviewed and approved</span>.
                            </Text>

                            <Text className="text-base mt-2">
                                You are now officially part of the <strong>We Chess</strong> coaching community.
                                We're excited to have you on board!
                            </Text>

                            {/* Rate Box */}
                            <Section className="bg-success/5 rounded-lg p-6 mt-6 border border-success/20">
                                <Text className="text-sm font-medium text-gray-600 m-0 text-center">
                                    Your Approved Hourly Rate
                                </Text>
                                <Text className="text-4xl font-bold text-success text-center m-0 mt-2">
                                    {currencySymbol}{price.toFixed(2)}
                                    <span className="text-lg font-normal text-gray-500 ml-1">/hour</span>
                                </Text>
                                <Text className="text-xs text-gray-500 text-center mt-3">
                                    This rate will be displayed to students when they browse coaches
                                </Text>
                            </Section>

                            {/* Next Steps */}
                            {/* <Section className="mt-6">
                                <Heading className="text-lg font-bold m-0 mb-3">
                                    What's Next?
                                </Heading>
                                <Row className="mb-2">
                                    <Text className="text-base m-0">✓ Complete your coach profile with teaching methodology</Text>
                                </Row>
                                <Row className="mb-2">
                                    <Text className="text-base m-0">✓ Set your availability for lessons</Text>
                                </Row>
                                <Row className="mb-2">
                                    <Text className="text-base m-0">✓ Start receiving lesson requests from students</Text>
                                </Row>
                                <Row className="mb-2">
                                    <Text className="text-base m-0">✓ Check your dashboard for new students</Text>
                                </Row>
                            </Section> */}

                            {/* <Section className="text-center mt-8">
                                <a
                                    href={`${process.env.NEXT_PUBLIC_APP_URL}/coach/dashboard`}
                                    className="bg-success text-white px-8 py-3 rounded-md font-medium no-underline inline-block"
                                >
                                    Go to Your Dashboard
                                </a>
                            </Section> */}

                            <Text className="text-base mt-6">
                                Welcome aboard! If you have any questions, feel free to reach out to our support team.
                            </Text>

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

                        {/* Footer */}
                        <Section className="text-center p-4">
                            <Text className="text-xs text-gray-500">
                                © 2026 We Chess. All rights reserved.
                            </Text>
                            <Text className="text-xs text-gray-500 mt-1">
                                You received this email because your coach application was approved.
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

export default VerifiedCoachEmail;