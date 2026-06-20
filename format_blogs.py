import os
import re
import shutil

source_dir = "/Users/hermanteng/Documents/Projects/2026/6_Jun/Blog-writing/Career_Articles"
target_dir = "/Users/hermanteng/Documents/Projects/2026/6_Jun/AI-Resume-Builder-SaaS/src/content/blog"

files_to_copy = [
    "31-AI-Skills-on-Your-Resume-Are-No-Longer-Optional-How-to-Position-Yourself-for-the.md",
    "32-Entry-Level-Tech-Jobs-Are-Disappearing-What-New-Grads-Must-Do-Differently-in-202.md"
]

for f in files_to_copy:
    with open(os.path.join(source_dir, f), "r") as infile:
        content = infile.read()
    
    # Strip YAML frontmatter
    content = re.sub(r'^---\n.*?---\n+', '', content, flags=re.DOTALL)
    
    lines = content.split('\n')
    title_line = ""
    rest_of_content = []
    
    for i, line in enumerate(lines):
        if line.startswith("# "):
            title_line = line
            rest_of_content = lines[i+1:]
            break
            
    while rest_of_content and rest_of_content[0].strip() == "":
        rest_of_content.pop(0)
        
    if rest_of_content and rest_of_content[0].strip() == "---":
        rest_of_content.pop(0)
        
    while rest_of_content and rest_of_content[0].strip() == "":
        rest_of_content.pop(0)
        
    new_content = [
        title_line,
        "",
        "> *Senior Tech Recruiter @ Career Insight Labs<br/>Jun 19, 2026*",
        "",
        "---",
        ""
    ] + rest_of_content
    
    with open(os.path.join(target_dir, f), "w") as outfile:
        outfile.write("\n".join(new_content))

# Copy images
os.makedirs("/Users/hermanteng/Documents/Projects/2026/6_Jun/AI-Resume-Builder-SaaS/public/blog-images", exist_ok=True)
shutil.copy("/Users/hermanteng/.gemini/antigravity-cli/brain/51ed0cbe-faeb-45ab-9074-688607348341/ai_skills_resume_1781922086457.jpg", "/Users/hermanteng/Documents/Projects/2026/6_Jun/AI-Resume-Builder-SaaS/public/blog-images/ai_skills_resume.jpg")
shutil.copy("/Users/hermanteng/.gemini/antigravity-cli/brain/51ed0cbe-faeb-45ab-9074-688607348341/entry_level_tech_1781922095219.jpg", "/Users/hermanteng/Documents/Projects/2026/6_Jun/AI-Resume-Builder-SaaS/public/blog-images/entry_level_tech.jpg")
