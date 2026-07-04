import type { ProjectAnalyzerGeneratedData } from "../types";

export const resumeJdMatcherGenerated = {
  "projectId": "resume-jd-matcher",
  "metadata": {
    "generatedAt": "2026-07-04T08:32:30.477Z",
    "source": "project-snapshots",
    "projectId": "resume-jd-matcher",
    "rootDir": "project-snapshots/resume-jd-matcher",
    "fileCount": 7,
    "folderCount": 1,
    "includedFileCount": 7,
    "skippedFileCount": 0
  },
  "tree": [
    {
      "name": "ROOT",
      "path": "",
      "type": "folder",
      "children": [
        {
          "name": ".gitignore",
          "path": ".gitignore",
          "type": "file"
        },
        {
          "name": "app.py",
          "path": "app.py",
          "type": "file"
        },
        {
          "name": "llm_client.py",
          "path": "llm_client.py",
          "type": "file"
        },
        {
          "name": "parser.py",
          "path": "parser.py",
          "type": "file"
        },
        {
          "name": "prompts.py",
          "path": "prompts.py",
          "type": "file"
        },
        {
          "name": "README.md",
          "path": "README.md",
          "type": "file"
        },
        {
          "name": "requirements.txt",
          "path": "requirements.txt",
          "type": "file"
        }
      ]
    }
  ],
  "entries": {
    "": {
      "path": "",
      "type": "folder",
      "title": "ROOT",
      "summary": "自动生成的文件夹条目：ROOT。可以在 manual analysis 中补充该模块的职责说明。",
      "generated": true,
      "review": {
        "status": "generated",
        "source": "generated"
      }
    },
    ".gitignore": {
      "path": ".gitignore",
      "type": "file",
      "title": ".gitignore",
      "summary": "自动生成的文件条目：.gitignore。可以在 manual analysis 中补充该文件的作用说明。",
      "language": "plaintext",
      "sizeBytes": 426,
      "generated": true,
      "review": {
        "status": "generated",
        "source": "generated"
      },
      "code": "# Secrets — never commit\n.env\n.env.local\n\n# Local plan notes (not for the repo)\nresume_job_matcher_mvp*\n*.pem\n\n# Python\n__pycache__/\n*.py[cod]\n*$py.class\n*.so\n.Python\nbuild/\ndist/\n*.egg-info/\n.eggs/\n\n# Virtual environments\n.venv/\nvenv/\nenv/\n\n# Streamlit\n.streamlit/secrets.toml\n\n# IDE / editor\n.vscode/\n.idea/\n*.swp\n*.swo\n*~\n\n# OS\n.DS_Store\nThumbs.db\n\n# Logs and local test artifacts\n*.log\n.pytest_cache/\n.coverage\nhtmlcov/\n"
    },
    "README.md": {
      "path": "README.md",
      "type": "file",
      "title": "README.md",
      "summary": "自动生成的文件条目：README.md。可以在 manual analysis 中补充该文件的作用说明。",
      "language": "markdown",
      "sizeBytes": 3094,
      "generated": true,
      "review": {
        "status": "generated",
        "source": "generated"
      },
      "code": "# AI Resume–Job Matcher\n\nA beginner-friendly Streamlit app that compares your resume (PDF) against a job description and produces a structured Markdown matching report using the [DeepSeek API](https://api-docs.deepseek.com/).\n\n## Features\n\n- Upload a PDF resume and paste a job description\n- Extract text from the PDF in memory (no files saved to disk)\n- Generate a 9-section report: match score, requirement mapping, gaps, bullet rewrites, ATS keywords, tailored profile, and action plan\n- Download the report as Markdown\n\n## Prerequisites\n\n- Python 3.10 or newer\n- A [DeepSeek API key](https://platform.deepseek.com/api_keys)\n\n## Setup\n\n### 1. Clone or open the project\n\n```bash\ncd /path/to/Resume-JD-Matching\n```\n\n### 2. Create a virtual environment\n\n**Windows (PowerShell / CMD):**\n\n```bash\npython -m venv .venv\n.venv\\Scripts\\activate\n```\n\n**macOS / Linux (WSL):**\n\n```bash\npython3 -m venv .venv\nsource .venv/bin/activate\n```\n\n### 3. Install dependencies\n\n```bash\npip install -r requirements.txt\n```\n\n### 4. Configure your API key\n\nCopy the example env file and add your key:\n\n**Windows:**\n\n```bash\ncopy .env.example .env\n```\n\n**macOS / Linux:**\n\n```bash\ncp .env.example .env\n```\n\nEdit `.env` and set:\n\n```env\nDEEPSEEK_API_KEY=your_actual_key_here\n```\n\nNever commit `.env` — it is listed in `.gitignore`.\n\n## Run the app\n\n```bash\nstreamlit run app.py\n```\n\nOpen the URL shown in the terminal (usually http://localhost:8501).\n\n## Usage\n\n1. Upload your resume as a **PDF** (text-based PDFs work best; scanned/image-only PDFs may fail).\n2. Paste the full **job description** into the text area.\n3. Click **Analyze** and wait for the report (this calls the DeepSeek API and may take a minute).\n4. Optionally **Download report (.md)** to save the result.\n\n## Project structure\n\n| File | Role |\n|------|------|\n| `app.py` | Streamlit UI and workflow orchestration |\n| `parser.py` | PDF → plain text via `pypdf` |\n| `prompts.py` | System prompt and user message template |\n| `llm_client.py` | DeepSeek chat API (OpenAI-compatible SDK) |\n| `requirements.txt` | Python dependencies |\n| `.env.example` | Template for API key (copy to `.env`) |\n\n## Model configuration\n\nBy default the app uses `deepseek-v4-pro` via `https://api.deepseek.com`. You can change the model in `llm_client.py` (e.g. to `deepseek-v4-flash` for faster, lower-cost responses). See the [DeepSeek API docs](https://api-docs.deepseek.com/) for details.\n\n## Troubleshooting\n\n| Problem | What to try |\n|---------|-------------|\n| API key warning in sidebar | Ensure `.env` exists with `DEEPSEEK_API_KEY=...` (not the placeholder `your_api_key_here`) |\n| Invalid API key | Verify the key at [DeepSeek Platform](https://platform.deepseek.com/) |\n| Could not extract text from PDF | Use a text-based PDF, not a scan; re-export from Word/Google Docs as PDF |\n| Rate limit exceeded | Wait a few minutes and retry |\n| Empty or cut-off report | Increase `max_tokens` in `llm_client.py` if the job description is very long |\n\n## Security\n\n- Keep your API key in `.env` only\n- Do not commit `.env` or share keys in chat or screenshots\n"
    },
    "app.py": {
      "path": "app.py",
      "type": "file",
      "title": "app.py",
      "summary": "自动生成的文件条目：app.py。可以在 manual analysis 中补充该文件的作用说明。",
      "language": "python",
      "sizeBytes": 2459,
      "generated": true,
      "review": {
        "status": "generated",
        "source": "generated"
      },
      "code": "import streamlit as st\n\nfrom llm_client import (\n    LLMError,\n    MissingAPIKeyError,\n    generate_match_report,\n    get_api_key,\n)\nfrom parser import PDFExtractionError, extract_text_from_pdf\n\nst.set_page_config(page_title=\"AI Resume-Job Matcher\", layout=\"wide\")\n\nst.title(\"AI Resume-Job Matcher\")\nst.caption(\"Upload your resume and paste a job description to get a tailored matching report.\")\n\nwith st.sidebar:\n    st.header(\"Setup\")\n    st.markdown(\n        \"This tool uses the [DeepSeek API](https://api-docs.deepseek.com/). \"\n        \"Enter your own API key below — get one for free at \"\n        \"[platform.deepseek.com](https://platform.deepseek.com/api_keys).\"\n    )\n    user_api_key = st.text_input(\n        \"DeepSeek API Key\",\n        type=\"password\",\n        placeholder=\"sk-...\",\n        help=\"Your key is only used this session and never stored.\",\n    )\n    st.caption(\"No key on hand? The server may provide a fallback if configured.\")\n\nuploaded_file = st.file_uploader(\"Upload your resume (PDF)\", type=[\"pdf\"])\njob_description = st.text_area(\"Paste the job description\", height=200)\nanalyze_clicked = st.button(\"Analyze\", type=\"primary\")\n\nif analyze_clicked:\n    if uploaded_file is None:\n        st.error(\"Please upload a PDF resume before analyzing.\")\n        st.stop()\n    \n    jd = job_description.strip()\n    if not jd:\n        st.error(\"Please paste a job description before analyzing.\")\n        st.stop()\n    \n    if not user_api_key and not get_api_key():\n        st.error(\n            \"No API key configured. Enter your DeepSeek API key in the sidebar, \"\n            \"or set DEEPSEEK_API_KEY on the server.\"\n        )\n        st.stop()\n\n    try:\n        resume_text = extract_text_from_pdf(uploaded_file.read())\n    except PDFExtractionError as e:\n        st.error(str(e))\n        st.stop()\n\n    with st.spinner(\"Analyzing resume against job description...\"):\n        try:\n            report = generate_match_report(resume_text, jd, api_key=user_api_key or None)\n        except MissingAPIKeyError as e:\n            st.error(str(e))\n            st.stop()\n        except LLMError as e:\n            st.error(f\"Analysis failed: {e}. Check your API key and try again.\")\n            st.stop()\n    \n    st.markdown(\"## Report\")\n    st.markdown(report, unsafe_allow_html=False)\n    st.download_button(\n        label=\"Download report (.md)\",\n        data=report,\n        file_name=\"resume_match_report.md\",\n        mime=\"text/markdown\"\n    )\n"
    },
    "llm_client.py": {
      "path": "llm_client.py",
      "type": "file",
      "title": "llm_client.py",
      "summary": "自动生成的文件条目：llm_client.py。可以在 manual analysis 中补充该文件的作用说明。",
      "language": "python",
      "sizeBytes": 2493,
      "generated": true,
      "review": {
        "status": "generated",
        "source": "generated"
      },
      "code": "import os\n\nfrom dotenv import load_dotenv\nfrom openai import APIError, AuthenticationError, RateLimitError, OpenAI\n\nfrom prompts import SYSTEM_PROMPT, build_user_prompt\n\nload_dotenv() # reads .env in project root\n\nDEEPSEEK_BASE_URL = \"https://api.deepseek.com\"\nDEEPSEEK_MODEL = \"deepseek-v4-pro\"\n\nclass LLMError(Exception):\n    \"\"\"Raised when the DeepSeek API call fails.\"\"\"\n\nclass MissingAPIKeyError(Exception):\n    \"\"\"Raised when DEEPSEEK_API_KEY is missing or still the placeholder.\"\"\"\n\ndef get_api_key() -> str | None:\n    # Try Streamlit secrets first (for Streamlit Cloud deployment)\n    try:\n        import streamlit as st\n        key = st.secrets.get(\"DEEPSEEK_API_KEY\", None)\n        if key and key.strip() != \"\" and key != \"your_api_key_here\":\n            return key\n    except (ImportError, AttributeError):\n        pass\n\n    # Fall back to environment variable (for local dev with .env)\n    key = os.getenv(\"DEEPSEEK_API_KEY\")\n    if not key or key.strip() == \"\" or key == \"your_api_key_here\":\n        return None\n    return key\n\ndef generate_match_report(\n    resume_text: str, job_description: str, api_key: str | None = None\n) -> str:\n    # Use user-provided key first, then fall back to server-side secrets / env\n    effective_key = api_key or get_api_key()\n    if not effective_key:\n        raise MissingAPIKeyError(\n            \"No API key configured. Enter your DeepSeek API key in the sidebar, \"\n            \"or set DEEPSEEK_API_KEY on the server.\"\n        )\n\n    client = OpenAI(api_key=effective_key, base_url=DEEPSEEK_BASE_URL)\n\n    try:\n        response = client.chat.completions.create(\n            model=DEEPSEEK_MODEL,\n            messages=[\n                {\"role\": \"system\", \"content\": SYSTEM_PROMPT},\n                {\"role\": \"user\", \"content\": build_user_prompt(resume_text, job_description),}\n            ],\n            temperature=0.3,\n            max_tokens=8192,\n            extra_body={\"thinking\": {\"type\": \"disabled\"}}\n        )\n    except AuthenticationError as e:\n        raise LLMError(\"Invalid API key. Check that you entered a valid DeepSeek API key.\") from e\n    except RateLimitError as e:\n        raise LLMError(\"Rate limit exceeded. Please try again in a few minutes.\") from e\n    except APIError as e:\n        raise LLMError(f\"Analysis failed: {e.message}\") from e\n    \n    content = response.choices[0].message.content\n    if not content:\n        raise LLMError(\"The model returned an empty response. Please try again.\")\n    \n    return content\n"
    },
    "parser.py": {
      "path": "parser.py",
      "type": "file",
      "title": "parser.py",
      "summary": "自动生成的文件条目：parser.py。可以在 manual analysis 中补充该文件的作用说明。",
      "language": "python",
      "sizeBytes": 717,
      "generated": true,
      "review": {
        "status": "generated",
        "source": "generated"
      },
      "code": "from io import BytesIO\nfrom pypdf import PdfReader\n\nclass PDFExtractionError(Exception):\n    \"\"\"Raised when the PDF cannot be read or has no extractable text.\"\"\"\n\ndef extract_text_from_pdf(pdf_bytes: bytes) -> str:\n    MSG = \"Could not extract text from the PDF. The file may be corrupted or image-only.\"\n\n    try:\n        reader = PdfReader(BytesIO(pdf_bytes))\n        parts = []\n        for page in reader.pages:\n            text = page.extract_text()\n            if text:\n                parts.append(text)\n        full_text = \"\\n\".join(parts).strip()\n    except Exception as e:\n        raise PDFExtractionError(MSG) from e\n    \n    if not full_text:\n        raise PDFExtractionError(MSG)\n    \n    return full_text"
    },
    "prompts.py": {
      "path": "prompts.py",
      "type": "file",
      "title": "prompts.py",
      "summary": "自动生成的文件条目：prompts.py。可以在 manual analysis 中补充该文件的作用说明。",
      "language": "python",
      "sizeBytes": 3234,
      "generated": true,
      "review": {
        "status": "generated",
        "source": "generated"
      },
      "code": "\"\"\"Prompt templates for resume–job description matching analysis.\"\"\"\n\nSYSTEM_PROMPT = \"\"\"You are an expert resume–job description matching analyst.\n\nYour task is to compare the candidate's resume against the job description and produce a structured matching report.\n\nRules:\n- Use only information present in the resume as evidence. Do not invent jobs, employers, skills, degrees, certifications, or metrics.\n- If the job description requires something not supported by the resume, mark it as missing or weak explicitly.\n- When rewriting bullets, preserve factual meaning; improve clarity, impact, and alignment with the job description only.\n- Give practical, actionable advice. Output clean Markdown only (no HTML).\n- Language: Detect the primary language of the RESUME (not the job description).\n  - If the resume is primarily in English, write the entire report in English (all section headings, tables, bullets, and advice).\n  - If the resume is primarily in Chinese, write the entire report in 简体中文 (translate the section headings below into Chinese, e.g. 「1. 整体匹配度」).\n  - Do not mix languages in the report except when quoting original resume text.\n\nOutput exactly 9 sections below, in this order, using these headings (use the English headings for English reports; use equivalent Chinese headings for Chinese reports). Do not add extra sections or skip any.\n\n## 1. Overall Match\n- **Score:** X/100\n- **Summary:** Brief paragraph explaining the score and overall fit.\n\n## 2. JD Key Requirements\nGroup requirements by category (e.g. Technical skills, Experience, Education, Soft skills). Use bullets and sub-bullets.\n\n## 3. Resume Evidence Mapping\n| JD Requirement | Resume Evidence | Match Level | Notes |\n| --- | --- | --- | --- |\nInclude one row per important job requirement. Match Level must be one of: Strong, Partial, None.\n\n## 4. Missing or Weak Skills\n| Skill / Requirement | Status | Recommendation |\n| --- | --- | --- |\nStatus must be Missing or Weak. Include actionable recommendations.\n\n## 5. Recommended Project Order\nNumbered list (3-6 items). For each item: which project or experience to highlight first and why it matters for this role.\n\n## 6. Bullet Rewrites\nProvide 3-6 rewrites for resume bullets that matter most for this job. For each:\n**Original:** (quote or paraphrase from resume)\n**Improved:** (rewritten bullet)\n**Why:** (brief reason)\n\n## 7. ATS Keywords\nBulleted list of keywords and phrases from the job description that should appear on the resume. Note which are already covered vs still missing.\n\n## 8. Tailored Profile\n2-4 lines suitable for a resume summary or LinkedIn About section, tailored to this job only.\n\n## 9. Final Action Plan\n3-5 numbered, concrete steps the candidate should take next to improve their application for this role.\n\"\"\"\n\n\ndef build_user_prompt(resume_text: str, job_description: str) -> str:\n    \"\"\"Wrap resume and job description for the user message.\"\"\"\n    return f\"\"\"Analyze how well this resume matches the job description.\nUse only the resume text as evidence.\nMatch report language to the resume: English resume → English report; Chinese resume → 简体中文 report.\n\nRESUME:\n{resume_text}\n\nJOB DESCRIPTION:\n{job_description}\n\"\"\"\n"
    },
    "requirements.txt": {
      "path": "requirements.txt",
      "type": "file",
      "title": "requirements.txt",
      "summary": "自动生成的文件条目：requirements.txt。可以在 manual analysis 中补充该文件的作用说明。",
      "language": "plaintext",
      "sizeBytes": 66,
      "generated": true,
      "review": {
        "status": "generated",
        "source": "generated"
      },
      "code": "streamlit>=1.32.0\npypdf>=4.0.0\nopenai>=1.40.0\npython-dotenv>=1.0.0"
    }
  }
} satisfies ProjectAnalyzerGeneratedData;
