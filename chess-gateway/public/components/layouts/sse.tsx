"use client";
import { useSession } from "next-auth/react";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
  useRef,
} from "react";
import { toast } from "sonner";

type SSEEvent = {
  type: string;
  payload: any;
};

type SSEContextType = {
  eventData?: SSEEvent;
  clearEventData: () => void;
};

const SSEContext = createContext<SSEContextType>({
  eventData: undefined,
  clearEventData: () => {},
});

export function SSEProvider({ children }: { children: ReactNode }) {
  const tone = useRef<HTMLAudioElement | null>(null);
  const [eventData, setEventData] = useState<SSEEvent>();
  const { data: session, status }: any = useSession();
  const user = session?.user;

  useEffect(() => {
    if (status === "loading") return;
    if (!user) return;

    let source: EventSource | null = null;
    let reconnectTimeout: NodeJS.Timeout;

    const connect = () => {
      const url = new URL("/api/sse", window.location.origin);
      url.searchParams.set("userId", user._id?.toString() || "");
      url.searchParams.set("userRole", user.role || "");

      source = new EventSource(url.toString());

      source.onmessage = (e) => {
        try {
          console.log("SSE RAW message received:", e.data);
          const data = JSON.parse(e.data);
          console.log("SSE parsed data:", data);

          setEventData(data);

          if (data.payload?.message) {
            switch (data.type) {
              case "PRODUCT_UPDATE":
              case "PRODUCT_CREATE":
                toast.info(data.payload.message, {
                  duration: 3000,
                  position: "bottom-left",
                });
                break;

              case "PRODUCT_DELETE":
                toast.error(data.payload.message, {
                  duration: 4000,
                  position: "bottom-left",
                });
                break;

              case "OUT_OF_STOCK_UPDATE":
                if (data.payload.stockBecameZero) {
                  toast.warning(data.payload.message, {
                    duration: 5000,
                    position: "bottom-left",
                    icon: "⚠️",
                  });
                } else if (data.payload.stockLeftZero) {
                  toast.success(data.payload.message, {
                    duration: 4000,
                    position: "bottom-left",
                    icon: "✅",
                  });
                } else if (data.payload.wasOutOfStock) {
                  toast.info(data.payload.message, {
                    duration: 4000,
                    position: "bottom-left",
                  });
                }
                break;

              case "CREDIT_USER_CREATED":
                toast.success(data.payload.message, {
                  duration: 4000,
                  position: "bottom-left",
                  icon: "💳",
                });
                break;

              case "CREDIT_USER_UPDATED":
                toast.info(data.payload.message, {
                  duration: 4000,
                  position: "bottom-left",
                  icon: "✏️",
                });
                break;

              case "CREDIT_USER_DELETED":
                toast.error(data.payload.message, {
                  duration: 4000,
                  position: "bottom-left",
                  icon: "🗑️",
                });
                break;

              case "CREDIT_RECORD_CREATED":
                toast.success(data.payload.message, {
                  duration: 4000,
                  position: "bottom-left",
                  icon: "📝",
                });
                break;

              case "CREDIT_RECORD_UPDATED":
                toast.info(data.payload.message, {
                  duration: 4000,
                  position: "bottom-left",
                  icon: "🔄",
                });
                break;

              case "CREDIT_RECORD_DELETED":
                toast.error(data.payload.message, {
                  duration: 4000,
                  position: "bottom-left",
                  icon: "🗑️",
                });
                break;

              case "USER_UPDATE":
              case "USER_DELETE":
              case "SUPPLIER_UPDATE":
              case "SUPPLIER_DELETE":
              case "PRODUCT_TYPE_UPDATE":
              case "PRODUCT_TYPE_DELETE":
                if (data.type.includes("DELETE")) {
                  toast.error(data.payload.message);
                } else {
                  toast.info(data.payload.message);
                }
                break;
            }

            if (tone.current) {
              tone.current
                .play()
                .catch((err) => console.error("Audio error:", err));
            }
          }
        } catch (err) {
          console.error("Failed to parse SSE message", err, e.data);
        }
      };

      source.onerror = (err) => {
        console.error("SSE error:", err);
        source?.close();
        reconnectTimeout = setTimeout(connect, 5000);
      };
    };

    connect();

    return () => {
      source?.close();
      clearTimeout(reconnectTimeout);
    };
  }, [user, status]);

  return (
    <SSEContext.Provider
      value={{ eventData, clearEventData: () => setEventData(undefined) }}
    >
      <audio ref={tone} src={"/audio/tone.wav"} />
      {children}
    </SSEContext.Provider>
  );
}

export function useSSE() {
  return useContext(SSEContext);
}