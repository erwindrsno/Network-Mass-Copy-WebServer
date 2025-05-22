import { createEffect } from "solid-js";

function OwnerInput(props) {
  const owners = props.owners;
  const setOwners = props.setOwners;

  createEffect(() => {
    console.log(owners());
  })

  const handleOnInput = (event) => {
    let inputValue = event.currentTarget.value;
    const newLines = inputValue
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line !== "");

    setOwners(newLines);
  }
  return (
    <>
      <p>Owner input</p>
      <textarea onInput={handleOnInput} class="w-2xl outline-1"></textarea>
    </>
  )
}

export default OwnerInput;
