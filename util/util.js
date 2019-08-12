export const couchUserAddress = (baseURL, username) => `${baseURL}_users/org.couchdb.user:${username}`;
export const defaultNewUserDoc = (name, password) => (
  {
    name,
    password,
    roles: [],
    type: "user",
    subscriptions: [],
  }
);

export const fetchAuthAPIOptions = ({ method, data, auth }) => {
	const opts = {		
		method,
    headers: {
		  "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: auth
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
}