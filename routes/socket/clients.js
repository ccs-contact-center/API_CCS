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
        console.log(key);
        return key;
      }
    }
  }

  saveClient(username, client) {
    this.clientList[username] = client;
    this.clientListShort.push(username);
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
