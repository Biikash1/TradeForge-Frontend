import { Client } from "@stomp/stompjs";

let stompClient = null;

export const connectWebSocket = (onMessageReceived) => {
  // Use native ws:// protocol instead of http://
  stompClient = new Client({
    brokerURL: "ws://localhost:8080/ws",
    reconnectDelay: 5000, // Automatically attempts to reconnect
    
    // Disable debug logging in production
    debug: function (str) {
      // console.log(str); 
    },
    
    onConnect: () => {
      console.log("Connected to WebSocket natively");
      
      stompClient.subscribe("/topic/public/prices", (message) => {
        if (message.body) {
          const livePrices = JSON.parse(message.body);
          onMessageReceived(livePrices);
        }
      });
    },
    
    onStompError: (frame) => {
      console.error("Broker reported error: " + frame.headers["message"]);
      console.error("Additional details: " + frame.body);
    },
  });

  stompClient.activate();
};

export const disconnectWebSocket = () => {
  if (stompClient !== null) {
    stompClient.deactivate();
    console.log("Disconnected from WebSocket");
  }
};