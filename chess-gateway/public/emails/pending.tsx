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

export const CLOUDINARY_LOGO_URL = "https://res.cloudinary.com/depmbnwrx/image/upload/v1771131766/logo-metatag_o432ru.png"

const PendingCoachEmail = ({ name }: { name: string }) => {
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
                Pending Application For Coach
              </Heading>
            </Section>

            {/* Content */}
            <Section className="p-8 text-gray-800">
              <Text className="text-base">
                Dear Mr./Mrs. <strong>{name || "Applicant"}</strong>,
              </Text>

              <Text className="text-base mt-4">
                Welcome to <strong>We Chess</strong>!
              </Text>

              <Text className="text-base mt-2">
                Congratulations on applying to become a coach at We Chess.
                We truly appreciate your interest in joining our growing chess community.
              </Text>

              <Text className="text-base mt-2">
                Your application is currently under <span className="font-bold underline underline-offset-2">review</span>. We will notify you as soon as possible once your application
                for being a Coach has been verified.
              </Text>

              <Text className="text-base mt-2">
                Thank you for your patience and for choosing to be part of We Chess.
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

export default PendingCoachEmail
