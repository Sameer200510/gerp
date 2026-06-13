const { Client } = require('pg');

const client = new Client({
  connectionString: "postgresql://postgres:postgres@127.0.0.1:5440/college_erp?schema=public&sslmode=disable"
});

async function main() {
  await client.connect();
  const adminEmail = 'admin@college.edu';
  
  const res = await client.query('SELECT * FROM "User" WHERE email = $1', [adminEmail]);
  if (res.rows.length === 0) {
    // Generate UUID v4
    const crypto = require('crypto');
    const id = crypto.randomUUID();
    const now = new Date().toISOString();
    
    await client.query(
      'INSERT INTO "User" (id, email, password, "firstName", "lastName", role, "createdAt", "updatedAt") VALUES ($1, $2, $3, $4, $5, $6, $7, $8)',
      [id, adminEmail, 'password123', 'Super', 'Admin', 'SUPER_ADMIN', now, now]
    );
    console.log('Created super admin user:', adminEmail);
  } else {
    console.log('Admin user already exists:', adminEmail);
  }
  
  const allUsers = await client.query('SELECT email, password, role FROM "User"');
  console.log('Current users in DB:', allUsers.rows);
}

main()
  .catch(console.error)
  .finally(() => client.end());
