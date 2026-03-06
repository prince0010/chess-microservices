// lib/sse-store.ts
import { EventEmitter } from 'events';

interface SSEClient {
  id: string;
  send: (data: any) => void;
  user?: {
    _id: string;
    role: string;
  };
}

interface SSEEvent {
  type: string;
  payload: {
    refetch?: boolean;
    message?: string;
    roles?: string[];
    receivers?: string[];
    [key: string]: any;
  };
}

class SSEStore {
  private clients: Map<string, SSEClient> = new Map();
  private emitter = new EventEmitter();

  addClient(client: SSEClient) {
    this.clients.set(client.id, client);
    console.log(`Client ${client.id} connected`, client.user);
  }

  removeClient(id: string) {
    this.clients.delete(id);
    console.log(`Client ${id} disconnected`);
  }

  broadcast(event: SSEEvent) {
    console.log(`Broadcasting event: ${event.type}`, {
      totalClients: this.clients.size,
      event
    });

    const { roles = [], receivers = [], ...payload } = event.payload;

    this.clients.forEach((client) => {
      try {
        // Check if client should receive this event
        let shouldSend = false;

        // Rule 1: Check if event has specific receivers
        if (receivers.length > 0) {
          if (client.user && receivers.includes(client.user._id)) {
            shouldSend = true;
          }
        }
        // Rule 2: Check if event has role requirements
        else if (roles.length > 0) {
          if (client.user && roles.includes(client.user.role)) {
            shouldSend = true;
          }
        }
        // Rule 3: If no restrictions, send to all
      else {
          shouldSend = true;
        }

        if (shouldSend) {
          console.log(`Sending to client ${client.id} (user: ${client.user?._id})`);
          client.send({
            type: event.type,
            payload: {
              ...payload,
              sentToUserId: client.user?._id
            }
          });
        }
      } catch (error) {
        console.error(`Error sending to client ${client.id}:`, error);
      }
    });
  }

  sendToUser(userId: string, event: SSEEvent) {
    this.clients.forEach((client) => {
      if (client.user?._id === userId) {
        try {
          client.send(event);
          console.log(`Sent event to user ${userId}`);
        } catch (error) {
          console.error(`Error sending to user ${userId}:`, error);
        }
      }
    });
  }

  sendToRole(role: string, event: SSEEvent) {
    this.clients.forEach((client) => {
      if (client.user?.role === role) {
        try {
          client.send(event);
        } catch (error) {
          console.error(`Error sending to role ${role}:`, error);
        }
      }
    });
  }

  getClientCount() {
    return this.clients.size;
  }
}

export const sseStore = new SSEStore();

// Old

// A simple in-memory store for SSE connections
// export interface SSEClient {
//   id: string;
//   send: (data: any) => void;
//   user?: {
//     _id: string;
//     role: string;
//   };
// }

// class SSEStore {
//   private clients: Map<string, SSEClient> = new Map();

//   addClient(client: SSEClient) {
//     this.clients.set(client.id, client);
//     console.log(`SSE client added: ${client.id}, total: ${this.clients.size}`);
//   }

//   removeClient(clientId: string) {
//     this.clients.delete(clientId);
//     console.log(`SSE client removed: ${clientId}, total: ${this.clients.size}`);
//   }

//   broadcast(data: any) {
//     console.log(`Broadcasting to ${this.clients.size} clients:`, data);
//     this.clients.forEach(client => {
//       try {
//         client.send(data);
//       } catch (error) {
//         console.error(`Error sending to client ${client.id}:`, error);
//         this.removeClient(client.id);
//       }
//     });
//   }

//   sendToUser(userId: string, data: any) {
//     this.clients.forEach(client => {
//       if (client.user?._id === userId) {
//         try {
//           client.send(data);
//         } catch (error) {
//           console.error(`Error sending to user ${userId}:`, error);
//           this.removeClient(client.id);
//         }
//       }
//     });
//   }

//   sendToRole(role: string, data: any) {
//     this.clients.forEach(client => {
//       if (client.user?.role === role) {
//         try {
//           client.send(data);
//         } catch (error) {
//           console.error(`Error sending to role ${role}:`, error);
//           this.removeClient(client.id);
//         }
//       }
//     });
//   }
// }

// // Global instance
// export const sseStore = new SSEStore();