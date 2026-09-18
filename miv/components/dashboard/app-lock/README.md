# Mobile App Lock

The app lock adds a short privacy screen to the mobile dashboard without changing the existing account authentication flow.

## Behaviour

- Selecting **Lock App** for the first time asks the user to create and confirm a four-digit PIN.
- The mobile dashboard locks immediately after setup and on later visits from the same browser.
- A correct PIN restores the current dashboard session without changing routes.
- **Forgot PIN?** clears the device PIN and signs the user out so normal account authentication is required again.
- Desktop dashboard layouts do not show the lock screen or setup dialog.

## Storage and security boundary

The PIN itself is never stored. The browser stores a random salt and a PBKDF2-SHA-256 verifier in local storage. This is a device-level privacy feature, similar to an app lock, and does not replace server authentication or authorization.

## Verification

Run the focused storage tests from the `miv` directory:

```bash
npx tsx --test components/dashboard/app-lock/app-lock-storage.test.ts
```
