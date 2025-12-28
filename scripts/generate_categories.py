#!/usr/bin/env python3
"""
Auto-generate navigation.yml and category pages from _posts folder structure.

Structure:
  _posts/
    menu1/           <- Menu (dropdown)
      category1/     <- Category page
      category2/
    menu2/
      category3/

Output:
  _data/navigation.yml  <- Auto-generated menus
  _pages/Category1.md   <- Auto-generated category pages
"""

import os
import yaml
from pathlib import Path

# Configuration
POSTS_DIR = "_posts"
DATA_DIR = "_data"
PAGES_DIR = "_pages"
NAVIGATION_FILE = os.path.join(DATA_DIR, "navigation.yml")

# Menu display order (menus not listed here will be appended at the end)
MENU_ORDER = [
    "programming",
    "frontend",
    "mobile",
    "backend",
    "infra",
    "tools",
    "language",
    "knowledge",
]

# Fixed menu items (always included)
FIXED_MENUS = [
    {"name": "Home", "link": "/"},
]

FIXED_MENUS_END = [
    {"name": "About", "link": "/about"},
]


def title_case(name: str) -> str:
    """Convert folder name to title case for display."""
    # Handle special cases
    special_cases = {
        "ai": "AI",
        "devops": "DevOps",
        "nodejs": "NodeJS",
        "javascript": "JavaScript",
        "ios": "iOS",
    }
    if name.lower() in special_cases:
        return special_cases[name.lower()]
    return name.replace("-", " ").replace("_", " ").title()


def scan_posts_structure() -> dict:
    """
    Scan _posts folder structure and return menu -> categories mapping.

    Returns:
        {
            "programming": ["kotlin", "java", "python"],
            "language": ["korean", "english"],
            ...
        }
    """
    structure = {}
    posts_path = Path(POSTS_DIR)

    if not posts_path.exists():
        return structure

    for menu_dir in sorted(posts_path.iterdir()):
        if not menu_dir.is_dir() or menu_dir.name.startswith("."):
            continue

        menu_name = menu_dir.name.lower()
        categories = []

        for category_dir in sorted(menu_dir.iterdir()):
            if not category_dir.is_dir() or category_dir.name.startswith("."):
                continue

            # Check if there are any .md files in the category
            md_files = list(category_dir.glob("*.md"))
            if md_files:
                categories.append(category_dir.name.lower())

        if categories:
            structure[menu_name] = categories

    return structure


def generate_navigation(structure: dict) -> list:
    """Generate navigation.yml content from structure."""
    navigation = list(FIXED_MENUS)

    # Sort menus by MENU_ORDER, then alphabetically for unlisted ones
    def menu_sort_key(menu_name):
        if menu_name in MENU_ORDER:
            return (0, MENU_ORDER.index(menu_name))
        return (1, menu_name)

    sorted_menus = sorted(structure.keys(), key=menu_sort_key)

    for menu_name in sorted_menus:
        categories = structure[menu_name]

        dropdown_items = []
        for category in sorted(categories):
            # For "common" category, use menu-specific name
            if category == "common":
                display_name = title_case(menu_name)
                link_name = title_case(menu_name)
            else:
                display_name = title_case(category)
                link_name = title_case(category).replace(' ', '-')

            dropdown_items.append({
                "name": display_name,
                "link": f"/{link_name}/"
            })

        navigation.append({
            "name": title_case(menu_name),
            "dropdown": dropdown_items
        })

    navigation.extend(FIXED_MENUS_END)
    return navigation


def generate_category_page(category: str, menu: str) -> str:
    """Generate category page markdown content."""
    # For "common" category, use menu name as title
    if category == "common":
        title = title_case(menu)
        permalink = f"/{title.replace(' ', '-')}/"
        # For common, match posts with categories containing menu name
        cat_value = menu
    else:
        title = title_case(category)
        permalink = f"/{title.replace(' ', '-')}/"
        cat_value = category

    return f"""---
layout: category
permalink: {permalink}
title: {title}
category: {cat_value}
menu: {menu}
---
"""


def write_navigation(navigation: list):
    """Write navigation.yml file."""
    os.makedirs(DATA_DIR, exist_ok=True)

    with open(NAVIGATION_FILE, "w", encoding="utf-8") as f:
        yaml.dump(navigation, f, allow_unicode=True, default_flow_style=False, sort_keys=False)

    print(f"Generated: {NAVIGATION_FILE}")


def write_category_pages(structure: dict):
    """Write category page files."""
    os.makedirs(PAGES_DIR, exist_ok=True)

    # Generate missing pages
    generated = []
    for menu, categories in structure.items():
        for category in categories:
            # For "common" category, use menu name as filename
            if category == "common":
                title = title_case(menu)
            else:
                title = title_case(category)

            page_filename = f"{title.replace(' ', '-')}.md"
            page_path = os.path.join(PAGES_DIR, page_filename)

            # Skip if page already exists (allow manual customization)
            if os.path.exists(page_path):
                continue

            content = generate_category_page(category, menu)
            with open(page_path, "w", encoding="utf-8") as f:
                f.write(content)

            generated.append(page_filename)

    if generated:
        print(f"Generated category pages: {', '.join(generated)}")
    else:
        print("No new category pages needed")


def cleanup_orphan_pages(structure: dict):
    """Remove category pages that no longer have corresponding folders."""
    pages_path = Path(PAGES_DIR)

    # Get all valid categories
    valid_categories = set()
    for categories in structure.values():
        for category in categories:
            valid_categories.add(title_case(category).replace(' ', '-').lower())

    # Special pages to keep
    keep_pages = {"about"}

    removed = []
    for page_file in pages_path.glob("*.md"):
        page_name = page_file.stem.lower()
        if page_name not in valid_categories and page_name not in keep_pages:
            # Don't auto-remove, just warn
            print(f"Warning: Orphan page found: {page_file.name}")


def main():
    # Change to repository root
    script_dir = Path(__file__).parent
    repo_root = script_dir.parent
    os.chdir(repo_root)

    print(f"Working directory: {os.getcwd()}")

    # Scan structure
    structure = scan_posts_structure()

    if not structure:
        print("No posts structure found. Make sure _posts/ has subdirectories.")
        return

    print(f"Found menus: {list(structure.keys())}")

    # Generate files
    navigation = generate_navigation(structure)
    write_navigation(navigation)
    write_category_pages(structure)
    cleanup_orphan_pages(structure)

    print("Done!")


if __name__ == "__main__":
    main()
