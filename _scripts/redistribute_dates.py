#!/usr/bin/env python3
"""
Redistribute 263 posts from 2025-12-28 to natural intervals across 2025.
Adds redirect_from for old URLs to maintain SEO.
"""

import os
import re
import random
from datetime import datetime, timedelta
from pathlib import Path

BLOG_ROOT = Path(__file__).parent.parent
POSTS_DIR = BLOG_ROOT / "_posts"

# Find all posts dated 2025-12-28
def find_batch_posts():
    posts = []
    for root, dirs, files in os.walk(POSTS_DIR):
        for f in files:
            if f.startswith("2025-12-28-") and f.endswith(".md"):
                posts.append(Path(root) / f)
    return sorted(posts)


def get_old_url(filepath):
    """Extract the old URL from the file path and front matter."""
    rel = filepath.relative_to(POSTS_DIR)
    parts = list(rel.parts)  # e.g. ['programming', 'common', '2025-12-28-foo.md']

    # Categories from directory path (everything except the file)
    categories = parts[:-1]

    # Extract slug from filename: 2025-12-28-foo.md -> foo
    filename = parts[-1]
    match = re.match(r'\d{4}-\d{2}-\d{2}-(.*?)\.md$', filename)
    if not match:
        return None
    slug = match.group(1)

    # Old URL: /categories/2025/12/28/slug.html
    cat_path = "/".join(categories)
    return f"/{cat_path}/2025/12/28/{slug}.html"


def parse_front_matter(content):
    """Parse YAML front matter."""
    if not content.startswith("---"):
        return None, content
    end = content.index("---", 3)
    fm = content[3:end].strip()
    body = content[end+3:]
    return fm, body


def update_post(filepath, new_date):
    """Update a post's date and add redirect_from."""
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    old_url = get_old_url(filepath)
    if not old_url:
        print(f"  SKIP (no URL): {filepath}")
        return False

    # Parse front matter
    fm, body = parse_front_matter(content)
    if fm is None:
        print(f"  SKIP (no front matter): {filepath}")
        return False

    # Update date in front matter
    date_str = new_date.strftime("%Y-%m-%d")
    # Generate a random hour between 09:00-21:00 for natural look
    hour = random.randint(9, 21)
    minute = random.randint(0, 59)
    time_str = f"{hour:02d}:{minute:02d}:00"

    # Replace date line
    fm = re.sub(
        r'date:\s*\d{4}-\d{2}-\d{2}\s+\d{2}:\d{2}:\d{2}\s*\+\d{4}',
        f'date: {date_str} {time_str} +0900',
        fm
    )
    # Also handle date without timezone
    fm = re.sub(
        r'date:\s*\d{4}-\d{2}-\d{2}\s+\d{2}:\d{2}:\d{2}\s*$',
        f'date: {date_str} {time_str} +0900',
        fm,
        flags=re.MULTILINE
    )

    # Add redirect_from if not already present
    if 'redirect_from' not in fm:
        fm += f'\nredirect_from:\n  - "{old_url}"'

    # Reconstruct content
    new_content = f"---\n{fm}\n---{body}"

    # Write back
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(new_content)

    # Rename file
    old_name = filepath.name
    new_name = re.sub(r'^\d{4}-\d{2}-\d{2}', date_str, old_name)
    new_path = filepath.parent / new_name

    if new_path != filepath:
        filepath.rename(new_path)

    return True


def distribute_dates(posts):
    """Distribute posts across 2025-01-01 to 2025-12-27."""
    n = len(posts)

    start_date = datetime(2025, 1, 1)
    end_date = datetime(2025, 12, 27)
    total_days = (end_date - start_date).days  # 360 days

    # Shuffle posts to mix categories
    random.seed(42)  # Reproducible randomness
    shuffled = list(posts)
    random.shuffle(shuffled)

    # Distribute evenly with some natural variation
    dates = []
    interval = total_days / n  # ~1.37 days between posts

    for i in range(n):
        base_day = int(i * interval)
        # Add slight random variation (-1 to +1 day)
        variation = random.randint(-1, 1)
        day = max(0, min(total_days, base_day + variation))
        date = start_date + timedelta(days=day)
        dates.append(date)

    # Sort dates to ensure monotonic
    dates.sort()

    return list(zip(shuffled, dates))


def main():
    posts = find_batch_posts()
    print(f"Found {len(posts)} posts from 2025-12-28")

    assignments = distribute_dates(posts)

    success = 0
    failed = 0

    for filepath, new_date in assignments:
        date_str = new_date.strftime("%Y-%m-%d")
        print(f"  {filepath.name} -> {date_str}")
        if update_post(filepath, new_date):
            success += 1
        else:
            failed += 1

    print(f"\nDone: {success} updated, {failed} failed")

    # Print date distribution summary
    from collections import Counter
    months = Counter()
    for _, date in assignments:
        months[date.strftime("%Y-%m")] += 1

    print("\nMonthly distribution:")
    for month in sorted(months.keys()):
        print(f"  {month}: {months[month]} posts")


if __name__ == "__main__":
    main()
