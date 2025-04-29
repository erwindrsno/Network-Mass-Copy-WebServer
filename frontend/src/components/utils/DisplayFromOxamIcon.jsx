import { Show } from "solid-js";
import { CheckIcon, CrossIcon } from "../../assets/Icons.jsx";

export const displayIcon = (isFromOxam) => {

  return (
    <Show when={isFromOxam} fallback={<CrossIcon class="bg-red-600" />}>
      <CheckIcon class="bg-green-500" />
    </Show>
  )
}
