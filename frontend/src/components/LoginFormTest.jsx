function LoginFormTest(){
    return (
    <div class="h-full w-full flex flex-col justify-center items-center">
        <div class="flex flex-col gap-0.5">
            <h1 class="text-4xl">Net Copy</h1>
            <h3 class="text-center font-light">Log in</h3>
        </div>
        <div class="flex flex-col h-md justify-center items-center gap-5 border rounded-sm border-red-300 px-3 py-5">
            <form class="flex flex-col gap-3 items-center">
                <div class="flex flex-col gap-1 w-xs">
                    <label for="username">Username</label>
                    <input type="text" name="username" required class="border rounded-sm border-slate-300"/>
                </div>
                <div class="flex flex-col gap-1 w-xs">
                    <label for="password">Password</label>
                    <input type="password" name="password" required class="border rounded-sm border-slate-300"/>
                </div>
                <input type="submit" name="login" value="Log in" class="bg-blue-900 text-blue-50 text-center border rounded-sm py-1 px-5" />
            </form>
        </div>
    </div>
    )
}

export default LoginFormTest
