'use strict';
const url = 'http://127.0.0.1:3000/api/v1';

// select existing html elements
const loginWrapper = document.querySelector('#login-wrapper');
const userInfo = document.querySelector('#user-info');
const logOut = document.querySelector('#log-out');
const main = document.querySelector('main');
const loginForm = document.querySelector('#login-form');
const addUserForm = document.querySelector('#add-user-form');
const addForm = document.querySelector('#add-cat-form');
const modForm = document.querySelector('#mod-cat-form');
const ul = document.querySelector('ul');
const imageModal = document.querySelector('#image-modal');
const modalImage = document.querySelector('#image-modal img');
const close = document.querySelector('#image-modal a');

// luxon date libary
const dt = luxon.DateTime;

const getErrorMessage = async (response) => {
  try {
    const body = await response.json();
    return body.message ?? `Request failed (${response.status}).`;
  } catch {
    return `Request failed (${response.status}).`;
  }
};

// get user from sessionStorage
let user = JSON.parse(sessionStorage.getItem('user'));
const startApp = (logged) => {
  // show/hide forms + cats
  loginWrapper.style.display = logged ? 'none' : 'flex';
  logOut.style.display = logged ? 'block' : 'none';
  main.style.display = logged ? 'block' : 'none';
  userInfo.textContent = logged ? `Hello ${user.name}` : '';
  if (logged) {
    getCat();
  }
};

// create cat cards
const createCatCards = (cats) => {
  // clear ul
  ul.innerHTML = '';
  cats.forEach((cat) => {
    // create li with DOM methods
    const img = document.createElement('img');
    const imagePath = cat.filename ? new URL(cat.filename, window.location.origin).href : '';
    const thumbnailPath = imagePath.replace(/(\.[^/.]+)$/, '_thumb$1');
    img.src = thumbnailPath;
    img.alt = 'Image of a cat named ' + cat.cat_name;
    img.classList.add('resp');

    // open large image when clicking image
    img.addEventListener('click', () => {
      modalImage.src = imagePath;
      modalImage.alt = cat.cat_name;
      imageModal.classList.toggle('hide');
    });

    const figure = document.createElement('figure').appendChild(img);

    const h2 = document.createElement('h2');
    h2.textContent = cat.cat_name;

    const p1 = document.createElement('p');
    p1.innerHTML = `Birthdate: ${dt
      .fromISO(cat.birthdate)
      .setLocale('fi')
      .toLocaleString()}`;
    const p1b = document.createElement('p');
    p1b.innerHTML = `Age: ${dt
      .now()
      .diff(dt.fromISO(cat.birthdate), ['year'])
      .toFormat('y')}`;

    const p2 = document.createElement('p');
    p2.innerHTML = `Weight: ${cat.weight}kg`;

    const p3 = document.createElement('p');
    p3.textContent = `Owner: ${cat.owner_name ?? 'Unknown'}`;

    const li = document.createElement('li');
    li.classList.add('light-border');

    li.appendChild(h2);
    li.appendChild(figure);
    li.appendChild(p1);
    li.appendChild(p1b);
    li.appendChild(p2);
    li.appendChild(p3);
    ul.appendChild(li);
    if (user.role === 'admin' || user.user_id === cat.owner) {
      // add modify button
      const modButton = document.createElement('button');
      modButton.textContent = 'Modify';
      modButton.addEventListener('click', () => {
        const inputs = modForm.querySelectorAll('input');
        inputs[0].value = cat.cat_name;
        inputs[1].value = dt.fromISO(cat.birthdate).toFormat('yyyy-MM-dd');
        inputs[2].value = cat.weight;
        modForm.action = `${url}/cats/${cat.cat_id}`;
      });

      // delete selected cat
      const delButton = document.createElement('button');
      delButton.textContent = 'Delete';
      delButton.addEventListener('click', async () => {
        const fetchOptions = {
          method: 'DELETE',
          headers: {
            Authorization: 'Bearer ' + sessionStorage.getItem('token'),
          },
        };
        try {
          const response = await fetch(
            url + '/cats/' + cat.cat_id,
            fetchOptions,
          );
          if (!response.ok) {
            throw new Error(await getErrorMessage(response));
          }
          getCat();
        } catch (e) {
          alert(e.message);
        }
      });
      li.appendChild(modButton);
      li.appendChild(delButton);
    }
  });
};

// close modal
close.addEventListener('click', (evt) => {
  evt.preventDefault();
  imageModal.classList.toggle('hide');
});

// AJAX call

const getCat = async () => {
  console.log('getCat token ', sessionStorage.getItem('token'));
  try {
    const options = {
      headers: {
        Authorization: 'Bearer ' + sessionStorage.getItem('token'),
      },
    };
    const response = await fetch(url + '/cats', options);
    if (!response.ok) {
      throw new Error(await getErrorMessage(response));
    }
    const json = await response.json();
    createCatCards(json.data ?? json);
  } catch (e) {
    alert(e.message);
  }
};

// submit add cat form
addForm.addEventListener('submit', async (evt) => {
  evt.preventDefault();
  const fd = new FormData(addForm);
  const fetchOptions = {
    method: 'POST',
    headers: {
      Authorization: 'Bearer ' + sessionStorage.getItem('token'),
    },
    body: fd,
  };
  const response = await fetch(url + '/cats', fetchOptions);
  if (!response.ok) {
    alert(await getErrorMessage(response));
    return;
  }
  getCat();
});

// submit modify form
modForm.addEventListener('submit', async (evt) => {
  evt.preventDefault();
  const data = serializeJson(modForm);
  const fetchOptions = {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + sessionStorage.getItem('token'),
    },
    body: JSON.stringify(data),
  };

  const response = await fetch(modForm.action, fetchOptions);
  if (!response.ok) {
    alert(await getErrorMessage(response));
    return;
  }
  getCat();
});

// login
loginForm.addEventListener('submit', async (evt) => {
  evt.preventDefault();
  const data = serializeJson(loginForm);
  const fetchOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  };

  const response = await fetch(url + '/auth/login', fetchOptions);
  const json = await response.json();
  if (!response.ok || !json.user) {
    alert(json.message ?? 'Login failed.');
  } else {
    // save token and user
    sessionStorage.setItem('token', json.token);
    sessionStorage.setItem('user', JSON.stringify(json.user));
    user = JSON.parse(sessionStorage.getItem('user'));
    startApp(true);
  }
});

// logout
logOut.addEventListener('click', async (evt) => {
  evt.preventDefault();
  sessionStorage.removeItem('token');
  sessionStorage.removeItem('user');
  user = null;
  startApp(false);
});

// submit register form
addUserForm.addEventListener('submit', async (evt) => {
  evt.preventDefault();
  const data = serializeJson(addUserForm);
  const fetchOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  };
  const response = await fetch(url + '/users', fetchOptions);
  const json = await response.json();
  if (!response.ok) {
    alert(json.message ?? 'Registration failed.');
  } else {
    alert('Registration successful. You can now log in.');
    addUserForm.reset();
  }
});

// when app starts, check if token exists and hide login form, show logout button and main content, get cats and users
(async () => {
  if (sessionStorage.getItem('token') && sessionStorage.getItem('user')) {
    // check if token valid
    try {
      const fetchOptions = {
        headers: {
          Authorization: 'Bearer ' + sessionStorage.getItem('token'),
        },
      };
      const response = await fetch(url + '/auth/me', fetchOptions);
      if (!response.ok) {
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('user');
        user = null;
        startApp(false);
      } else {
        startApp(true);
      }
    } catch (e) {
      sessionStorage.removeItem('token');
      sessionStorage.removeItem('user');
      user = null;
      startApp(false);
    }
  } else {
    // when starting app and nothing in sessionStorage
    startApp(false);
  }
})();
