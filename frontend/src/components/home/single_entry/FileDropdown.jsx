import { useFileDropdownContext } from "../../utils/FileDropdownContextProvider.jsx";
import { useParams } from "@solidjs/router";
import { useAuthContext } from "../../utils/AuthContextProvider.jsx";
import { createResource, createSignal, Show, For, createEffect, onMount, on } from 'solid-js';

const fetchFilesNameByEntryId = async (token, id) => {
  const response = await fetch(`${import.meta.env.VITE_LOCALHOST_BACKEND_URL}/entry/${id}/file`, {
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

function FileDropdown() {
  const { currFilename, setCurrFilename } = useFileDropdownContext();
  const params = useParams();
  const { token, setToken } = useAuthContext();
  const [file, { mutate, refetch }] = createResource(params.id, () => fetchFilesNameByEntryId(token, params.id));

  const [shouldRun, setShouldRun] = createSignal(true);

  //kenapa pada kasus render filename pertama kali lebih bagus menggunakan createEffect dibanding dengan onMount?
  //karena life cycle onMount hanya dijalankan sekali ketika komponen ini dirender. Sedangkan proses fetch createResource belum selesai
  //pada saat life cycle onMount berakhir. Kemudian createEffect juga bersifat tracking terhadap dependency yang digunakan didalamnya,
  //pada contoh in dependency nya adalah file().
  //sehingga createEffect akan jalan setelah dependency file() mengalami perubahan, yaitu pada saat file() berhasil difetch.

  //pada kode ini digunakan sebuah helper berupa on, dengan dependency [file]. Dengan begitu, effect ini HANYA akan
  //dijalankan ketika file() sudah mengalami perubahan (sudah berhasil fetch) dengan bantuan defer true,
  //dan hanya dijalankan sekali saja.
  createEffect(on([file], () => {
    if (file() && file().length > 0) {
      setCurrFilename(file()[0].filename);
      console.log("currfilename effect: " + currFilename());
    }
  }, { defer: true }));

  const handleFilenameChange = (event) => {
    console.log("current file name is: " + event.target.value);
    setCurrFilename(event.target.value);
  }

  return (
    <select
      name="file_name"
      value={currFilename()}
      onChange={handleFilenameChange}
      class="bg-gray-50 rounded-sm border border-slate-300"
    >
      <For each={file()} fallback={<option>No files available</option>}>
        {(file) => (
          <option value={file.filename}>{file.filename}</option>
        )}
      </For>
    </select>
  )
}

export default FileDropdown;
