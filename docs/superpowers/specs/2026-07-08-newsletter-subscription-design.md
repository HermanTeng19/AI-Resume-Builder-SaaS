# Newsletter Subscription Integration - Design Spec

## 1. Overview
The objective is to implement a high-conversion, Beehiiv-style email subscription feature for Career Insight Labs. This will allow users to subscribe to the newsletter directly from the blog and homepage, enhancing user retention and engagement. The architecture must ensure the security of third-party API keys while providing a seamless user experience.

## 2. Frontend Architecture
### 2.1 Component Design
- **Component**: `<NewsletterSubscribe />` (React Functional Component)
- **Styling**: Tailored to mimic the minimalist, high-converting aesthetic of Beehiiv. Includes a strong value proposition headline, an email input field, and a call-to-action (CTA) button.
- **Placement**: Designed to be responsive and modular. It will be embedded at the bottom of all markdown blog posts and strategically on the homepage.

### 2.2 State Management
The component will manage four distinct UI states:
- **Idle**: Default view showing the input field and active button.
- **Loading**: While the API request is in flight, the input will be disabled and the button will show a loading spinner/text.
- **Success**: Upon successful subscription, the input and button will fade out, replaced by a visual success message (e.g., "✅ Successfully subscribed!").
- **Error**: If the API fails or the email is invalid, a subtle red inline error message will appear below the input without breaking the layout.

## 3. Backend & Data Flow
### 3.1 Vercel Serverless Function
Directly calling the third-party mailing API (like Beehiiv or Mailchimp) from the frontend exposes private API keys. To prevent this, we will use a serverless function.
- **Endpoint**: `/api/subscribe`
- **Method**: POST
- **Payload**: `{ "email": "user@example.com" }`

### 3.2 Proxy Logic
1. The frontend sends the user's email to `/api/subscribe`.
2. The serverless function retrieves the secure API key from environment variables (`process.env.MAIL_API_KEY`).
3. The function forwards the request to the chosen third-party email provider's API.
4. The function returns a standard HTTP 200 (Success) or 400/500 (Error) response to the frontend.

## 4. Security & Environment Variables
- The API Key will **never** be exposed in the frontend bundle.
- Requires configuring `MAIL_API_KEY` in the Vercel project dashboard.
- Basic server-side email validation will be performed before forwarding the request to avoid spamming the third-party API.

## 5. Implementation Steps (Next Phase)
1. Initialize `/api/subscribe.ts` function.
2. Build the `<NewsletterSubscribe />` UI component and integrate state logic.
3. Inject the component into the blog post layout and homepage.
4. Test all states (Success, Error, Loading) using a mock API key before full integration.
