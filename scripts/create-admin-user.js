/**
 * Script to create an admin user
 * Usage: node scripts/create-admin-user.js <username> <password> [email] [name]
 * Example: node scripts/create-admin-user.js admin mypassword123 admin@rootwise.com "Admin User"
 */

const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  const args = process.argv.slice(2);
  
  if (args.length < 2) {
    console.error("Usage: node scripts/create-admin-user.js <username> <password> [email] [name]");
    process.exit(1);
  }

  const [username, password, email, name] = args;

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
        email: email || null,
        name: name || null,
        isActive: true,
      },
    });

    console.log(`✅ Admin user created successfully!`);
    console.log(`   Username: ${admin.username}`);
    console.log(`   Email: ${admin.email || "Not set"}`);
    console.log(`   Name: ${admin.name || "Not set"}`);
    console.log(`   ID: ${admin.id}`);
  } catch (error) {
    console.error("Error creating admin user:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();

