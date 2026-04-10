import { io, Socket } from 'socket.io-client';

class SocketService {
  private socket: Socket | null = null;

  connect() {
    // Using the provided URL or falling back to the API base URL
    const socketUrl = import.meta.env.VITE_SOCKET_URL || 'https://api.vlmacademy.co.in';
    
    console.log('SocketService: Connecting to', socketUrl);
    
    // Force websocket transport from the start to avoid "xhr poll error"
    // which often happens due to CORS or proxy issues with long-polling
    this.socket = io(socketUrl, {
      reconnectionAttempts: 10,
      reconnectionDelay: 2000,
      reconnection: true,
      autoConnect: true,
      transports: ['websocket'],
      upgrade: false,
      timeout: 20000,
    });

    this.socket.on('connect', () => {
      console.log('SocketService: Connected to socket server via WebSocket');
    });

    this.socket.on('disconnect', (reason) => {
      console.log('SocketService: Disconnected from socket server. Reason:', reason);
      if (reason === 'io server disconnect') {
        this.socket?.connect();
      }
    });

    this.socket.on('connect_error', (error) => {
      console.error('SocketService: Connection error:', error.message);
      
      // If websocket fails on the base URL, try the /api path as a last resort
      if (socketUrl === 'https://api.vlmacademy.co.in' && !this.socket?.active) {
        console.log('SocketService: WebSocket failed on base URL, trying /api/socket.io path...');
        this.socket?.disconnect();
        this.socket = io('https://api.vlmacademy.co.in', {
          path: '/api/socket.io',
          reconnection: true,
          transports: ['websocket'],
          timeout: 20000,
        });
      }
    });
  }

  on(event: string, callback: (data: any) => void) {
    if (!this.socket) {
      console.warn('SocketService: Attempted to listen to event before connecting:', event);
    }
    this.socket?.on(event, callback);
  }

  off(event: string) {
    this.socket?.off(event);
  }

  emit(event: string, data: any) {
    if (!this.socket) {
      console.warn('SocketService: Attempted to emit event before connecting:', event);
    }
    this.socket?.emit(event, data);
  }

  get isConnected() {
    return this.socket?.connected || false;
  }
}

export const socketService = new SocketService();
