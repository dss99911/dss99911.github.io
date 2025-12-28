#!/usr/bin/env python3
"""
Migrate _posts from 1-level to 2-level folder structure.

Before:
  _posts/kotlin/post.md
  _posts/java/post.md

After:
  _posts/programming/kotlin/post.md
  _posts/programming/java/post.md

Also updates categories in each post's front matter.
"""

import os
import re
import shutil
from pathlib import Path

# Configuration
POSTS_DIR = "_posts"

# Folder mapping: old_folder -> (menu, category)
# If category is None, use the old folder name as category
FOLDER_MAPPING = {
    # Programming languages
    "kotlin": ("programming", None),
    "java": ("programming", None),
    "scala": ("programming", None),
    "python": ("programming", None),
    "golang": ("programming", None),
    "c": ("programming", None),
    "ruby": ("programming", None),
    "programming": ("programming", "common"),

    # Frontend
    "javascript": ("frontend", None),
    "nodejs": ("frontend", None),
    "frontend": ("frontend", "common"),

    # Mobile
    "android": ("mobile", None),
    "mobile": ("mobile", "common"),

    # Backend
    "spring": ("backend", None),
    "database": ("backend", None),

    # Infra
    "devops": ("infra", None),
    "security": ("infra", None),
    "automation": ("infra", None),
    "spark": ("infra", None),

    # Tools
    "mac": ("tools", None),
    "jekyll": ("tools", None),
    "obsidian": ("tools", None),
    "tools": ("tools", "common"),

    # Knowledge
    "ai": ("knowledge", None),
    "history": ("knowledge", None),
    "science": ("knowledge", None),
    "law": ("knowledge", None),
    "knowledge": ("knowledge", "common"),
    "miscellanea": ("knowledge", None),
}

# Language folder needs special handling - files should be split by language
LANGUAGE_MAPPING = {
    "korean": "korean",
    "english": "english",
    "chinese": "chinese",
    "hindi": "hindi",
    "arabic": "arabic",
    "indonesian": "indonesian",
}


def update_post_categories(file_path: Path, menu: str, category: str) -> bool:
    """
    Update categories in post's front matter.

    Returns True if file was modified.
    """
    with open(file_path, "r", encoding="utf-8") as f:
        content = f.read()

    # Check if file has front matter
    if not content.startswith("---"):
        return False

    # Find the end of front matter
    end_match = content.find("---", 3)
    if end_match == -1:
        return False

    front_matter = content[3:end_match]
    body = content[end_match:]

    # Update categories
    new_categories = f"categories: [{menu}, {category}]"

    # Replace existing categories line
    if re.search(r'^categories:', front_matter, re.MULTILINE):
        new_front_matter = re.sub(
            r'^categories:.*$',
            new_categories,
            front_matter,
            flags=re.MULTILINE
        )
    else:
        # Add categories if not exists
        new_front_matter = front_matter.rstrip() + f"\n{new_categories}\n"

    new_content = "---" + new_front_matter + body

    with open(file_path, "w", encoding="utf-8") as f:
        f.write(new_content)

    return True


def detect_language_from_filename(filename: str) -> str:
    """Detect language from filename."""
    filename_lower = filename.lower()
    # Check in priority order (more specific first)
    # e.g., "chinese-korean" should match "chinese" first
    priority_order = ["chinese", "arabic", "hindi", "indonesian", "english", "korean"]
    for lang in priority_order:
        if filename_lower.startswith(f"2025-12-28-{lang}") or f"-{lang}-" in filename_lower:
            return lang
    # Fallback to simple check
    for lang in LANGUAGE_MAPPING.keys():
        if lang in filename_lower:
            return lang
    return "common"


def migrate_folder(old_path: Path, new_path: Path, menu: str, category: str, dry_run: bool = False):
    """Migrate a folder and update all posts."""
    if not old_path.exists():
        return

    print(f"Moving: {old_path} -> {new_path}")

    if not dry_run:
        # Create parent directory if needed
        new_path.parent.mkdir(parents=True, exist_ok=True)

        # Move the folder
        if new_path.exists():
            # Merge contents if destination exists
            for item in old_path.iterdir():
                dest = new_path / item.name
                if item.is_file():
                    shutil.move(str(item), str(dest))
                elif item.is_dir():
                    if dest.exists():
                        # Recursively move contents
                        for sub_item in item.iterdir():
                            shutil.move(str(sub_item), str(dest / sub_item.name))
                        item.rmdir()
                    else:
                        shutil.move(str(item), str(dest))
            old_path.rmdir()
        else:
            shutil.move(str(old_path), str(new_path))

        # Update categories in all posts
        for md_file in new_path.glob("*.md"):
            if update_post_categories(md_file, menu, category):
                print(f"  Updated: {md_file.name}")


def migrate_language_folder(language_path: Path, dry_run: bool = False):
    """Special handling for language folder - split files by detected language."""
    if not language_path.exists():
        return

    print(f"Processing language folder: {language_path}")

    for md_file in list(language_path.glob("*.md")):
        lang = detect_language_from_filename(md_file.name)

        # Skip non-language files (like golang, ruby)
        if lang == "common":
            # Check if it's a programming language file misplaced here
            filename_lower = md_file.name.lower()
            if "golang" in filename_lower or "ruby" in filename_lower:
                print(f"  Skipping misplaced file: {md_file.name}")
                continue

        new_dir = language_path.parent / "language" / lang
        new_path = new_dir / md_file.name

        print(f"  Moving: {md_file.name} -> language/{lang}/")

        if not dry_run:
            new_dir.mkdir(parents=True, exist_ok=True)
            shutil.move(str(md_file), str(new_path))
            update_post_categories(new_path, "language", lang)

    # Remove old language folder if empty
    if not dry_run and language_path.exists():
        remaining = list(language_path.iterdir())
        if not remaining:
            language_path.rmdir()
        elif all(f.name.startswith(".") for f in remaining):
            for f in remaining:
                f.unlink()
            language_path.rmdir()


def main():
    import argparse

    parser = argparse.ArgumentParser(description="Migrate posts to 2-level structure")
    parser.add_argument("--dry-run", action="store_true", help="Show what would be done without making changes")
    args = parser.parse_args()

    # Change to repository root
    script_dir = Path(__file__).parent
    repo_root = script_dir.parent
    os.chdir(repo_root)

    print(f"Working directory: {os.getcwd()}")
    if args.dry_run:
        print("DRY RUN - no changes will be made")
    print()

    posts_path = Path(POSTS_DIR)

    # First, handle the language folder specially
    language_path = posts_path / "language"
    if language_path.exists() and language_path.is_dir():
        # Check if it has subdirectories (already 2-level) or just files
        subdirs = [d for d in language_path.iterdir() if d.is_dir()]
        if not subdirs:
            migrate_language_folder(language_path, dry_run=args.dry_run)

    # Then migrate other folders
    for old_folder, (menu, category) in FOLDER_MAPPING.items():
        old_path = posts_path / old_folder

        if not old_path.exists():
            continue

        # Skip if already under the target menu
        if old_path.parent.name == menu:
            continue

        actual_category = category if category else old_folder
        new_path = posts_path / menu / actual_category

        migrate_folder(old_path, new_path, menu, actual_category, dry_run=args.dry_run)

    print()
    print("Migration complete!")
    print()
    print("Next steps:")
    print("1. Review the changes: git status")
    print("2. Run generate_categories.py to update navigation and pages")
    print("3. Test locally: bundle exec jekyll serve")
    print("4. Commit the changes")


if __name__ == "__main__":
    main()
