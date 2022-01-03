import { apiServerUrl } from './book.js';

async function getRents(url) {
  const response = await fetch(url, {
    credentials: 'include',
  });
  if (!response.ok) {
    throw response.statusText;
  }
  const rents = await response.json();
  return rents;
}

export async function getRentsOfBook(isbn) {
  const rents = await getRents(`${apiServerUrl}/rents/${isbn}`);
  return rents;
}

export async function getRentsOfUser() {
  const rents = await getRents(`${apiServerUrl}/rents`);
  return rents;
}

export async function getHistoryOfUser() {
  const rents = await getRents(`${apiServerUrl}/rents/history`);
  return rents;
}

export async function rentBook(formdata) {
  formdata.date = new Date().toISOString();
  const response = await fetch(`${apiServerUrl}/rents`, {
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
  const newRent = await response.json();
  return newRent;
}

export async function returnBook(rent) {
  rent.date = new Date().toISOString();
  const response = await fetch(`${apiServerUrl}/rents`, {
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    method: 'PUT',
    body: JSON.stringify(rent),
  });
  if (!response.ok) {
    throw response.statusText;
  }
  const { message } = await response.json();
  return message;
}
