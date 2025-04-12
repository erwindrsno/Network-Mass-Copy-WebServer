import { A } from '@solidjs/router'

function Navbar(){
    return(
        <div class="flex w-full justify-center items-center py-5">
         <nav class='flex flex-row w-xs gap-20 justify-center'>
          <A href="/admin/computer" class="text-gray-80 text-xl aria-[current=page]:underline">Computer</A>
          <A href="/admin/user" class="text-gray-800 text-xl aria-[current=page]:underline">User</A>
         </nav>
        </div>
    )
}

export default Navbar;
