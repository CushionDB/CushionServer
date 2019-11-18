const btoa = require('btoa');

let envVars;

const couchUserAddress = (baseURL, username) => `${baseURL}_users/org.couchdb.user:${username}`;
const defaultNewUserDoc = (name, password) => {
  return {
    name,
    password,
    roles: [],
    type: "user",
    subscriptions: [],
  }
}

const fetchAuthAPIOptions = ({ method, data, auth }) => {
  const environmentVars = getEnvVars();


	const opts = {		
		method,
    headers: {
		  "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Basic ${btoa(`${
        environmentVars.couchAdmin
      }:${
        environmentVars.couchPassword
      }`)}`
    }
   };

  return data ? { ...opts, body: JSON.stringify(data) } : opts;
}

const addSubscriptionToUserDoc = (userDoc, sub) => {
  return {
  	...userDoc,
  	subscriptions: [
  		...userDoc.subscriptions,
  		sub
  	]
  };
}

const editUserDoc = (userDoc, attrs) => {
  return {
    ...userDoc,
    ...attrs
  };
}

const getEnvVars = () => {
  if (envVars) return envVars;

  if (process.env.NODE_ENV === "production") {
    envVars = createEnvObject();
  } else {
    envVars = require('../../cushion-default-env.json');
  }

  return envVars;
};

const createEnvObject = () => {
  const env = process.env;
  return  {
    privateVapid: env.PRIVATE_VAPID,
    publicVapid: env.PUBLIC_VAPID,
    appEmail: env.APP_EMAIL,
    couchBaseURL: env.COUCH_BASE_URL,
    couchAdmin: env.COUCHDB_USER,
    couchPassword: env.COUCHDB_PASSWORD,
    appAddress: env.APP_ADDRESS
  }
}

module.exports = {
  couchUserAddress,
  defaultNewUserDoc,
  fetchAuthAPIOptions,
  addSubscriptionToUserDoc,
  editUserDoc,
  getEnvVars,
  createEnvObject
}