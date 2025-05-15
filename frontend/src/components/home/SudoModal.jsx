import { Portal } from "solid-js/web";
import { CloseModalIcon } from "../../assets/Icons";
import { useAuthContext } from "../utils/AuthContextProvider";

function SudoModal(props) {
  const { token, setToken } = useAuthContext();
  return (
    <Portal>
      <div class="fixed inset-0 bg-black opacity-20 z-40" onClick={() => { console.log("clicked!") }}></div>

      <div class="flex fixed inset-0 self-center justify-center z-50">
        <div class="w-2/5 border rounded-lg bg-gray-50 border-gray-300 shadow-md">
          <div class="flex flex-col my-2 mx-3 gap-4">
            <div class="flex flex-row justify-between border-b-1 pb-2">
              <p>Warning!</p>
              <button onClick={props.closeSudoModal} class="cursor-pointer bg-gray-200 hover:bg-gray-300 rounded-sm"><CloseModalIcon /></button>
            </div>
            <div class="flex flex-col gap-5 items-center border border-gray-300 rounded-lg p-2 bg-gray-50">
              <p>{`Anda akan melakukan penyalinan file pada entri:`}</p>
              <p class="font-bold text-lg text-center">{`${props.title}`}</p>
              <form onSubmit={event => props.authSudoAction(event, token, props.entryId)} class="flex flex-col gap-2">
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
