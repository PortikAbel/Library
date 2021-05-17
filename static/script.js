// eslint-disable-next-line no-unused-vars
function getSummary(tableRow) {
  const isbn = tableRow.children[0].innerText;
  const summaryTD = tableRow.nextElementSibling.getElementsByTagName('td')[0];
  console.log(summaryTD);
  fetch(`/books/${isbn}`, {
    method: 'GET',
  }).then((response) => response.json())
    .then((responseText) => {
      console.log(responseText.summary);
      summaryTD.style.display = 'table-cell';
      summaryTD.innerText = responseText.summary;
    });
}
