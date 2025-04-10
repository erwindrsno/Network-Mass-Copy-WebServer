import { createSignal, Show } from "solid-js"
import ProfileDropdown from "./ProfileDropdown.jsx"
import Triangle from "./Triangle.jsx"


function Profile(){
  const [isToggled, setIsToggled] = createSignal(false)

  let triangle

  const toggleDropdown = () => {
    setIsToggled(!isToggled())
    if(isToggled() === true){
      triangle.classList.remove("rotate-180")
    } else{
      triangle.classList.add("rotate-180")
    }
    console.log(isToggled())
  }

  return(
    <>
      <div class="flex flex-col items-end mr-4">
        <button onClick={toggleDropdown} class="flex flex-row items-center space-x-2 w-fit cursor-pointer">
          <p class="text-amber-50 text-sm">Admnistrator</p>
          <Triangle ref={elm => triangle = elm}/>
        </button>
        <Show when={isToggled() === true}>
          <ProfileDropdown />
        </Show>
      </div>
    </>
  )
}

export default Profile