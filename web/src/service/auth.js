import { apiServerUrl } from './book.js';

export async function getUser() {
  const response = await fetch(`${apiServerUrl}/auth`, {
    credentials: 'include',
  });
  if (!response.ok) {
    throw response.statusText;
  }
  const user = await response.json();
  return user;
}

export async function signup(formdata) {
  const response = await fetch(`${apiServerUrl}/auth/sign-up`, {
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    method: 'POST',
    body: JSON.stringify(formdata),
  });
  if (!response.ok) {
    throw response.statusText;
  }
  const user = await response.json();
  return user;
}

export async function login(formdata) {
  const response = await fetch(`${apiServerUrl}/auth/login`, {
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    method: 'POST',
    body: JSON.stringify(formdata),
  });

  if (!response.ok) {
    throw response.statusText;
  }

  const user = await response.json();
  return user;
}

export async function logout() {
  const response = await fetch(`${apiServerUrl}/auth/logout`, { 
    credentials: 'include',
    method: 'POST',
   });

  if (!response.ok) {
    throw response.statusText;
  }

  const { msg } = await response.json();
  return msg;
}
