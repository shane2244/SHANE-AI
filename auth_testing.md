# Emergent Google Auth Testing Playbook

## Test user and session

Create a temporary MongoDB user with a custom `user_id` plus a matching `user_sessions` record. Sessions expire after seven days and use `session_token`; MongoDB `_id` is never returned by APIs.

## Backend checks

- Call `GET /api/auth/me` with `Authorization: Bearer <session_token>`.
- Confirm the response includes `user_id`, `email`, `name`, and `is_premium`.
- Confirm protected premium endpoints reject missing/expired sessions.
- Confirm all MongoDB reads exclude `_id`.

## Browser checks

- Add an httpOnly, secure, SameSite=None `session_token` cookie for the preview domain.
- Visit `/app/discovery` and confirm member state loads from `/api/auth/me`.
- Confirm the OAuth callback is detected from `useLocation().hash` before protected routing.
- Confirm logout clears the cookie and member UI.
- Confirm a paid test user can view locked report sections while a free user sees half previews.

## Cleanup

Delete test users with `email` matching `test.user.*@example.com` and sessions with tokens matching `test_session_*`.