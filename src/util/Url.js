
/**
 * Format urls
 *
 * @param  {string}   input
 * @param  {bool}     encodeUri
 * @return {string}
 */
function format(input, encodeUri) {
  if (input) {
    let encodedInput = encodeUri ? encodeURIComponent(input) : input;
    encodedInput = encodedInput.replace(/'/g, '%27');
    return encodedInput;
  }

  return null;
}

const Url = {
  format,
};

export default Url;
