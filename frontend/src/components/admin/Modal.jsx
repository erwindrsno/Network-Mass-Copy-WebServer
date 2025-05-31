import { CloseModalIcon } from "@icons/Icons";
import { Portal } from "solid-js/web";

function Modal(props) {
  const closeModal = props.closeModal;
  const deleteItem = props.deleteItem;
  const item = props.item;
  return (
    <Portal>
      <div class="fixed inset-0 bg-black opacity-50 z-40" onClick={() => closeModal()}>
      </div>
      <div class="flex fixed inset-0 self-center justify-center z-50">
        <div class="w-2/5 border rounded-lg bg-gray-50 border-gray-300 shadow-md">
          <div class="flex flex-col my-2 mx-3 gap-4">
            <div class="flex flex-row justify-between border-b-1 pb-2">
              <p>Warning!</p>
              <button onClick={() => closeModal()} class="cursor-pointer bg-gray-200 hover:bg-gray-300 rounded-sm"><CloseModalIcon /></button>
            </div>
            <div class="flex flex-col gap-5 items-center border border-gray-300 rounded-lg p-2 bg-gray-50">
              <p class="text-lg text-center">{`Apakah anda yakin ingin delete `}<span class="font-bold">{item().name}</span></p>
              <form onSubmit={deleteItem} class="flex flex-row gap-2">
                <button onClick={() => closeModal()} class="w-28 bg-gray-400 border rounded-md py-1 text-blue-50 font-semibold hover:bg-gray-500 cursor-pointer">Tidak</button>
                <button type="submit" class="w-28 bg-blue-600 border rounded-md py-1 text-blue-50 font-semibold hover:bg-blue-700 cursor-pointer">Ya</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </Portal >
  )
}

export default Modal;
