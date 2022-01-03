export const apiServerUrl = 'http://localhost:5000';

export async function findAllBooks() {
  const response = await fetch(`${apiServerUrl}/books`);
  if (!response.ok) {
    throw response.statusText;
  }
  const books = await response.json();
  return books;
}

export async function getSummary(isbn) {
  const response = await fetch(`${apiServerUrl}/books/${isbn}/summary`);
  if (!response.ok) {
    throw response.statusText;
  }
  const { summary } = await response.json();
  return summary;
}

export async function registerBook(formdata) {
  // sending the image
  const fileFormData = new FormData();
  const file = formdata.cover;
  fileFormData.append('cover', file);
  const fileResponse = await fetch(`${apiServerUrl}/images`, {
    credentials: 'include',
    method: 'POST',
    body: fileFormData,
  });
  if (!fileResponse.ok) {
    throw response.statusText;
  }
  const { imageName } = await fileResponse.json();

  // sending the book registration
  formdata.cover = imageName;
  const response = await fetch(`${apiServerUrl}/books`, {
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
}

export async function deleteBook(isbn) {
  await fetch(`${apiServerUrl}/books/${isbn}`, {
    method: 'DELETE',
    credentials: 'include',
  });
}
