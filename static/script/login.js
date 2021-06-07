// eslint-disable-next-line no-unused-vars
const login = () => {
  const formdata = {
    username: document.getElementById('username').value,
    password: document.getElementById('password').value,
  };
  fetch('/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(formdata),
    redirect: 'follow',
  })
    .then((response) => {
      if (!response.ok) {
        throw response.statusText;
      }
      window.location.href = response.url;
    })
    .catch((err) => {
      document.getElementById('login-error').innerText = err;
    });
};
