export const apiFetchComputer = async (token) => {
  const response = await fetch(`${import.meta.env.VITE_LOCALHOST_BACKEND_URL}/computer`, {
    method: "GET",
    credentials: "include",
    headers: {
      "Authorization": `Bearer ${token()}`
    },
  })
  if (response.status === 401) {
    console.log("UNAUTH!");
    return null;
  }

  if (!response.ok) {
    console.error("Failed to fetch computers. Status:", response.status);
    return null;
  }

  try {
    const result = await response.json();
    return result;
  } catch (err) {
    console.error("Failed to parse JSON:", err);
    return null;
  }
}

export const apiAddComputer = async (formData, token) => {
  const encodedForm = new URLSearchParams(formData);
  const response = await fetch(`${import.meta.env.VITE_LOCALHOST_BACKEND_URL}/computer`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      "Authorization": `Bearer ${token()}`
    },
    body: encodedForm,
  })
  if (!response.ok || response.status === 401) {
    console.log("UNAUTH! or SOmething went wrong")
  } else if (response.ok && response.status === 200) {
    return { success: true };
  }
}

export const apiDeleteComputer = async (computerId, token) => {
  const response = await fetch(`${import.meta.env.VITE_LOCALHOST_BACKEND_URL}/computer/${computerId}`, {
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
