function PermissionInput(props) {
  const permission = props.permission;
  const setPermission = props.setPermission;

  const handleChangeCheckBox = (event) => {
    const value = event.target.value;
    const checked = event.target.checked;

    setPermission((prev) => {
      let updated = [...prev];

      if (checked) {
        if (!updated.includes(value)) updated.push(value);
        // untuk pastikan read selalu tercentang apabila terdapat write
        if (value === "write" && !updated.includes("read")) {
          updated.push("read");
        }
        // untuk pastikan read selalu tercentang apabila terdapat execute
        if (value === "execute" && !updated.includes("read")) {
          updated.push("read");
        }
      } else {
        // untuk pastikan read tidak boleh di uncheck apabila write masih tercentang
        if (value === "read" && updated.includes("write")) {
          return updated;
        }
        // untuk pastikan read tidak boleh di uncheck apabila exeucte masih tercentang
        if (value === "read" && updated.includes("execute")) {
          return updated;
        }

        updated = updated.filter((perm) => perm !== value);
      }

      return updated;
    });
  }

  return (
    <>
      <p>Permission Input</p>
      <div class="flex flex-col">
        <div class="flex flex-row gap-5 ">
          <label for="read" class="w-24">Read</label>
          <input type="checkbox" name="read" value="read" checked={permission().includes("read")} onChange={handleChangeCheckBox} />
        </div>

        <div class="flex flex-row gap-5">
          <label for="write" class="w-24">Write</label>
          <input type="checkbox" name="write" value="write" checked={permission().includes("write")} onChange={handleChangeCheckBox} />
        </div>

        <div class="flex flex-row gap-5">
          <label for="execute" class="w-24">Execute</label>
          <input type="checkbox" name="execute" value="execute" checked={permission().includes("execute")} onChange={handleChangeCheckBox} />
        </div>
      </div>
    </>
  )
}

export default PermissionInput;
