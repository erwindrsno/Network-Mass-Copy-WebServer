import { action } from "@solidjs/router";
import toast, { Toaster } from 'solid-toast';

export const apiLogin = async (formData) => {
  const encodedForm = new URLSearchParams(formData);
  const response = await fetch(`${import.meta.env.VITE_LOCALHOST_BACKEND_URL}/user/login`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: encodedForm,
  });
  if (!response.ok) {
    toast.error("Something went wrong");
    return null;
  }
  if (response.status === 401) {
    toast.error("Credentials incorrect, please try again.");
    return null;
  }
  const result = await response.json();
  return result;
};

export const apiAuthSudoAction = async (formData, token) => {
  const encodedForm = new URLSearchParams(formData);
  const response = await fetch(`${import.meta.env.VITE_LOCALHOST_BACKEND_URL}/user/sudo`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Authorization": `Bearer ${token()}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: encodedForm,
  })

  if (!response.ok && response.status === 401) {
    toast.error("Sudo action not permit.");
  }
  if (response.ok && response.status === 200) {
    console.log("sudo action allowed!");
    return { success: true };
  }
};
