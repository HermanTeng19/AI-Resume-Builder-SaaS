import os
import re
from datetime import date

src_dir = '/Users/hermanteng/Documents/Projects/2026/6_Jun/Blog-writing/Career_Articles'
dest_dir = '/Users/hermanteng/Documents/Projects/2026/6_Jun/AI-Resume-Builder-SaaS/src/content/blog'

files = [
    '42-AI-Skills-Are-Now-More-Valuable-Than-Experience-71-of-Employers-Agree-Heres-Your.md',
    '43-The-Rent-Dont-Buy-Lie-What-Nobody-Tells-You-About-Contract-Work-in-Tech.md'
]

today = date.today().isoformat()
subtitle = f"> *Senior Tech Recruiter @ Career Insight Labs<br/>{today}*"

def process_file(filename):
    with open(os.path.join(src_dir, filename), 'r') as f:
        content = f.read()

    # Remove YAML frontmatter
    content = re.sub(r'^---\n.*?\n---\n', '', content, flags=re.DOTALL)
    
    # Remove HTML at the end (match ```html ... ``` or just trailing HTML tags)
    content = re.sub(r'```html\n?.*?```\s*$', '', content, flags=re.DOTALL)
    content = re.sub(r'<title>.*?</title>', '', content, flags=re.DOTALL)
    content = re.sub(r'<meta.*?>', '', content)
    content = re.sub(r'<script.*?</script>', '', content, flags=re.DOTALL)
    
    # Clean up empty lines at the end
    content = content.strip() + '\n'
    
    # Insert subtitle after the first # H1 heading
    def insert_subtitle(match):
        return match.group(0) + '\n\n' + subtitle
        
    content = re.sub(r'^#\s.*$', insert_subtitle, content, count=1, flags=re.MULTILINE)
    
    with open(os.path.join(dest_dir, filename), 'w') as f:
        f.write(content)

for filename in files:
    process_file(filename)

print("Processed files successfully")
