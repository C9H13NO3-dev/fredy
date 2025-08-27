import { markdown2Html } from '../../services/markdown.js';
import nano from 'nano';

export const send = async ({ serviceName, newListings, notificationConfig, jobKey }) => {
  const { url, database, username, password } = notificationConfig.find((adapter) => adapter.id === config.id).fields;
  const urlObject = new URL(url);
  if (username != null && username !== '') {
    urlObject.username = username;
    urlObject.password = password || '';
  }
  const couch = nano(urlObject.toString());
  try {
    await couch.db.get(database);
  } catch {
    await couch.db.create(database);
  }
  const db = couch.db.use(database);
  const docs = newListings.map((listing) => ({ ...listing, serviceName, jobKey }));
  await db.bulk({ docs });
  return Promise.resolve();
};

export const config = {
  id: 'couchdb',
  name: 'CouchDB',
  description: 'This adapter stores listings in a CouchDB database.',
  fields: {
    url: {
      type: 'text',
      label: 'Server URL',
      description: 'The CouchDB server URL (e.g. http://localhost:5984).',
    },
    database: {
      type: 'text',
      label: 'Database',
      description: 'Database name where listings will be stored.',
    },
    username: {
      type: 'text',
      label: 'Username',
      description: 'The username for authentication, if required.',
    },
    password: {
      type: 'password',
      label: 'Password',
      description: 'The password for authentication, if required.',
    },
  },
  readme: markdown2Html('lib/notification/adapter/couchdb.md'),
};
