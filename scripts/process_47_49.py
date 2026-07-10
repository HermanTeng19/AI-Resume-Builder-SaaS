import os
import re
import shutil

SOURCE_DIR = "/Users/hermanteng/Documents/Projects/2026/6_Jun/Blog-writing/Career_Articles"
DEST_DIR = "/Users/hermanteng/Documents/Projects/2026/6_Jun/AI-Resume-Builder-SaaS/src/content/blog"
FILES = [
    "47-The-Specialization-Imperative-Why-Going-Narrow-Is-the-Fastest-Path-to-a-Six-Figu.md",
    "48-2026-Remote-Tech-Career-Hotspots-Where-to-Live-for-Salary-Growth-and-Low-Cost-of.md",
    "49-The-2025-Product-Management-Hiring-Rebound-What-the-Data-Actually-Shows-and-How-.md"
]

def process_file(filename):
    src_path = os.path.join(SOURCE_DIR, filename)
    dest_path = os.path.join(DEST_DIR, filename)
    
    with open(src_path, 'r', encoding='utf-8') as f:
        content = f.read()
        
    # 1. Remove YAML frontmatter
    content = re.sub(r'^---\n.*?---\n', '', content, flags=re.DOTALL)
    
    # 2. Remove trailing HTML block
    content = re.sub(r'```html\n<title>.*?</script>\n```', '', content, flags=re.DOTALL)
    
    # 3. Add subtitle
    subtitle = "\n> *By Herman Teng, Ex-FAANG Recruiting Leader<br/>Jul 10, 2026*\n\n---\n"
    # Find the first H1 title and insert subtitle after it
    content = re.sub(r'(# .*?\n)', r'\1' + subtitle, content, count=1)
    
    with open(dest_path, 'w', encoding='utf-8') as f:
        f.write(content.strip() + '\n')
        
    print(f"Processed {filename}")

for filename in FILES:
    process_file(filename)
