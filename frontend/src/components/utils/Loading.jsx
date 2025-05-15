import { Portal } from "solid-js/web";

function Loading(props) {
  return (
    <Portal>
      <div class="fixed inset-0 bg-black opacity-20 z-40" onClick={() => { console.log("clicked!") }}></div>

      <div class="flex fixed inset-0 self-center justify-center z-50">
        <div class="w-2/5 border rounded-lg bg-gray-50 border-gray-300 shadow-md">
          <div class="flex flex-col my-2 mx-3 gap-4">
            <div class="flex flex-row justify-between border-b-1 pb-2">
              <p>Warning!</p>
            </div>
            <div class="flex flex-col gap-5 items-center border border-gray-300 rounded-lg p-2 bg-gray-50">
              <p>{`Copied: `}</p>
            </div>
          </div>
        </div>
      </div>
    </Portal>
  )
}

export default Loading;
