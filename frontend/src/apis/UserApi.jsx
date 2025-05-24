export const apiAddUser = async (formData, token) => {
  const encodedForm = new URLSearchParams(formData);

  const response =
    await fetch(`${import.meta.env.VITE_LOCALHOST_BACKEND_URL}/user`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Authorization": `Bearer ${token()}`
      },
      body: encodedForm
    })
  if (!response.ok || response.status === 401) {
    console.log("UNAUTH! or SOmething went wrong")
  } else if (response.ok && response.status === 201) {
    return { success: true };
  }
}

export const apiFetchUser = async (token) => {
  const response = await fetch(`${import.meta.env.VITE_LOCALHOST_BACKEND_URL}/user`, {
    method: "GET",
    credentials: "include",
    headers: {
      "Authorization": `Bearer ${token()}`
    },
  })
  if (!response.ok || response.status === 401) {
    console.log("UNAUTH!")
  }
  const result = await response.json();
  return result;
}

export const apiDeleteUser = async (userId, token) => {
  const response = await fetch(`${import.meta.env.VITE_LOCALHOST_BACKEND_URL}/user/id/${userId}`, {
    method: "DELETE",
    credentials: "include",
    headers: {
      "Authorization": `Bearer ${token()}`
    },
  })
  if (!response.ok || response.status === 401) {
    console.log("UNATUH!")
  } else {
    return { success: true }
  }
}
