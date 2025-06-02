import { createEffect, createResource, createSignal, createMemo, onCleanup, onMount, Switch } from "solid-js";
import { useAuthContext } from "../utils/AuthContextProvider.jsx";
import { apiFetchComputer } from "@apis/ComputerApi.jsx";
import toast, { Toaster } from 'solid-toast';

function StatusBoard() {
  const { token, setToken } = useAuthContext();
  const [data, setData] = createSignal([]);
  const [computers, { mutate, refetch }] = createResource(() => apiFetchComputer(token));
  const [labNum, setLabNum] = createSignal(1);
  const [hasChecked, setHasChecked] = createSignal(false);
  const [socket, setSocket] = createSignal(null);

  const handleLabNumChange = (event) => {
    setLabNum(Number(event.target.value))
  }

  const handlecheck = (event) => {
    event.preventDefault();
    // Toast with a countdown timer
    const duration = 2000
    toast.custom((t) => {
      const [life, setLife] = createSignal(100);
      const startTime = Date.now();

      setTimeout(() => toast.dismiss(t.id), duration);

      createEffect(() => {
        const interval = setInterval(() => {
          const diff = Date.now() - startTime;
          setLife(100 - (diff / duration * 100));
        });
        onCleanup(() => clearInterval(interval));
      });

      return (
        <div class="bg-slate-800 p-3 rounded-md shadow-md min-w-[350px]">
          <div class="flex gap-2">
            <div class="flex flex-1 flex-col">
              <div class="font-medium text-white">Checking initiated</div>
              <div class="text-sm text-gray-50">3 seconds</div>
            </div>
          </div>
          <div class="relative pt-4">
            <div class="w-full h-1 rounded-full bg-gray-400"></div>
            <div
              class="h-1 top-4 absolute rounded-full bg-gray-50"
              style={{ width: `${life()}%` }}
            ></div>
          </div>
        </div>
      );
    }, { duration });
    socket().send("webclient/monitor/" + labNum());
  }

  const filteredComputers = createMemo(() => {
    //jika computers masih dalam proses fetching
    if (computers.loading) {
      return [];
    } else if (computers()) {
      return computers().filter((c) => c.lab_num === labNum());
    }
    //jika computers gagal fetching
    else {
      return [];
    }
  });

  onMount(() => {
    const ws = new WebSocket(`${import.meta.env.VITE_WEBSOCKET_SERVER_URL}`);
    setSocket(ws);

    socket().onopen = () => {
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

    socket().onmessage = (event) => {
      const message = event.data;

      if (message.startsWith("monitor/")) {
        const jsonPayload = message.slice("monitor/".length);
        try {
          const jsonParsed = JSON.parse(jsonPayload);
          setData(jsonParsed);
          console.log(data());
          setHasChecked(true)
        } catch (error) {
          console.error("Failed to parse monitor JSON:", error);
        }
      }
    };

    socket().onerror = (err) => {
      console.error("WebSocket error:", err);
    };

    socket().onclose = () => {
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
    <div class="flex flex-col gap-4">
      <select name="lab_num" onChange={handleLabNumChange} value={labNum()} class="bg-gray-50 rounded-sm border border-slate-300">
        <option value="1">LAB01 - 9018</option>
        <option value="2">LAB02 - 9017</option>
        <option value="3">LAB03 - 9016</option>
        <option value="4">LAB04 - 9015</option>
      </select>

      <div class="flex flex-row gap-4">
        <button class="bg-green-500 px-3 py-1 rounded-sm text-white cursor-pointer" onClick={handlecheck}>Check!</button>
        <div class="w-[2px] h-full bg-gray-300"></div>
        <div class="flex flex-col">
          <p class="block">Legends:</p>
          <div class="flex flex-row gap-16">
            <p><span class="inline-block w-3 h-3 bg-sky-100 rounded-full"></span> = Not checked yet.</p>
            <p><span class="inline-block w-3 h-3 bg-green-500 rounded-full"></span> = Connected</p>
            <p><span class="inline-block w-3 h-3 bg-red-500 rounded-full"></span> = Not connected</p>
          </div>
        </div>
      </div>

      <div class="w-full h-full px-4 py-4 shadow-md bg-white bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]">
        <div class="grid grid-cols-7 w-full h-3/4 gap-2">
          <For each={filteredComputers()} fallback={<p>Loading...</p>}>
            {(item, index) => {
              const isActive = () => data().includes(item.ip_address);
              console.log(isActive())

              const showColor = () => {
                if (!hasChecked()) {
                  return "bg-gray-300";
                }
                return isActive() ? "bg-green-500 animate-ping" : "bg-red-500";
              };

              return (
                <div class="bg-sky-100 text-center flex flex-col border rounded-sm border-gray-300 relative p-0 z-40">
                  <span class="absolute top-0 right-0 flex size-3 z-50">
                    <span class="absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75"></span>
                    <span class={`relative inline-flex size-3 rounded-full ${showColor()}`}></span>
                  </span>

                  <p class="text-lg">{item.host_name}</p>
                  <p class="text-sm">{item.ip_address}</p>
                </div>
              )
            }}
          </For>
        </div>
      </div>
    </div>
  )
}

export default StatusBoard;
