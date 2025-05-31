import { createSignal, createContext, useContext, createEffect, onCleanup } from "solid-js";
import { useAuthContext } from "./AuthContextProvider";

const SseContext = createContext();

export function SseContextProvider(props) {
  const { token } = useAuthContext();
  const [sse, setSse] = createSignal(null);
  const [data, setData] = createSignal("");
  const value = { sse, setSse, data, setData };

  createEffect(() => {
    if (!token()) {
      return;
    }
    const eventSource = new EventSource("http://localhost:7070/sse", { withCredentials: true });
    setSse(eventSource);

    eventSource.addEventListener("message", (event) => {
      setData(event.data);
      console.log("sse event is: " + event.data);
    });

    onCleanup(() => {
      eventSource.close();
      console.log("SSE connection closed");
      setSse(null);
    });
  });

  return (
    <SseContext.Provider value={value}>
      {props.children}
    </SseContext.Provider>
  )
}

export function useSseContext() {
  return useContext(SseContext);
}
