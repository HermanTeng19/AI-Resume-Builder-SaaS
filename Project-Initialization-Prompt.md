# AI-Resume-Builder-SaaS 初始启动 Prompt

当你准备在一个全新目录下启动项目时，请将以下指令发送给 Agent (如 Antigravity / Cursor 等)，它已经包含了技术栈规范、SaaS 工具架构以及与 SEO 内容创作分离（独立 `/blog` 路由）的最佳实践要求。

---

```markdown
<USER_REQUEST>
你好！我现在要启动一个名为 "AI-Resume-Builder-SaaS" 的新项目。目标是构建一个低成本、高转化、SEO 友好的在线简历润色与生成 Web App。

我已经将项目的核心战略和执行计划保存在了当前目录中。请你作为首席工程师，执行以下操作：

1. **阅读战略文档**：请立刻使用相关工具读取并仔细分析当前目录下的两个文件：
   - `AI-Resume-Builder-SaaS-Execution-Plan.md`
   - `AdSense-Approval-Strategy.md`

2. **技术栈确认与前端路由规划**：
   基于我们的【阶段一：纯静态单页应用 MVP (0 服务器成本)】策略，本项目将采用纯前端架构。
   - **工具端**：我们需要支持左侧简历信息/参数编辑，右侧实时渲染 HTML 并支持一键导出 PDF。
   - **内容端 (SEO 策略)**：根据 AdSense 审批策略，我们需要“项目构建与内容创作分离”。请确保你的技术选型（如 Vite + React/Vanilla JS）能够完美支持前端路由（如 React Router）。
   请推荐最适合这种“复杂状态管理工具 + SEO 内容博客”组合的前端技术栈。

3. **初始化与项目骨架搭建**：
   在明确技术栈后，请在这个当前目录 (`AI-Resume-Builder-SaaS`) 中直接执行项目初始化命令，并为我构建出 MVP 版本的最小核心代码骨架：
   
   【路由 1：主应用 `/`】
   - 构建一个带分栏布局的主编辑界面骨架。
   - 包含大模型 API Key 本地存储 (LocalStorage) 逻辑的基础设置模块 (BYOK模式)。
   
   【路由 2：博客引擎 `/blog`】
   - 为我配置一个基础的静态博客路由和目录结构（例如 `/src/content/blog/`），并集成 Markdown 解析引擎（如 `marked` 或 `react-markdown`）。
   - 目标是：未来我用 Claude 写出标准的 `.md` 软文和博客后，只要拖进这个文件夹，网站就能自动渲染生成 `/blog/article-name` 页面，为获取 Google AdSense 铺路。

阅读完毕后，请给我输出一份简要的技术选型确认和首日的 Coding 冲刺计划，确认无误后我们就开始动手写代码！
</USER_REQUEST>
```
