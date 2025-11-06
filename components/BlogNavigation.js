import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { createSlug } from '../lib/slugify';

const NavigationButton = ({ post, direction }) => {
  if (!post) return null;

  const coverImage = post.cover?.type === "external"
    ? post.cover.external?.url || post.cover.internal?.url
    : post.cover?.file?.url || "";

  return (
    <div className={`nav ${direction}`}>
      <p className={`nav-text ${direction}`}>
        {direction === 'prev' && 'Previous'}
        {direction === 'next' && 'Next'}
      </p>
      <Link href={`/blogs/${createSlug(post.properties.title.title[0]?.plain_text || '', post.id)}`} scroll={false} legacyBehavior>
        <a>
          <div className={`nav-button ${direction}`}>
            <div className="nav-button-cover-wrapper">
              {coverImage ? (
                <Image
                  src={coverImage}
                  alt={`${direction} post cover`}
                  fill
                  style={{ objectFit: 'cover' }}
                  className="nav-button-cover"
                />
              ) : (
                <div className="nav-button-cover-placeholder" />
              )}
            </div>
            <div className="nav-button-title">
              {post.properties.title.title[0].plain_text}
            </div>
          </div>
        </a>
      </Link>
    </div>
  );
};

const BlogNavigation = ({ prevPost, nextPost }) => {
  return (
    <div className="blog-navigation">
      <NavigationButton post={prevPost} direction="prev" />
      <NavigationButton post={nextPost} direction="next" />
    </div>
  );
};

export default BlogNavigation;