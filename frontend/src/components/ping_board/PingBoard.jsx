import { createEffect, createResource, createSignal, createMemo, onCleanup, onMount } from "solid-js";
import { useAuthContext } from "../utils/AuthContextProvider.jsx";
import { useWebSocketContext } from "../utils/WebSocketContextProvider.jsx";
import { apiFetchComputer } from "@apis/ComputerApi.jsx";
import toast, { Toaster } from 'solid-toast';

function PingBoard() {
  const { token, setToken } = useAuthContext();
  const { socket, setSocket, data, setdata } = useWebSocketContext();
  const [computers, { mutate, refetch }] = createResource(() => apiFetchComputer(token));
  const [labNum, setLabNum] = createSignal(1);
  const [hasPinged, setHasPinged] = createSignal(false);

  const [colorReady, setColorReady] = createSignal(false);

  const handleLabNumChange = (event) => {
    setLabNum(Number(event.target.value))
  }

  const handlePing = () => {
    setHasPinged(true)
    toast("Polling...", {
      position: "top-center"
    });

    setTimeout(() => {
      setColorReady(true);
    }, 2000);
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

  createEffect(() => {
    if (!hasPinged()) {
      return;
    }
    let intervalPolling;

    if (socket().readyState === WebSocket.OPEN) {
      intervalPolling = setInterval(() => {
        if (socket().readyState === WebSocket.OPEN) {
          socket().send(`webclient/monitor/${labNum()}`);
        } else {
          console.warn("WebSocket is not open");
        }
      }, 2000);
    } else {
      console.warn("WebSocket is not open");
    }

    onCleanup(() => {
      clearInterval(intervalPolling);
      console.log("Interval cleaned.");
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
        <button class="bg-green-500 px-3 py-1 rounded-sm text-white cursor-pointer" onClick={handlePing}>Poll!</button>
        <div class="w-[2px] h-full bg-gray-300"></div>
        <div class="flex flex-col">
          <p class="block">Legends:</p>
          <div class="flex flex-row gap-16">
            <p><span class="inline-block w-3 h-3 bg-sky-100 rounded-full"></span> = Not yet polled.</p>
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

              const showColor = () => {
                if (!hasPinged() || !colorReady()) {
                  return "bg-gray-300";
                }
                if (colorReady()) {
                  return isActive() ? "bg-green-500 animate-ping" : "bg-red-500";
                }
              };

              return (
                <div class="bg-sky-100 text-center flex flex-col border rounded-sm border-gray-300 relative p-0 z-40">
                  <Show when={hasPinged() && colorReady()} >
                    <span class="absolute top-0 right-0 flex size-3 z-50">
                      <span class="absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75"></span>
                      <span class={`relative inline-flex size-3 rounded-full ${showColor()}`}></span>
                    </span>
                  </Show>

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

export default PingBoard;
