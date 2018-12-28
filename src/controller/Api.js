/**
 * Api.js - Handles api calls and responses
 */
import Config from '../Config';

const config = Config.load();
const PROXY = config.api.endpoint;
const API_KEY = config.api.key;

/**
 * Checks api response and returns response if 200
 * Throws error if there is an error response
 *
 * @param  {object} response
 * @return {object} response or error
 */
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

/**
 * Returns JSON response
 *
 * @param  {object} response
 * @return {object}
 */
function parseJSON(response) {
  return response.json();
}

/**
 * Get list of all cookbooks
 *
 * @param  {Function} cb  Callback after API processing ends
 * @return {object}       List of cookbooks
 */
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

/**
 * Update cookbook
 *
 * @param  {string}   title  Cookbook title
 * @param  {string}   author Cookbook author
 * @param  {string}   blog   Optional website
 * @param  {string}   date   Optional meeting date in YYYY-MM-DD format
 * @param  {Function} cb     Callback
 * @return {object}
 */
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

/**
 * Delete cookbook
 *
 * @param  {string}   title  Cookbook title
 * @param  {string}   author Cookbook author
 * @param  {Function} cb     Callback
 * @return {object}
 */
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

/**
 * Get list of recipes by cookbook
 *
 * @param  {string}   author Cookbook author
 * @param  {string}   title  Cookbook title
 * @param  {Function} cb     Callback
 * @return {object}
 */
function getCookbookRecipes(author, title, cb) {
  return fetch(`${PROXY}recipes/${author}/${title}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': API_KEY,
    },
  }).then(checkStatus)
    .then(parseJSON)
    .then(cb);
}

const Api = {
  getCookbooks, updateCookbook, deleteCookbook, getCookbookRecipes,
};

export default Api;
