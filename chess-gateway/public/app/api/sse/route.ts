import { sseStore } from "@/lib/sse-store"
import { NextRequest } from "next/server"
import { randomUUID } from "crypto"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"
export const fetchCache = "force-no-store"

export async function GET(req: NextRequest) {
  const encoder = new TextEncoder()
  const clientId = randomUUID()

  const stream = new ReadableStream({
    start(controller) {
      // Set retry interval
      controller.enqueue(encoder.encode("retry: 3000\n\n"))

      // Create send function
      const send = (data: any) => {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`))
      }

      // Send connection message
      send({ message: "Connected to SSE" })

      // Get user info from headers or query params
      const userId = req.headers.get("x-user-id") || req.nextUrl.searchParams.get("userId")
      const userRole = req.headers.get("x-user-role") || req.nextUrl.searchParams.get("userRole")

      // Add client to store
      sseStore.addClient({
        id: clientId,
        send,
        user: userId && userRole ? { _id: userId, role: userRole } : undefined
      })

      // Heartbeat
      const heartbeat = setInterval(() => {
        controller.enqueue(encoder.encode(": heartbeat\n\n"))
      }, 20000)

      // Cleanup on disconnect
      req.signal.addEventListener("abort", () => {
        console.log(`Client ${clientId} disconnected`)
        clearInterval(heartbeat)
        sseStore.removeClient(clientId)
        controller.close()
      })
    },
  })

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
      "Transfer-Encoding": "chunked",
    },
  })
}