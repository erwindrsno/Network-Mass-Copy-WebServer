import { createResource, createSignal, onMount, onCleanup, Show } from 'solid-js';
import { useAuthContext } from "../utils/AuthContextProvider.jsx";
import FileModal from "./FileModal.jsx";
import { CopyIcon, TakeownIcon, TrashcanIcon } from "../../assets/Icons.jsx";
import { useNavigate, action } from "@solidjs/router";
import Pagination from '../utils/Pagination.jsx'
import { formatDateTime } from '../utils/DateTimeDisplayFormatter.jsx';
import { displayIcon } from '../utils/DisplayFromOxamIcon.jsx';
import SudoModal from './SudoModal.jsx';
import Loading from '../utils/Loading.jsx';
import toast, { Toaster } from 'solid-toast';
import { useWebSocketContext } from '../utils/WebSocketContextProvider.jsx';


function EntryRecordTable() {
  const navigate = useNavigate();
  const { token, setToken } = useAuthContext();
  const { socket, setSocket } = useWebSocketContext();
  const [entries, { mutate, refetch }] = createResource(() => fetchEntries(token));
  const [isModalToggled, toggleModal] = createSignal(false);
  const [isSudoModalToggled, toggleSudoModal] = createSignal(false);
  const [title, setTitle] = createSignal("" || "N/A");
  const [entryId, setEntryId] = createSignal(null);
  const [clientCount, setClientCount] = createSignal(0);
  const [paginated, setPaginated] = createSignal({
    currentPage: 1,
    items: [],
    totalPages: 1
  });

  const openModal = (title, id) => {
    setTitle(title);
    setEntryId(id);
    toggleModal(prev => !prev);
  }

  const closeModal = () => {
    setTitle("");
    setEntryId(null);
    toggleModal(prev => !prev);
  }

  const openSudoModal = (id, title, count) => {
    setTitle(title);
    setEntryId(id);
    setClientCount(count);
    console.log("the count is: " + clientCount());
    toggleSudoModal(prev => !prev);
  }

  const closeSudoModal = () => {
    setTitle("");
    setEntryId(null);
    toggleSudoModal(prev => !prev);
  }

  const viewSingleEntryRecord = (id, title) => {
    navigate(`entry/${id}`, { state: { title: title } });
  }

  onMount(() => {
    const ws = socket();
    if (!ws) return;

    const onMessage = (event) => {
      const message = event.data;

      console.log(message);

      if (message.startsWith("ok/")) {
        const strJson = message.slice("ok/".length);
        const json = JSON.parse(strJson);
        // console.log("Handled in component:", json);
        insertFileCompletion(token, json, entryId);
      } else if (message === "refetch") {
        console.log("aye aye sir, ready to received");
      }
    };

    ws.addEventListener("message", onMessage);

    onCleanup(() => {
      ws.removeEventListener("message", onMessage);
    });
  });

  return (
    <>
      <div class="shadow-md rounded-lg overflow-hidden">
        <table class="text-sm rtl:text-right text-gray-500">
          <thead class="text-xs text-gray-700 bg-gray-300">
            <tr>
              <th scope="col" class="px-4 w-3xs py-3 text-left">No.</th>
              <th scope="col" class="w-3xl py-3 text-left">Title</th>
              <th scope="col" class="w-md py-3 text-center">File</th>
              <th scope="col" class="w-sm py-3 text-center">From OXAM</th>
              <th scope="col" class="w-sm py-3 text-center">Created at</th>
              <th scope="col" class="w-3xs py-3 text-center">Copy Status</th>
              <th scope="col" class="w-3xs py-3 text-center">Takeown Status</th>
              <th scope="col" class="py-3 w-min">Action</th>
            </tr>
          </thead>
          <tbody>
            <For each={paginated().items} fallback={<p>Loading...</p>}>
              {(entry, index) => (
                <tr key={entry.id} class="bg-white border-b border-gray-200 hover:bg-gray-50">
                  <td class="px-4 py-3 text-left">{(paginated().currentPage - 1) * 10 + index() + 1}</td>
                  <td class="py-3 text-left whitespace-nowrap">{entry.title}</td>
                  <td class="py-3 text-center whitespace-nowrap"><button onClick={() => openModal(entry.title, entry.id)} class="hover:text-blue-500 cursor-pointer hover:underline">view</button></td>
                  <td class="py-3 text-center whitespace-nowrap justify-items-center">{displayIcon(entry.fromOxam)}</td>
                  <td class="py-3 text-center whitespace-nowrap">{formatDateTime(entry.createdAt)}</td>
                  <td class="py-3 text-center whitespace-nowrap">{entry.copyStatus}</td>
                  <td class="py-3 text-center whitespace-nowrap">{entry.takeownStatus}</td>
                  <td class="text-center text-sm px-2 py-1.5">
                    <div class="flex flex-col gap-1 w-min">
                      <button onClick={() => viewSingleEntryRecord(entry.id, entry.title)} class="bg-blue-600 hover:bg-blue-700 text-gray-50 px-1 py-0.5 rounded-xs cursor-pointer">View</button>
                      <div class="flex gap-1">
                        <button onClick={() => openSudoModal(entry.id, entry.title, entry.count)} class="bg-gray-700 hover:bg-gray-900 text-gray-50 px-1 py-0.5 rounded-xs cursor-pointer"><CopyIcon></CopyIcon></button>
                        <button onClick={() => console.log(entry.createdAt)} class="bg-gray-700 hover:bg-gray-900 text-gray-50 px-1 py-0.5 rounded-xs cursor-pointer"><TakeownIcon></TakeownIcon></button>
                        <button onClick={() => console.log(entry.createdAt)} class="bg-gray-700 hover:bg-gray-900 text-gray-50 px-1 py-0.5 rounded-xs cursor-pointer"><TrashcanIcon /></button>
                      </div>
                    </div>
                  </td>
                </tr>
              )}
            </For>
          </tbody>
        </table>
        <Show when={isModalToggled()}>
          <FileModal title={title()} entryId={entryId()} closeModal={closeModal} />
        </Show>
        <Show when={isSudoModalToggled()}>
          <SudoModal closeSudoModal={closeSudoModal} title={title()} entryId={entryId()} authSudoAction={authSudoAction} />
        </Show>
      </div>

      <Pagination items={entries()} onPageChange={setPaginated} />
    </>
  )
}

const fetchEntries = async (token) => {
  const response = await fetch(`${import.meta.env.VITE_LOCALHOST_BACKEND_URL}/entry`, {
    method: "GET",
    credentials: "include",
    headers: {
      "Authorization": `Bearer ${token()}`
    },
  })
  if (!response.ok && response.status === 401) {
    console.log("UNAUTH!")
  }
  const result = await response.json();
  return result;
}

const handleCopyByEntry = async (token, id) => {
  const response = await fetch(`${import.meta.env.VITE_LOCALHOST_BACKEND_URL}/entry/${id}/copy`, {
    method: "GET",
    credentials: "include",
    headers: {
      "Authorization": `Bearer ${token()}`
    },
  })
  if (!response.ok && response.status === 401) {
    console.log("UNAUTH!")
  }
  if (response.ok && response.status === 200) {
    console.log("SUCCEED!");
  }
}

const authSudoAction = async (event, token, id) => {
  event.preventDefault();

  const formData = new FormData(event.currentTarget)
  const response = await fetch(`${import.meta.env.VITE_LOCALHOST_BACKEND_URL}/user/sudo`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Authorization": `Bearer ${token()}`
    },
    body: formData,
  })

  if (!response.ok && response.status === 401) {
    toast.error("Sudo action not permit.");
  }
  if (response.ok && response.status === 200) {

    handleCopyByEntry(token, id);
  }
}

const insertFileCompletion = async (token, json, entryId) => {
  console.log("The id issssss: " + entryId());
  const response = await fetch(`${import.meta.env.VITE_LOCALHOST_BACKEND_URL}/user/sudo`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Authorization": `Bearer ${token()}`
    },
    body: formData,
  })
}

export default EntryRecordTable;
