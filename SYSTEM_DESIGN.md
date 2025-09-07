# 3. System Design

## 3.1 ER Diagram

**Entity and Attributes:**

**Scheme**
- schemeId (Primary Key)
- title
- description
- category
- eligibility
- benefits
- applyMethods (e.g., Online form, Email, Offline submission)

**Textual ER Diagram:**

```
Scheme
------------------------
schemeId (PK)
title
description
category
eligibility
benefits
applyMethods
```

---

## 3.2 Data Flow Diagram (DFD)

**Level 0 (High-level view):**

```
[User] ---> (Frontend - HTML/JS/CSS) ---> [Backend - Node/Express] ---> [Database - MongoDB]
                    ^                                                   |
                    |---------------------------------------------------|
```

**Level 1 (Detailed flow with Apply Methods and Chatbot API):**

- User opens index.html → navigates to schemes.html.
- Frontend JS (main.js, schemes.js, api.js) fetches schemes from backend API.
- User clicks on a scheme → fetch scheme details (scheme-details.html).
- User selects apply method → frontend handles instructions or redirection (no backend storage).
- User interacts with Gemini Chatbot API for guidance → backend relays response → frontend displays.
- Frontend shows confirmation or assistance.

**DFD Flow Diagram (textual view):**

```
[User]
   |
   v
[Frontend - index.html / schemes.html / scheme-details.html]
   |-- fetch schemes --> [Backend - Node/Express] --> [MongoDB]
   |-- apply for scheme --> [Frontend handles action]
   |-- chatbot query --> [Gemini API] --> [Backend] --> [Frontend]
   v
[Display data & confirmation]
```

---

## 3.3 Design Process

**Step 1: Requirement Analysis**
- Features: home page, view schemes, view scheme details, apply for schemes (instructions only), chatbot assistance.
- Entity: Scheme only.
- No login/authentication.

**Step 2: Technology Stack**
- Frontend: HTML, CSS, JavaScript
- Backend: Node.js + Express.js
- Database: MongoDB
- Chatbot: Gemini API

**Step 3: Module Design**
- Home Page Module (index.html): Landing page with navigation to schemes list, scheme details, and chatbot assistance.
- Scheme Module: Fetch all schemes and individual scheme details.  
  - Backend: routes/schemes.js  
  - Frontend JS: schemes.js
- Apply Module: Handles apply methods (instructions or external links).  
  - Frontend: JS handles display or redirection; no backend storage.
- API Module (api.js): Handles all HTTP requests between frontend and backend.  
  - Fetches schemes and scheme details.
- Chatbot Module: Handles queries via Gemini API.  
  - Provides guidance and assistance.
- Frontend UI (HTML/CSS/JS):  
  - Pages: index.html (home), schemes.html (list), scheme-details.html (details)  
  - Dynamically updated using JS (main.js, schemes.js, api.js)

**Step 4: Workflow**
- User opens index.html → navigates to schemes.html → JS fetches schemes → frontend displays.
- User selects a scheme → JS fetches scheme details → frontend displays.
- User clicks apply → frontend displays instructions or redirects to external link.
- User interacts with chatbot → Gemini API responds → frontend displays assistance.
- Frontend shows confirmation or guidance messages.

