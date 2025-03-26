import { A } from '@solidjs/router'

function Navbar(){
  return(
    <div class="flex h-full w-1/2 items-center">
     <nav class='flex justify-around w-full'>
      <A href='/' end={true} class="text-slate-200">Home</A>
      <A href="/copy-oxam" class="text-slate-200">Copy (OXAM)</A>
      <A href="/copy" class="text-slate-200">Copy</A>
     </nav>
    </div>
  )
}

export default Navbar
