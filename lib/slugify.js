// Utility function to create URL-friendly slugs from blog titles
export function createSlug(title) {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9가-힣\s-]/g, '') // Remove special characters, keep Korean characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
    .replace(/^-|-$/g, ''); // Remove leading/trailing hyphens
}

// Function to find blog by slug
export function findBlogBySlug(blogs, slug) {
  return blogs.find(blog => {
    const title = blog.properties.title.title[0]?.plain_text || '';
    return createSlug(title) === slug;
  });
}