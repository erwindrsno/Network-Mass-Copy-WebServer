export const apiFetchSingleEntry = async (entryId, token) => {
  const response = await fetch(`${import.meta.env.VITE_LOCALHOST_BACKEND_URL}/entry/${entryId}`, {
    method: "GET",
    credentials: "include",
    headers: {
      "Authorization": `Bearer ${token()}`
    },
  })
  if (!response.ok && response.status === 401) {
    console.log("UNAUTH!")
  }
  const result = await response.json();
  console.log(result);
  return result;
}

export const apiCopySingleDirectory = async (entryId, directory, token) => {
  const formData = new FormData();
  formData.append("entry_id", entryId);
  const encodedForm = new URLSearchParams(formData);
  const response = await fetch(`${import.meta.env.VITE_LOCALHOST_BACKEND_URL}/directory/${directory.id}/copy`, {
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

export const apiTakeownSingleDirectory = async (entryId, directory, token) => {
  const formData = new FormData();
  formData.append("entry_id", entryId);
  const encodedForm = new URLSearchParams(formData);
  const response = await fetch(`${import.meta.env.VITE_LOCALHOST_BACKEND_URL}/directory/${directory.id}/takeown`, {
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

export const apiDeleteSingleDirectory = async (entryId, directory, token) => {
  const formData = new FormData();
  formData.append("entry_id", entryId);
  const encodedForm = new URLSearchParams(formData);
  const response = await fetch(`${import.meta.env.VITE_LOCALHOST_BACKEND_URL}/directory/${directory.id}/delete`, {
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
