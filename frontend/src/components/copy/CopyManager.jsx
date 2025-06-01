import PermissionInput from "./PermissionInput";
import FileInput from "./FileInput";
import ComputerSelector from "./ComputerSelector.jsx";
import { useFileUploadContext } from "@utils/FileUploadContextProvider";
import { createSignal, createEffect } from "solid-js";
import { useNavigate } from "@solidjs/router";
import { useAuthContext } from "@utils/AuthContextProvider.jsx";
import { apiCreateNonOxamEntry } from "@apis/EntryApi";

function CopyManager() {
  const navigate = useNavigate();
  const { files, setFiles } = useFileUploadContext();
  const { token, setToken } = useAuthContext();
  const [permission, setPermission] = createSignal([]);
  const [title, setTitle] = createSignal("");
  const [selectedComputers, setSelectedComputers] = createSignal([]);

  const handleSubmit = (async (event) => {
    event.preventDefault();
    const owner = event.target.owner.value;

    // const formatRecords = () => {
    //   const result = [];
    //
    //   selectedComputers().forEach((computer, index) => {
    //     const hostname = computer.host_name;
    //     const formatPermission = (perms) => {
    //       const permOrder = ["read", "write", "execute"];
    //       return permOrder.map(p => perms.includes(p) ? "1" : "0").join("");
    //     };
    //     result.push({
    //       hostname,
    //       owner,
    //       permissions: formatPermission(permission())
    //     });
    //   });
    //
    //   return result;
    // };

    try {
      let formData = new FormData();
      // const records = formatRecords();
      const formatPermission = (perms) => {
        const permOrder = ["read", "write", "execute"];
        return permOrder.map(p => perms.includes(p) ? "1" : "0").join("");
      };
      const records = [{ hostname: "LAB-KOST", owner: owner, permissions: formatPermission(permission()) }]
      const form = event.currentTarget;
      const title = form.elements.title.value;
      const path = form.elements.path.value;
      formData.append("title", title);
      formData.append("path", path);

      formData.append("records", JSON.stringify(records));
      for (const file of files()) {
        formData.append("files", file);
      }
      formData.append("count", records.length * files().length);
      formData.append("host_count", records.length);
      console.log(records[0].permissions);

      const result = await apiCreateNonOxamEntry(formData, token);
      if (result.success) {
        navigate("/home");
      }
    } catch (err) {
      console.error(err);
    }
  });

  return (
    <>
      <div class="w-full justify-items-center">
        <form onSubmit={handleSubmit} class="flex gap-1.5 flex-col">
          <label for="title">Title</label>
          <input type="text" name="title" class="outline-1 outline-gray-300 rounded-md py-0.5 px-2 font-normal w-full" required />
          <label for="path">Path</label>
          <input type="text" name="path" class="outline-1 outline-gray-300 rounded-md py-0.5 px-2 font-normal w-full" placeholder="E.g: D:\Ujian (without backslash in the end)" required />
          <label for="owner">Owner</label>
          <input type="text" name="owner" class="outline-1 outline-gray-300 rounded-md py-0.5 px-2 font-normal w-full" required />
          <PermissionInput permission={permission} setPermission={setPermission} />
          <FileInput />
          <ComputerSelector selectedComputers={selectedComputers} setSelectedComputers={setSelectedComputers} />
          <button type="submit" class="w-full bg-blue-600 border rounded-md py-1 text-blue-50 font-semibold hover:bg-blue-700 cursor-pointer">Add</button>
        </form>
      </div>
    </>
  )
}

export default CopyManager;
