# SpendWise AI --- V2 Upgrade Specification

## A continuation plan from the existing MVP

**Document purpose:** This is the working product, architecture,
feature, API, migration, and implementation specification for upgrading
the existing SpendWise AI / AI Budget & Expense Advisor MVP. It is
deliberately written as a continuation of the deployed project---not as
a greenfield rebuild.

**Project principle:** Preserve working functionality, extend the
existing codebase incrementally, migrate existing data safely, and test
each backend/frontend integration before moving to the next feature.

------------------------------------------------------------------------

# 1. Product overview

## 1.1 Product vision

SpendWise AI is a personal finance and expense-management application
designed to help users record transactions, understand spending, manage
budgets, and make better day-to-day financial decisions.

The V2 goal is to move beyond a basic expense tracker and create an
interactive AI-assisted financial companion. The application should
combine reliable financial calculations, useful automation,
understandable insights, and a polished exhibition-ready experience.

The product should demonstrate three things clearly:

1.  **Useful financial management:** Users can record income and
    expenses, see their financial position, and manage overall and
    category budgets.
2.  **Practical AI assistance:** Users can enter transactions naturally,
    scan receipts, receive contextual insights, and ask questions about
    their own financial data.
3.  **Trustworthy engineering:** Each user's information is private,
    calculations are deterministic where possible, AI output is
    validated, and users can review AI-generated entries before saving.

## 1.2 Exhibition objective

The exhibition version should be easy for a judge to understand and
interact with in a short demonstration.

Recommended signature demonstrations:

-   **AI Receipt Scanner:** Upload a receipt, extract relevant details,
    review the result, and save it as a transaction.
-   **Magic Input:** Type a natural sentence containing one or more
    expenses, preview the extracted transactions, edit if needed, and
    confirm.
-   **Context-aware Ask AI:** Ask a question and receive an answer
    grounded in the signed-in user's actual financial data.
-   **Category budgets and visual insights:** Show where money is going
    and whether spending is approaching a limit.

The application should not rely on flashy visuals alone. The features
must work reliably with seeded demo data and should explain their
results.

------------------------------------------------------------------------

# 2. Existing MVP: the starting point

The existing MVP is already deployed and must be treated as the
foundation.

## 2.1 Current stack

  -----------------------------------------------------------------------
  Layer                               Existing technology
  ----------------------------------- -----------------------------------
  Frontend                            React.js with Vite

  Styling                             Tailwind CSS

  Backend                             Python Flask

  Database                            SQLite

  ORM / migrations                    SQLAlchemy and Flask-Migrate

  API communication                   Fetch API through an existing API
                                      helper

  AI provider                         Groq

  AI model                            `openai/gpt-oss-20b`

  Backend hosting                     PythonAnywhere

  Frontend hosting                    Vercel

  Frontend token key                  `spendwise_token` (already
                                      referenced by `api.js`)
  -----------------------------------------------------------------------

The backend has been deployed at `hammailriaz.pythonanywhere.com`; the
frontend has been deployed at
`ai-budget-and-expense-advisor.vercel.app`.

These deployment details describe the known project setup. Confirm the
live environment and current configuration before making deployment
changes.

## 2.2 Existing backend functionality

The following endpoints have already been implemented and tested during
MVP development:

  Existing endpoint                 Existing purpose
  --------------------------------- -------------------------------
  `GET /api/health`                 Health check
  `GET /api/transactions`           Retrieve transactions
  `POST /api/transactions`          Add a transaction
  `DELETE /api/transactions/<id>`   Delete a transaction
  `GET /api/dashboard`              Dashboard financial summary
  `GET /api/budget`                 Retrieve monthly budget
  `POST /api/budget`                Create/update monthly budget
  `GET /api/analytics`              Financial analytics
  `GET /api/ai/advice`              AI-generated financial advice

The existing database includes `transactions` and `budgets` tables. The
application is currently a single-user MVP and does not yet have real
registration/login or user-level data isolation.

The existing AI advice endpoint uses Groq with `openai/gpt-oss-20b`.
Keep this working integration unless a specific feature requires another
model/provider.

## 2.3 Existing frontend API helper

The current `api.js` already reads the token key:

``` javascript
const token = localStorage.getItem("spendwise_token");
```

It also prepares an Authorization header when a token exists. This is
only frontend preparation; it does not mean backend authentication is
already implemented.

When authentication is introduced, extend the existing helper rather
than creating a second competing API utility. Keep one consistent API
request layer for base URL, JSON handling, authorization, errors, and
optional multipart requests.

## 2.4 Do not assume

The V2 blueprint contains proposed tables, routes, and response
examples. They are target designs, not proof that those features already
exist.

In particular, do not assume that the following are implemented:

-   Users, registration, login, JWT validation, or protected routes.
-   `user_id` ownership on transactions and budgets.
-   Category-wise budgets.
-   Recurring bill schedules.
-   Magic Input or voice logging.
-   Receipt scanning.
-   Structured Bento AI insights.
-   Ask AI chat.
-   Financial health score.
-   What-If simulator.
-   Smart alerts, streaks, or achievements.

------------------------------------------------------------------------

# 3. V2 product modules and features

## Module 1 --- Account security and multi-user support

### Objective

Allow multiple people to use the same deployed application while keeping
each user's transactions, budgets, and AI context private.

### Features

1.  Registration using full name, email, and password.
2.  Login using email and password.
3.  Password hashing on the backend.
4.  JWT access-token creation and verification.
5.  Protected frontend routes.
6.  Protected backend API endpoints.
7.  A current-user/profile endpoint.
8.  A one-click demo login for exhibition judges.
9.  User-specific financial data and AI context.

Google OAuth was part of the initial feature ideas, but it is not
required for the first authentication milestone. It can be considered
later if time and integration complexity allow.

### Backend responsibilities

-   Add a `users` table.
-   Hash passwords using a secure password-hashing utility such as
    Werkzeug.
-   Use Flask-JWT-Extended, or an equivalent established JWT
    implementation.
-   Create registration, login, and current-user endpoints.
-   Require a valid JWT on all private financial endpoints.
-   Obtain the user identity from the verified token; never trust a
    client-supplied `user_id`.
-   Scope every transaction, budget, recurring-bill, and AI-data query
    to the authenticated user.
-   Return safe user fields only; never return password hashes.

### Frontend responsibilities

-   Create login and registration pages.
-   Add a protected-route component.
-   Store and attach the access token using the existing
    `spendwise_token` convention.
-   Handle expired/invalid tokens by returning the user to login.
-   Add a clearly labelled **Demo Login (For Judges)** action.
-   Show the signed-in user's name or profile state.
-   Provide logout.

### Demo account

Create a seeded demo account with realistic sample data across multiple
months. The demo account must be isolated like an ordinary user.

Do not rely on a hardcoded public demo password as a security mechanism.
Use a controlled seed process, avoid exposing private user data, and
ensure the demo dataset can be reset or recreated for exhibition day.

### Acceptance criteria

-   A user can register and log in.
-   A user cannot retrieve, modify, or delete another user's records by
    changing an ID or request parameter.
-   All private routes reject missing or invalid tokens.
-   Demo login works without manual account creation.
-   Existing MVP records are assigned to a deliberate owner during
    migration.

------------------------------------------------------------------------

## Module 2 --- Core financial management and dashboard

### Objective

Preserve the current transaction and dashboard functionality while
making the calculations consistent and extending the dashboard with
useful financial summaries.

### Existing functionality to preserve

-   Add income/expense transactions.
-   List transactions.
-   Delete transactions.
-   Display dashboard totals.
-   Set/retrieve an overall monthly budget.
-   Display analytics.
-   Generate AI advice.

Do not remove working functionality merely to match a new route name.

### Financial definitions

The application must distinguish account balance from budget remaining.

**Net balance:**

`total_income - total_expenses`

**Remaining overall budget:**

`monthly_budget_limit - current_month_expenses`

**Budget utilization:**

`(current_month_expenses / monthly_budget_limit) * 100`

If the budget is zero or missing, avoid division-by-zero and represent
utilization as unavailable or zero according to one documented
frontend/backend convention.

Example:

-   Income: Rs 10,000
-   Expenses: Rs 6,500
-   Monthly budget: Rs 80,000

Then:

-   Net balance = Rs 3,500
-   Remaining budget = Rs 73,500
-   Budget utilization = 8.125%

The dashboard and AI Insights must use the same underlying definitions
and period filters.

### Currency convention

Use one display convention throughout the application. Recommended:
display **PKR** or **Rs** consistently, and store amounts as numeric
values rather than currency-formatted strings.

The API should return numeric amounts. The frontend should format them
consistently. Avoid mixing `Rs`, `PKR`, and differently formatted
currency labels across screens.

### Dashboard improvements

-   Income, expenses, net balance, and remaining budget cards.
-   Monthly spending trend.
-   Category spending breakdown.
-   Recent transactions.
-   Budget utilization.
-   Upcoming recurring bills when that module is implemented.
-   Clear month/year selection where appropriate.

### Acceptance criteria

-   Dashboard totals reconcile with transaction records.
-   Dashboard and AI Insights use identical definitions for income,
    expenses, balance, and budget remaining.
-   Currency formatting is consistent.
-   Empty months and missing budgets render safely.

------------------------------------------------------------------------

## Module 3 --- Overall and category-wise budgeting

### Objective

Extend the existing monthly budget feature with per-category spending
limits and progress tracking.

### Overall monthly budget

Preserve the current overall budget capability. It represents the user's
spending limit for a selected month and year.

### Category-wise budgets

Allow a user to set separate monthly spending limits for categories such
as:

-   Food
-   Transport
-   Entertainment
-   Bills
-   Shopping
-   Other

Categories should be consistent across transaction entry, receipt
scanning, Magic Input, analytics, and budgeting. If custom categories
are later supported, validation and display should handle them
consistently.

### Category budget calculations

For each user, category, month, and year:

-   `spent_amount` = sum of expense transactions in that category and
    period.
-   `remaining_amount` = `limit_amount - spent_amount`.
-   `percentage_used` = `spent_amount / limit_amount * 100`, with safe
    handling for a zero/missing limit.

Suggested display states:

  Usage              Suggested state
  ------------------ -----------------------
  Below 70%          Healthy
  70% to below 90%   Warning
  90% or above       Near limit / critical

These are visual thresholds, not claims that a user's finances are
objectively healthy or unhealthy.

### Frontend experience

-   Keep the overall monthly budget card.
-   Add a Category Limits section.
-   Display category cards with spent, limit, remaining, and progress
    bar.
-   Allow a user to add or edit a category limit.
-   Show a warning when a category approaches or exceeds its limit.
-   Make the selected month/year clear.

### Backend responsibilities

-   Add category-budget persistence.
-   Return category limits together with spending totals for the
    selected period.
-   Validate category names, month, year, and positive limit values.
-   Enforce user ownership.

### Acceptance criteria

-   A user can set/update an overall monthly limit.
-   A user can set/update category limits.
-   Progress reflects only expense transactions belonging to that user
    and period.
-   Income transactions do not count toward spending limits.
-   Existing overall budget data is migrated or mapped without silent
    loss.

------------------------------------------------------------------------

## Module 4 --- Magic Input: natural-language transaction logging

### Objective

Let users describe one or more transactions in ordinary language instead
of filling every field manually.

### Example input

> Spent 1,200 on biryani yesterday and 500 on InDrive today.

The parser should attempt to extract:

-   Date
-   Description
-   Category
-   Transaction type
-   Amount

### Recommended workflow

1.  User enters or dictates a sentence.
2.  Backend sends the text and an authoritative current date to the AI
    parser.
3.  AI returns structured candidate transaction data.
4.  Backend validates the structure and values.
5.  Frontend displays a preview of all proposed transactions.
6.  User can edit or remove incorrect entries.
7.  User confirms.
8.  Confirmed transactions are saved through an authenticated endpoint.

**Important:** Do not automatically commit AI-parsed transactions before
the user reviews them. Parsing mistakes involving amounts, dates, or
categories could corrupt the user's financial record.

### Voice input

Add a microphone control to the Magic Input bar using browser
speech-recognition support where available.

-   Convert speech to text in the browser.
-   Place the recognized text in the same input field.
-   Let the user review/edit the text before parsing.
-   Provide a typed-input fallback for unsupported browsers or denied
    microphone permission.

Voice recognition is a convenience layer; the backend parser remains
responsible for extracting transaction fields.

### Backend responsibilities

-   Accept natural-language text.
-   Use the server's date/time context or a validated date supplied by
    the client; do not blindly trust arbitrary client dates.
-   Ask the model for strict structured output.
-   Validate amounts, dates, categories, and transaction types.
-   Return candidate transactions for review.
-   Save only after explicit confirmation, using the normal transaction
    creation logic.

### Acceptance criteria

-   A sentence containing multiple expenses produces multiple candidate
    records.
-   Relative dates such as "yesterday" resolve against a known current
    date.
-   Invalid or ambiguous extraction is flagged for user review.
-   No transaction is saved before confirmation.
-   Voice failure does not prevent typed Magic Input.

------------------------------------------------------------------------

## Module 5 --- AI Receipt Scanner

### Objective

Allow a user to upload a receipt image and extract transaction
information automatically.

### User experience

1.  User chooses **Scan Receipt** from the add-expense flow.
2.  User uploads or drops an image.
3.  The application validates file type and size.
4.  The backend extracts receipt information.
5.  The frontend displays the extracted fields in an editable form.
6.  User confirms and saves the transaction.

Show a scanning/loading state while processing. Do not make the
animation imply that the scan is complete before the backend responds.

### Desired extracted fields

-   Merchant / store name.
-   Receipt date.
-   Total amount.
-   Suggested category.
-   Currency if identifiable.
-   Optional line items when extraction is sufficiently reliable.
-   Confidence or review warnings where supported.

The initial MVP of this feature only needs the fields required to create
a useful expense transaction: date, merchant/description, category,
type, and total amount.

### Technology options

**Option A --- Multimodal vision model**

Send the image to a vision-capable model and request structured JSON.
This is often simpler for varied receipt layouts, but depends on model
availability, image limits, cost, privacy considerations, and extraction
reliability.

**Option B --- Traditional OCR**

Use an OCR engine to extract text, then write parsing logic to identify
merchant, date, totals, and other fields. This provides more direct
control but receipts vary substantially in layout.

**Option C --- Hybrid OCR + AI extraction**

Extract text with OCR and pass the text to an LLM for structured
interpretation. This can be a useful balance, especially when the OCR
output is inspectable.

Choose the implementation after a small proof of concept using several
different sample receipts. Do not assume that one approach will work
perfectly for every receipt.

### Backend responsibilities

-   Accept multipart/form-data with a field such as `receipt_image`.
-   Validate file size and allowed image formats.
-   Avoid storing uploaded images permanently unless there is a clear
    product requirement and appropriate privacy handling.
-   Extract and validate fields.
-   Return structured candidate data.
-   Do not automatically save an expense without user confirmation.
-   Handle unreadable or incomplete receipts gracefully.

### Acceptance criteria

-   A supported receipt image can be uploaded.
-   The response contains structured fields rather than a raw model
    paragraph.
-   User can edit extracted information.
-   User confirms before the expense is saved.
-   Unreadable receipts produce a useful error or partial result rather
    than fabricated values.

------------------------------------------------------------------------

## Module 6 --- Structured AI Insights and financial health score

### Objective

Replace the current text-heavy/raw-Markdown AI advice display with
structured, visually understandable insights.

### Existing functionality to preserve

The current `/api/ai/advice` endpoint uses Groq and already provides
AI-generated advice. Do not discard it before the structured V2
replacement is working.

### Structured insights response

The new insights endpoint should return a predictable JSON structure
containing:

-   Financial health score.
-   Score label.
-   Summary headline.
-   Insight cards.
-   Saving tips.
-   Relevant metrics and action suggestions.

Suggested insight card types:

-   Positive / strength.
-   Warning.
-   Actionable recommendation.
-   Informational observation.

Each card may include:

-   Stable ID.
-   Type.
-   Title.
-   Metric.
-   Description.
-   Optional action label.
-   Optional action payload.

The frontend should render native React components rather than
displaying raw Markdown tables or relying on unsafe HTML rendering.

### Financial health score

The score should be calculated by deterministic backend logic using
documented financial indicators, not generated freely by an LLM.

Possible indicators:

-   Overall budget utilization.
-   Category budget performance.
-   Income versus expenses.
-   Savings or net balance trend.
-   Spending consistency over time.

The exact weights, missing-data behavior, and score interpretation must
be defined and documented before release. Do not present an arbitrary
number as an objective financial truth.

The AI may explain the score and suggest improvements, but it must not
invent the score or underlying metrics.

### Bento-style UI

Use modular cards for:

-   Financial overview.
-   Positive patterns.
-   Spending warnings.
-   Category concentration.
-   Actionable saving tips.
-   Financial health score.

Use progress rings, subtle color states, and clear action buttons where
they improve understanding. Color must not be the only way to
communicate a warning.

### Acceptance criteria

-   AI insights return valid structured JSON.
-   The frontend renders cards and metrics natively.
-   Invalid model output is handled safely.
-   Financial calculations are verified by backend code.
-   The score is reproducible from the same input data and documented
    formula.
-   The old advice endpoint remains available until the new feature is
    integrated and tested.

------------------------------------------------------------------------

## Module 7 --- Context-aware Ask AI drawer

### Objective

Provide an assistant that answers questions using the authenticated
user's current financial data.

### Example questions

-   "Can I afford a Rs 15,000 trip this weekend?"
-   "Where am I overspending?"
-   "How much have I spent on food this month?"
-   "What bills are coming up?"
-   "How much could I save if I reduced entertainment spending?"

### Frontend responsibilities

-   Add an Ask AI entry point in the navigation.
-   Open a slide-over drawer.
-   Display the conversation.
-   Provide suggested prompt chips.
-   Show loading and error states.
-   Keep the interface usable on smaller screens.

### Backend responsibilities

-   Require authentication.
-   Retrieve a compact financial summary for the current user.
-   Include relevant budgets, transaction aggregates, and recurring
    bills.
-   Send only the necessary context to the AI provider.
-   Keep chat history bounded and validate its structure.
-   Avoid allowing user-provided chat history to override system
    instructions or access another user's data.

### Financial-answer safeguards

The assistant must distinguish:

-   Current account balance.
-   Remaining monthly budget.
-   Upcoming obligations.
-   Proposed purchase amount.
-   Uncertainty in future income or expenses.

It should not say a user can afford something solely because the monthly
budget has unused capacity. It should explain assumptions and avoid
presenting estimates as guarantees.

### Acceptance criteria

-   Answers are grounded in the signed-in user's data.
-   Another user's data is never included.
-   Missing information is acknowledged.
-   Large or unsupported claims are avoided.
-   The UI clearly distinguishes AI suggestions from saved financial
    records.

------------------------------------------------------------------------

## Module 8 --- What-If savings simulator

### Objective

Allow users to explore hypothetical spending changes and understand
their possible impact on savings.

### Example interaction

A slider lets a user model reducing Food spending by a chosen
percentage.

The interface can calculate:

-   Estimated monthly reduction.
-   Estimated six-month reduction.
-   Estimated twelve-month reduction.

For a simple projection:

`monthly_saving = baseline_category_spending * reduction_percentage`

`six_month_projection = monthly_saving * 6`

`twelve_month_projection = monthly_saving * 12`

These are simple hypothetical projections. They assume the baseline
spending and reduction remain constant. Label them as estimates, not
guaranteed savings.

### Frontend responsibilities

-   Category selector.
-   Percentage slider.
-   Live projected savings.
-   Animated counters where appropriate.
-   Clear explanation of assumptions.

### Backend responsibilities

The initial simulator can calculate client-side from trusted analytics
data. If the calculation becomes more complex or needs server-side
persistence, add a backend endpoint later.

### Acceptance criteria

-   Slider changes update projections immediately.
-   Calculations use the selected category's actual baseline spending.
-   Projections are labelled as hypothetical.
-   No real transaction or budget is modified by the simulator.

------------------------------------------------------------------------

## Module 9 --- Smart alerts and recurring bills

### Objective

Help users notice important changes and upcoming obligations without
having to inspect every chart.

### Smart alerts

Examples:

-   Category spending reaches 70%, 90%, or 100% of its limit.
-   Spending in a category rises substantially compared with a previous
    period.
-   A recurring bill is approaching.
-   An unusual transaction or spending spike deserves review.

Start with deterministic rules based on transaction and budget data. AI
can explain an alert, but should not be required for simple threshold
checks.

Define what counts as an unusual increase and ensure the application has
enough historical data before presenting a comparison.

### Recurring bills

A recurring bill is more than a boolean flag on a transaction.

A recurring-bill record should be able to represent:

-   Description / merchant.
-   Category.
-   Expected amount.
-   Frequency (for example weekly, monthly, or yearly).
-   Next due date.
-   Active/paused state.
-   User ownership.

A transaction may optionally be associated with a recurring-bill record
when a payment is actually made.

Do not generate duplicate transactions merely because a due date
arrives. A reminder and a completed payment are different events.

### Frontend responsibilities

-   Upcoming bills section.
-   Due-date labels.
-   Active/paused state.
-   Alert list or notification area.
-   Clear distinction between expected and paid amounts.

### Acceptance criteria

-   Users can create and manage recurring-bill definitions.
-   Upcoming due dates are calculated correctly.
-   Alerts are scoped to the user.
-   A reminder does not automatically count as a completed expense.

------------------------------------------------------------------------

## Module 10 --- Streaks and achievements

### Objective

Encourage consistent use of the application through meaningful
milestones rather than meaningless gamification.

### Possible achievements

-   First transaction recorded.
-   First budget created.
-   First category limit created.
-   Tracked spending for a full week.
-   Stayed within a category budget for a month.
-   Reached a user-defined savings milestone.

### Design rules

-   Achievements should be based on real application events or financial
    records.
-   Do not reward users for spending less in a way that encourages
    unhealthy or unrealistic behavior.
-   Do not imply that a badge is a professional financial assessment.
-   Make achievements optional and non-intrusive.

### Acceptance criteria

-   Each achievement has a clear rule.
-   The same achievement is not repeatedly awarded.
-   Progress is tied to the correct user.
-   Missing history is not treated as proof of success or failure.

------------------------------------------------------------------------

## Module 11 --- UI/UX and exhibition polish

### Objective

Make the product feel coherent, modern, responsive, and easy to
demonstrate.

### Visual improvements

-   Consistent design system and spacing.
-   Bento-grid AI insights.
-   Dark mode.
-   Subtle glass/glow accents where appropriate.
-   Responsive layouts.
-   Clear typography and hierarchy.
-   Consistent currency formatting.
-   Interactive donut chart with useful hover details.
-   Spending trend charts.
-   Smooth number counters.
-   Skeleton or shimmer loading states.
-   Toasts and clear validation messages.
-   Framer Motion transitions where they improve the experience.

### UX rules

-   Animations must not block user interaction.
-   Respect reduced-motion preferences where possible.
-   Provide empty states for users with no transactions.
-   Provide useful error states for failed API calls.
-   Avoid showing fake or hardcoded financial values outside the seeded
    demo account.
-   Keep key financial information readable and accessible.
-   Do not use color as the only signal for category status.

### Acceptance criteria

-   Main screens work on desktop and mobile layouts.
-   Loading, empty, success, and error states exist.
-   Charts use real API data.
-   Currency and date formats are consistent.
-   The demo flow is understandable without developer assistance.

------------------------------------------------------------------------

# 4. Database evolution and migration plan

## 4.1 Existing database

Known existing tables:

-   `transactions`
-   `budgets`

The exact current model definitions, constraints, column names, and
migration history must be inspected in the repository before writing
migrations.

## 4.2 Target logical data model

The V2 design is expected to include these entities:

### `users`

-   `id`
-   `full_name`
-   `email` (unique)
-   `password_hash`
-   `created_at`

### `transactions` --- extend the existing table

Preserve existing transaction fields and add:

-   `user_id`
-   `is_recurring` only if it is useful for the chosen transaction/bill
    relationship.

Existing fields are known to include transaction information such as
amount, category, type, description, and date. Confirm exact field names
in the existing model before migration.

### Overall monthly budgets

The current `budgets` table already exists. Do not automatically create
a duplicate `monthly_budgets` table.

First inspect the existing model and decide whether to: - Extend and
retain `budgets`, or - Migrate it to a renamed/new table using an
explicit migration.

The target logical fields are:

-   `id`
-   `user_id`
-   `month`
-   `year`
-   `total_limit` (or the existing equivalent)

There should be one overall budget per user per month/year.

### `category_budgets`

-   `id`
-   `user_id`
-   `category`
-   `month`
-   `year`
-   `limit_amount`

There should be one category limit per user/category/month/year.

### `recurring_bills`

Recommended logical fields:

-   `id`
-   `user_id`
-   `description`
-   `category`
-   `amount`
-   `frequency`
-   `next_due_date`
-   `is_active`
-   `created_at`

### Optional future entities

Do not create these until their features require them:

-   Achievement definitions/progress.
-   Saved financial goals.
-   Alert history.
-   Persistent AI conversation history.

## 4.3 Migration strategy

Recommended: preserve and migrate the existing database.

1.  Back up the current SQLite database.
2.  Inspect current SQLAlchemy models and migration history.
3.  Create the users table.
4.  Create a deliberate owner for existing MVP records (for example, a
    seeded legacy/demo owner).
5.  Add `user_id` to existing transactions and budget records.
6.  Backfill existing rows to that owner.
7.  Add foreign keys and indexes where supported.
8.  Add category-budget and recurring-bill tables.
9.  Verify row counts and financial totals before and after migration.
10. Test migrations against a copy of production data before applying
    them to the deployed database.

Do not drop or recreate the existing database as a shortcut. Do not add
a non-nullable ownership field without a backfill plan.

SQLite migration details and foreign-key behavior must be checked
against the project's actual SQLAlchemy/Flask-Migrate setup.

------------------------------------------------------------------------

# 5. API evolution: preserve working routes and introduce V2 routes carefully

The API below is a target contract. It is not a claim that these
endpoints already exist.

## 5.1 API conventions

-   Base path: `/api`
-   JSON requests use `Content-Type: application/json`.
-   Protected endpoints require `Authorization: Bearer <access_token>`.
-   Receipt upload uses `multipart/form-data`.
-   Return numeric monetary values; format currency in the frontend.
-   Use consistent success/error response shapes.
-   Validate all input on the backend.
-   Derive user identity from the verified JWT, never from a
    client-provided `user_id`.

## 5.2 Authentication endpoints

  Method   Endpoint               Purpose
  -------- ---------------------- -----------------------------------
  POST     `/api/auth/register`   Register a user
  POST     `/api/auth/login`      Authenticate and return token
  GET      `/api/auth/me`         Return current authenticated user

Example registration request:

``` json
{
  "full_name": "Ali Raza",
  "email": "ali@example.com",
  "password": "user-supplied-password"
}
```

Example login request:

``` json
{
  "email": "ali@example.com",
  "password": "user-supplied-password"
}
```

Return safe profile fields and an access token. Never return the
password or password hash.

## 5.3 Existing transaction endpoints

Preserve the existing routes:

  --------------------------------------------------------------------------
  Method                  Endpoint                   V2 behavior
  ----------------------- -------------------------- -----------------------
  GET                     `/api/transactions`        Return only current
                                                     user's transactions;
                                                     add validated filters

  POST                    `/api/transactions`        Create transaction for
                                                     current user

  DELETE                  `/api/transactions/<id>`   Delete only if record
                                                     belongs to current user
  --------------------------------------------------------------------------

Potential future improvements include update/edit and pagination, but
they should not delay core V2 features unless needed by the UI.

## 5.4 Dashboard endpoint

Preserve:

`GET /api/dashboard`

Extend its response as needed. Optional query parameters:

`?month=11&year=2026`

Suggested response structure:

``` json
{
  "summary": {
    "total_income": 10000,
    "total_expenses": 6500,
    "net_balance": 3500,
    "monthly_budget": 80000,
    "remaining_budget": 73500,
    "budget_utilization_percent": 8.1
  },
  "category_breakdown": [],
  "six_month_trend": [],
  "upcoming_recurring": [],
  "recent_transactions": []
}
```

All values must be calculated from the authenticated user's records. The
example numbers are illustrative only.

## 5.5 Budget endpoints

The MVP currently uses `/api/budget` GET and POST. Preserve these until
the frontend has been migrated and tested.

Recommended V2 contract:

  Method   Endpoint                      Purpose
  -------- ----------------------------- -------------------------------------
  GET      `/api/budgets?month=&year=`   Get overall and category budgets
  POST     `/api/budgets/overall`        Create/update overall monthly limit
  POST     `/api/budgets/category`       Create/update category limit

A temporary compatibility approach may keep the old `/api/budget` route
and have it call shared service logic. Remove or deprecate it only after
all clients have migrated.

## 5.6 Analytics endpoint

Preserve:

`GET /api/analytics`

Do not move or delete analytics functionality simply because the
dashboard response gains trend and category data. Reuse shared
calculation/service functions to avoid inconsistent totals.

## 5.7 AI endpoints

Keep the existing endpoint while adding new capabilities:

  ---------------------------------------------------------------------------------
  Method                  Endpoint                          Purpose
  ----------------------- --------------------------------- -----------------------
  GET                     `/api/ai/advice`                  Existing Groq-based AI
                                                            advice

  POST                    `/api/ai/magic-log/parse`         Parse text into
                                                            candidate transactions

  POST                    `/api/ai/scan-receipt`            Extract candidate
                                                            transaction from image

  POST                    `/api/ai/magic-log/confirm`       Save user-confirmed
                                                            parsed transactions

  GET                     `/api/ai/insights?month=&year=`   Return structured
                                                            insights and score

  POST                    `/api/ai/chat`                    Answer using current
                                                            user's financial
                                                            context
  ---------------------------------------------------------------------------------

The parse/confirm separation is intentional: parsing must not silently
write financial records.

## 5.8 Recurring bills and alerts endpoints

Suggested future routes:

  Method   Endpoint                      Purpose
  -------- ----------------------------- --------------------------------------
  GET      `/api/recurring-bills`        List user's recurring bills
  POST     `/api/recurring-bills`        Create a recurring bill
  PATCH    `/api/recurring-bills/<id>`   Update/pause a bill
  DELETE   `/api/recurring-bills/<id>`   Remove a bill
  GET      `/api/alerts`                 Retrieve calculated or stored alerts

Implement only when the corresponding module is scheduled.

------------------------------------------------------------------------

# 6. AI and data-integrity rules

These rules apply across Magic Input, receipt scanning, AI Insights, and
Ask AI.

1.  **Financial arithmetic belongs in backend code.** Use Python/SQL for
    totals, balances, percentages, comparisons, and score inputs.
2.  **AI output is untrusted input.** Parse and validate model output
    before using it.
3.  **Use structured JSON.** Do not build frontend components by parsing
    arbitrary Markdown generated by a model.
4.  **Require user confirmation for data entry.** AI-generated
    transaction candidates must be reviewed before saving.
5.  **Keep user context isolated.** Only the authenticated user's
    records may be passed to an AI prompt.
6.  **Minimize prompt data.** Send aggregated, relevant financial
    context rather than unnecessary raw personal records.
7.  **Handle uncertainty honestly.** If a receipt total or date is
    unclear, ask for review rather than guessing.
8.  **Protect secrets.** AI API keys belong in environment variables,
    never in frontend code or committed source.
9.  **Handle provider failures.** Return useful errors and keep manual
    transaction entry available.
10. **Do not let AI execute financial actions silently.** The user must
    explicitly confirm changes to saved records.

------------------------------------------------------------------------

# 7. Frontend structure and user journeys

The exact existing React folder structure should be inspected before
moving files. Extend the current project rather than imposing a new
folder architecture without need.

## 7.1 Main screens

-   Login
-   Register
-   Dashboard
-   Transactions
-   Budgets
-   AI Insights
-   Ask AI drawer
-   Optional recurring bills / alerts view

## 7.2 Key user journeys

### First-time user

1.  Register.
2.  Log in.
3.  Set an overall monthly budget.
4.  Add a transaction manually or with Magic Input.
5.  Review dashboard and insights.

### Returning user

1.  Log in.
2.  Review current balance and spending.
3.  Check category budget progress.
4.  Review alerts and upcoming bills.
5.  Ask AI a contextual question.

### Exhibition judge

1.  Open the application.
2.  Choose Demo Login.
3.  See a populated dashboard immediately.
4.  Try Magic Input.
5.  Scan a sample receipt.
6.  Explore category limits and structured AI insights.
7.  Ask AI a question about the demo financial data.

The demo journey should be rehearsed on the actual deployed frontend and
backend before exhibition day.

------------------------------------------------------------------------

# 8. Recommended implementation roadmap

Build in small vertical slices: backend model/route, endpoint tests,
frontend integration, then deployment verification.

## Phase 0 --- Audit and stabilize the MVP

-   Inspect the current repository and deployed configuration.
-   Confirm existing models, routes, response formats, and migrations.
-   Fix balance and remaining-budget definitions.
-   Standardize currency formatting.
-   Fix any raw Markdown rendering in AI Insights.
-   Back up the database.
-   Record current API behavior so regressions can be detected.

**Exit condition:** Existing MVP still works and its calculations are
consistent.

## Phase 1 --- Database migration and authentication

-   Add users and password hashing.
-   Implement register/login/current-user.
-   Add JWT protection.
-   Migrate existing data to a deliberate owner.
-   Add ownership filters to every private query.
-   Extend the existing `api.js`.
-   Add protected frontend routes.

**Exit condition:** Multiple users can use the app without seeing one
another's data; existing data remains available to its assigned owner.

## Phase 2 --- Demo account

-   Create a seed script.
-   Populate realistic sample data.
-   Add one-click demo login.
-   Verify the complete demo flow on the deployed site.

**Exit condition:** A judge can enter the app and explore useful data
without manual setup.

## Phase 3 --- Category-wise budgeting

-   Add category-budget model and migration.
-   Implement get/update endpoints.
-   Add category progress cards.
-   Test thresholds and edge cases.

**Exit condition:** Category spending and progress match transaction
records.

## Phase 4 --- AI Receipt Scanner

-   Compare vision, OCR, and hybrid approaches using sample receipts.
-   Implement upload validation.
-   Return structured extraction candidates.
-   Build editable review form.
-   Save only after confirmation.

**Exit condition:** A judge can scan a sample receipt, correct extracted
fields, and save a transaction.

## Phase 5 --- Magic Input and voice

-   Implement structured parsing.
-   Add preview/confirmation flow.
-   Integrate normal transaction creation.
-   Add browser speech-to-text with typed fallback.

**Exit condition:** One sentence can produce multiple editable candidate
transactions, with no silent saving.

## Phase 6 --- Structured AI Insights and health score

-   Define the deterministic score formula.
-   Implement aggregated backend metrics.
-   Return strict structured insight JSON.
-   Build Bento cards, score visualization, and action links.
-   Keep existing AI advice available during transition.

**Exit condition:** Insights are data-grounded, structured, and visually
useful.

## Phase 7 --- Ask AI

-   Build contextual data aggregation.
-   Add authenticated chat endpoint.
-   Add drawer UI and prompt suggestions.
-   Test questions involving balances, budgets, and spending.

**Exit condition:** AI answers reflect only the current user's data and
distinguish balance from budget remaining.

## Phase 8 --- What-If simulator

-   Use trusted category spending totals.
-   Add slider and live projections.
-   Label assumptions and estimates.

**Exit condition:** Hypothetical changes never alter saved financial
records.

## Phase 9 --- Recurring bills and smart alerts

-   Add recurring-bill model and routes.
-   Calculate upcoming due dates.
-   Implement deterministic alert rules.
-   Add dashboard/alerts UI.

**Exit condition:** Upcoming obligations and alerts are accurate and
user-specific.

## Phase 10 --- Streaks and achievements

-   Define meaningful achievement rules.
-   Track progress and awarded milestones.
-   Add optional badges.

**Exit condition:** Achievements are reproducible and not duplicated.

## Phase 11 --- Exhibition polish and deployment

-   Dark mode and responsive layout.
-   Animations and loading states.
-   Interactive charts.
-   Consistent design and currency.
-   Seed/reset demo data procedure.
-   End-to-end regression tests.
-   Rehearse the exhibition demonstration.
-   Verify production environment variables and CORS.

**Exit condition:** The complete demonstration works on the deployed
application, including failure and empty states.

------------------------------------------------------------------------

# 9. Testing and quality checklist

## Backend tests

-   Valid and invalid registration.
-   Duplicate email.
-   Correct and incorrect login.
-   Missing/invalid/expired token.
-   User A cannot access User B's transaction or budget.
-   Transaction amount/type/date validation.
-   Dashboard totals reconcile with transactions.
-   Budget calculations handle zero/missing limits.
-   Category spending excludes income.
-   Magic Input rejects malformed model output.
-   Receipt upload rejects unsupported/oversized files.
-   AI provider failure does not corrupt data.
-   Recurring bill due dates are correct.
-   Alerts are user-specific.

## Frontend tests

-   Login, logout, and protected routes.
-   Token expiry behavior.
-   API loading/error/empty states.
-   Manual transaction creation and deletion.
-   Budget editing and progress updates.
-   Magic Input preview/edit/confirm.
-   Receipt preview/edit/confirm.
-   Responsive Ask AI drawer.
-   Dark mode.
-   Demo login and demo data.

## Deployment checks

-   Frontend API base URL points to the intended backend.
-   Production CORS allows the deployed frontend origin.
-   Secrets are configured on the backend host.
-   Database file and migration state are correct.
-   Refreshing a frontend route does not produce a hosting 404.
-   Demo account works on the production deployment.
-   No local-only URLs remain in production configuration.

------------------------------------------------------------------------

# 10. Important decisions and unresolved items

These decisions should be made deliberately during implementation rather
than silently assumed.

  -----------------------------------------------------------------------
  Topic                               Recommended direction
  ----------------------------------- -----------------------------------
  Database                            Preserve existing SQLite data and
                                      migrate

  Existing budget table               Inspect and extend/migrate; do not
                                      duplicate blindly

  Authentication                      Email/password + JWT first

  Google OAuth                        Optional later

  Demo access                         Seeded demo user with isolated
                                      sample data

  Existing AI advice                  Keep Groq integration working

  Receipt scanner                     Run a small comparison of vision,
                                      OCR, and hybrid approaches

  Magic Input                         Parse → validate → preview →
                                      confirm → save

  Health score                        Deterministic documented formula;
                                      AI explains it

  Alerts                              Start with deterministic rules

  Recurring bills                     Dedicated recurring-bill model, not
                                      only a boolean

  What-If                             Client-side projections from
                                      trusted analytics initially

  API migration                       Preserve old routes until V2
                                      frontend is integrated

  Currency                            One consistent PKR/Rs display
                                      convention

  UI                                  Polish after core flows work, with
                                      incremental visual improvements
  -----------------------------------------------------------------------

------------------------------------------------------------------------

# 11. Working agreement for future development sessions

To continue from the MVP without losing track:

1.  Work on one feature or one small milestone at a time.
2.  Before changing code, inspect the relevant existing files and
    current implementation.
3.  Explain the purpose of each model, route, service, and frontend
    change.
4.  Prefer extending existing code over duplicating it.
5.  Do not replace working endpoints without a migration/compatibility
    plan.
6.  Test backend endpoints independently before integrating the
    frontend.
7.  Test the complete user flow after frontend integration.
8.  Keep API documentation updated when request/response contracts
    change.
9.  Use environment variables for secrets and environment-specific URLs.
10. Back up the database before schema migrations.
11. Never claim a feature is complete until it has been tested.
12. Keep a short progress log: completed, currently working, next step,
    and known issues.

## Definition of done for a feature

A feature is complete only when:

-   Its data model and validation are understood.
-   Its backend behavior is implemented and tested.
-   Its API contract is documented.
-   Its frontend is integrated.
-   Loading, error, empty, and success states are handled.
-   User ownership and privacy are enforced.
-   It has been tested with realistic data.
-   It works in the intended deployment environment when deployment is
    part of the milestone.

------------------------------------------------------------------------

# 12. Final product summary

SpendWise AI V2 is an upgrade of the existing deployed MVP, not a new
application.

It preserves the working Flask/React/SQLite foundation and existing
transaction, dashboard, budget, analytics, and Groq AI advice
functionality. It adds secure multi-user accounts, a judge-friendly demo
account, category-wise budgets, natural-language and voice transaction
entry, AI receipt scanning, structured AI insights, a transparent
financial health score, contextual Ask AI, a What-If savings simulator,
smart alerts, recurring bills, and achievements.

The priority is to build a reliable, demonstrable financial product. A
smaller number of complete, trustworthy features is more valuable at the
exhibition than a large collection of unfinished screens.

**First implementation task:** Audit the current repository's SQLAlchemy
models, Flask routes, migration history, database file, and frontend API
helper. Then write a safe database migration plan before implementing
authentication.
