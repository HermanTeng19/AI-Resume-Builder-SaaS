import os
import re

SOURCE_DIR = "/Users/hermanteng/Documents/Projects/2026/6_Jun/Blog-writing/Career_Articles"
DEST_DIR = "/Users/hermanteng/Documents/Projects/2026/6_Jun/AI-Resume-Builder-SaaS/src/content/blog"
SITEMAP_PATH = "/Users/hermanteng/Documents/Projects/2026/6_Jun/AI-Resume-Builder-SaaS/public/sitemap.xml"
IMAGEMAP_PATH = "/Users/hermanteng/Documents/Projects/2026/6_Jun/AI-Resume-Builder-SaaS/src/content/imageMap.ts"

FILES = [
    "44-75-of-Tech-Hiring-Managers-Are-Shifting-to-Contract-Workers-Heres-How-to-Make-th.md",
    "45-Product-Management-Hiring-Rebound-Inside-the-2025-PM-Job-Market-Surge-and-How-to.md",
    "46-2026-Tech-Hiring-AI-Cloud-Cybersecurity-Jobs-Salaries.md"
]

IMAGES = {
    "44-75-of-Tech-Hiring-Managers-Are-Shifting-to-Contract-Workers-Heres-How-to-Make-th": "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2071&auto=format&fit=crop",
    "45-Product-Management-Hiring-Rebound-Inside-the-2025-PM-Job-Market-Surge-and-How-to": "https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=2070&auto=format&fit=crop",
    "46-2026-Tech-Hiring-AI-Cloud-Cybersecurity-Jobs-Salaries": "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2070&auto=format&fit=crop"
}

def format_article(content):
    # 1. Remove YAML frontmatter
    content = re.sub(r"^---\n.*?\n---\n", "", content, flags=re.DOTALL)
    
    # 2. Clean HTML tags at the end (script, title, meta)
    content = re.sub(r"(?i)<(script|title|meta)[^>]*>.*?</\1>", "", content, flags=re.DOTALL)
    content = re.sub(r"(?i)<(script|title|meta)[^>]*/>", "", content)
    
    # Clean up trailing spaces/newlines
    content = content.strip() + "\n"
    
    # 3. Add subtitle
    subtitle = "\n> *By Herman Teng, Ex-FAANG Recruiting Leader<br/>Jul 07, 2026*\n\n---\n\n"
    # Find the first H1 title
    match = re.search(r"^# .*\n", content)
    if match:
        end_idx = match.end()
        # insert subtitle
        content = content[:end_idx] + subtitle + content[end_idx:]
    else:
        # Fallback if no H1
        content = subtitle + content
        
    return content

for fname in FILES:
    src = os.path.join(SOURCE_DIR, fname)
    dst = os.path.join(DEST_DIR, fname)
    
    with open(src, "r") as f:
        content = f.read()
        
    formatted = format_article(content)
    
    with open(dst, "w") as f:
        f.write(formatted)
        
    print(f"Processed {fname}")

# Update sitemap
with open(SITEMAP_PATH, "r") as f:
    sitemap = f.read()
    
for fname in FILES:
    slug = fname.replace(".md", "")
    url = f"https://careerinsightlabs.com/blog/{slug}"
    if url not in sitemap:
        url_tag = f"  <url>\n    <loc>{url}</loc>\n  </url>\n</urlset>"
        sitemap = sitemap.replace("</urlset>", url_tag)

with open(SITEMAP_PATH, "w") as f:
    f.write(sitemap)
    
# Update imageMap.ts
with open(IMAGEMAP_PATH, "r") as f:
    imgmap = f.read()

for fname in FILES:
    slug = fname.replace(".md", "")
    url = IMAGES[slug]
    if f"'{slug}'" not in imgmap and f'"{slug}"' not in imgmap:
        entry = f"  '{slug}': '{url}',\n}};"
        imgmap = imgmap.replace("};", entry)

with open(IMAGEMAP_PATH, "w") as f:
    f.write(imgmap)

print("Updated sitemap and imageMap.")
