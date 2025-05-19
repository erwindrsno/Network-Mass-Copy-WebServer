import { Portal } from "solid-js/web";
import { createEffect, Show } from "solid-js";
import { CloseModalIcon } from "../../assets/Icons";
import { useAuthContext } from "../utils/AuthContextProvider";

function SudoModal(props) {
  const title = () => props.title;
  const entryId = () => props.entryId;
  const isCopy = props.isCopy;
  const { token, setToken } = useAuthContext();

  createEffect(() => {
    console.log(isCopy());
  })
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
            <div class="flex flex-col gap-5 items-center border border-gray-300 rounded-lg p-2 bg-gray-50">
              <Show when={isCopy()} fallback={<p class="text-center">Anda akan melakukan pengalihan hak akses file dengan entri:</p>}>
                <p>Anda akan melakukan penyalinan file dengan entri:</p>
              </Show>
              <p class="font-bold text-lg text-center">{title()}</p>
              <form onSubmit={event =>
                props.authSudoAction(event, token, props.entryId, props.isCopy, props.closeModal)} class="flex flex-col gap-2">
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

export default SudoModal;
