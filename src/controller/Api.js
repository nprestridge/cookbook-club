import Config from './../Config';

const config = Config.load();
const PROXY = config.api.endpoint;
const API_KEY = config.api.key;

function checkStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return response;
  }

  const error = new Error(`HTTP Error ${response.statusText}`);
  error.status = response.statusText;
  error.response = response;
  console.log(error); // eslint-disable-line no-console
  throw error;
}

function parseJSON(response) {
  return response.json();
}

function getCookbooks(cb) {
  return fetch(`${PROXY}cookbooks`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': API_KEY,
    },
  }).then(checkStatus)
    .then(parseJSON)
    .then(cb);
}

function updateCookbook(title, author, blog, date, cb) {
  const body = {
    params: {
      path: {
        author,
        title,
      },
    },
  };

  if (blog) {
    body.params.path.blog = blog;
  }

  if (date) {
    body.params.path.meetingDate = date;
  }

  return fetch(`${PROXY}cookbooks`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': API_KEY,
    },
    body: JSON.stringify(body),
  }).then(checkStatus)
    .then(parseJSON)
    .then(cb);
}

function deleteCookbook(title, author, cb) {
  const body = {
    params: {
      path: {
        author,
        title,
      },
    },
  };

  return fetch(`${PROXY}cookbooks`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': API_KEY,
    },
    body: JSON.stringify(body),
  }).then(checkStatus)
    .then(parseJSON)
    .then(cb);
}

function getCookbookRecipes(author, book, cb) {
  return fetch(`${PROXY}recipes/${author}/${book}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': API_KEY,
    },
  }).then(checkStatus)
    .then(parseJSON)
    .then(cb);
}

const Api = { getCookbooks, updateCookbook, deleteCookbook, getCookbookRecipes };
export default Api;
