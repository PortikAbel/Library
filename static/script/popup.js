const popup = document.getElementsByClassName('popup')[0];
const content = document.getElementById('popup-text');

// eslint-disable-next-line no-unused-vars
function closePopup() {
  popup.style.display = 'none';
}

// eslint-disable-next-line no-unused-vars
function openPopup(message) {
  content.innerText = message;
  popup.style.display = 'block';
}
