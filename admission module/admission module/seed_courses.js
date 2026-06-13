const { Client } = require('pg');

const client = new Client({
  connectionString: 'postgresql://postgres:postgres@127.0.0.1:5440/college_erp?schema=public&sslmode=disable'
});

async function main() {
  await client.connect();
  const courses = [
    {id: 'btech', name: 'B.Tech Computer Science', code: 'BT-CSE', department: 'Engineering', fee: 100000},
    {id: 'bba', name: 'Bachelor of Business Admin', code: 'BBA-01', department: 'Management', fee: 80000},
    {id: 'mba', name: 'Master of Business Admin', code: 'MBA-01', department: 'Management', fee: 120000}
  ];
  for (const c of courses) {
    await client.query(
      'INSERT INTO "Course" (id, name, code, department, fee, "createdAt", "updatedAt") VALUES ($1, $2, $3, $4, $5, NOW(), NOW()) ON CONFLICT DO NOTHING',
      [c.id, c.name, c.code, c.department, c.fee]
    );
  }
  console.log('Inserted courses');
  await client.end();
}

main().catch(console.error);
