# Charlotte, NC - Frontend/Fullstack Job Board

## I. Core Concept

A hyper-focused platform connecting software engineers (frontend & fullstack) with job opportunities exclusively in Charlotte, NC. The "micro" aspect means we prioritize quality and relevance over quantity. AI will be layered on to enhance user experience and provide intelligent features.

## II. Key Features (Phased Approach)

### Phase 1: Minimum Viable Product (MVP) - The Core Job Board

1.  **Job Listings Display:**
    - Homepage shows a list of recent job postings.
    - Each listing shows: Job Title, Company, Location (Charlotte area), Brief Description, Date Posted.
    - Get list of companies from Coresignal (maybe?), then scrape company websites for jobs?
2.  **Job Detail View:**
    - Clicking a job shows full details: full description, responsibilities, qualifications, company info, how to apply (link to external site or email).
3.  **Basic Search & Filtering:**
    - Search by keywords (e.g., "React", "Senior", "Node.js").
    - Filter by:
      - Experience Level (Entry, Mid, Senior)
      - Job Type (Full-time, Contract)
      - Specific skills/technologies (e.g., "TypeScript", "AWS")
4.  **Manual Job Posting (Admin):**
    - Initially, admin will add jobs.
5.  **Responsive Design:**
    - Works well on desktop and mobile.

### Phase 2: AI Integration & User Accounts

1.  **User Accounts (Job Seekers):**
    - Sign up/Login.
    - Profile with resume upload.
    - Save favorite jobs.
    - Track applications.
2.  **AI - Smart Matching:**
    - AI parses uploaded resumes and suggests relevant jobs.
    - AI analyzes job descriptions to extract key skills, experience levels.
3.  **AI - Salary Estimation:**
    - For listings without a salary, AI predicts a range.
4.  **AI - Enhanced Search:**
    - Natural language search queries.

### Phase 3: Advanced Features & Polish

1.  **Employer Accounts:**
    - Companies can post jobs directly.
    - AI assistance for job descriptions.
2.  **Application Tracking (Optional).**
3.  **Charlotte Tech Market Insights:**
    - AI-generated stats.
4.  **Notifications:**
    - Email alerts for new jobs.
5.  **AI - Coresignal MCP:**
    - AI-generated job insights, company insights, job search?

## III. Proposed Tech Stack

- **Frontend:** React with Vite (TypeScript)
  - Styling: Tailwind CSS
  - State Management: Zustand or Redux Toolkit
  - Routing: React Router
- **Backend:** Python with FastAPI (Alternative: Node.js with Express.js)
- **Database:** PostgreSQL
- **AI Components:**
  - OpenAI API or Hugging Face Transformers + spaCy.
  - Data Scraping: BeautifulSoup, Requests/Scrapy (if needed).
- **Deployment:**
  - Frontend: Vercel or Netlify
  - Backend & DB: Railway.app, Heroku, or AWS/Google Cloud.

## Other Ideas

- Highlight companies that have recently listed jobs on main page
- Community forum to help people connect. Job seekers, recruiters, companies, etc
- some way to manage events
