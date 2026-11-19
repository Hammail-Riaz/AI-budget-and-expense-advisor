# AI Budget & Expense Advisor
## MVP – Product Requirements & Workflow Documentation

**Project Type:** AI-powered Personal Finance Management Application  
**Project Purpose:** College Science Exhibition  
**Development Timeline:** 4 Days  
**Team Size:** 4 Members  
**Document Version:** 1.0

---

# 1. Project Overview

## 1.1 Introduction

AI Budget & Expense Advisor is a personal finance management application that helps users record their income and expenses, manage monthly budgets, visualize spending patterns, and receive AI-generated financial suggestions.

The application combines traditional software development with Artificial Intelligence to demonstrate how AI can be integrated into a practical, real-world application.

The system will process financial transactions, calculate spending statistics, display visual analytics, and use Google's Gemini API to generate personalized budgeting and saving recommendations.

## 1.2 Main Objective

The primary objective is to develop a functional AI-powered financial management application that demonstrates:

- Financial data management.
- Budget tracking and expense analysis.
- Data visualization.
- Backend and frontend communication.
- Database integration.
- Practical AI API integration.

## 1.3 Target Users

The application is designed for students and individuals who want to monitor their personal finances and understand their spending habits.

Examples include:
- College and university students.
- Individuals receiving monthly allowances.
- People managing personal monthly budgets.
- Anyone interested in tracking everyday expenses.

---

# 2. Project Scope

The MVP (Minimum Viable Product) will include the following features:

| Feature | Description |
|---|---|
| Dashboard | Overview of income, expenses, balance and budget |
| Monthly Budget | Set and manage monthly spending limits |
| Transaction Management | Add and delete income and expenses |
| Categories | Organize transactions into predefined categories |
| Expense History | View previously recorded transactions |
| Spending Analytics | Visualize spending through charts |
| AI Financial Advisor | Generate financial insights and recommendations |

## 2.1 Features Outside the MVP

To maintain the four-day development timeline, the following features are excluded:

- User registration and authentication.
- Multiple user accounts.
- Bank account integration.
- Online payments and transfers.
- Automatic bank transaction imports.
- Advanced financial forecasting.
- Subscription management.
- Complex financial reporting.
- Mobile application development.

These features may be considered for future versions.

---

# 3. Application Architecture

## 3.1 Technology Stack

| Component | Technology | Responsibility |
|---|---|---|
| Frontend | React.js | User interface and interactions |
| Backend | Python Flask | Application logic and REST APIs |
| Database | SQLite | Store transactions and budgets |
| AI Provider | Google Gemini API | Generate financial suggestions |
| Charts | Recharts | Visualize financial data |
| Styling | Tailwind CSS / CSS | Application design |
| Version Control | Git and GitHub | Team collaboration |

## 3.2 System Architecture

The application follows a client-server architecture.

**Frontend (React)**

Responsible for:
- Displaying the dashboard.
- Collecting user input.
- Displaying transaction history.
- Rendering spending charts.
- Displaying AI recommendations.
- Sending requests to the backend.

**Backend (Flask)**

Responsible for:
- Receiving frontend requests.
- Validating user input.
- Performing financial calculations.
- Communicating with SQLite.
- Preparing analytics data.
- Communicating with the Gemini API.
- Returning JSON responses.

**Database (SQLite)**

Responsible for permanently storing:
- Financial transactions.
- Monthly budget information.

**AI Service (Gemini)**

Responsible for:
- Interpreting spending patterns.
- Identifying notable spending categories.
- Generating budgeting suggestions.
- Providing personalized saving recommendations.

## 3.3 Data Flow

The general communication process is:

1. User interacts with the React frontend.
2. React sends an HTTP request to the Flask backend.
3. Flask processes the request.
4. Flask reads or modifies the SQLite database when necessary.
5. Python performs financial calculations.
6. Flask returns the results in JSON format.
7. React updates the interface.

For AI functionality, Flask additionally sends summarized financial information to Gemini and returns its response to React.

---

# 4. Application Navigation

The application will have four main navigation sections.

## 4.1 Dashboard

Displays the user's overall financial situation.

Contains:
- Total income.
- Total expenses.
- Current balance.
- Monthly budget.
- Remaining budget.
- Budget utilization.
- Recent transactions.
- Category-wise spending chart.
- Monthly expense chart.

## 4.2 Transactions

Allows users to manage their financial transactions.

Contains:
- Add transaction button.
- Transaction history.
- Transaction type.
- Transaction category.
- Amount.
- Date.
- Description.
- Delete transaction functionality.

## 4.3 Budget

Allows users to manage monthly spending limits.

Contains:
- Current month's budget.
- Budget editing functionality.
- Total monthly expenses.
- Remaining budget.
- Budget utilization percentage.
- Budget warning when spending exceeds the limit.

## 4.4 AI Advisor

Provides AI-powered financial analysis.

Contains:
- Generate Advice button.
- Financial overview.
- Spending observations.
- Budget recommendations.
- Saving suggestions.

---

# 5. Complete User Workflow

This section explains the complete journey of a user interacting with the application.

## STEP 1: Opening the Application

When the user opens the application:

**For a new user:**
- The dashboard displays a welcome message.
- The application explains that the user should set a monthly budget.
- The user is encouraged to record their first transaction.

**For an existing user:**
- The dashboard retrieves previously stored financial information.
- The application displays current financial statistics.
- Recent transactions and spending charts are loaded.

There is no registration or login requirement in the MVP.

## STEP 2: Setting a Monthly Budget

The user navigates to the Budget section or uses the dashboard's budget setup option.

The application asks the user to enter a monthly spending limit.

Example:

Monthly Budget = Rs. 20,000

The backend validates the amount and stores the budget in SQLite.

The budget is associated with a specific month and year.

**Expected behavior:**

- The user can set a budget for the current month.
- The user can update an existing budget.
- A new month receives a separate budget record.
- Previous monthly budgets remain stored.
- The application should not automatically carry forward the previous month's spending limit.

## STEP 3: Adding Transactions

The user navigates to Transactions and selects Add Transaction.

The application displays a form.

### Required fields

| Field | Description |
|---|---|
| Transaction Type | Income or Expense |
| Amount | Transaction amount in PKR |
| Category | Financial category |
| Date | Transaction date |
| Description | Optional transaction details |

### Transaction Types

**Income:**
- Pocket Money
- Salary
- Freelancing
- Business Income
- Other Income

**Expenses:**
- Food
- Transport
- Education
- Shopping
- Entertainment
- Bills
- Healthcare
- Other

### Example Transaction

Type: Expense  
Amount: Rs. 500  
Category: Food  
Date: 19 November 2026  
Description: Lunch

### Backend Processing

1. React collects transaction information.
2. React sends a POST request to Flask.
3. Flask validates the incoming data.
4. Flask checks the transaction type and amount.
5. Flask saves the transaction in SQLite.
6. Flask returns a success response.
7. React updates the transaction list and dashboard.

The user receives a confirmation that the transaction was added successfully.

## STEP 4: Updating Financial Statistics

Whenever a transaction is added or deleted, the backend recalculates the financial statistics.

The following calculations are required:

**Total Income**

Sum of all recorded income transactions within the selected reporting period.

**Total Expenses**

Sum of all recorded expense transactions within the selected reporting period.

**Current Balance**

Current Balance = Total Income - Total Expenses

**Remaining Budget**

Remaining Budget = Monthly Budget - Monthly Expenses

**Budget Utilization**

Budget Utilization (%) = (Monthly Expenses / Monthly Budget) × 100

### Example

Monthly income: Rs. 15,000  
Monthly expenses: Rs. 8,000  
Monthly budget: Rs. 20,000

Results:

- Total Income = Rs. 15,000
- Total Expenses = Rs. 8,000
- Current Balance = Rs. 7,000
- Remaining Budget = Rs. 12,000
- Budget Utilization = 40%

Important distinction:

Current Balance and Remaining Budget are two different financial values.

Current Balance represents recorded income minus recorded expenses.

Remaining Budget represents how much of the planned spending limit is still available.

Income should not automatically increase the monthly spending budget.

## STEP 5: Viewing Expense History

The user navigates to the Transactions section.

The application retrieves stored transactions from SQLite and displays them in a structured list or table.

Each transaction displays:

- Description.
- Category.
- Transaction type.
- Amount.
- Date.

The user can delete a transaction.

When a transaction is deleted:

1. React sends a DELETE request.
2. Flask verifies that the transaction exists.
3. The transaction is deleted from SQLite.
4. Financial statistics are recalculated.
5. The frontend refreshes the transaction history and dashboard.

Editing transactions is optional and can be added if development time permits.

## STEP 6: Viewing Spending Analytics

The application converts financial transaction data into visual representations.

Two charts are required for the MVP.

### A. Category-wise Expense Chart

A pie or doughnut chart displays the distribution of expenses across different categories.

Example:

| Category | Expenses |
|---|---:|
| Food | Rs. 3,000 |
| Transport | Rs. 2,000 |
| Education | Rs. 2,000 |
| Entertainment | Rs. 1,000 |

The chart helps users identify where most of their money is being spent.

### B. Monthly Expense Chart

A bar chart displays expenses across different months.

Example:

| Month | Expenses |
|---|---:|
| June | Rs. 7,000 |
| July | Rs. 9,000 |
| August | Rs. 6,500 |
| September | Rs. 11,000 |
| October | Rs. 8,500 |
| November | Rs. 8,000 |

This helps users understand how their spending changes over time.

Charts must use actual database records, not hardcoded demonstration values.

For users with no transaction history, the application should display an appropriate empty state.

## STEP 7: Using the AI Financial Advisor

This is the main AI-powered feature of the application.

The user navigates to AI Advisor and clicks Generate Advice.

### What information will AI receive?

The backend prepares a summarized financial report.

Example:

```json
{
  "currency": "PKR",
  "monthly_budget": 20000,
  "total_income": 15000,
  "total_expenses": 8000,
  "remaining_budget": 12000,
  "budget_utilization": 40,
  "category_breakdown": {
    "Food": 3000,
    "Transport": 2000,
    "Education": 2000,
    "Entertainment": 1000
  }
}
```

This information is sent to Gemini through the Flask backend.

### What should AI do?

Gemini should:

1. Understand the user's financial situation.
2. Identify the highest spending categories.
3. Identify notable spending patterns.
4. Evaluate spending relative to the monthly budget.
5. Generate realistic budgeting suggestions.
6. Provide practical saving recommendations.

### Example AI Prompt

"You are a personal budgeting assistant.

Analyze the financial information provided by the application.

Your responsibilities:
- Summarize the user's spending.
- Identify the highest expense categories.
- Highlight potential areas where spending could be reviewed.
- Provide practical budgeting suggestions.
- Recommend reasonable saving habits.

Use the provided numbers accurately.
Do not invent transactions or financial information.
Do not claim that the user has a particular habit unless the data supports it.

Currency: PKR.

Return your response in clearly structured sections."

### AI Response

The generated response should be displayed in the AI Advisor section.

Suggested response structure:

1. Financial Overview
2. Spending Insights
3. Budget Analysis
4. Saving Suggestions

The user can regenerate advice after recording additional transactions.

### Important AI Architecture Rule

Python must perform all exact financial calculations.

Gemini should interpret the calculated information and generate suggestions.

The AI must not be responsible for calculating the official balance, budget utilization or transaction totals.

This makes the system more reliable.

---

# 6. Business Rules

The application must follow these rules consistently.

| Situation | Expected Behavior |
|---|---|
| User adds income | Total income increases |
| User adds expense | Total expenses increase |
| User deletes income | Total income decreases |
| User deletes expense | Total expenses decrease |
| User updates budget | Remaining budget recalculates |
| Expenses exceed budget | Show budget exceeded warning |
| No transactions exist | Show empty state |
| Budget is not configured | Ask user to set a budget |
| Gemini API fails | Display a friendly error |
| Internet connection fails | Core local functionality remains usable |
| New month begins | Start a separate monthly budget period |

Additional rules:

- Transaction amounts must be greater than zero.
- Only valid transaction types should be accepted.
- Dates must be valid.
- Categories should be selected from the supported list.
- A user should not be able to delete a transaction that does not exist.
- All financial calculations should use appropriate decimal precision.
- AI should only analyze information supplied by the backend.

---

# 7. Database Design

SQLite will be used for data storage.

The MVP requires two primary tables.

## 7.1 Transactions Table

| Column | Data Type | Description |
|---|---|---|
| id | INTEGER | Primary key |
| amount | DECIMAL / NUMERIC | Transaction amount |
| category | TEXT | Transaction category |
| type | TEXT | Income or Expense |
| description | TEXT | Optional description |
| date | DATE / TEXT | Transaction date |

## 7.2 Budgets Table

| Column | Data Type | Description |
|---|---|---|
| id | INTEGER | Primary key |
| monthly_limit | DECIMAL / NUMERIC | Spending limit |
| month | INTEGER | Budget month |
| year | INTEGER | Budget year |

The month and year combination should uniquely identify a monthly budget.

### Database Relationships

The MVP is a single-user application.

Therefore, no users table or authentication-related relationships are necessary.

Transactions and budgets are stored locally in the application's SQLite database.

---

# 8. Backend API Requirements

The React frontend communicates with Flask through REST API endpoints.

| Method | Endpoint | Purpose |
|---|---|---|
| GET | /api/dashboard | Retrieve dashboard statistics |
| GET | /api/transactions | Retrieve transactions |
| POST | /api/transactions | Add transaction |
| DELETE | /api/transactions/:id | Delete transaction |
| GET | /api/budget | Retrieve monthly budget |
| POST | /api/budget | Create or update monthly budget |
| GET | /api/analytics | Retrieve spending analytics |
| POST | /api/ai/advice | Generate AI recommendations |

All endpoints should return JSON responses.

### Example: Add Transaction Request

POST `/api/transactions`

```json
{
  "amount": 500,
  "category": "Food",
  "type": "Expense",
  "description": "Lunch",
  "date": "2026-11-19"
}
```

### Example: Successful Response

```json
{
  "success": true,
  "message": "Transaction added successfully"
}
```

### API Error Handling

The backend should return meaningful HTTP status codes.

- 200: Successful request.
- 201: Resource created.
- 400: Invalid input.
- 404: Resource not found.
- 500: Internal server error.
- 503: AI service temporarily unavailable.

---

# 9. AI Integration Requirements

## 9.1 AI Provider

Google Gemini API.

## 9.2 Integration Architecture

The Gemini API key must remain on the backend.

React must never directly expose or use the secret API key.

The process:

1. User requests financial advice.
2. React sends a request to Flask.
3. Flask retrieves financial information from SQLite.
4. Python calculates and prepares a summary.
5. Flask sends the summary and prompt to Gemini.
6. Gemini generates recommendations.
7. Flask returns the result to React.
8. React displays the advice.

## 9.3 Error Handling

If Gemini is unavailable:

- Do not crash the application.
- Display a friendly error.
- Keep the dashboard and other features functional.
- Allow the user to retry later.

## 9.4 Privacy Considerations

The application should only send the financial information necessary for analysis.

No passwords, identity documents, bank credentials or unnecessary personal information should be sent to the AI provider.

Use synthetic financial data during the exhibition.

---

# 10. Four-Day Development Plan

## Day 1: Foundation and Architecture

Objectives:
- Finalize project structure.
- Create GitHub repository.
- Configure React.
- Configure Flask.
- Create SQLite database.
- Establish frontend-backend communication.
- Create basic dashboard layout.

**Deliverable:** A working React frontend communicating with Flask.

## Day 2: Core Finance Functionality

Objectives:
- Implement transaction creation.
- Implement transaction deletion.
- Implement budget creation and updating.
- Implement financial calculations.
- Display transaction history.
- Connect the dashboard to database information.

**Deliverable:** A functional expense and budget tracking application.

## Day 3: Charts and AI

Objectives:
- Implement category-wise spending charts.
- Implement monthly expense charts.
- Configure Gemini API.
- Create AI advisor functionality.
- Implement prompt engineering.
- Handle API errors.

**Deliverable:** A working AI-powered financial management MVP.

## Day 4: Testing and Finalization

Objectives:
- Test all application features.
- Fix integration issues.
- Improve the interface.
- Prepare realistic demonstration data.
- Test AI responses.
- Prepare project documentation.
- Rehearse the exhibition presentation.

**Deliverable:** A stable, exhibition-ready application.

---

# 11. Team Responsibilities

## Member 1: Frontend Developer

Primary responsibility: React frontend.

Tasks:
- Dashboard interface.
- Transaction forms.
- Budget interface.
- Transaction history.
- Spending charts.
- AI advisor interface.
- API integration.

## Member 2: Backend Developer

Primary responsibility: Flask backend.

Tasks:
- Flask configuration.
- REST API development.
- Input validation.
- Financial calculations.
- Budget management.
- API error handling.

## Member 3: Database and AI Developer

Primary responsibility: Data management and AI integration.

Tasks:
- SQLite database design.
- Database operations.
- Gemini API integration.
- Prompt engineering.
- AI response processing.
- AI error handling.

## Member 4: Integration and Testing Developer

Primary responsibility: Integration, quality assurance and project support.

Tasks:
- Backend development assistance.
- API testing.
- Sample dataset preparation.
- Frontend-backend integration support.
- Application testing.
- Documentation and exhibition preparation.

All members should understand the overall architecture, not just their assigned components.

---

# 12. Testing Requirements

Before declaring the MVP complete, test the following scenarios.

| Test Case | Expected Result |
|---|---|
| Add a valid expense | Expense is saved |
| Add a valid income | Income is saved |
| Enter a negative amount | Validation error |
| Enter zero amount | Validation error |
| Delete a transaction | Transaction is removed |
| Add a new expense | Dashboard updates |
| Change monthly budget | Remaining budget updates |
| Expenses exceed budget | Warning is displayed |
| View category chart | Correct category distribution |
| View monthly chart | Correct monthly totals |
| Generate AI advice | Recommendations are displayed |
| Gemini API unavailable | Friendly error is displayed |
| No transactions exist | Empty state is displayed |
| Restart application | Stored data remains available |

---

# 13. MVP Completion Criteria

The project will be considered complete when:

- [ ] Application starts successfully.
- [ ] Dashboard displays financial statistics.
- [ ] User can set a monthly budget.
- [ ] User can add income.
- [ ] User can add expenses.
- [ ] Transactions are stored in SQLite.
- [ ] User can view transaction history.
- [ ] User can delete transactions.
- [ ] Financial calculations are accurate.
- [ ] Dashboard updates after transaction changes.
- [ ] Category-wise spending chart works.
- [ ] Monthly expense chart works.
- [ ] Gemini API generates financial suggestions.
- [ ] AI errors do not break the application.
- [ ] Application can demonstrate a complete user journey.

---

# 14. Exhibition Demonstration Workflow

For the science exhibition, prepare a demonstration using sample financial data.

Recommended demonstration sequence:

**1. Introduce the application**

Explain the problem: People often struggle to understand where their money goes.

**2. Set a monthly budget**

Enter a monthly budget of Rs. 20,000.

**3. Add sample income**

Record Rs. 15,000 as pocket money.

**4. Add sample expenses**

- Food: Rs. 3,000
- Transport: Rs. 2,000
- Education: Rs. 2,000
- Entertainment: Rs. 1,000

**5. Show the dashboard**

Demonstrate how the application calculates income, expenses, current balance and remaining budget.

**6. Show spending charts**

Explain the category-wise and monthly spending visualizations.

**7. Demonstrate AI integration**

Click Generate Advice and show how Gemini analyzes the financial summary and generates recommendations.

**8. Explain the technology**

Briefly explain how React, Flask, SQLite, Python and Gemini work together.

---

# 15. Future Improvements

Features that could be introduced after the exhibition:

- User authentication and multiple financial profiles.
- Edit transactions.
- Transaction filtering and searching.
- CSV import and export.
- PDF financial reports.
- Recurring expenses.
- Savings goals.
- Category-specific budgets.
- More advanced AI financial analysis.
- Automatic monthly reports.
- Mobile-friendly Progressive Web App.

---

# 16. Final Project Summary

AI Budget & Expense Advisor is a practical demonstration of how traditional software engineering and Artificial Intelligence can work together.

The application uses React for its frontend, Flask for backend processing, SQLite for data storage, and Gemini API for intelligent financial recommendations.

Users can record income and expenses, manage monthly budgets, visualize spending patterns, and receive personalized financial suggestions.

The project focuses on building a functional, understandable and useful application within a limited development timeline while demonstrating practical AI-assisted software development.

**Our development philosophy: Build the core application first, integrate AI where it provides real value, and ensure every team member understands the system.**

---

**END OF DOCUMENT**  
*AI Budget & Expense Advisor — MVP Documentation, Version 1.0*
