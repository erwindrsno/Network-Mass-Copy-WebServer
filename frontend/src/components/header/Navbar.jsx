import { A } from '@solidjs/router'
import Profile from './Profile.jsx'

function Navbar(){
  return(
    <div class="flex h-full w-1/2 items-center">
     <nav class='flex justify-around w-full font-medium'>
      <A href='/home' end={true} class="text-slate-200">Home</A>
      <A href="/copy-oxam" class="text-slate-200">Copy (OXAM)</A>
      <A href="/copy" class="text-slate-200">Copy</A>
     </nav>
    </div>
  )
}

export default Navbar
