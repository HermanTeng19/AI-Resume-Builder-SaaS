import os
import re
from datetime import datetime

SOURCE_DIR = "/Users/hermanteng/Documents/Projects/2026/6_Jun/Blog-writing/Career_Articles"
DEST_DIR = "/Users/hermanteng/Documents/Projects/2026/6_Jun/AI-Resume-Builder-SaaS/src/content/blog"

files_to_process = [
    "42-AI-Skills-Are-Now-More-Valuable-Than-Experience-71-of-Employers-Agree-Heres-Your.md",
    "43-The-Rent-Dont-Buy-Lie-What-Nobody-Tells-You-About-Contract-Work-in-Tech.md",
    "44-75-of-Tech-Hiring-Managers-Are-Shifting-to-Contract-Workers-Heres-How-to-Make-th.md",
    "45-Product-Management-Hiring-Rebound-Inside-the-2025-PM-Job-Market-Surge-and-How-to.md",
    "46-2026-Tech-Hiring-AI-Cloud-Cybersecurity-Jobs-Salaries.md"
]

current_date = datetime.now().strftime("%b %d, %Y")
subtitle = f"\n> *Senior Tech Recruiter @ Career Insight Labs<br/>{current_date}*\n"

for filename in files_to_process:
    src_path = os.path.join(SOURCE_DIR, filename)
    dest_path = os.path.join(DEST_DIR, filename)
    
    with open(src_path, 'r', encoding='utf-8') as f:
        content = f.read()
        
    # 1. Remove YAML
    content = re.sub(r"^---\n.*?\n---\n", "", content, flags=re.DOTALL)
    
    # 2. Add subtitle under the first H1
    if not re.search(r"> \*Senior Tech Recruiter", content):
        content = re.sub(r"^(# .+?\n)", r"\1" + subtitle + "\n", content, count=1, flags=re.MULTILINE)
        
    # 3. Strip out HTML blocks at the end
    content = re.sub(r"<script>.*?</script>", "", content, flags=re.DOTALL | re.IGNORECASE)
    content = re.sub(r"<title>.*?</title>", "", content, flags=re.DOTALL | re.IGNORECASE)
    content = re.sub(r"<meta.*?>", "", content, flags=re.DOTALL | re.IGNORECASE)
    
    with open(dest_path, 'w', encoding='utf-8') as f:
        f.write(content.strip() + "\n")
        
    print(f"Processed: {filename}")
