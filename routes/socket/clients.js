var t = "";
class Clients {
  constructor() {
    this.clientList = {};
    this.clientListShort = [];
    this.saveClient = this.saveClient.bind(this);
    this.searchUserByConn = this.searchUserByConn.bind(this);
  }

  searchUserByConn(obj, query) {
    for (var key in obj) {
      var value = obj[key];

      if (typeof value === "object") {
        this.searchUserByConn(value, query);
      }

      if (value === query) {
        return key;
      }
    }
  }

  isLoggedIn(username) {
    var count = 0;
    for (var i = 0; i < this.clientListShort.length; ++i) {
      if (this.clientListShort[i] == username) count++;
    }
    return count === 0 ? false : true;
  }

  saveClient(username, client) {
    this.clientList[username] = client;
    this.clientListShort.push(username);
  }

  updateClient(username, client) {
    delete this.clientList[username];
    this.clientList[username] = client;
  }

  requestRemove(username) {
    t = setTimeout(() => {
      this.removeClient(username);
    }, 3000);
  }
  stopRemove() {
    clearTimeout(t);
  }

  removeClient(username) {
    delete this.clientList[username];
    var index = this.clientListShort.indexOf(username);
    if (index > -1) {
      this.clientListShort.splice(index, 1);
    }
  }
}

module.exports = Clients;
