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
    const ws = new WebSocket("ws://192.168.0.106:8887");
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
      const openedConnections = JSON.parse(event.data);
      setData(() => openedConnections);
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
