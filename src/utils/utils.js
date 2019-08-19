import btoa from 'btoa';

let envVars;

export const couchUserAddress = (baseURL, username) => `${baseURL}_users/org.couchdb.user:${username}`;
export const defaultNewUserDoc = (name, password) => (
  {
    name,
    password,
    roles: [],
    type: "user",
    subscriptions: [],
  }
)

export const fetchAuthAPIOptions = ({ method, data, auth }) => {
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

export const addSubscriptionToUserDoc = (userDoc, sub) => {
  return {
  	...userDoc,
  	subscriptions: [
  		...userDoc.subscriptions,
  		sub
  	]
  }
}

export const editUserDoc = (userDoc, attrs) => {
  return {
    ...userDoc,
    ...attrs
  }
}

export const getEnvVars = () => {
  if (envVars) return envVars;

  const PRODUCTION = process.env.NODE_ENV === "production";

  if (PRODUCTION) {
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
