const users = [];

function registerUser(username, password) {
  if (users.some(u => u.username === username)) {
    throw new Error('User already exists');
  }
  users.push({ username, password });
}

function getUser(username) {
  return users.find(u => u.username === username);
}

module.exports = {
  registerUser,
  getUser
};