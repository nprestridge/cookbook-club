const PROXY = "API HERE";
const API_KEY = "API KEY HERE";

function getCookbooks(cb) {
  return fetch(`${PROXY}cookbooks`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': API_KEY
    }
  }).then(checkStatus)
    .then(parseJSON)
    .then(cb);
}

function updateCookbook(title, author, blog, date, cb) {
  let body = {
    params: {
      path: {
        author: author,
        title: title
      }
    }
  }

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
      'x-api-key': API_KEY
    },
    body: JSON.stringify(body)
  }).then(checkStatus)
    .then(parseJSON)
    .then(cb);
}

function deleteCookbook(title, author, cb) {
  let body = {
    params: {
      path: {
        author: author,
        title: title
      }
    }
  }

  return fetch(`${PROXY}cookbooks`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': API_KEY
    },
    body: JSON.stringify(body)
  }).then(checkStatus)
    .then(parseJSON)
    .then(cb);
}

function getCookbookRecipes(author, book, cb) {
  return fetch(`${PROXY}recipes/${author}/${book}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': API_KEY
    }
  }).then(checkStatus)
    .then(parseJSON)
    .then(cb);
}

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

const Api = { getCookbooks, updateCookbook, deleteCookbook, getCookbookRecipes };
export default Api;
