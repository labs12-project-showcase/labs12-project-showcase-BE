const db = require("../../data/config");
const axios = require("axios");

module.exports = {
  getAPIToken,
  getUserInfo,
  findUser,
  registerUser
};

function getAPIToken() {
  return new Promise(async (resolve, reject) => {
    try {
      const body = {
        client_id: process.env.OAUTH_CLIENT_ID,
        client_secret: process.env.OAUTH_CLIENT_SECRET,
        audience: process.env.OAUTH_MGR_API,
        grant_type: "client_credentials"
      };
      const { data } = await axios.post(process.env.OAUTH_TOKEN_API, body);
      resolve(data.access_token);
    } catch (error) {
      console.log(error);
      reject(error);
    }
  });
}

function getUserInfo(token, id) {
  return new Promise(async (resolve, reject) => {
    try {
      const url = `${process.env.OAUTH_MGR_API}/users/${id}`;
      const headers = {
        authorization: `Bearer ${token}`
      };

      const { data } = await axios.get(url, { headers });
      const info = {
        name: data.name,
        github: data.html_url,
        location: data.location,
        about: data.bio
      };
      resolve(info);
    } catch (error) {
      console.log(error);
      reject(error);
    }
  });
}

function findUser(sub_id) {
  return db("accounts")
    .select("accounts.*", "roles.role")
    .innerJoin("roles", "accounts.role_id", "roles.id")
    .where({ "accounts.sub_id": sub_id })
    .first();
}

function registerUser(info) {
  return new Promise(async (resolve, reject) => {
    try {
      await db.transaction(async t => {
        [account] = await db("accounts")
          .insert(info, "*")
          .transacting(t);
        await db("students")
          .insert({ account_id: account.id })
          .transacting(t);
      });
      resolve(account);
    } catch (error) {
      console.log(error);
      reject(error);
    }
  });
}
