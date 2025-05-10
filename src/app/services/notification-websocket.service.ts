import { Injectable } from '@angular/core';
import { Client, Message, StompHeaders } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { BehaviorSubject } from 'rxjs';
import { Notification as AppNotification } from '../model/notification.model';

@Injectable({
  providedIn: 'root',
})
export class NotificationWebSocketService {
  private stompClient: Client;
  private connected = false;

  private notificationsSubject = new BehaviorSubject<AppNotification[]>([]);
  notifications$ = this.notificationsSubject.asObservable();

  private wsEndpoint = 'http://localhost:8081/ws';

  constructor() {
    console.log('✅ Using WS endpoint:', this.wsEndpoint);

    // Ask for browser notification permission
    if (Notification.permission !== 'granted' && Notification.permission !== 'denied') {
      Notification.requestPermission().then(permission => {
        console.log('🔐 Notification permission:', permission);
      });
    }

    this.stompClient = new Client({
      webSocketFactory: () => {
        const token = localStorage.getItem('token');
        return new SockJS(`${this.wsEndpoint}?token=${token}`);
      },
      reconnectDelay: 5000,
      debug: (str) => console.log('[WebSocket]', str),
      connectHeaders: this.buildConnectHeaders(),
    });
  }

  private buildConnectHeaders(): StompHeaders {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  connect(): void {
    if (this.connected) {
      console.log('Already connected to WebSocket');
      return;
    }

    this.stompClient.onConnect = (frame) => {
      console.log('✅ WebSocket connected:', frame);
      this.connected = true;

      // 📥 Receive new notifications
      this.stompClient.subscribe('/user/queue/notifications', (message: Message) => {
        console.log('📥 Incoming WebSocket message:', message.body);

        try {
          const incoming: AppNotification = JSON.parse(message.body);

          // 🔔 Show native browser notification
if ('Notification' in window && Notification.permission === 'granted') {
  new Notification(incoming.description, {
    body: 'Cliquez pour voir plus',
    icon: 'assets/free-notification.png',  // This path is now correct
  });
} else if ('Notification' in window && Notification.permission !== 'denied') {
  Notification.requestPermission().then(permission => {
    if (permission === 'granted') {
      new Notification(incoming.description, {
        body: 'Cliquez pour voir plus',
        icon: 'assets/free-notification.png',
      });
    }
  });
}


          const current = this.notificationsSubject.value;
          const updated = [incoming, ...current.filter(n => n.id !== incoming.id)]
            .sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime());

          this.notificationsSubject.next(updated);
        } catch (err) {
          console.error('❌ Error parsing WebSocket message:', err);
          this.notificationsSubject.error(err);
        }
      });

      // 🗑 Handle deleted notifications
      this.stompClient.subscribe('/user/queue/notifications/deleted', (msg: Message) => {
        console.log('📤 Notification deleted from socket:', msg.body);
        try {
          const deletedId = parseInt(msg.body, 10);
          const current = this.notificationsSubject.value;
          this.notificationsSubject.next(current.filter(n => n.id !== deletedId));
        } catch (err) {
          console.error('❌ Error parsing deleted message:', err);
        }
      });
    };

    this.stompClient.onStompError = (frame) => {
      console.error('❌ STOMP error:', frame);
      this.connected = false;
      this.notificationsSubject.error(new Error('STOMP error: ' + frame.body));
    };

    this.stompClient.onWebSocketError = (evt) => {
      console.error('❌ WebSocket error:', evt);
      this.connected = false;
      setTimeout(() => this.connect(), 5000);
    };

    this.stompClient.onWebSocketClose = (evt) => {
      console.log('🔌 WebSocket closed:', evt);
      this.connected = false;
      setTimeout(() => this.connect(), 5000);
    };

    console.log('Activating WebSocket client...');
    this.stompClient.activate();
  }

  disconnect(): void {
    this.stompClient.deactivate();
    this.connected = false;
    console.log('🛑 WebSocket disconnected');
  }

  setInitialNotifications(initial: AppNotification[]) {
    this.notificationsSubject.next(initial);
  }

  public addOrUpdateNotification(notif: AppNotification): void {
    const current = this.notificationsSubject.value;
    const updated = [notif, ...current.filter(n => n.id !== notif.id)]
      .sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime());
    this.notificationsSubject.next(updated);
  }

  public mergeNotifications(notifs: AppNotification[]): void {
    const current = this.notificationsSubject.value;
    const merged = [...notifs.filter(n => !current.some(c => c.id === n.id)), ...current]
      .sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime());
    this.notificationsSubject.next(merged);
  }
}
