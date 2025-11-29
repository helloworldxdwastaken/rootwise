# Admin CRM Setup Guide

## Overview
The admin CRM system allows you to manage blog articles through a web interface. You can create, edit, delete articles, manage images, and control publishing status.

## Initial Setup

### 1. Database Migration
First, you need to update your database schema to include the new `images` field in the `BlogPost` model:

```bash
npx prisma migrate dev --name add_images_to_blog_post
```

Or if you prefer to generate the migration manually:

```bash
npx prisma migrate dev
```

### 2. Create Admin User
Create your first admin user using the provided script:

```bash
node scripts/create-admin-user.js <username> <password> [email] [name]
```

Example:
```bash
node scripts/create-admin-user.js admin mySecurePassword123 admin@rootwise.com "Admin User"
```

**Important:** Make sure to use a strong password!

### 3. Access Admin Panel
1. Navigate to `/admin/login`
2. Enter your username and password
3. You'll be redirected to the admin dashboard

## Features

### Article Management
- **View All Articles**: See all blog posts in a grid layout with preview images
- **Create New Article**: Add new blog posts with full content editor
- **Edit Articles**: Update existing articles
- **Delete Articles**: Remove articles (with confirmation)
- **Publish/Draft**: Control article visibility
- **Featured Articles**: Mark articles as featured to highlight them

### Image Management
- **Featured Image**: Set a preview/thumbnail image that appears in blog listings
- **Multiple Images**: Add multiple images to an article
- **Image Preview**: See image previews before saving
- **Set as Featured**: Easily promote any image to be the featured/preview image

### Article Structure
All articles follow a standardized template:
- **Title**: Article headline
- **Slug**: URL-friendly identifier (auto-generated from title)
- **Excerpt**: Short description shown in listings
- **Content**: Full article content (Markdown supported)
- **Category**: Article category/topic
- **Read Time**: Estimated reading time
- **Featured Image**: Preview image for listings
- **Images**: Additional images used in content
- **SEO Fields**: Custom SEO title, description, and keywords
- **Publish Date**: When the article was/will be published
- **Status**: Published or Draft

## Blog Display

### Blog Listing Page (`/blog`)
- Shows featured articles prominently at the top
- Displays all articles in a grid layout
- Each article card shows:
  - Featured/preview image (first image)
  - Category and read time
  - Title and excerpt
  - Publication date
  - "Read more" link

### Article Detail Page (`/blog/[slug]`)
- Full article content with Markdown rendering
- Featured image displayed prominently
- Share buttons for social media
- Related articles section
- SEO optimized metadata

## Content Guidelines

### Article Template Structure
When creating articles, follow this structure:

1. **Introduction Paragraph** (large text, light weight)
   - Hook the reader
   - Set context

2. **Main Sections** (H2 headings)
   - Use clear, descriptive headings
   - Break content into digestible sections

3. **Subsections** (H3 headings if needed)
   - Further organize content

4. **Content Formatting**
   - Use Markdown for formatting
   - **Bold** for emphasis
   - *Italic* for subtle emphasis
   - Lists for key points
   - Images to break up text

5. **Conclusion/Safety Note**
   - End with important disclaimers or next steps

### Image Best Practices
- Use high-quality images
- Optimize images before uploading (use WebP format when possible)
- Featured images should be at least 1200x630px for best results
- Keep file sizes reasonable (< 500KB recommended)
- Use descriptive alt text in markdown: `![Alt text](image-url.jpg)`

## Markdown Support

The content editor supports full Markdown syntax:

- **Headers**: `# H1`, `## H2`, `### H3`
- **Bold**: `**bold text**`
- **Italic**: `*italic text*`
- **Links**: `[link text](url)`
- **Images**: `![alt text](image-url.jpg)`
- **Lists**: `- item` or `1. item`
- **Code**: `` `code` `` or ` ```code block``` `
- **Blockquotes**: `> quote`

## API Endpoints

### Public Endpoints
- `GET /api/blog/posts` - Get all published posts
- `GET /api/blog/posts/[slug]` - Get single post by slug

### Admin Endpoints (Requires Authentication)
- `GET /api/admin/posts` - Get all posts (admin)
- `POST /api/admin/posts` - Create new post
- `GET /api/admin/posts/[id]` - Get single post
- `PUT /api/admin/posts/[id]` - Update post
- `DELETE /api/admin/posts/[id]` - Delete post
- `POST /api/admin/auth` - Admin authentication

## Security Notes

- Admin routes are protected by NextAuth session authentication
- Only authenticated admin users can access `/admin/*` routes
- Passwords are hashed using bcrypt
- Admin users can be deactivated without deletion

## Troubleshooting

### Can't log in
- Verify the admin user exists: Check database or create new one
- Check that `isActive` is `true` in the database
- Verify password is correct

### Images not showing
- Check image URLs are accessible
- Verify image URLs are absolute (include `http://` or `https://`)
- Check browser console for CORS or loading errors

### Articles not appearing on blog
- Verify `published` field is `true`
- Check article date is not in the future
- Clear Next.js cache if needed

### Database errors
- Run `npx prisma generate` to regenerate Prisma client
- Run migrations: `npx prisma migrate dev`
- Check database connection in `.env` file

## Next Steps

1. Run database migration
2. Create admin user
3. Log in to admin panel
4. Create your first article
5. Add images and content
6. Publish and view on `/blog`

For questions or issues, check the main README or project documentation.

