function PermissionInput(props) {
  const permission = props.permissions;
  const setPermission = props.setPermission;

  const handleChangeCheckBox = (event) => {
    const value = event.target.value;
    const checked = event.target.checked;

    setPermission((prev) => {
      if (checked && !prev.includes(value)) {
        return [...prev, value];
      } else if (!checked && prev.includes(value)) {
        return prev.filter((perm) => perm !== value);
      }
      return prev;
    });
  }

  return (
    <>
      <p>Permission Input</p>
      <div class="flex flex-col">
        <input type="checkbox" name="read" value="read" onChange={handleChangeCheckBox} />
        <label for="read">Read</label>

        <input type="checkbox" name="write" value="write" onChange={handleChangeCheckBox} />
        <label for="write">Write</label>

        <input type="checkbox" name="execute" value="execute" onChange={handleChangeCheckBox} />
        <label for="execute">Execute</label>
      </div>
    </>
  )
}

export default PermissionInput;
