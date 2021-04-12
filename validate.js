const gmailPattern = /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@gmail.[a-z]+$/;
const yahooPattern = /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@yahoo.[a-z]+$/;

function validateName() {
  if(document.forms['registerForm']['name'].validity.valid) {
    document.querySelector('#name-error').style.display = 'none';
  }
  else {
    document.querySelector('#name-error').style.display = 'inline';
  }
}

function validateDate() {
  if(document.forms.registerForm.date.validity.valid) {
    document.querySelector('#date-error').style.display = 'none';
  }
  else {
    document.querySelector('#date-error').style.display = 'inline';
  }
}

function validateEmail() {
  const emailInput = document.forms['registerForm']['email'];
  if(emailInput.value.match(gmailPattern) || 
    emailInput.value.match(yahooPattern)) {
    emailInput.setCustomValidity('');
  }
  else {
    emailInput.setCustomValidity('Expecting valid gmail/yahoo e-mail address.');
  }
  if(emailInput.validity.valid) {
    document.querySelector('#email-error').style.display = 'none';
  }
  else {
    document.querySelector('#email-error').style.display = 'inline';
  }
}

const urlPattern = /[a-zA-Z0-9_\-\/:]+\.[a-zA-Z0-9_\-\/:]+\.[a-zA-Z0-9_\-\/:]+/

function validateUrl() {
  const urlInput = document.forms['registerForm']['web-adrs'];
  if(urlInput.value.match(urlPattern)) {
    urlInput.setCustomValidity('');
  }
  else {
    urlInput.setCustomValidity('Invalid url.');
  }
  if(urlInput.validity.valid) {
    document.querySelector('#url-error').style.display = 'none';
  }
  else {
    document.querySelector('#url-error').style.display = 'inline';
  }
}

const fields = document.querySelectorAll('.input');
const submitBtn = document.querySelector('.button');
submitBtn.disabled = true;
submitBtn.style.cursor = 'not-allowed';

function validate() {
  submitBtn.disabled = false;
  fields.forEach(field => {
      submitBtn.disabled |= !field.validity.valid;
    }
  );
  submitBtn.style.cursor = submitBtn.disabled ? 'not-allowed' : 'pointer'
}

fields.forEach(field => field.addEventListener('input', validate));

let modifDate = "Last modified: " + document.lastModified;

function updateLastModified() {
  modifDate = "Last modified: " + document.lastModified;
}

const footer = document.querySelector("footer");
footer.innerText = modifDate;