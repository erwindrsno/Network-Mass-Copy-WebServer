import { createResource, createSignal, onMount, onCleanup, Show } from 'solid-js';
import { useAuthContext } from "@utils/AuthContextProvider.jsx";
import FileModal from "./FileModal.jsx";
import { CopyIcon, TakeownIcon, TrashcanIcon } from "@icons/Icons.jsx";
import { useNavigate, action } from "@solidjs/router";
import Pagination from '@utils/Pagination.jsx'
import { formatDateTime } from '@utils/DateTimeDisplayFormatter.jsx';
import { displayIcon } from '@utils/DisplayFromOxamIcon.jsx';
import SudoModal from './SudoModal.jsx';
import toast, { Toaster } from 'solid-toast';
import { useWebSocketContext } from '@utils/WebSocketContextProvider.jsx';
import { apiFetchEntry, apiCopyEntry, apiTakeownEntry, apiDeleteEntry } from '@apis/EntryApi.jsx';


function EntryRecordTable() {
  const maxItems = 8;
  const navigate = useNavigate();
  const { token, setToken } = useAuthContext();
  const { socket, setSocket } = useWebSocketContext();
  const [action, setAction] = createSignal("");
  const [entries, { mutate, refetch }] = createResource(() => apiFetchEntry(token));
  const [isModalToggled, toggleModal] = createSignal(false);
  const [title, setTitle] = createSignal("" || "N/A");
  const [entryId, setEntryId] = createSignal(null);
  const [paginated, setPaginated] = createSignal({
    currentPage: 1,
    items: [],
    totalPages: 1,
  });

  const openModal = (title, id, action) => {
    setTitle(title);
    setEntryId(id);
    setAction(action);
    toggleModal(prev => !prev);
  }

  const closeModal = () => {
    setTitle("");
    setEntryId(null);
    setAction("");
    toggleModal(prev => !prev);
  }

  const viewSingleEntryRecord = (id, title) => {
    navigate(`entry/${id}`, { state: { title: title } });
  }

  const actionMap = new Map([
    ['copy', async () => {
      const result = await apiCopyEntry(entryId, token);
      if (result.success) {
        closeModal();
      }
    }],
    ['takeown', async () => {
      const result = await apiTakeownEntry(entryId, token);
      if (result.success) {
        closeModal();
      }
    }],
    ['delete', async () => {
      const result = await apiDeleteEntry(entryId, token);
      if (result.success) {
        closeModal();
      }
    }]
  ]);


  onMount(() => {
    const ws = socket();
    if (!ws) return;

    const onMessage = (event) => {
      const message = event.data;

      console.log(message);
      if (message === "refetch") {
        refetch();
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
              <th scope="col" class="py-3 w-min">Action</th>
            </tr>
          </thead>
          <tbody>
            <For each={paginated().items} fallback={<p>Loading...</p>}>
              {(entry, index) => (
                <tr key={entry.id} class="bg-white border-b border-gray-200 hover:bg-gray-50">
                  <td class="px-4 py-3 text-left">{(paginated().currentPage - 1) * maxItems + index() + 1}</td>
                  <td class="py-3 text-left whitespace-nowrap">{entry.title}</td>
                  <td class="py-3 text-center whitespace-nowrap"><button onClick={() => openModal(entry.title, entry.id, "view")} class="hover:text-blue-500 cursor-pointer hover:underline">view</button></td>
                  <td class="py-3 text-center whitespace-nowrap justify-items-center">{displayIcon(entry.fromOxam)}</td>
                  <td class="py-3 text-center whitespace-nowrap">{formatDateTime(entry.createdAt)}</td>
                  <td class="text-center text-sm px-2 py-1.5">
                    <div class="flex flex-col gap-1 w-min">
                      <button onClick={() => viewSingleEntryRecord(entry.id, entry.title)} class="bg-blue-600 hover:bg-blue-700 text-gray-50 px-1 py-0.5 rounded-xs cursor-pointer">View</button>
                      <div class="flex gap-1">
                        <button onClick={() => openModal(entry.title, entry.id, "copy")} class="bg-gray-700 hover:bg-gray-900 text-gray-50 px-1 py-0.5 rounded-xs cursor-pointer"><CopyIcon></CopyIcon></button>
                        <button onClick={() => openModal(entry.title, entry.id, "takeown")} class="bg-gray-700 hover:bg-gray-900 text-gray-50 px-1 py-0.5 rounded-xs cursor-pointer"><TakeownIcon></TakeownIcon></button>
                        <button onClick={() => openModal(entry.title, entry.id, "delete")}
                          class="bg-gray-700 hover:bg-gray-900 text-gray-50 px-1 py-0.5 rounded-xs cursor-pointer"><TrashcanIcon /></button>
                      </div>
                    </div>
                  </td>
                </tr>
              )}
            </For>
          </tbody>
        </table>
        <Show when={isModalToggled() && action() === "view"}>
          <FileModal title={title} entryId={entryId} closeModal={closeModal} />
        </Show>
        <Show when={isModalToggled() && action() !== "view"}>
          <SudoModal title={title} entryId={entryId} closeModal={closeModal} action={action} actionMap={actionMap} />
        </Show>
      </div >

      <Pagination items={entries()} onPageChange={setPaginated} maxItems={maxItems} />
    </>
  )
}

export default EntryRecordTable;
