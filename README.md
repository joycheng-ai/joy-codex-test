# AutoParts CRM Demo

A simple, local customer-development tracker for an automotive-parts company selling into the U.S. market. It is designed for wholesalers, distributors, repair chains, and independent repair shops.

## Features

- Dashboard totals for all customers, customers due for follow-up, customers in quoting, and won customers
- Search by company name and filter by state, customer type, or follow-up status
- Add, edit, view, and delete customer records
- Tracks contact details, vehicle/product interests, source, follow-up dates, status, and notes
- Includes five fictional U.S. customer records for testing
- Stores data only in your browser with `localStorage`—no database, account, paid service, or internet connection required
- Responsive English interface for desktop and mobile use

> **Demo storage note:** Data belongs to the browser and device where it was entered. Clearing browser site data removes it. This demo is not intended for sensitive or production customer data.

## How to run (recommended for non-technical users)

1. Install [Python 3](https://www.python.org/downloads/) if it is not already installed.
2. Download or copy this project folder.
3. Open Terminal (macOS/Linux) or PowerShell (Windows) in the project folder.
4. Run:

   ```bash
   python3 -m http.server 8000
   ```

   On Windows, if `python3` is not recognized, run `python -m http.server 8000` instead.
5. Open <http://localhost:8000> in Chrome, Edge, Firefox, or Safari.
6. Keep the terminal window open while using the demo. Press **Ctrl+C** in the terminal to stop it.

There is no installation, build step, login, or configuration.

## Quick test checklist

1. Confirm the dashboard shows **5** total sample customers.
2. Type `Liberty` in the search box and confirm one company remains.
3. Clear the search, then try the State, Customer Type, and Status filters.
4. Click **Add customer**, complete at least the required Company Name field, and save.
5. Click **Edit** on a row, change its status or next follow-up date, and save.
6. Click **Delete** and confirm the prompt to remove a record.
7. Refresh the page and confirm your changes remain.
8. Click **Reset demo data** to restore the five original sample records.

## Project files

- `index.html` — page structure, dashboard, customer table, and customer form
- `styles.css` — responsive visual design
- `app.js` — sample data, local storage, search/filtering, statistics, and CRUD behavior

## Limitations and suggested next steps

This first version is intentionally local and single-user. A future production version could add secure sign-in, shared cloud storage, CSV import/export, activity history, reminders, owner assignment, and role-based access. Before storing real customer information, add authentication, backups, access controls, and an appropriate privacy/security review.
