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

export const apiFetchDeletedEntry = async (token) => {
  const response = await fetch(`${import.meta.env.VITE_LOCALHOST_BACKEND_URL}/entry/deleted`, {
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
  console.log(response)
  if (!response.ok || response.status === 401) {
    console.log("UNAUTH! or SOmething went wrong")
  } else if (response.ok && response.status === 200) {
    console.log("delete entry ok")
    return { success: true };
  }
}

export const apiCreateNonOxamEntry = async (formData, token) => {
  const response = await fetch(`${import.meta.env.VITE_LOCALHOST_BACKEND_URL}/entry`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Authorization": `Bearer ${token()}`,
    },
    body: formData,
  });

  if (!response.ok || response.status === 401) {
    console.log("UNAUTH! or SOmething went wrong")
  } else if (response.ok && response.status === 201) {
    return { success: true };
  }
}

export const apiCreateOxamEntry = async (formData, token) => {
  const response = await fetch(`${import.meta.env.VITE_LOCALHOST_BACKEND_URL}/entry/oxam`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Authorization": `Bearer ${token()}`
    },
    body: formData,
  });

  if (!response.ok || response.status === 401) {
    console.log("UNAUTH! or SOmething went wrong")
  } else if (response.ok && response.status === 201) {
    return { success: true };
  }
}
