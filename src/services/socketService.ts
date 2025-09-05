import { io, Socket } from 'socket.io-client';
import { getBaseUrl } from '../config/environment';
import Cookies from 'js-cookie';

class SocketService {
  private socket: Socket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;

  connect(): Promise<Socket> {
    return new Promise((resolve, reject) => {
      if (this.socket?.connected) {
        resolve(this.socket);
        return;
      }

      // Get authentication token from cookies
      const token = Cookies.get('user_s');
      if (!token) {
        reject(new Error('No authentication token found'));
        return;
      }

      const serverUrl = getBaseUrl();
      
      this.socket = io(serverUrl, {
        auth: {
          token: token
        },
        transports: ['websocket', 'polling'],
        upgrade: true,
        rememberUpgrade: true
      });

      this.socket.on('connect', () => {
        console.log('Connected to socket server');
        this.reconnectAttempts = 0;
        resolve(this.socket!);
      });

      this.socket.on('connect_error', (error) => {
        console.error('Socket connection error:', error);
        this.handleReconnect();
        reject(error);
      });

      this.socket.on('disconnect', (reason) => {
        console.log('Socket disconnected:', reason);
        if (reason === 'io server disconnect') {
          // Server initiated disconnect, reconnect manually
          this.handleReconnect();
        }
      });
    });
  }

  private handleReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      setTimeout(() => {
        console.log(`Attempting to reconnect... (${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
        this.connect().catch(console.error);
      }, 2000 * this.reconnectAttempts);
    } else {
      console.error('Max reconnection attempts reached');
    }
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  getSocket(): Socket | null {
    return this.socket;
  }

  // Message methods
  sendMessage(message: string, messageType: string = 'text', replyTo?: string) {
    if (this.socket?.connected) {
      this.socket.emit('sendMessage', { message, messageType, replyTo });
    }
  }

  editMessage(messageId: string, message: string) {
    if (this.socket?.connected) {
      this.socket.emit('editMessage', { messageId, message });
    }
  }

  deleteMessage(messageId: string) {
    if (this.socket?.connected) {
      this.socket.emit('deleteMessage', { messageId });
    }
  }

  setTyping(isTyping: boolean) {
    if (this.socket?.connected) {
      this.socket.emit('typing', { isTyping });
    }
  }

  // Event listeners
  onNewMessage(callback: (message: any) => void) {
    this.socket?.on('newMessage', callback);
  }

  onMessageEdited(callback: (message: any) => void) {
    this.socket?.on('messageEdited', callback);
  }

  onMessageDeleted(callback: (data: { messageId: string }) => void) {
    this.socket?.on('messageDeleted', callback);
  }

  onOnlineUsersUpdate(callback: (users: any[]) => void) {
    this.socket?.on('onlineUsersUpdate', callback);
  }

  onUserTyping(callback: (data: { username: string; isTyping: boolean }) => void) {
    this.socket?.on('userTyping', callback);
  }

  onError(callback: (error: { message: string }) => void) {
    this.socket?.on('error', callback);
  }

  // Remove event listeners
  off(event: string, callback?: any) {
    this.socket?.off(event, callback);
  }
}

export const socketService = new SocketService();
export default socketService;