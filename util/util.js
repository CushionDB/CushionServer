export const couchUserAddress = (baseURL, username) => `${baseURL}_users/org.couchdb.user:${username}`;
export const defaultNewUserDoc = (name, password) => (
  {
    name,
    password,
    roles: [],
    type: 'user',
    subscriptions: [],
  }
);

export const fetchAuthAPIOptions = ({ method, data, auth }) => (
	{
		method,
    body: JSON.stringify(data),
    headers: {
		  "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Basic ${btoa(`${auth.name}:${auth.pass}`)}`
    }
  }
)
