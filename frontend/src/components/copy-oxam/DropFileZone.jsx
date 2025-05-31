function DropFileZone(props) {
  return (
    <>
      <div ref={props.ref} onClick={() => document.getElementById("fileInput").click()} onDrop={props.onDrop} onDragOver={props.onDragOver} class="flex justify-center items-center border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer bg-gray-50 hover:bg-gray-100 transition h-5">
        <div>
          <p class="text-gray-500">Drag & Drop files here or <span class="text-blue-500 font-semibold">Click to Browse</span></p>
          <input id="fileInput" type="file" multiple class="hidden" onChange={props.onChange} required />
        </div>
      </div>
    </>
  )
}

export default DropFileZone
