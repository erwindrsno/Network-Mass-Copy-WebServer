export const apiFetchEntry = async (token) => {
  const response = await fetch(`${import.meta.env.VITE_LOCALHOST_BACKEND_URL}/entry`, {
    method: "GET",
    credentials: "include",
    headers: {
      "Authorization": `Bearer ${token()}`
    },
  })
  if (!response.ok || response.status === 401) {
    console.log("UNAUTH! or Something went wrong")
  } else {
    const result = await response.json();
    return result;
  }
}

export const apiCopyEntry = async (entryId, token) => {
  const response = await fetch(`${import.meta.env.VITE_LOCALHOST_BACKEND_URL}/entry/${entryId()}/copy`, {
    method: "PATCH",
    credentials: "include",
    headers: {
      "Authorization": `Bearer ${token()}`
    },
  })
  if (!response.ok || response.status === 401) {
    console.log("UNAUTH! or SOmething went wrong")
  } else if (response.ok && response.status === 200) {
    return { success: true };
  }
}

export const apiTakeownEntry = async (entryId, token) => {
  const response = await fetch(`${import.meta.env.VITE_LOCALHOST_BACKEND_URL}/entry/${entryId()}/takeown`, {
    method: "PATCH",
    credentials: "include",
    headers: {
      "Authorization": `Bearer ${token()}`
    },
  })
  if (!response.ok || response.status === 401) {
    console.log("UNAUTH! or SOmething went wrong")
  } else if (response.ok && response.status === 200) {
    return { success: true };
  }
}

export const apiDeleteEntry = async (entryId, token) => {
  const response = await fetch(`${import.meta.env.VITE_LOCALHOST_BACKEND_URL}/entry/${entryId()}/delete`, {
    method: "DELETE",
    credentials: "include",
    headers: {
      "Authorization": `Bearer ${token()}`
    },
  })
  if (!response.ok || response.status === 401) {
    console.log("UNAUTH! or SOmething went wrong")
  } else if (response.ok && response.status === 200) {
    return { success: true };
  }
}
