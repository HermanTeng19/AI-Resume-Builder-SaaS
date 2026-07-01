import os
import re

source_dir = "/Users/hermanteng/Documents/Projects/2026/6_Jun/Blog-writing/Career_Articles"
target_dir = "/Users/hermanteng/Documents/Projects/2026/6_Jun/AI-Resume-Builder-SaaS/src/content/blog"

files_to_process = ["41-AI-Isnt-Coming-for-Your-Job-Its-Coming-for-Your-Boring-Tasks-Heres-How-to-Win.md"]

for filename in files_to_process:
    source_path = os.path.join(source_dir, filename)
    target_path = os.path.join(target_dir, filename)
    
    with open(source_path, "r", encoding="utf-8") as f:
        content = f.read()

    # 1. Remove YAML
    content = re.sub(r"^---\n.*?\n---\n", "", content, flags=re.DOTALL)

    # 2. Add Subtitle after H1
    h1_pattern = r"^(#\s.+)$"
    subtitle = "\n> *By Herman Teng, Ex-FAANG Recruiting Leader*\n"
    content = re.sub(h1_pattern, r"\1\n" + subtitle, content, count=1, flags=re.MULTILINE)

    # 3. Strip HTML at the bottom
    content = re.sub(r"```html\s*<title>.*?</script>\n```\s*$", "", content, flags=re.DOTALL)

    # Clean up any trailing whitespace/newlines
    content = content.strip() + "\n"

    with open(target_path, "w", encoding="utf-8") as f:
        f.write(content)
        
    print(f"Processed {filename}")
