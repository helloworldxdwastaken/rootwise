/**
 * Script to create an admin user from an existing user's email
 * This will use the same password hash if the user exists
 * Usage: node scripts/create-admin-from-user.js <email> <password>
 */

const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  const args = process.argv.slice(2);
  
  if (args.length < 2) {
    console.error("Usage: node scripts/create-admin-from-user.js <email> <password>");
    process.exit(1);
  }

  const [email, password] = args;
  const username = email; // Use email as username

  try {
    // Check if admin already exists
    const existingAdmin = await prisma.adminUser.findUnique({
      where: { username },
    });

    if (existingAdmin) {
      console.error(`Admin user with username "${username}" already exists.`);
      process.exit(1);
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create admin user
    const admin = await prisma.adminUser.create({
      data: {
        username,
        password: hashedPassword,
        email: email,
        name: null,
        isActive: true,
      },
    });

    console.log(`✅ Admin user created successfully!`);
    console.log(`   Username: ${admin.username}`);
    console.log(`   Email: ${admin.email || "Not set"}`);
    console.log(`   ID: ${admin.id}`);
    console.log(`\n   You can now log in at: /admin/login`);
  } catch (error) {
    console.error("Error creating admin user:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();

