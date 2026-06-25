import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const blogDir = path.join(__dirname, '../src/content/blog');
const publicDir = path.join(__dirname, '../public');

if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

const files = fs.readdirSync(blogDir).filter(f => f.endsWith('.md'));

const articles = files.map(filename => {
  const slug = filename.replace('.md', '');
  const content = fs.readFileSync(path.join(blogDir, filename), 'utf-8');
  
  const match = content.match(/^#\s+(.*)/m);
  const title = match ? match[1] : slug;
  
  const dateMatch = content.match(/<br\/>(.*?)\*/);
  const date = dateMatch ? dateMatch[1].trim() : 'Unknown';
  
  const words = content.trim().split(/\s+/).length;
  const readingTime = Math.max(1, Math.ceil(words / 200));
  
  const previewText = content
    .replace(/^#.*\n/m, '')
    .replace(/^>.*$/gm, '')
    .replace(/---/g, '')
    .replace(/<[^>]+>/g, '')
    .replace(/[#*_>]/g, '')
    .replace(/^\s*[\r\n]/gm, '')
    .trim()
    .substring(0, 140) + '...';
    
  return { slug, title, previewText, date, readingTime };
}).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

fs.writeFileSync(path.join(publicDir, 'articles.json'), JSON.stringify(articles, null, 2));
console.log(`Generated articles.json with ${articles.length} articles.`);
