import btoa from 'btoa';
import fs from 'fs';

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

export const getEnvVars = () => {
  if (envVars) return envVars;

  const PRODUCTION = process.env.NODE_ENV === "prod";

  if (PRODUCTION) {
    envVars = createEnvObject();
  } else {
    const envFile = fs.readFileSync('cushion-default-env.json');
    envVars = JSON.parse(envFile);
  }

  return envVars;
};

const createEnvObject = () => {
  const env = process.env;
  return  {
    privateVapid: env.PRIVATE_VAPID,
    publicVapid: env.PUBLIC_VAPID,
    appURL: env.APP_URL,
    appEmail: env.APP_EMAIL,
    couchBaseURL: env.COUCH_BASE_URL,
    couchAdmin: env.COUCH_ADMIN,
    couchPassword: env.COUCH_PASSWORD
  }
}