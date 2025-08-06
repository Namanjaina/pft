    # Finance Tracker

A personal finance tracking application built with Next.js and React.

## Features

### Expense Tracking
- Add, edit, and delete expenses
- Categorize expenses
- View expense history
- Generate reports and visualizations

### Receipt Scanning
The application includes a receipt scanning feature that allows users to:
- Upload images of receipts
- Automatically extract expense information (amount, date, merchant, category)
- Add the extracted information to their expenses

The receipt scanning process uses computer vision techniques to:
1. Detect the edges of the receipt in the image
2. Find the contours of the receipt
3. Apply perspective transformation to get a top-down view
4. Use OCR (Optical Character Recognition) to extract text
5. Parse the text to find relevant expense information

### Bank Account Integration
- Link bank accounts
- Import transactions
- View account balances

### Reports and Analytics
- View expense trends over time
- Analyze spending by category
- Generate PDF and CSV reports

## Getting Started

1. Clone the repository
2. Install dependencies: `npm install`
3. Run the development server: `npm run dev`
4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Technologies Used

- Next.js
- React
- TypeScript
- Tailwind CSS
- shadcn/ui
- Chart.js

