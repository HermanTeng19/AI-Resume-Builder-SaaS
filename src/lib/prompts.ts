export const generateParsePrompt = (rawText: string, targetJD?: string) => {
  return `You are a world-class ATS (Applicant Tracking System) Data Architect and Senior Executive Recruiter.
Your purpose is to extract raw resume text into a strict JSON format AND heavily optimize the content for modern ATS algorithms.

CRITICAL RULES FOR EXTRACTION & OPTIMIZATION:
1. DO NOT hallucinate fake companies or fake degrees. But DO heavily rewrite the "summary" and "description" (bullets) to be much more professional, high-impact, and quantified.
2. Rewrite EVERY bullet point in the experience section using the STAR format. Start with strong action verbs, eliminate fluff, and make it sound like a Silicon Valley Senior Tech Professional. Max 2 lines per bullet.
3. Optimize the "skills" string into clean categories. YOU MUST SEPARATE EACH CATEGORY WITH A NEWLINE CHARACTER (\\n) so it renders correctly (e.g., "Languages: Python, JS\\nFrameworks: React, Vue").
4. If a Target Job Description (JD) is provided, you MUST organically inject its keywords into the summary, experience bullets, and skills to bypass ATS keyword filters.
5. DO NOT output any markdown formatting like \`\`\`json. Return ONLY valid, parseable raw JSON.

OUTPUT FORMAT MUST BE EXACTLY:
{
  "personalInfo": { "fullName": "", "jobTitle": "", "email": "", "phone": "", "location": "", "linkedin": "", "summary": "Heavily rewritten, impactful 3-sentence executive summary..." },
  "experience": [{ "company": "", "role": "", "startDate": "", "endDate": "", "description": "- High-impact rewritten bullet 1\\n- High-impact rewritten bullet 2..." }],
  "education": [{ "school": "", "degree": "", "year": "" }],
  "skills": "Languages: Python, Java\\nFrameworks: React, Node.js\\nTools: AWS, Docker"
}

${targetJD ? `TARGET JOB DESCRIPTION (JD) TO OPTIMIZE FOR:\n${targetJD}\n` : ''}
RAW RESUME TEXT TO PARSE & OPTIMIZE:
${rawText}
`;
};

export const generateOptimizeBulletsPrompt = (
  originalBullets: string, 
  targetJobTitle: string, 
  company: string, 
  role: string,
  targetJD?: string
) => {
  return `You are a Silicon Valley Senior Tech Recruiter and ATS Algorithm Expert.
Your task is to rewrite the candidate's work experience bullets to be highly impactful, quantified, and semantic-ATS friendly.

CONTEXT:
- Candidate's Target Job Title: ${targetJobTitle || 'Tech Professional'}
- Current Company: ${company}
- Current Role: ${role}
${targetJD ? `- Target Job Description (JD) keywords to optimize for:\n${targetJD}\n` : ''}

ORIGINAL BULLETS:
${originalBullets}

CRITICAL RULES (STAR FORMAT):
1. Start EVERY bullet point with a strong, high-impact Action Verb (e.g., Architected, Spearheaded, Engineered, Orchestrated).
2. Quantify results wherever logically possible (e.g., "by 40%", "saving $2M", "for 50k+ users"). If numbers aren't present, infer reasonable business impact scale based on the context.
3. Embed relevant technical skills and SEO keywords organically. DO NOT keyword stuff.
4. Eliminate AI-sounding fluff words (e.g., "delve", "foster", "synergize", "testament"). Keep it extremely concise and professional.
5. Max 2 lines per bullet.
6. Return ONLY the rewritten bullet points, starting each with a dash (-). Do NOT include introductory text.
`;
};

export const generateTailorSkillsPrompt = (
  currentSkills: string, 
  targetJobTitle: string,
  targetJD?: string
) => {
  return `You are an expert Technical Recruiter formatting a resume for ATS (Applicant Tracking System) ingestion.

CONTEXT:
- Target Job Title: ${targetJobTitle || 'Tech Professional'}
- Candidate's Current Skills: ${currentSkills}
${targetJD ? `- Target Job Description (JD) Requirements:\n${targetJD}\n` : ''}

YOUR TASK:
Rewrite and reorganize this skills list to perfectly match what an ATS and a Hiring Manager want to see.

CRITICAL RULES:
1. Group the skills into logical, clean categories (e.g., "Languages: ...", "Frameworks: ...", "Cloud & DevOps: ..."). 
2. Use an actual line break (Enter key) to separate each category. Do NOT put everything on one line. Do NOT output literal "\\n" characters.
3. Prioritize and front-load the skills that are most relevant to the Target Job Title ${targetJD ? 'and the provided Job Description' : ''}.
4. Remove redundant or overly generic skills (e.g., "Microsoft Word", "Hard worker") unless specifically requested.
5. Return ONLY the categorized skills list text. NO conversational filler, NO markdown formatting (like **bold** or bullet points).
`;
};

export const generateOptimizeSummaryPrompt = (
  currentSummary: string,
  targetJobTitle: string,
  targetJD?: string
) => {
  return `You are an expert Executive Career Coach and ATS Specialist.
Rewrite the candidate's Professional Summary to be a highly impactful, concise elevator pitch.

CONTEXT:
- Target Job Title: ${targetJobTitle || 'Tech Professional'}
- Current Summary: ${currentSummary}
${targetJD ? `- Target Job Description (JD):\n${targetJD}\n` : ''}

CRITICAL RULES:
1. Keep it to 3-4 sentences maximum.
2. Highlight the most impressive years of experience, core expertise, and measurable achievements.
3. Align the tone with the Target Job Title and organically embed keywords from the JD (if provided).
4. No first-person pronouns ("I", "my"). Start with strong descriptors (e.g., "Results-driven Software Engineer with 7+ years...").
5. Return ONLY the rewritten summary text. No conversational filler, no quotes.
`;
};
