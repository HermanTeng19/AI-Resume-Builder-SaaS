# 双核并行工作流：AGY (工程) + Claude (内容) 终极策略

在独立开发（Indie Hacking）中，将“工程构建（Antigravity/AGY）”和“内容生产（Claude）”进行物理隔离，是最高效、也是最保护上下文（Context Window）的神级策略。

## 💡 为什么这是一个高杠杆 (High Leverage) 策略？

1. **上下文物理隔离，杜绝大模型幻觉**：
   写代码最怕上下文被污染。如果在 AGY 的环境里塞进十几万字的 SEO 软文，会迅速消耗 Token，甚至导致 Agent 在 Debug 核心代码时“失忆”。让 AGY 保持纯净的“代码脑”，让 Claude 保持“作家脑”。
2. **发挥大模型的最强长板**：
   * **AGY (CTO 首席架构师)**：深入文件系统，擅长操纵命令行、管理 Vercel/GitHub 部署、处理复杂的单页应用逻辑流和组件拆解。
   * **Claude (CMO 首席营销官)**：在长文本生成、硅谷职场语气模仿（Human-like Tone）、排版格式化以及避免“浓重 AI 味”方面处于绝对的业界统治地位。
3. **真正的并行开发 (Parallel Processing)**：
   当 AGY 在终端后台为你跑 `npm install`、搭建路由、或执行线上环境打包部署时，你完全可以无缝切到浏览器端的 Claude，指挥它疯狂输出长篇博客。效率直接翻倍。

---

## 🚀 双线并行的具体执行 SOP (标准作业程序)

### 阶段一：打地基 (Setup)
* **AGY (技术侧)**：
  * 初始化项目（Vite + React/Vanilla），配置好全局的 CSS 系统。
  * **核心任务**：在项目目录中建好内容专属坑位，例如 `/src/content/blog/`。开发一个轻量级的 Markdown 解析引擎（引入 `marked.js` 或 `react-markdown`），让网站能够自动读取该文件夹下的 `.md` 文件并直接渲染为网页。
* **Claude (内容侧)**：
  * 调用准备好的 `Claude-Content-Creation-Prompt.md`，化身北美 Tech Recruiter 进行长尾关键词调研。
  * 确立统一的 **Frontmatter（前置元数据）标准**。约束 Claude：“以后输出的文章，顶部必须包含标准的 yaml 格式（`title`, `date`, `description`, `seo_keywords`, `slug`）”。

### 阶段二：量产与自动化渲染 (Production & Rendering)
* **Claude (内容侧)**：
  * 疯狂产出纯粹的 Markdown 格式文章。
  * 你只需将生成的文章保存为 `.md` 文件（如 `how-to-beat-ats.md`），直接无脑扔进本地的 `/src/content/blog/` 文件夹。
* **AGY (技术侧)**：
  * 开发并设计单篇文章的详情页 UI（Article Detail Page）。
  * 开发博客列表页（Blog List Page），编写脚本自动遍历 `/blog/` 目录，提取 Frontmatter 摘要生成文章卡片。

### 阶段三：SEO 闭环融合 (SEO Integration)
* **Claude (内容侧)**：
  * 针对写好的每篇文章，专门生成高度精准的 HTML `<title>`, `<meta description>` 以及结构化 Schema.org `JSON-LD` 文本块。
* **AGY (技术侧)**：
  * 编写代码逻辑（如使用 React Helmet），在用户切换页面时，动态将 Claude 写好的 SEO Meta Tags 和 JSON-LD 无缝注入到 HTML 的 `<head>` 中。
  * 编写自动化脚本，每次打包时自动生成整站最新的 `sitemap.xml`。

---

### 📝 最终形态：拥有自驱 CMS 的轻量级 SaaS
你的分工极其明确：**Claude 负责产出带标准格式的 `.md` 弹药，而 AGY 负责打造一个完美发射这些弹药的代码容器。**

此架构落成后，你的应用将具备极强的扩展性（Scalability）。未来你甚至不需要改动任何一行代码，只要让 Claude 每天写一篇新 Markdown 扔进文件夹，再 `git push`，Vercel 就会自动打包发布。属于你个人的自动化流量与变现飞轮，就此开始转动！
