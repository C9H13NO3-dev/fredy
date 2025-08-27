### NocoDB Adapter

This adapter stores listings in a [NocoDB](https://nocodb.com/) table using the v2 REST API and an API token.

1. Create a table in your NocoDB project.
2. Generate an API token with access to that project.
3. Find the table ID from the table's API info page.
4. Configure the adapter in Fredy with:
   - **Base URL** – URL of your NocoDB instance (e.g. `https://nocodb.example.com`)
   - **Table ID** – ID of the table where rows should be inserted
   - **API Token** – the token created in step 2

The adapter will create a new row for each listing and adds the `serviceName` and `jobKey` to the stored data.
