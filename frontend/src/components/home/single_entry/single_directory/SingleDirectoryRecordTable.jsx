import { createResource, createSignal, Show, createMemo, createEffect, onMount, onCleanup } from 'solid-js';
import Pagination from '@utils/Pagination.jsx';
import { formatDateTime } from '@utils/DateTimeDisplayFormatter.jsx';
import { useParams, useLocation } from "@solidjs/router";
import { CopyIcon, TakeownIcon, TrashcanIcon } from '@icons/Icons.jsx';
import { useAuthContext } from '@utils/AuthContextProvider.jsx';
import SingleDirectorySudoModal from './SingleDirectorySudoModal.jsx';
import { useNavigate, action } from "@solidjs/router";

const fetchPerDirectory = async (token, entryId, directoryId) => {
  const response = await fetch(`${import.meta.env.VITE_LOCALHOST_BACKEND_URL}/directory/${directoryId}`, {
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
  console.log(result);
  return result;
}

const authSudoAction = async (event, token, id, isCopy, closeModal) => {
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
    console.log(isCopy());
    if (isCopy()) {
      console.log("handle copy");
      handleCopyByEntry(token, id, closeModal);
    } else if (isCopy() === false) {
      handleTakeownByEntry(token, id, closeModal);
      console.log("handle takeown");
    } else {
      console.log("nothing to handle!");
    }
  }
}

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
  const [fileId, setFileId] = createSignal(null);
  const [filename, setFilename] = createSignal("");
  const { token, setToken } = useAuthContext();
  const [isCopy, setIsCopy] = createSignal(null);
  const [isModalToggled, toggleModal] = createSignal(false);

  const openModal = (file_id, filename, flag) => {
    setFileId(file_id);
    setFilename(filename);
    setIsCopy(flag);
    toggleModal(prev => !prev);
  }

  const closeModal = () => {
    setFileId(null);
    setFilename("");
    setIsCopy(null);
    toggleModal(prev => !prev);
  }

  const [fileRecordPerDir, { mutate, refetch }] = createResource(
    () => fetchPerDirectory(token, params.entry_id, params.dir_id)
  );
  const [paginated, setPaginated] = createSignal({
    currentPage: 1,
    items: [],
    totalPages: 1
  });

  createEffect(() => {
    console.log(owner);
    console.log(location.state.title);
  })



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
              <th scope="col" class="w-1/2 py-3 text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            <For each={paginated().items} fallback={<p>Loading...</p>}>
              {(item, index) => (
                <tr key={item.id} class="bg-white border-b border-gray-200 hover:bg-gray-50">
                  <td class="px-4 py-3 text-left">{(paginated().currentPage - 1) * maxItems + index() + 1}</td>
                  <td class="py-3 text-left whitespace-nowrap truncate">{item.fileRecord.filename}</td>
                  <td class="py-3 text-center whitespace-nowrap">{(item.fileRecord.filesize / 10240).toFixed(2)} MB</td>
                  <td class="py-3 text-center whitespace-nowrap truncate">{item.fileRecord.permissions}</td>
                  <td class="py-3 text-center whitespace-nowrap justify-items-center">{formatDateTime(item.fileRecordComputer.copiedAt)}</td>
                  <td class="text-center text-sm px-2 py-1.5">
                    <div class="flex flex-row gap-1 w-min">
                      <button onClick={() => openModal(item.id, item.fileRecord.filename, true)} class="bg-gray-700 hover:bg-gray-900 text-gray-50 px-1 py-0.5 rounded-xs cursor-pointer"><CopyIcon></CopyIcon></button>
                      <button onClick={() => openModal(item.id, item.fileRecord.filename, false)} class="bg-gray-700 hover:bg-gray-900 text-gray-50 px-1 py-0.5 rounded-xs cursor-pointer"><TrashcanIcon /></button>
                    </div>
                  </td>
                </tr>
              )}
            </For>
          </tbody>
        </table>

        <Show when={isModalToggled() && isCopy() !== null}>
          <SingleDirectorySudoModal entryId={entryId} closeModal={closeModal} authSudoAction={authSudoAction} isCopy={isCopy} computer={computer} filename={filename} owner={owner} />
        </Show>
      </div>


      <Pagination items={fileRecordPerDir()} onPageChange={setPaginated} maxItems={maxItems} />
    </>
  )
}

export default SingleDirectoryRecordTable;
