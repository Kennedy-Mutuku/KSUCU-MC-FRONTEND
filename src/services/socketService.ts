import { io, Socket } from 'socket.io-client';
import { getBaseUrl } from '../config/environment';
import Cookies from 'js-cookie';

class SocketService {
  private socket: Socket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;

  connect(): Promise<Socket> {
    return new Promise(async (resolve, reject) => {
      if (this.socket?.connected) {
        resolve(this.socket);
        return;
      }

      const serverUrl = getBaseUrl();
      console.log('🔌 SocketService: Connecting to:', serverUrl);

      // Get authentication token from cookies (required)  
      console.log('🔐 SocketService: All available cookies:', document.cookie);
      const token = Cookies.get('socket_token');
      const userS = Cookies.get('user_s');
      console.log('🔐 SocketService: socket_token:', token ? 'Found' : 'Not found');
      console.log('🔐 SocketService: user_s:', userS ? 'Found' : 'Not found');
      console.log('🔐 SocketService: Token value debug:', token?.substring(0, 20) + '...' || 'No token');
      
      // If no socket_token, try to get a fresh one by making a request to the backend
      if (!token) {
        console.log('❌ SocketService: No socket_token found, attempting to get fresh token...');
        try {
          // Make a request to get user info, which should set fresh cookies
          const response = await fetch(getBaseUrl() + '/users', {
            credentials: 'include'
          });
          
          if (response.ok) {
            // Try to get token again after the request
            const refreshedToken = Cookies.get('socket_token');
            if (refreshedToken) {
              console.log('✅ SocketService: Got refreshed token');
              // Continue with the refreshed token
              this.socket = io(serverUrl, {
                auth: {
                  token: refreshedToken
                },
                transports: ['websocket', 'polling'],
                upgrade: true,
                rememberUpgrade: true
              });
            } else {
              console.log('❌ SocketService: Still no token after refresh attempt');
              reject(new Error('No authentication token available'));
              return;
            }
          } else {
            console.log('❌ SocketService: Authentication failed');
            reject(new Error('Authentication failed'));
            return;
          }
        } catch (fetchError) {
          console.log('❌ SocketService: Error fetching fresh token:', fetchError);
          reject(new Error('No authentication token available'));
          return;
        }
      } else {
        // Continue with original token
        this.socket = io(serverUrl, {
          auth: {
            token: token
          },
          transports: ['websocket', 'polling'],
          upgrade: true,
          rememberUpgrade: true
        });
      }

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

  deleteMessageForMe(messageId: string) {
    if (this.socket?.connected) {
      this.socket.emit('deleteMessageForMe', { messageId });
    }
  }

  updateMessageStatus(messageId: string, status: string) {
    if (this.socket?.connected) {
      this.socket.emit('updateMessageStatus', { messageId, status });
    }
  }

  setTyping(isTyping: boolean) {
    if (this.socket?.connected) {
      this.socket.emit('typing', { isTyping });
    }
  }

  // Reaction methods
  addReaction(messageId: string, reactionType: 'like' | 'dislike') {
    if (this.socket?.connected) {
      this.socket.emit('addReaction', { messageId, reactionType });
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

  onMessageDeletedForUser(callback: (data: { messageId: string; userId?: string; username?: string }) => void) {
    this.socket?.on('messageDeletedForUser', callback);
  }

  onMessageStatusUpdated(callback: (data: { messageId: string; status: string }) => void) {
    this.socket?.on('messageStatusUpdated', callback);
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

  onReactionUpdate(callback: (data: { messageId: string; reactions: any }) => void) {
    this.socket?.on('reactionUpdate', callback);
  }

  // Remove event listeners
  off(event: string, callback?: any) {
    this.socket?.off(event, callback);
  }
}

export const socketService = new SocketService();
export default socketService;