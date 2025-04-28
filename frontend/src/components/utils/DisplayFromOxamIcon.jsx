import { Show } from "solid-js";
import { CheckIcon } from "../home/CheckIcon.jsx";
import { CrossIcon } from "../home/CrossIcon.jsx";

export const displayIcon = (isFromOxam) => {

  return (
    <Show when={isFromOxam} fallback={<CrossIcon class="bg-red-600" />}>
      <CheckIcon class="bg-green-500" />
    </Show>
  )
}
