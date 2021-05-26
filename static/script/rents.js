const table = document.getElementById('rent-table');
const paragraph = document.getElementById('no-books-p');

// eslint-disable-next-line no-unused-vars
const rentBook = () => {
  const isbn = document.getElementById('isbn-select').value;
  const date = new Date().toISOString().slice(0, 10);
  fetch('/users/rents', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ isbn, date }),
  })
    .then((response) => {
      if (!response.ok) {
        throw response.statusText;
      }
      return response;
    })
    .then((response) => response.json())
    .then((response) => {
      table.className = '';
      paragraph.className = 'hidden';

      const row = table.getElementsByTagName('tbody')[0].insertRow(-1);
      const isbnCell = row.insertCell(0);
      const dateCell = row.insertCell(1);
      const buttonCell = row.insertCell(2);
      isbnCell.innerHTML = response.isbn;
      dateCell.innerHTML = response.date;
      buttonCell.innerHTML = '<img src="/resources/return.png" alt="return" height="50" '
        + 'onclick="returnBook(this.parentNode.parentNode)"/>';
    })
    .catch((err) => {
      document.getElementById('rent-error').innerText = err;
    });
};

// eslint-disable-next-line no-unused-vars
function returnBook(tableRow) {
  const isbn = tableRow.children[0].innerText;
  const date = tableRow.children[1].innerText;
  fetch('/users/rents', {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ isbn, date }),
  }).then((response) => response.json())
    .then((responseJSON) => {
      if (responseJSON.success) {
        console.log(table);
        tableRow.parentNode.removeChild(tableRow);
        console.log(table);
        if (table.children[1].children.length === 0) {
          table.className = 'hidden';
          paragraph.className = '';
        }
      }
      // eslint-disable-next-line no-undef
      openPopup(responseJSON.message);
    });
}
