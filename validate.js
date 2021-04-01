const gmailPattern = /^[a-zA-Z.!#$%&'*+\/=?^_`{|}~-]+@gmail.[a-z]+$/;
const yahooPattern = /^[a-zA-Z.!#$%&'*+\/=?^_`{|}~-]+@yahoo.[a-z]+$/;

function validateEmail() {
  const emailInput = document.forms['registerForm']['email'];
  if(emailInput.value.match(gmailPattern) || 
    emailInput.value.match(yahooPattern)) {
    emailInput.setCustomValidity('');
    emailInput.validity.valid = true;
  }
  else {
    emailInput.setCustomValidity('Expecting valid gmail/yahoo e-mail address.');
    emailInput.validity.valid = false;
  }
}

const urlPattern = /[a-zA-Z0-9_\-\/.]+\.[a-zA-Z0-9_\-\/.]+\.[a-zA-Z0-9_\-\/.]+/

function validateUrl() {
  const urlInput = document.forms['registerForm']['web-adrs'];
  if(urlInput.value.match(urlPattern)) {
    urlInput.setCustomValidity('');
  }
  else {
    urlInput.setCustomValidity('Invalid url.');
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

fields.forEach(addEventListener('input', validate));

let modifDate = "Last modified: " + document.lastModified;

function updateLastModified() {
  modifDate = "Last modified: " + document.lastModified;
}

const footer = document.querySelector("footer");
footer.innerText = modifDate;