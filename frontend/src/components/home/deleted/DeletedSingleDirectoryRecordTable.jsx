import { createResource, createSignal, Show, createMemo, createEffect, onMount, onCleanup } from 'solid-js';
import Pagination from '@utils/Pagination.jsx';
import { formatDateTime } from '@utils/DateTimeDisplayFormatter.jsx';
import { useParams, useLocation } from "@solidjs/router";
import { CopyIcon, TakeownIcon, TrashcanIcon } from '@icons/Icons.jsx';
import { useAuthContext } from '@utils/AuthContextProvider.jsx';
import { useSseContext } from '@utils/SseContextProvider.jsx';
import { apiFetchSingleDirectory, apiCopySingleFile, apiDeleteSingleFile } from '@apis/SingleDirectoryApi.jsx';
import { useNavigate, action } from "@solidjs/router";
import { extractClaims } from '@utils/ExtractClaims.jsx';

function DeletedSingleDirectoryRecordTable() {
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
  const { role } = extractClaims(token());
  const { sse, setSse, data, setData } = useSseContext();

  const [fileRecordPerDir, { mutate, refetch }] = createResource(
    () => apiFetchSingleDirectory(directoryId, token)
  );
  const [paginated, setPaginated] = createSignal({
    currentPage: 1,
    items: [],
    totalPages: 1
  });

  createEffect(() => {
    if (!sse()) return;

    if (data() && data() === "refetch") {
      refetch();
      setData("");
    }
  })

  return (
    <>
      <div class="shadow-md rounded-lg overflow-hidden">
        <table class="w-full text-sm rtl:text-right text-gray-500">
          <thead class="text-xs text-gray-700 bg-gray-300">
            <tr>
              <th scope="col" class="w-1/12 px-4 py-3 text-left">No.</th>
              <th scope="col" class="w-1/3 py-3 text-left">File name</th>
              <th scope="col" class="w-1/5 py-3 text-center">Size</th>
              <th scope="col" class="w-1/6 py-3 text-center">Permissions</th>
              <th scope="col" class="w-1/6 py-3 text-center">Copied at</th>
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
                </tr>
              )}
            </For>
          </tbody>
        </table>
      </div >


      <Pagination items={fileRecordPerDir()} onPageChange={setPaginated} maxItems={maxItems} />
    </>
  )
}

export default DeletedSingleDirectoryRecordTable;
