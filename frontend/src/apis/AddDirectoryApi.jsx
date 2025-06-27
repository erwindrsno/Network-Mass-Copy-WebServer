export const apiAddDirectory = async (encodedForm, token) => {
  const response = await fetch(`${import.meta.env.VITE_LOCALHOST_BACKEND_URL}/directory`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      "Authorization": `Bearer ${token()}`
    },
    body: encodedForm,
  })

  if (!response.ok && response.status === 401) {
    console.log("UNAUTH!")
  } else if (response.ok && response.status === 201) {
    return { success: true };
  }
}
