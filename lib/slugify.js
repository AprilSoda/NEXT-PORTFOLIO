// Utility function to create URL-friendly slugs from blog titles
export function createSlug(title, fallbackId = null) {
  if (!title) return fallbackId || 'untitled';
  
  // Extract English words, numbers, and basic characters only
  let slug = title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '') // Remove everything except English letters, numbers, spaces, and hyphens
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
    .replace(/^-|-$/g, ''); // Remove leading/trailing hyphens
    
  // If the slug is empty or too short (only Korean text), use a fallback
  if (!slug || slug.length < 2) {
    if (fallbackId) {
      return `post-${fallbackId.substring(0, 8)}`; // Use first 8 chars of ID
    }
    return 'untitled-post';
  }
  
  return slug;
}

// Function to find blog by slug
export function findBlogBySlug(blogs, slug) {
  return blogs.find(blog => {
    const title = blog.properties.title.title[0]?.plain_text || '';
    return createSlug(title, blog.id) === slug;
  });
}