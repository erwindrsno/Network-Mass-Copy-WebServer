import { createResource, createSignal, Show, createMemo, createEffect, onMount, onCleanup } from 'solid-js';
import { useAuthContext } from "@utils/AuthContextProvider.jsx";
import { createStore } from "solid-js/store"
import Pagination from '@utils/Pagination.jsx'
import { CopyIcon, TakeownIcon, TrashcanIcon } from '@icons/Icons.jsx';
import { formatDateTime } from '@utils/DateTimeDisplayFormatter.jsx';
import SingleEntrySudoModal from "./SingleEntrySudoModal.jsx";
import { useWebSocketContext } from '@utils/WebSocketContextProvider.jsx';
import { useNavigate, useParams, action } from "@solidjs/router";
import { apiFetchSingleEntry, apiCopySingleDirectory, apiTakeownSingleDirectory, apiDeleteSingleDirectory } from '@apis/SingleEntryApi.jsx';

function SingleEntryRecordTable(props) {
  const maxItems = 8;
  const navigate = useNavigate();
  const params = useParams();
  const entryId = params.entry_id;
  const title = props.title;
  const { socket, setSocket } = useWebSocketContext();
  const { token, setToken } = useAuthContext();
  const [action, setAction] = createSignal("");
  const [isModalToggled, toggleModal] = createSignal(false);
  const [directory, setDirectory] = createStore({
    id: null,
    owner: ""
  });

  const [computer, setComputer] = createStore({
    ip_addr: "",
    host_name: ""
  })

  const [dirPerEntry, { mutate, refetch }] = createResource(
    () => apiFetchSingleEntry(params.entry_id, token)
  );
  const [paginated, setPaginated] = createSignal({
    currentPage: 1,
    items: [],
    totalPages: 1
  });

  const viewFilePerDirectory = (entryId, title, directoryId, owner, hostname, ip_addr) => {
    navigate(`directory/${directoryId}`, { state: { title: title, owner: owner, hostname: hostname, ip_addr: ip_addr } });
  }

  const openModal = (ip, host_name, owner, directoryId, action) => {
    setComputer({
      "ip_addr": ip,
      "host_name": host_name
    })
    setDirectory({
      "id": directoryId,
      "owner": owner
    })
    setAction(action);
    toggleModal(prev => !prev);
  }

  const closeModal = () => {
    setComputer({
      "ip_addr": "",
      "host_name": ""
    })
    setDirectory({
      "id": null,
      "owner": ""
    })
    setAction("");
    toggleModal(prev => !prev);
  }

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

  const actionMap = new Map([
    ['copy', async () => {
      const result = await apiCopySingleDirectory(entryId, directory, token);
      if (result.success) {
        closeModal();
      }
    }],
    ['takeown', async () => {
      const result = await apiTakeownSingleDirectory(entryId, directory, token);
      if (result.success) {
        closeModal();
      }
    }],
    ['delete', async () => {
      const result = await apiDeleteSingleDirectory(entryId, directory, token);
      if (result.success) {
        closeModal();
      }
    }]
  ]);
  return (
    <>
      <div class="shadow-md rounded-lg overflow-hidden">
        <table class="text-sm rtl:text-right text-gray-500">
          <thead class="text-xs text-gray-700 bg-gray-300">
            <tr>
              <th scope="col" class="w-1/12 px-4 py-3 text-left">No.</th>
              <th scope="col" class="w-1/6 py-3 text-center">Hostname | IP address</th>
              <th scope="col" class="w-1/5 py-3 text-center">Owner</th>
              <th scope="col" class="w-1/5 py-3 text-left">Path</th>
              <th scope="col" class="w-1/6 py-3 text-center">Copied</th>
              <th scope="col" class="w-1/3 py-3 text-center">Takeowned at</th>
              <th scope="col" class="w-1/3 py-3 text-center">Deleted at</th>
              <th scope="col" class="w-1/5 py-3 text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            <For each={paginated().items} fallback={<p>Loading...</p>}>
              {(item, index) => (
                <tr key={item.directory.id} class="bg-white border-b border-gray-200 hover:bg-gray-50">
                  <td class="px-4 py-3 text-left">{(paginated().currentPage - 1) * maxItems + index() + 1}</td>
                  <td class="py-3 text-center whitespace-nowrap">{item.computer.host_name} | {item.computer.ip_address}</td>
                  <td class="py-3 text-center whitespace-nowrap">{item.directory.owner}</td>
                  <td class="py-3 text-left whitespace-nowrap truncate">{item.directory.path}</td>
                  <td class="py-3 text-center whitespace-nowrap">{`${item.directory.copied} / ${item.directory.fileCount}`}</td>
                  <td class="py-3 text-center whitespace-nowrap justify-items-center">{formatDateTime(item.directory.takeOwnedAt)}</td>
                  <td class="py-3 text-center whitespace-nowrap justify-items-center">{formatDateTime(item.directory.deletedAt)}</td>
                  <td class="text-center text-sm px-2 py-1.5">
                    <div class="flex flex-col gap-1 w-min">
                      <button onClick={() => viewFilePerDirectory(params.entry_id, title, item.directory.id, item.directory.owner, item.computer.host_name, item.computer.ip_address)} class="bg-blue-600 hover:bg-blue-700 text-gray-50 px-1 py-0.5 rounded-xs cursor-pointer">View</button>
                      <div class="flex gap-1">
                        <button onClick={() => openModal(item.computer.ip_address, item.computer.host_name, item.directory.owner, item.directory.id, "copy")} class="bg-gray-700 hover:bg-gray-900 text-gray-50 px-1 py-0.5 rounded-xs cursor-pointer"><CopyIcon></CopyIcon></button>
                        <button onClick={() => openModal(item.computer.ip_address, item.computer.host_name, item.directory.owner, item.directory.id, "takeown")} class="bg-gray-700 hover:bg-gray-900 text-gray-50 px-1 py-0.5 rounded-xs cursor-pointer"><TakeownIcon></TakeownIcon></button>
                        <button onClick={() => openModal(item.computer.ip_address, item.computer.host_name, item.directory.owner, item.directory.id, "delete")} class="bg-gray-700 hover:bg-gray-900 text-gray-50 px-1 py-0.5 rounded-xs cursor-pointer"><TrashcanIcon></TrashcanIcon></button>
                      </div>
                    </div>
                  </td>
                </tr>
              )}
            </For>
          </tbody>
        </table>

        <Show when={isModalToggled() && action() !== ""}>
          <SingleEntrySudoModal closeModal={closeModal} action={action} actionMap={actionMap} directory={directory} computer={computer} title={title} />
        </Show>
      </div>


      <Pagination items={dirPerEntry()} onPageChange={setPaginated} maxItems={maxItems} />
    </>
  )
}

export default SingleEntryRecordTable;
