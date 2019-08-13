import btoa from 'btoa';
import fs from 'fs';

const PRODUCTION = process.env.NODE_ENV === "prod";

const envFile = fs.readFileSync('cushionEnv.json');
const envVars = JSON.parse(envFile);

const couchAuth = PRODUCTION ? {
	admin: process.env.COUCH_ADMIN,
	password: process.env.COUCH_PASSWORD
} : {
	admin: envVars.couch.devAdmin,
	password: envVars.couch.devPassword
};

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
	const opts = {		
		method,
    headers: {
		  "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Basic ${btoa(`${couchAuth.admin}:${couchAuth.password}`)}`
    }
   };

  return data ? { ...opts, body: JSON.stringify(data) } : opts;
}

export const addSubscriptionToUserDoc = (userDoc, sub) => ({
	...userDoc,
	subscriptions: [
		...subscriptions,
		sub
	]
})
