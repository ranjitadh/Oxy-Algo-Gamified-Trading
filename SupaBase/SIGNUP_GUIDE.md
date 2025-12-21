# Signup Guide

## How Signup Works

The system now supports user registration with automatic account creation.

### Signup Flow

1. **User visits `/signup` page**
2. **User enters:**
   - Email address
   - Password (minimum 6 characters)
   - Confirm password
3. **System validates:**
   - Password length (min 6 characters)
   - Password match confirmation
   - Email format
4. **System creates:**
   - Supabase Auth user account
   - Account record in `accounts` table (with balance=0, equity=0, bot_status=false)
5. **User receives:**
   - Email confirmation (if email confirmation is enabled in Supabase)
   - Or immediate access to dashboard (if email confirmation is disabled)

### Email Confirmation

**If email confirmation is ENABLED in Supabase:**
- User must click confirmation link in email
- After confirmation, user can sign in
- Account record is created automatically on first signup

**If email confirmation is DISABLED in Supabase:**
- User is immediately signed in
- Redirected to dashboard
- Account record is created immediately

### Configuring Email Confirmation

1. Go to Supabase Dashboard → Authentication → Settings
2. Find "Enable email confirmations"
3. Toggle ON/OFF as needed

**For development:** Disable email confirmation for faster testing
**For production:** Enable email confirmation for security

## Features

### Password Requirements
- Minimum 6 characters
- Must match confirmation field
- No other restrictions (Supabase handles complexity)

### Automatic Account Creation
- When a user signs up, an account record is automatically created
- Initial values:
  - `balance`: 0
  - `equity`: 0
  - `bot_status`: false
- Account is linked to user via `user_id`

### Error Handling
- Password mismatch errors
- Password too short errors
- Email already exists errors
- Network/connection errors
- All errors displayed clearly to user

## User Experience

### Signup Page (`/signup`)
- Clean, professional design matching login page
- Real-time validation feedback
- Clear error messages
- Link to login page if user already has account

### After Signup
- Success message with email confirmation instructions (if enabled)
- Or immediate redirect to dashboard (if disabled)
- Account ready to use immediately

## Testing Signup

### Test Signup Flow

1. **Visit signup page:**
   ```
   http://localhost:3000/signup
   ```

2. **Fill in form:**
   - Email: `test@example.com`
   - Password: `password123`
   - Confirm: `password123`

3. **Submit form**

4. **Check results:**
   - If email confirmation disabled: Should redirect to dashboard
   - If email confirmation enabled: Should show "Check your email" message

5. **Verify account created:**
   - Go to Supabase Dashboard → Table Editor → `accounts`
   - Should see new account record with your user_id

### Test Validation

Try these to test error handling:

- **Password too short:** Enter password less than 6 characters
- **Password mismatch:** Enter different passwords
- **Invalid email:** Enter invalid email format
- **Existing email:** Try to sign up with email that already exists

## Troubleshooting

### "User already registered" error
- User with this email already exists
- Direct them to login page instead

### Account not created
- Check Supabase logs for errors
- Verify RLS policies allow INSERT on accounts table
- Check browser console for errors
- Account creation failure doesn't block signup (logged but doesn't fail)

### Email confirmation not working
- Check Supabase email settings
- Verify SMTP is configured (for custom emails)
- Check spam folder
- Use Supabase's default email service for testing

### Redirect issues
- Check middleware allows `/signup` route
- Verify session is created correctly
- Check browser console for errors

## Security Considerations

### Password Security
- Passwords are hashed by Supabase (bcrypt)
- Never stored in plain text
- Minimum 6 characters enforced client-side
- Consider adding more requirements in production

### Email Verification
- Recommended for production
- Prevents fake accounts
- Reduces spam
- Can be disabled for development

### Account Creation
- Automatic account creation ensures every user has an account
- Prevents errors from missing account records
- Initial balance/equity set to 0 (safe defaults)

## Integration with Existing System

### Webhooks
- Webhooks can create accounts if they don't exist
- Signup creates account automatically
- Both methods work seamlessly together

### Dashboard
- New users can immediately access dashboard
- Empty state shown until data is added via webhooks
- All features available immediately

### Realtime
- Account updates work immediately after signup
- No additional setup needed
- Realtime subscriptions work from first login

## Next Steps After Signup

1. **User signs up** → Account created
2. **User logs in** → Dashboard shows empty state
3. **Webhooks send data** → Dashboard populates with real data
4. **User sees live updates** → Realtime subscriptions active

Everything works automatically! 🚀



