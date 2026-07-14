import os
import re

SOURCE_DIR = "/Users/hermanteng/Documents/Projects/2026/6_Jun/Blog-writing/Career_Articles"
DEST_DIR = "/Users/hermanteng/Documents/Projects/2026/6_Jun/AI-Resume-Builder-SaaS/src/content/blog"
FILES = [
    "50-Data-Engineering-in-2026-The-Most-Overlooked-Tech-Career-With-34-Growth-and-a-12.md",
    "51-Skills-Based-Hiring-Is-Replacing-Years-of-Experience-A-FAANG-Recruiters-Data-Bac.md"
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
    subtitle = "\n> *Senior Tech Recruiter @ Career Insight Labs<br/>Jul 14, 2026*\n\n---\n"
    # Find the first H1 title and insert subtitle after it
    content = re.sub(r'(# .*?\n)', r'\1' + subtitle, content, count=1)
    
    with open(dest_path, 'w', encoding='utf-8') as f:
        f.write(content.strip() + '\n')
        
    print(f"Processed {filename}")

for filename in FILES:
    process_file(filename)
