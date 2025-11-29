/**
 * Script to add free copyright images to existing blog articles
 * Uses Unsplash images (free to use)
 * Usage: node scripts/add-images-to-articles.js
 */

const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

// Map article slugs to appropriate Unsplash images
const articleImages = {
  "what-is-rootwise-ai-wellness-platform": {
    featuredImage: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=1200&q=80",
    images: [
      "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&q=80",
      "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&q=80",
    ],
  },
  "natural-wellness-support-ai-powered-guidance": {
    featuredImage: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=1200&q=80",
    images: [
      "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&q=80",
      "https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=800&q=80",
    ],
  },
  "safety-first-wellness-red-flags-medical-boundaries": {
    featuredImage: "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=1200&q=80",
    images: [
      "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&q=80",
      "https://images.unsplash.com/photo-1581595220892-b0739db3ba8c?w=800&q=80",
    ],
  },
  "natural-remedies-herbs-foods-wellness-support": {
    featuredImage: "https://images.unsplash.com/photo-1509664158680-07c5032b51e5?w=1200&q=80",
    images: [
      "https://images.unsplash.com/photo-1506617420156-8e4536971650?w=800&q=80",
      "https://images.unsplash.com/photo-1471193945509-9ad0617afabf?w=800&q=80",
    ],
  },
  "holistic-wellness-approach-natural-health-integration": {
    featuredImage: "https://images.unsplash.com/photo-1545205597-3d9d02c29597?w=1200&q=80",
    images: [
      "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&q=80",
      "https://images.unsplash.com/photo-1499209974431-9dddcece7f88?w=800&q=80",
    ],
  },
  "conversational-ai-health-support-natural-wellness": {
    featuredImage: "https://images.unsplash.com/photo-1531746790731-6c087fecd65a?w=1200&q=80",
    images: [
      "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&q=80",
      "https://images.unsplash.com/photo-1580894908361-967195033215?w=800&q=80",
    ],
  },
};

async function main() {
  try {
    console.log("Adding images to existing articles...\n");

    for (const [slug, images] of Object.entries(articleImages)) {
      try {
        const post = await prisma.blogPost.findUnique({
          where: { slug },
        });

        if (post) {
          await prisma.blogPost.update({
            where: { slug },
            data: {
              featuredImage: images.featuredImage,
              images: images.images,
            },
          });
          console.log(`✅ Added images to: ${post.title}`);
        } else {
          console.log(`⚠️  Article not found: ${slug}`);
        }
      } catch (error) {
        console.error(`❌ Error with "${slug}":`, error.message);
      }
    }

    console.log("\n✨ Image addition complete!");
    const count = await prisma.blogPost.count({
      where: {
        AND: [
          { published: true },
          { featuredImage: { not: null } },
        ],
      },
    });
    console.log(`Total articles with images: ${count}`);
  } catch (error) {
    console.error("Error adding images:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
