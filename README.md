# Dream Agent OS

Mobile-first real estate operating system for agents in Myanmar/Burma.

## What Works Now

- Agent login for the local MVP.
- English and Burmese language toggle.
- Property creation and editing.
- Owner contact details saved with each property.
- Myanmar/Burma land title selections like grant land, permit land, ancestral land, farmland, and garden land.
- Developed / not developed status for faster agent scanning.
- Private/public listing visibility so public pages can come later without leaking owner data.
- Owner phone masking by default with reveal reason, short-lived reveal, blocked requests, and sensitive access logs.
- Multiple image uploads per property.
- Search by code, owner, location, description, and notes.
- Filters for sale/rent, status, and property type.
- Fast status updates from the list and detail view.
- Lead inbox with source tracking for Facebook, phone, referral, website, walk-in, iMyanmarHouse, and ShweProperty.
- Client requirement records and a matching view that scores available inventory against buyer/renter needs.
- Showing workflow with schedule, status, result, and next action.
- Team roster with active/inactive staff, roles, phone numbers, and assignment support.
- My Schedule view for filtering showing tasks by team member and day.
- Login history records for phone-based staff access tracking.
- Security dashboard for owner-phone reveal history, suspicious flags, and blocked reveal requests.
- Strategy tab with the first-principles product direction.
- Firebase-ready persistence for Auth, Firestore, and Storage.
- Local browser fallback when Firebase environment variables are empty.

## Run Locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Production Path

The app runs immediately with local browser storage. To move to production, create a Firebase project, enable Anonymous Auth, Firestore, and Storage, add the values from `.env.example`, then deploy the rules in `firebase/firestore.rules` and `firebase/storage.rules`.

Expected Firestore collections:

- `agents`
- `properties`
- `leads`
- `clientRequirements`
- `showings`
- `teamMembers`
- `accessLogs`
- `ownersPrivate`
- `sensitiveAccessLogs`
- `revealRequests`

Production security note: demo mode still keeps data in browser storage for quick testing. Do not enter real owner phone numbers until Firebase Phone Auth, role-aware rules, App Check, and Cloud Functions for private owner contact retrieval are configured.
