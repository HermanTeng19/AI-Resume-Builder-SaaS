import os
import re

SITEMAP = "/Users/hermanteng/Documents/Projects/2026/6_Jun/AI-Resume-Builder-SaaS/public/sitemap.xml"
IMAGEMAP = "/Users/hermanteng/Documents/Projects/2026/6_Jun/AI-Resume-Builder-SaaS/src/content/imageMap.ts"

articles = [
    "42-AI-Skills-Are-Now-More-Valuable-Than-Experience-71-of-Employers-Agree-Heres-Your",
    "43-The-Rent-Dont-Buy-Lie-What-Nobody-Tells-You-About-Contract-Work-in-Tech",
    "44-75-of-Tech-Hiring-Managers-Are-Shifting-to-Contract-Workers-Heres-How-to-Make-th",
    "45-Product-Management-Hiring-Rebound-Inside-the-2025-PM-Job-Market-Surge-and-How-to",
    "46-2026-Tech-Hiring-AI-Cloud-Cybersecurity-Jobs-Salaries"
]

images = {
    "44-75-of-Tech-Hiring-Managers-Are-Shifting-to-Contract-Workers-Heres-How-to-Make-th": "https://images.unsplash.com/photo-1521791136064-7986c2920216?w=800&q=80",
    "45-Product-Management-Hiring-Rebound-Inside-the-2025-PM-Job-Market-Surge-and-How-to": "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&q=80",
    "46-2026-Tech-Hiring-AI-Cloud-Cybersecurity-Jobs-Salaries": "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&q=80"
}

# Update sitemap
with open(SITEMAP, 'r') as f:
    sitemap_content = f.read()

urls_to_add = ""
for article in articles:
    url_tag = f"    <url>\n        <loc>https://careerinsightlabs.com/blog/{article}</loc>\n        <changefreq>monthly</changefreq>\n        <priority>0.7</priority>\n    </url>\n"
    if f"<loc>https://careerinsightlabs.com/blog/{article}</loc>" not in sitemap_content:
        urls_to_add += url_tag

if urls_to_add:
    sitemap_content = sitemap_content.replace("</urlset>", f"{urls_to_add}</urlset>")
    with open(SITEMAP, 'w') as f:
        f.write(sitemap_content)
    print("Updated sitemap.xml")

# Update imageMap
with open(IMAGEMAP, 'r') as f:
    imagemap_content = f.read()

entries_to_add = ""
for article, img_url in images.items():
    if f"'{article}'" not in imagemap_content:
        entries_to_add += f"  '{article}': '{img_url}',\n"

if entries_to_add:
    imagemap_content = imagemap_content.replace("};", f"{entries_to_add}}};")
    with open(IMAGEMAP, 'w') as f:
        f.write(imagemap_content)
    print("Updated imageMap.ts")
