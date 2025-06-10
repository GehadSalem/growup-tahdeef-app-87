
# API Integration Guide

This document explains how the frontend is connected to your backend APIs.

## Setup Instructions

1. **Environment Configuration**
   - Create a `.env` file in your project root
   - Add: `VITE_API_BASE_URL=http://localhost:3000/api`
   - Replace with your actual backend URL

2. **Backend Requirements**
   - Your backend should be running on the specified URL
   - CORS should be configured to allow requests from your frontend
   - All endpoints should return JSON responses

## API Services

### Authentication (`src/services/authService.ts`)
- `POST /login` - User login
- `POST /register` - User registration
- `POST /google` - Google authentication

### Habits (`src/services/habitService.ts`)
- `GET /habits` - Get user habits
- `POST /habits` - Create new habit
- `PATCH /habits/:id` - Mark habit complete
- `PUT /habits/:id` - Update habit
- `DELETE /habits/:id` - Delete habit

### Expenses (`src/services/expenseService.ts`)
- `GET /expenses` - Get user expenses
- `POST /expenses` - Add new expense
- `GET /expenses/:month/:year` - Get monthly report

### Income (`src/services/incomeService.ts`)
- `GET /incomes` - Get user incomes
- `POST /incomes` - Add new income
- `PUT /incomes/:id` - Update income
- `DELETE /incomes/:id` - Delete income

### Emergency Fund (`src/services/emergencyService.ts`)
- `GET /emergency` - Get emergency fund data
- `POST /emergency` - Add to emergency fund

### Installments (`src/services/installmentService.ts`)
- `GET /installments` - Get user installments
- `POST /installments` - Add new installment
- `PATCH /installments/:id/pay` - Mark installment paid

## Authentication Flow

1. User logs in via login page
2. Backend returns JWT token and user data
3. Token stored in localStorage
4. All subsequent API calls include token in Authorization header
5. Protected routes redirect to login if no valid token

## State Management

- **React Query** for API state management and caching
- **Custom hooks** for specific API operations
- **Context API** for authentication state

## Error Handling

- API errors are caught and displayed via toast notifications
- Loading states are managed per operation
- Automatic retry for failed requests (configurable)

## Testing the Integration

1. Start your backend server
2. Update `VITE_API_BASE_URL` in environment
3. Start the frontend development server
4. Test authentication flow
5. Test CRUD operations for each feature

## Data Flow

```
User Action → Component → Custom Hook → API Service → Backend API
                ↓
User Feedback ← Toast/Loading ← React Query ← Response ← Backend API
```

## Key Files

- `src/lib/api.ts` - Base API client
- `src/services/` - API service modules
- `src/hooks/` - Custom hooks for API operations
- `src/hooks/useAuth.tsx` - Authentication context and hooks
