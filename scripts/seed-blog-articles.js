/**
 * Script to seed initial blog articles
 * Usage: node scripts/seed-blog-articles.js
 */

const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const sampleArticles = [
  {
    slug: "what-is-rootwise-comprehensive-guide",
    title: "What is Rootwise? A Comprehensive Guide to the AI-Powered Wellness Platform",
    excerpt: "Rootwise represents a new approach to wellness support, combining conversational AI with evidence-informed natural health guidance. This comprehensive guide explores what makes Rootwise unique.",
    content: `In an increasingly digital health landscape, Rootwise emerges as a platform that bridges the gap between artificial intelligence and natural wellness approaches. Unlike many health apps that focus on tracking metrics or providing generic advice, Rootwise takes a conversational, personalized approach to wellness support.

## Understanding Rootwise's Core Philosophy

Rootwise operates on a fundamental principle: wellness support should be gentle, evidence-informed, and always prioritize safety. The platform doesn't position itself as a replacement for medical care, but rather as a complementary tool that helps individuals explore natural approaches to everyday wellness challenges.

What sets Rootwise apart is its conversational interface. Rather than requiring users to navigate complex menus or fill out extensive questionnaires, the platform allows individuals to describe how they feel in their own words. This natural language approach makes wellness support more accessible and less clinical.

## How Rootwise Works: The User Experience

When a user interacts with Rootwise, they begin by describing their symptoms, mood, or wellness goals in plain language. The platform's AI technology interprets these descriptions, asking clarifying questions when needed to better understand the context. This process feels more like a conversation with a knowledgeable friend than a medical consultation.

Based on the conversation, Rootwise generates a personalized wellness plan. These plans typically include suggestions for foods that might support the user's goals, herbal recommendations grounded in traditional and modern evidence, and simple daily habits that align with their needs. Importantly, every plan includes safety notes highlighting when professional medical care should be sought.

## Safety as a Core Feature

One of Rootwise's most distinctive features is its "red flag" system. Every wellness plan includes clear warnings about symptoms or situations that require immediate medical attention. The platform maintains strict boundaries, focusing only on mild, everyday wellness concerns and explicitly directing users to healthcare professionals for anything beyond that scope.

**Important Note:** Rootwise provides general wellness and nutrition information only. It does not offer medical advice, diagnosis, or treatment. Always consult a qualified healthcare professional about your health. In an emergency, contact your local emergency services.`,
    category: "Platform Overview",
    readTime: "8 min read",
    featured: true,
    published: true,
    seoTitle: "What is Rootwise? Complete Guide to AI Wellness Platform | Rootwise Blog",
    seoDescription: "Comprehensive guide to Rootwise: an AI-powered wellness platform that combines conversational technology with evidence-informed natural health guidance.",
    seoKeywords: "what is Rootwise, Rootwise platform, AI wellness, natural health app, wellness technology",
    date: new Date("2024-12-15"),
  },
  {
    slug: "how-rootwise-uses-ai-natural-wellness",
    title: "How Rootwise Uses AI to Support Natural Wellness: A Deep Dive",
    excerpt: "Understanding how artificial intelligence can enhance rather than replace human-centered wellness approaches. Rootwise demonstrates how technology can support natural health journeys.",
    content: `The intersection of artificial intelligence and natural wellness might seem paradoxical at first glance. How can advanced technology support approaches that emphasize simplicity, tradition, and natural processes? Rootwise provides a compelling answer to this question.

## The Conversational AI Approach

At its core, Rootwise uses conversational AI to create a more natural interaction between users and wellness guidance. Unlike traditional health apps that require users to navigate menus, select from predefined options, or fill out extensive forms, Rootwise allows individuals to express themselves in their own words.

This natural language processing capability means that someone can say "I've been feeling really tired lately, especially in the afternoons, and I'm not sure if it's my diet or just stress" and receive contextual, relevant guidance.

## Human-AI Collaboration

What makes Rootwise's AI implementation unique is its emphasis on human oversight. The platform doesn't rely solely on algorithms to generate wellness suggestions. Instead, human wellness coaches and medical safety reviewers work alongside the AI to establish guidelines, review outputs, and ensure that suggestions remain safe and appropriate.

**Important Note:** Rootwise provides general wellness and nutrition information only. It does not offer medical advice, diagnosis, or treatment. Always consult a qualified healthcare professional about your health.`,
    category: "Technology",
    readTime: "10 min read",
    featured: true,
    published: true,
    seoTitle: "How Rootwise Uses AI for Natural Wellness | Technology Deep Dive",
    seoDescription: "Explore how Rootwise combines artificial intelligence with natural wellness approaches.",
    seoKeywords: "AI wellness, natural health AI, conversational AI health, AI wellness platform",
    date: new Date("2024-12-14"),
  },
  {
    slug: "getting-started-with-rootwise-beginners-guide",
    title: "Getting Started with Rootwise: A Beginner's Guide to Natural Wellness Support",
    excerpt: "New to Rootwise? This step-by-step guide walks you through the platform's features, how to describe your symptoms, and what to expect from your wellness conversations.",
    content: `If you're new to Rootwise, the platform's conversational approach might feel different from other health apps you've used. This guide will walk you through everything you need to know to get started.

## Creating Your Account

Getting started with Rootwise begins with creating an account. The platform offers both free and paid tiers, with the free tier providing access to basic features. Once you've signed up, you'll be guided through a brief onboarding process that helps Rootwise understand your general wellness goals and preferences.

## Your First Conversation

Rootwise's conversational interface means you can simply start typing about how you feel. You don't need to use specific medical terminology or navigate complex menus. Just describe your symptoms, concerns, or goals in your own words.

## Understanding Wellness Plans

When Rootwise generates a wellness plan, it typically includes several components. You'll see suggestions for foods that might support your goals, herbal recommendations (if appropriate), simple daily habits to consider, and important safety notes.

**Important Note:** Rootwise provides general wellness and nutrition information only. It does not offer medical advice, diagnosis, or treatment. Always consult a qualified healthcare professional about your health.`,
    category: "Getting Started",
    readTime: "6 min read",
    featured: false,
    published: true,
    seoTitle: "Getting Started with Rootwise: Complete Beginner's Guide | Blog",
    seoDescription: "Complete guide to getting started with Rootwise. Learn how to use the platform and make the most of natural wellness support.",
    seoKeywords: "Rootwise guide, how to use Rootwise, Rootwise tutorial, wellness platform guide",
    date: new Date("2024-12-11"),
  },
];

async function main() {
  try {
    console.log("Seeding blog articles...\n");

    for (const article of sampleArticles) {
      try {
        const existing = await prisma.blogPost.findUnique({
          where: { slug: article.slug },
        });

        if (existing) {
          console.log(`⚠️  Article "${article.title}" already exists, skipping...`);
          continue;
        }

        const created = await prisma.blogPost.create({
          data: article,
        });

        console.log(`✅ Created: ${created.title}`);
      } catch (error) {
        console.error(`❌ Error creating "${article.title}":`, error.message);
      }
    }

    console.log("\n✨ Seeding complete!");
    const count = await prisma.blogPost.count();
    console.log(`Total articles in database: ${count}`);
  } catch (error) {
    console.error("Error seeding articles:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();

