import { apiServerUrl } from './book.js';

export async function getAllUsers() {
  const response = await fetch(`${apiServerUrl}/users`, {
    credentials: 'include',
  });
  if (!response.ok) {
    throw response.statusText;
  }
  const users = await response.json();
  return users;
}

export async function updateUser(user, valuesToUpdate) {
  const response = await fetch(`${apiServerUrl}/users`, {
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    method: 'PUT',
    body: JSON.stringify({ user, valuesToUpdate }),
  });
  if (!response.ok) {
    throw response.statusText;
  }
  const newUser = await response.json();
  return newUser;
}