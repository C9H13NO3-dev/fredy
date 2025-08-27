import { markdown2Html } from '../../services/markdown.js';
import fetch from 'node-fetch';

export const send = ({ serviceName, newListings, notificationConfig, jobKey }) => {
  const { url, tableId, token } = notificationConfig.find((adapter) => adapter.id === config.id).fields;
  const baseUrl = url.endsWith('/') ? url.slice(0, -1) : url;
  const endpoint = `${baseUrl}/api/v2/tables/${tableId}/rows`;

  const promises = newListings.map((listing) =>
    fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'xc-token': token,
      },
      body: JSON.stringify({
        ...listing,
        serviceName,
        jobKey,
      }),
    }),
  );

  return Promise.all(promises);
};

export const config = {
  id: 'nocodb',
  name: 'NocoDB',
  description: 'This adapter stores listings in a NocoDB table using the v2 API.',
  fields: {
    url: {
      type: 'text',
      label: 'Base URL',
      description: 'Base URL of your NocoDB instance (e.g. https://nocodb.example.com).',
    },
    tableId: {
      type: 'text',
      label: 'Table ID',
      description: 'ID of the table where listings will be stored.',
    },
    token: {
      type: 'text',
      label: 'API Token',
      description: 'NocoDB API token with access to the table.',
    },
  },
  readme: markdown2Html('lib/notification/adapter/nocodb.md'),
};

