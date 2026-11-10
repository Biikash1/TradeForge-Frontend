import { Client } from "@stomp/stompjs";

let stompClient = null;
let subscriptions = {};
let pendingSubscriptions = [];

export const connectWebSocket = () => {
  if (stompClient && stompClient.active) return;

  stompClient = new Client({
    brokerURL: "ws://localhost:8080/ws",
    reconnectDelay: 5000, 
    debug: function (str) {
      // console.log(str); 
    },
    
    onConnect: () => {
      console.log("Connected to WebSocket natively");
      
      // Process any components that tried to subscribe before connection was fully established
      pendingSubscriptions.forEach(({ channel, callback }) => {
        subscribe(channel, callback);
      });
      pendingSubscriptions = [];
    },
    
    onStompError: (frame) => {
      console.error("Broker reported error: " + frame.headers["message"]);
      console.error("Additional details: " + frame.body);
    },
  });

  stompClient.activate();
};

// Internal actual subscribe function
const subscribe = (channel, callback) => {
  if (subscriptions[channel]) return; // Prevent duplicate subscriptions

  const subscription = stompClient.subscribe(channel, (message) => {
    if (message.body) {
      callback(JSON.parse(message.body));
    }
  });
  subscriptions[channel] = subscription;
};

// Hook for React components to request a channel subscription
export const subscribeToChannel = (channel, onMessageReceived) => {
  if (stompClient && stompClient.connected) {
    subscribe(channel, onMessageReceived);
  } else {
    pendingSubscriptions.push({ channel, callback: onMessageReceived });
  }
};

// Hook for React components to clean up when they unmount
export const unsubscribeFromChannel = (channel) => {
  if (subscriptions[channel]) {
    subscriptions[channel].unsubscribe();
    delete subscriptions[channel];
  } else {
    // Remove from pending if component unmounted before connection finished
    pendingSubscriptions = pendingSubscriptions.filter(sub => sub.channel !== channel);
  }
};

export const disconnectWebSocket = () => {
  if (stompClient !== null) {
    Object.values(subscriptions).forEach(sub => sub.unsubscribe());
    subscriptions = {};
    pendingSubscriptions = [];
    stompClient.deactivate();
    console.log("Disconnected from WebSocket");
  }
};