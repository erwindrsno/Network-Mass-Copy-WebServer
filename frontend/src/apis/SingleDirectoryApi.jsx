export const apiFetchSingleDirectory = async (directoryId, token) => {
  const response = await fetch(`${import.meta.env.VITE_LOCALHOST_BACKEND_URL}/directory/${directoryId}`, {
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

export const apiCopySingleFile = async (entryId, fileId, token) => {
  const formData = new FormData();
  formData.append("entry_id", entryId);
  const encodedForm = new URLSearchParams(formData);

  const response = await fetch(`${import.meta.env.VITE_LOCALHOST_BACKEND_URL}/file/${fileId()}/copy`, {
    method: "PATCH",
    credentials: "include",
    headers: {
      "Authorization": `Bearer ${token()}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: encodedForm
  })
  if (!response.ok || response.status === 401) {
    console.log("UNAUTH! or SOmething went wrong")
  } else if (response.ok && response.status === 200) {
    return { success: true };
  }
}


export const apiDeleteSingleFile = async (entryId, fileId, token) => {
  const formData = new FormData();
  formData.append("entry_id", entryId);
  const encodedForm = new URLSearchParams(formData);

  const response = await fetch(`${import.meta.env.VITE_LOCALHOST_BACKEND_URL}/file/${fileId()}/delete`, {
    method: "DELETE",
    credentials: "include",
    headers: {
      "Authorization": `Bearer ${token()}`
    },
    body: encodedForm
  })
  if (!response.ok || response.status === 401) {
    console.log("UNAUTH! or SOmething went wrong")
  } else if (response.ok && response.status === 200) {
    return { success: true };
  }
}
