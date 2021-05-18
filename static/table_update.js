// eslint-disable-next-line no-unused-vars
function getSummary(tableRow) {
  const isbn = tableRow.children[0].innerText;
  const summaryTD = tableRow.nextElementSibling.getElementsByTagName('td')[0];
  fetch(`/books/${isbn}`, {
    method: 'GET',
  }).then((response) => response.json())
    .then((responseText) => {
      summaryTD.style.display = 'table-cell';
      summaryTD.innerText = responseText.summary;
    });
}

// eslint-disable-next-line no-unused-vars
function deleteRow(tableRow) {
  const isbn = tableRow.children[0].innerText;
  fetch(`/books/${isbn}`, {
    method: 'DELETE',
  }).then((response) => response.json())
    .then((responseJSON) => {
      if (responseJSON.success) {
        tableRow.parentNode.removeChild(tableRow);
      }
    });
}
