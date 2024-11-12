// validation.js
const usernameRegex = /^[a-zA-Z0-9]{3,20}$/; // Alphanumeric, 3-20 characters
const passwordRegex = /^(?=.*[a-zA-Z])(?=.*[0-9]).{8,}$/; // At least 8 characters, letters and numbers

function validateUsername(username) {
  return usernameRegex.test(username);
}

function validatePassword(password) {
  return passwordRegex.test(password);
}

module.exports = { validateUsername, validatePassword };
