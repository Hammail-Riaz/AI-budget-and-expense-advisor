## 1. Create a Transaction

### Endpoint Information

| Property | Value |
|---|---|
| Endpoint | `/api/transactions` |
| HTTP Method | `POST` |
| Content-Type | `application/json` |
| Success Status | `201 Created` |

**Purpose:**  
This endpoint allows the frontend to add a new income or expense transaction. The backend validates the submitted information and saves the transaction in the SQLite database.

### Request Body

The frontend must send a JSON object containing the following fields:

| Field | Data Type | Required | Description |
|---|---|---|---|
| `amount` | Number | Yes | Transaction amount (must be greater than 0) |
| `category` | String | Yes | Transaction category |
| `type` | String | Yes | Either `Income` or `Expense` |
| `description` | String | No | Optional transaction description (maximum 255 characters) |
| `date` | String | Yes | Transaction date in `YYYY-MM-DD` format |

**Example Request:**

```json
{
  "amount": 1500,
  "category": "Food",
  "type": "Expense",
  "description": "Lunch",
  "date": "2026-11-20"
}
```

### Available Categories

**Income Categories:**
- Pocket Money
- Salary
- Freelancing
- Business Income
- Other Income

**Expense Categories:**
- Food
- Transport
- Education
- Shopping
- Entertainment
- Bills
- Healthcare
- Other

The category must match the selected transaction type.

### Successful Response

**HTTP Status: `201 Created`**

```json
{
  "success": true,
  "message": "Transaction added successfully",
  "transaction": {
    "amount": "1500.00",
    "category": "Food",
    "date": "2026-11-20",
    "description": "Lunch",
    "id": 1,
    "type": "Expense"
  }
}
```

The backend automatically generates the transaction `id`. The amount is returned as a decimal string with two decimal places.

### Error Responses

| HTTP Status | Meaning |
|---|---|
| `400 Bad Request` | Missing, invalid, or incorrectly formatted request data |
| `500 Internal Server Error` | Database error or unexpected server error |

Validation errors include details about the invalid fields.

### Frontend Integration (React)

The frontend can use JavaScript's built-in `fetch()` API to send the request.

```javascript
const response = await fetch(
  "http://127.0.0.1:5000/api/transactions",
  {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      amount: 1500,
      category: "Food",
      type: "Expense",
      description: "Lunch",
      date: "2026-11-20"
    })
  }
);

const result = await response.json();

if (response.ok) {
  console.log("Transaction added:", result.transaction);
} else {
  console.error("Error:", result);
}
```

### Backend Processing Workflow

1. Receives the transaction data from the frontend.
2. Checks that the request contains JSON.
3. Validates the fields using Marshmallow.
4. Creates a transaction using the transaction service.
5. Saves the transaction through SQLAlchemy into SQLite.
6. Returns the saved transaction and a success response.

**Important:** The frontend should use the returned transaction object, particularly its database-generated `id`, rather than generating its own transaction ID.

<hr>

## 2. Get Dashboard Statistics

### Endpoint Information

| Property | Value |
|---|---|
| Endpoint | `/api/dashboard` |
| HTTP Method | `GET` |
| Content-Type | Not required |
| Success Status | `200 OK` |

**Purpose:**

This endpoint retrieves the user's current month's financial overview, including total income, total expenses, balance, monthly budget, and remaining budget.

The backend calculates these statistics using transaction and budget records stored in the SQLite database.

### Request

**URL:**

```text
http://127.0.0.1:5000/api/dashboard
```

No request body or parameters are required.

The endpoint automatically determines the current month and year.

### Successful Response

**HTTP Status: `200 OK`**

```json
{
  "success": true,
  "message": "Dashboard statistics retrieved successfully",
  "dashboard": {
    "period": {
      "month": 11,
      "year": 2026
    },
    "total_income": "10000.00",
    "total_expenses": "1500.00",
    "balance": "8500.00",
    "monthly_budget": null,
    "remaining_budget": null
  }
}
```

### Response Fields

| Field | Description |
|---|---|
| `period` | Current month and year |
| `total_income` | Sum of all income transactions for the current month |
| `total_expenses` | Sum of all expense transactions for the current month |
| `balance` | Total income minus total expenses |
| `monthly_budget` | Monthly budget limit, or `null` if not configured |
| `remaining_budget` | Monthly budget minus total expenses, or `null` if no budget exists |

**Note:** Monetary values are returned as strings with two decimal places to preserve decimal precision.

### Calculation Logic

The backend uses the following formulas:

**1. Total Income**

Sum of all transactions where `type = "Income"` during the current month.

**2. Total Expenses**

Sum of all transactions where `type = "Expense"` during the current month.

**3. Balance**

```text
Balance = Total Income - Total Expenses
```

**4. Remaining Budget**

```text
Remaining Budget = Monthly Budget - Total Expenses
```

If no monthly budget exists, both `monthly_budget` and `remaining_budget` return `null`.

### Error Responses

| HTTP Status | Meaning |
|---|---|
| `500 Internal Server Error` | Database error or unexpected server error |

### Frontend Integration (React)

The frontend can retrieve dashboard statistics using JavaScript's `fetch()` API.

```javascript
const response = await fetch(
  "http://127.0.0.1:5000/api/dashboard"
);

const result = await response.json();

if (response.ok) {
  const dashboard = result.dashboard;

  console.log("Income:", dashboard.total_income);
  console.log("Expenses:", dashboard.total_expenses);
  console.log("Balance:", dashboard.balance);
  console.log("Monthly Budget:", dashboard.monthly_budget);
} else {
  console.error("Dashboard error:", result.message);
}
```

### Backend Processing Workflow

1. Receives a GET request from the frontend.
2. Determines the current month and year.
3. Retrieves and aggregates income transactions.
4. Retrieves and aggregates expense transactions.
5. Calculates the current balance.
6. Retrieves the current month's budget, if available.
7. Calculates the remaining budget when a budget exists.
8. Returns the statistics as a JSON response.

### Important Frontend Notes

- The dashboard automatically displays statistics for the current month.
- No request body is required.
- The frontend should handle `null` budget values when a monthly budget has not been configured.
- Statistics update when new transactions are added or deleted.
- A negative balance is valid and means expenses exceed income.

<hr>

## 3. Get All Transactions

### Endpoint Information

| Property | Value |
|---|---|
| Endpoint | `/api/transactions` |
| HTTP Method | `GET` |
| Request Body | Not required |
| Success Status | `200 OK` |

**Purpose:**

This endpoint retrieves all income and expense transactions stored in the SQLite database.

Transactions are returned in descending order by date, with newer transaction IDs appearing first when dates are the same.

### Request

```text
GET http://127.0.0.1:5000/api/transactions
```

No request body or parameters are required.

### Successful Response

**HTTP Status: `200 OK`**

```json
{
  "success": true,
  "message": "Transactions retrieved successfully",
  "transactions": [
    {
      "id": 2,
      "amount": "10000.00",
      "category": "Pocket Money",
      "type": "Income",
      "description": "Monthly pocket money",
      "date": "2026-11-20"
    },
    {
      "id": 1,
      "amount": "1500.00",
      "category": "Food",
      "type": "Expense",
      "description": "Lunch",
      "date": "2026-11-20"
    }
  ]
}
```

### Response Fields

| Field | Description |
|---|---|
| `success` | Indicates whether the request succeeded |
| `message` | Response status message |
| `transactions` | Array containing transaction records |
| `id` | Unique database-generated transaction ID |
| `amount` | Transaction amount, returned as a decimal string |
| `category` | Transaction category |
| `type` | Either `Income` or `Expense` |
| `description` | Optional transaction description |
| `date` | Transaction date in `YYYY-MM-DD` format |

### Empty Database Response

If no transactions exist, the endpoint returns an empty array instead of an error.

```json
{
  "success": true,
  "message": "Transactions retrieved successfully",
  "transactions": []
}
```

### Error Responses

| HTTP Status | Meaning |
|---|---|
| `500 Internal Server Error` | Database error or unexpected server error |

### Frontend Integration (React)

The frontend can retrieve transaction history using JavaScript's `fetch()` API.

```javascript
const response = await fetch(
  "http://127.0.0.1:5000/api/transactions"
);

const result = await response.json();

if (response.ok) {
  const transactions = result.transactions;

  console.log("All transactions:", transactions);
} else {
  console.error("Error:", result.message);
}
```

The React frontend can map over the returned array to display transactions in a table or transaction history component.

### Backend Processing Workflow

1. Receives a GET request from the frontend.
2. Calls the `get_all_transactions()` service function.
3. Queries all records from the transactions table.
4. Sorts records by date and ID in descending order.
5. Serializes the database objects using Marshmallow with `many=True`.
6. Returns the transaction array as JSON.

### Important Frontend Notes

- The endpoint returns all transactions, not just the current month's transactions.
- An empty database returns `transactions: []`.
- Each transaction has a unique database-generated ID.
- The frontend can use this

## 4. DELETE `/api/transactions/:id` — Delete Transaction

Deletes a specific transaction using its unique ID.

### Endpoint

```http
DELETE /api/transactions/:id
```

**Example URL:**
```http
http://127.0.0.1:5000/api/transactions/1
```

### Request Parameters

| Parameter | Type | Required | Description |
|---|---|---|---|
| `id` | Integer | Yes | ID of the transaction to delete |

**Request Body:** None

### Success Response

**Status Code:** `200 OK`

```json
{
  "success": true,
  "message": "Transaction deleted successfully",
  "transaction_id": 1
}
```

### Error Responses

**404 Not Found** — Transaction does not exist.

```json
{
  "success": false,
  "message": "Transaction not found"
}
```

**500 Internal Server Error** — Database or unexpected server error.

```json
{
  "success": false,
  "message": "Database error while deleting transaction"
}
```

### Frontend Integration (React)

Use JavaScript's `fetch()` to send a DELETE request:

```javascript
const response = await fetch(
  `http://127.0.0.1:5000/api/transactions/${id}`,
  {
    method: "DELETE"
  }
);

const data = await response.json();

if (data.success) {
  console.log("Transaction deleted successfully");

  // Refresh transactions or update React state
} else {
  console.error(data.message);
}
```

**Note:** Replace `${id}` with the ID of the transaction selected for deletion. After successful deletion, update the frontend transaction list so the deleted transaction disappears.

### Important

- No request body is required.
- The transaction is permanently deleted from the database.
- Returns `200` if successful and `404` if the transaction does not exist.
- The frontend should refresh or update its transaction list after successful deletion.


## 5. POST `/api/budget` — Create or Update Monthly Budget

Creates a new monthly budget or updates an existing budget for the specified month and year.

### Endpoint

```http
POST /api/budget
```

**Example URL:**
```text
http://127.0.0.1:5000/api/budget
```

### Request Headers

```http
Content-Type: application/json
```

### Request Body

```json
{
  "monthly_limit": 20000,
  "month": 11,
  "year": 2026
}
```

| Field | Type | Required | Description |
|---|---|---|---|
| `monthly_limit` | Number | Yes | Monthly spending limit (must be greater than 0) |
| `month` | Integer | Yes | Month number (1–12) |
| `year` | Integer | Yes | Year (2020–2100) |

### Success Response

**Status Code:** `200 OK`

```json
{
  "success": true,
  "message": "Budget saved successfully",
  "budget": {
    "id": 1,
    "monthly_limit": "20000.00",
    "month": 11,
    "year": 2026
  }
}
```

### Error Responses

**400 Bad Request** — Invalid or missing request data.

```json
{
  "success": false,
  "message": "Validation failed",
  "errors": {
    "monthly_limit": [
      "Must be greater than or equal to 0.01."
    ]
  }
}
```

**500 Internal Server Error** — Database or unexpected server error.

```json
{
  "success": false,
  "message": "Database error while saving budget"
}
```

### Create vs Update Behavior

The backend checks whether a budget already exists for the supplied month and year.

- **New budget:** Creates a new database record if no budget exists.
- **Existing budget:** Updates the monthly limit if a budget already exists for that month and year.
- The existing budget ID remains unchanged during an update.

### Frontend Integration (React)

```javascript
const response = await fetch(
  "http://127.0.0.1:5000/api/budget",
  {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      monthly_limit: 20000,
      month: 11,
      year: 2026
    })
  }
);

const data = await response.json();

if (data.success) {
  console.log("Budget saved:", data.budget);
} else {
  console.error(data.message);
}
```

### Important Notes

- The same endpoint handles both creation and updating.
- A budget is uniquely identified by its month and year.
- Only one budget can exist for a particular month and year.
- The backend validates incoming data before saving it.
- The endpoint returns `200 OK` for both creation and updating.


## 6. GET `/api/budget` — Retrieve Monthly Budget

Retrieves the monthly budget for a specified month and year. If no query parameters are provided, the backend automatically retrieves the current month's budget.

### Endpoint

```http
GET /api/budget
```

**Base URL:**
```text
http://127.0.0.1:5000
```

### Request Parameters (Query Parameters)

| Parameter | Type | Required | Description |
|---|---|---|---|
| `month` | Integer | No | Month number (1–12) |
| `year` | Integer | No | Year (2020–2100) |

**Example URL:**

```text
http://127.0.0.1:5000/api/budget?month=11&year=2026
```

If both parameters are omitted, the current month and year are used.

**Request Body:** None

### Success Response

**Status Code:** `200 OK`

```json
{
  "success": true,
  "message": "Budget retrieved successfully",
  "budget": {
    "id": 1,
    "monthly_limit": "25000.00",
    "month": 11,
    "year": 2026
  }
}
```

### Error Responses

**400 Bad Request** — Invalid month or year.

```json
{
  "success": false,
  "message": "Month must be between 1 and 12"
}
```

Invalid integer values:

```json
{
  "success": false,
  "message": "Month and year must be valid integers"
}
```

**404 Not Found** — No budget exists for the requested month and year.

```json
{
  "success": false,
  "message": "Budget not found"
}
```

**500 Internal Server Error** — Database or unexpected server error.

```json
{
  "success": false,
  "message": "Database error while retrieving budget"
}
```

### Frontend Integration (React)

```javascript
// Retrieve November 2026 budget
const response = await fetch(
  "http://127.0.0.1:5000/api/budget?month=11&year=2026"
);

const data = await response.json();

if (data.success) {
  console.log("Monthly budget:", data.budget.monthly_limit);
} else {
  console.error(data.message);
}
```

To retrieve the current month's budget automatically:

```javascript
const response = await fetch(
  "http://127.0.0.1:5000/api/budget"
);

const data = await response.json();
```

### Important Notes

- Uses HTTP GET.
- No request body is required.
- Both query parameters are optional.
- If both are omitted, the current month and year are used.
- If only one is provided, the other defaults to the current value.
- Returns `404` when the requested budget does not exist.
- Monthly budget amounts are returned as decimal strings.



## 7. GET `/api/analytics` — Retrieve Spending Analytics

Retrieves spending analytics for the dashboard, including category-wise expenses and monthly expense trends.

### Endpoint

```http
GET /api/analytics
```

**Example URL:**
```text
http://127.0.0.1:5000/api/analytics
```

### Request

- Method: `GET`
- Request body: None
- Query parameters: None

### Success Response

**Status Code:** `200 OK`

```json
{
  "success": true,
  "message": "Analytics retrieved successfully",
  "analytics": {
    "category_expenses": [
      {
        "category": "Food",
        "total": 1500.0
      },
      {
        "category": "Other",
        "total": 150.0
      },
      {
        "category": "Transport",
        "total": 150.0
      },
      {
        "category": "Entertainment",
        "total": 150.0
      }
    ],
    "monthly_expenses": [
      {
        "month": 6,
        "year": 2026,
        "total": 0.0
      },
      {
        "month": 7,
        "year": 2026,
        "total": 0.0
      },
      {
        "month": 8,
        "year": 2026,
        "total": 0.0
      },
      {
        "month": 9,
        "year": 2026,
        "total": 0.0
      },
      {
        "month": 10,
        "year": 2026,
        "total": 0.0
      },
      {
        "month": 11,
        "year": 2026,
        "total": 1950.0
      }
    ]
  }
}
```

*The response above illustrates the verified November 2026 test data. Actual values depend on database transactions and the current date.*

### Response Fields

**1. `category_expenses`**

Contains total expenses grouped by category for the current month.

| Field | Type | Description |
|---|---|---|
| `category` | String | Expense category |
| `total` | Number | Total spending in that category |

**2. `monthly_expenses`**

Contains expense totals for the current month and previous five months.

| Field | Type | Description |
|---|---|---|
| `month` | Integer | Month number (1–12) |
| `year` | Integer | Calendar year |
| `total` | Number | Total expenses for that month |

Months without expenses are included with a total of `0.0`.

### Frontend Integration (React)

```javascript
const response = await fetch(
  "http://127.0.0.1:5000/api/analytics"
);

const data = await response.json();

if (data.success) {
  const categoryData = data.analytics.category_expenses;
  const monthlyData = data.analytics.monthly_expenses;

  console.log("Category expenses:", categoryData);
  console.log("Monthly expenses:", monthlyData);
} else {
  console.error(data.message);
}
```

### Error Response

**500 Internal Server Error** — Database or unexpected server error.

```json
{
  "success": false,
  "message": "Database error while retrieving analytics"
}
```

### Important Notes

- Only `Expense` transactions are included.
- Income transactions are excluded.
- Category expenses cover the current calendar month.
- Monthly expenses cover six calendar months, including the current month.
- Months without expenses return `0.0`.
- Category results are grouped by category.
- The endpoint provides data suitable for pie/doughnut and bar charts.


## 8. POST `/api/ai/advice` — Generate AI Financial Advice

Generates personalized financial recommendations using the current month's financial data and Groq AI.

### 1. Request

| Property | Value |
|---|---|
| Method | POST |
| Endpoint | `/api/ai/advice` |
| Body | None required |

**URL:**
```text
http://127.0.0.1:5000/api/ai/advice
```

### 2. How It Works

1. Retrieves current month's transactions and budget.
2. Calculates income, expenses, balance, and budget utilization using Python.
3. Groups expenses by category.
4. Sends the financial report to Groq AI.
5. Returns the financial report and generated advice.

### 3. Expected Response (HTTP 200)

```json
{
  "success": true,
  "message": "AI financial advice generated successfully",
  "financial_report": {
    "currency": "PKR",
    "period": {
      "month": 11,
      "year": 2026
    },
    "total_income": "10000.00",
    "total_expenses": "1950.00",
    "balance": "8050.00",
    "monthly_budget": "21.00",
    "remaining_budget": "-1929.00",
    "budget_utilization": 9285.7,
    "category_breakdown": {
      "Food": "1500.00",
      "Transport": "150.00",
      "Entertainment": "150.00",
      "Other": "150.00"
    }
  },
  "advice": "AI-generated financial recommendations..."
}
```

### 4. Error Responses

| Status Code | Description |
|---|---|
| 429 | Groq API rate limit reached |
| 500 | Database or unexpected server error |
| 502 | Groq API request failed |
| 503 | Groq API key not configured |
| 504 | Groq API timeout |

### 5. Important Notes

- No request body is required.
- Financial calculations are performed by Python.
- AI recommendations are generated using Groq.
- Financial data is retrieved automatically from SQLite.
- The Groq API key remains on the backend.