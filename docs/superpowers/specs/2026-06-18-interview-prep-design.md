# Interview Prep Guide - Design Specification

## 1. Overview
**Feature:** A new AI-driven tool to generate highly targeted interview preparation guides.
**Goal:** Expand the platform beyond resume building into interview success. The feature will use the existing BYOK (Bring Your Own Key) architecture to parse a user's resume and target Job Description (JD), plus any user-specified "confusing points", to output a comprehensive, customizable interview survival guide.

## 2. Architecture & Routing
* **New Route:** `/interview-prep` (added to `App.tsx` inside `MainLayout`).
* **Component Structure:**
  * `pages/InterviewPrep.tsx`: The main container managing the state.
  * Internal Wizard states: 
    * `Step 1: Configuration (Input Form)`
    * `Step 2: Generation (Loading)`
    * `Step 3: Result (Immersive Markdown Reader)`
* **Navigation:** Added to the main navbar and landing page CTA.

## 3. UI/UX Design (Wizard Approach)
**Step 1: Configuration**
* **Resume Input:** File upload button (PDF/Word) using existing `pdfjs` and `mammoth` local extraction tools.
* **JD Input:** A large text area to paste the Job Description.
* **JD Clarification (New Feature):** An *optional* text area where users can paste specific skillsets, qualifications, or accountabilities from the JD that confuse them. 
  * *Help text:* "Not sure what 'Kubernetes orchestration' or 'Cross-functional agile matrix' means? Paste it here and we'll break it down."
* **Module Selection:** Checkboxes to select desired output sections:
  * [x] JD Clarification & Expert Guidance (Dynamic - only if user fills the clarification box)
  * [x] Core Competency Breakdown
  * [x] Resume Deep-Dive & Trap Questions
  * [x] Behavioral Questions (STAR templates)
  * [x] Technical / Domain Specific Questions

**Step 2: Loading State**
* A premium, technology-focused loading animation (e.g., pulsing skeleton or typing effect) to ease the 10-30 seconds LLM generation time.

**Step 3: Immersive Reading**
* The form disappears, replaced by a wide, centered Markdown reader (`ReactMarkdown`).
* **Output Structure:** The result is rendered as a clean, reading-optimized document. If the user provided "confusing points", the guide will feature a dedicated top section titled **"JD Clarification & Deep Dive"** explicitly addressing those points with authoritative, expert-level explanations.

## 4. AI & Prompt Engineering
* **BYOK Engine:** Reuses the established `openai` Node SDK instance and pulls `apiKey` / `baseURL` from `localStorage`.
* **Prompt Assembly:**
  * Base Prompt: "You are an elite FAANG-level executive recruiter and technical interviewer."
  * Context Injection: `[Resume Context]` + `[JD Context]`
  * Dynamic Modules: The prompt dynamically appends instructions based on the checkboxes selected in Step 1.
  * **Clarification Handling:** *Technical Note:* Since this is a 100% client-side tool calling generic LLM endpoints (like OpenAI or DeepSeek), real-time "live web searching" is not natively available unless the specific endpoint supports it. Therefore, the prompt will strictly instruct the LLM to *act as an industry expert, retrieving the most authoritative, up-to-date best practices from its vast training data* to explain the user's confused points in simple, actionable terms.

## 5. State Management
* Local state within `InterviewPrep.tsx`:
  * `step: 1 | 2 | 3`
  * `resumeText: string`
  * `jdText: string`
  * `confusedPoints: string`
  * `selectedModules: string[]`
  * `generatedGuide: string`
  * `isGenerating: boolean`

## 6. Success Criteria
* Users can successfully navigate to the page and generate a guide.
* The UI transitions smoothly between the 3 steps.
* The LLM respects the dynamic prompt and accurately dedicates a section to the "confused points" if provided.
