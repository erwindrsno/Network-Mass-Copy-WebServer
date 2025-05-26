import { createResource, createSignal, Show, createMemo, createEffect, onMount, onCleanup } from 'solid-js';
import Pagination from '@utils/Pagination.jsx';
import { formatDateTime } from '@utils/DateTimeDisplayFormatter.jsx';
import { useParams, useLocation } from "@solidjs/router";
import { CopyIcon, TakeownIcon, TrashcanIcon } from '@icons/Icons.jsx';
import { useAuthContext } from '@utils/AuthContextProvider.jsx';
import { useWebSocketContext } from '@utils/WebSocketContextProvider.jsx';
import SingleDirectorySudoModal from './SingleDirectorySudoModal.jsx';
import { apiFetchSingleDirectory, apiCopySingleFile, apiDeleteSingleFile } from '@apis/SingleDirectoryApi.jsx';
import { useNavigate, action } from "@solidjs/router";

function SingleDirectoryRecordTable() {
  const maxItems = 8;
  const navigate = useNavigate();
  const location = useLocation();
  const params = useParams();
  const computer = {
    hostname: location.state.hostname,
    ip_addr: location.state.ip_addr
  }
  const owner = location.state.owner;
  const entryId = params.entry_id;
  const directoryId = params.dir_id;
  const [fileId, setFileId] = createSignal(null);
  const [filename, setFilename] = createSignal("");
  const { token, setToken } = useAuthContext();
  const { socket, setSocket } = useWebSocketContext();
  const [action, setAction] = createSignal("");
  const [isModalToggled, toggleModal] = createSignal(false);

  const openModal = (fileId, filename, action) => {
    setFileId(fileId);
    setFilename(filename);
    setAction(action)
    toggleModal(prev => !prev);
  }

  const closeModal = () => {
    setFileId(null);
    setFilename("");
    setAction("");
    toggleModal(prev => !prev);
  }

  const actionMap = new Map([
    ['copy', async () => {
      const result = await apiCopySingleFile(entryId, fileId, token);
      if (result.success) {
        closeModal();
      }
    }],
    ['delete', async () => {
      const result = await apiDeleteSingleFile(entryId, fileId, token);
      if (result.success) {
        closeModal();
      }
    }]
  ]);

  const [fileRecordPerDir, { mutate, refetch }] = createResource(
    () => apiFetchSingleDirectory(directoryId, token)
  );
  const [paginated, setPaginated] = createSignal({
    currentPage: 1,
    items: [],
    totalPages: 1
  });

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
              <th scope="col" class="w-1/12 px-4 py-3 text-left">No.</th>
              <th scope="col" class="w-1/3 py-3 text-left">File name</th>
              <th scope="col" class="w-1/5 py-3 text-center">Size</th>
              <th scope="col" class="w-1/6 py-3 text-center">Permissions</th>
              <th scope="col" class="w-1/6 py-3 text-center">Copied at</th>
              <th scope="col" class="w-1/6 py-3 text-center">Deleted at</th>
              <th scope="col" class="w-1/2 py-3 text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            <For each={paginated().items} fallback={<p>Loading...</p>}>
              {(item, index) => (
                <tr key={item.fileRecord.id} class="bg-white border-b border-gray-200 hover:bg-gray-50">
                  <td class="px-4 py-3 text-left">{(paginated().currentPage - 1) * maxItems + index() + 1}</td>
                  <td class="py-3 text-left whitespace-nowrap truncate">{item.fileRecord.filename}</td>
                  <td class="py-3 text-center whitespace-nowrap">{(item.fileRecord.filesize / 10240).toFixed(2)} MB</td>
                  <td class="py-3 text-center whitespace-nowrap truncate">{item.fileRecord.permissions}</td>
                  <td class="py-3 text-center whitespace-nowrap justify-items-center">{formatDateTime(item.fileRecordComputer.copiedAt)}</td>
                  <td class="py-3 text-center whitespace-nowrap justify-items-center">{formatDateTime(item.fileRecordComputer.deletedAt)}</td>
                  <td class="text-center text-sm px-2 py-1.5">
                    <div class="flex flex-row gap-1 w-min">
                      <button onClick={() => openModal(item.fileRecord.id, item.fileRecord.filename, "copy")} class="bg-gray-700 hover:bg-gray-900 text-gray-50 px-1 py-0.5 rounded-xs cursor-pointer"><CopyIcon></CopyIcon></button>
                      <button onClick={() => openModal(item.fileRecord.id, item.fileRecord.filename, "delete")} class="bg-gray-700 hover:bg-gray-900 text-gray-50 px-1 py-0.5 rounded-xs cursor-pointer"><TrashcanIcon /></button>
                    </div>
                  </td>
                </tr>
              )}
            </For>
          </tbody>
        </table>

        <Show when={isModalToggled() && action() !== ""}>
          <SingleDirectorySudoModal closeModal={closeModal} computer={computer} filename={filename} owner={owner} action={action} actionMap={actionMap} />
        </Show>
      </div>


      <Pagination items={fileRecordPerDir()} onPageChange={setPaginated} maxItems={maxItems} />
    </>
  )
}

export default SingleDirectoryRecordTable;
