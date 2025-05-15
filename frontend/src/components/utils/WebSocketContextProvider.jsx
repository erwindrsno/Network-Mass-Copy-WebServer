import { createSignal, createContext, useContext, createEffect, onCleanup } from "solid-js";
import { useAuthContext } from "./AuthContextProvider";

const WebSocketContext = createContext();

export function WebSocketContextProvider(props) {
  const { token } = useAuthContext();
  const [socket, setSocket] = createSignal(null);
  const [data, setData] = createSignal([]);
  const value = { socket, setSocket, data, setData };

  createEffect(() => {
    if (!token()) {
      return;
    }
    const ws = new WebSocket(`${import.meta.env.VITE_WEBSOCKET_SERVER_URL}`);
    setSocket(ws);

    ws.onopen = () => {
      console.log("WebSocket connected");

      if (socket() && socket().readyState === WebSocket.OPEN) {
        console.log("And in ready state");
      } else {
        console.warn("WebSocket is not open");
      }
      if (token() === "") {
        socket().close();
      }
    };

    ws.onmessage = (event) => {
      const message = event.data;

      if (message.startsWith("monitor/")) {
        const jsonPayload = message.slice("monitor/".length);
        try {
          const openedConnections = JSON.parse(jsonPayload);
          setData(() => openedConnections);
        } catch (error) {
          console.error("Failed to parse monitor JSON:", error);
        }
      }
      // else if (message.startsWith("ok/")) {
      //   const strJson = message.slice("ok/".length);
      //   const json = JSON.parse(strJson);
      //   console.log(json);
      // } else {
      //   // Handle other message types (optional)
      //   console.log("Received non-monitor message:", message);
      // }
    };

    ws.onerror = (err) => {
      console.error("WebSocket error:", err);
    };

    ws.onclose = () => {
      console.log("WebSocket closed");
    };

    onCleanup(() => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.close();
      }
      console.log("WebSocket cleaned up");
    });
  });

  return (
    <WebSocketContext.Provider value={value}>
      {props.children}
    </WebSocketContext.Provider>
  )
}

export function useWebSocketContext() {
  return useContext(WebSocketContext);
}
