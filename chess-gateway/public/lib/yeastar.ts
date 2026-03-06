import axios from "axios"

const sendSMS = async ({
  destination,
  content,
}: {
  destination: string[]
  content: string
}): Promise<any> => {
  try {
    const responses = await Promise.all(
      destination.map((dest) =>
        axios.get(`${process.env.SMS_GATEWAY_URL}/cgi/WebCGI?1500101=`, {
          params: {
            account: process.env.SMS_GATEWAY_USER,
            password: process.env.SMS_GATEWAY_PASS,
            port: process.env.SMS_GATEWAY_PORT,
            destination: `+63${dest}`,
            content,
          },
        })
      )
    )
    return responses
  } catch (err: any) {
    console.warn("TG400 header error ignored:", err.message)
    return null // don't throw
  }
}

const SMS = { sendSMS }

export default SMS
