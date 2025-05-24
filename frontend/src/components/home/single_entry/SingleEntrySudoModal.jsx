import { Portal } from "solid-js/web";
import { createEffect, Show, Switch, Match } from "solid-js";
import { CloseModalIcon } from "@icons/Icons";
import { useAuthContext } from "@utils/AuthContextProvider";
import { apiAuthSudoAction } from "@apis/AuthApi";

function SingleEntrySudoModal(props) {
  const directory = props.directory;
  const computer = props.computer;
  const title = props.title;
  const action = props.action;
  const actionMap = props.actionMap;
  const { token, setToken } = useAuthContext();

  const handleSubmit = async () => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const result = await apiAuthSudoAction(formData, token);
    if (result.success) {
      switch (action()) {
        case "copy":
          actionMap.get("copy")?.();
          break;

        case "takeown":
          actionMap.get("takeown")?.();
          break;

        case "delete":
          actionMap.get("delete")?.();
          break;

        default:
          console.log("nothing to handle.");
          break;
      }
    }
  };

  return (
    <Portal>
      <div class="fixed inset-0 bg-black opacity-20 z-40" onClick={() => { console.log("clicked!") }}></div>

      <div class="flex fixed inset-0 self-center justify-center z-50">
        <div class="w-2/5 border rounded-lg bg-gray-50 border-gray-300 shadow-md">
          <div class="flex flex-col my-2 mx-3 gap-4">
            <div class="flex flex-row justify-between border-b-1 pb-2">
              <p>Warning!</p>
              <button onClick={props.closeModal} class="cursor-pointer bg-gray-200 hover:bg-gray-300 rounded-sm"><CloseModalIcon /></button>
            </div>
            <div class="flex flex-col gap-3 items-center rounded-lg p-2 bg-gray-50">
              <Switch fallback={<p>Not found.</p>}>
                <Match when={action() === "copy"}>
                  <p class="text-center">Anda akan melakukan <span class="text-red-500 font-semibold">penyalinan direktori</span> beserta file dengan keterangan:</p>
                </Match>
                <Match when={action() === "takeown"}>
                  <p class="text-center">Anda akan melakukan <span class="text-red-500 font-semibold">pengalihan hak akses direktori</span> dengan keterangan:</p>
                </Match>
                <Match when={action() === "delete"}>
                  <div class="flex flex-col gap-1">
                    <p class="text-center">Anda akan melakukan <span class="text-red-500 font-semibold">penghapusan direktori</span> dengan keterangan:</p>
                    <p class="text-gray-400 text-xs">Catatan: Anda juga akan menghapus file jika file sudah tersalin pada computer client.</p>
                  </div>
                </Match>
              </Switch>
              <div class="flex flex-col justify-center items-center">
                <p class="font-medium text-md text-center text-gray-400">{`Judul`}</p>
                <p class="font-bold text-lg text-center">{title}</p>
              </div>
              <div class="flex flex-col justify-center items-center">
                <p class="font-medium text-md text-center text-gray-400">{`Owner`}</p>
                <p class="font-bold text-lg text-center">{`${directory.owner}`}</p>
              </div>
              <div class="flex flex-col justify-center items-center">
                <p class="font-medium text-md text-center text-gray-400">{`Hostname - Ip address`}</p>
                <p class="font-bold text-lg text-center">{`${computer.host_name} - ${computer.ip_addr}`}</p>
              </div>
              <form onSubmit={handleSubmit} class="flex flex-col gap-2">
                <label for="sudo" class="text-center text-sm text-gray-500">Konfirmasi aksi anda dengan mengetik password akun yang sedang anda gunakan!</label>
                <input type="password" name="sudo" class="w-full outline-1 outline-gray-300 rounded-md px-2 font-normal text-md" placeholder="Ketik password anda" required />
                <button type="submit" class="w-full bg-blue-600 border rounded-md py-1 text-blue-50 font-semibold hover:bg-blue-700 cursor-pointer">Execute</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </Portal>
  )
}

export default SingleEntrySudoModal;
