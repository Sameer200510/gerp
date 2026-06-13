const { Client } = require('pg');

const client = new Client({
  connectionString: "postgresql://postgres:postgres@127.0.0.1:5433/college_erp?schema=public&sslmode=disable"
});

client.connect()
  .then(() => {
    console.log('Connected successfully!');
    return client.end();
  })
  .catch(err => console.error('Connection error', err.stack));
