# Agent Behavioral Rules for AI-Resume-Builder-SaaS

## 1. Image & Asset Sourcing Preference
When acquiring visual assets (such as blog covers, UI placeholders, or article images), prioritize using high-quality, real-world royalty-free images (e.g., via Unsplash search). Use AI image generation (`generate_image`) ONLY as a fallback or when the content explicitly demands a highly abstract, futuristic, or specialized visual that cannot be found in real photos. 

## 2. Markdown File Cleanliness
Whenever formatting, editing, or publishing Markdown documents (especially blog posts), always actively check for and strip out residual or SEO-related HTML tags (such as `<script>`, `<title>`, `<meta>`) embedded at the end of the file. Ensure the final output remains clean, pure Markdown.
