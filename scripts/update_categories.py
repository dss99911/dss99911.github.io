#!/usr/bin/env python3
"""
Update categories in all posts based on their folder location.
"""

import os
import re
from pathlib import Path

POSTS_DIR = "_posts"


def update_post_categories(file_path: Path, menu: str, category: str) -> bool:
    """Update categories in post's front matter."""
    with open(file_path, "r", encoding="utf-8") as f:
        content = f.read()

    if not content.startswith("---"):
        return False

    end_match = content.find("---", 3)
    if end_match == -1:
        return False

    front_matter = content[3:end_match]
    body = content[end_match:]

    new_categories = f"categories: [{menu}, {category}]"

    if re.search(r'^categories:', front_matter, re.MULTILINE):
        new_front_matter = re.sub(
            r'^categories:.*$',
            new_categories,
            front_matter,
            flags=re.MULTILINE
        )
    else:
        new_front_matter = front_matter.rstrip() + f"\n{new_categories}\n"

    new_content = "---" + new_front_matter + body

    if new_content != content:
        with open(file_path, "w", encoding="utf-8") as f:
            f.write(new_content)
        return True
    return False


def main():
    script_dir = Path(__file__).parent
    repo_root = script_dir.parent
    os.chdir(repo_root)

    posts_path = Path(POSTS_DIR)
    updated = 0

    for menu_dir in posts_path.iterdir():
        if not menu_dir.is_dir() or menu_dir.name.startswith("."):
            continue

        menu = menu_dir.name

        for category_dir in menu_dir.iterdir():
            if not category_dir.is_dir() or category_dir.name.startswith("."):
                continue

            category = category_dir.name

            for md_file in category_dir.glob("*.md"):
                if update_post_categories(md_file, menu, category):
                    print(f"Updated: {md_file}")
                    updated += 1

    print(f"\nTotal updated: {updated} files")


if __name__ == "__main__":
    main()
