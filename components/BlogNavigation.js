import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

const NavigationButton = ({ post, direction }) => {
  if (!post) return null;

  const coverImage = post.cover.external.url || post.cover.internal.url;
  return (
    <div className={`nav ${direction}`}>
      <p className={`nav-text ${direction}`}>
        {direction === 'prev' && 'Previous'}
        {direction === 'next' && 'Next'}
      </p>

      <Link href={`/blogs/${post.id}`} passHref>
        <a className={`nav-button ${direction}`}>
          {coverImage && (
            <Image
              src={coverImage}
              alt={`${direction} post cover`}
              width={300}
              height={100}
              objectFit="cover"
              className="nav-button-cover"
            />
          )}
          <div className="nav-button-title">
            {post.properties.title.title[0].plain_text}
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