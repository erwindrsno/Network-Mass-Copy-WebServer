export const apiFetchFilesInfo = async (entryId, token) => {
  const response = await fetch(`${import.meta.env.VITE_LOCALHOST_BACKEND_URL}/entry/${entryId()}/file`, {
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

export const apiDownloadFile = async (entryId, filename, token) => {
  const response = await fetch(`${import.meta.env.VITE_LOCALHOST_BACKEND_URL}/file/download/${entryId()}/${filename}`, {
    method: "GET",
    credentials: "include",
    headers: {
      "Authorization": `Bearer ${token()}`
    },
  })
  if (!response.ok && response.status === 401) {
    console.log("UNAUTH!")
  } else {
    const blob = await response.blob();
    return blob;
  }
}
