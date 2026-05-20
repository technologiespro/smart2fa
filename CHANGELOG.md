v2.0.0

**Premium 2FA authenticator**

## What was done

The "Oxid Edition" client-side 2FA authenticator was completely rebuilt from scratch:

- **Complete template replacement**: the template has been replaced with pure Vue 3 + Vite. The backend is no longer used—the app works 100% offline.
- **Industrial-Metallic design system**: Rust Orange `#E25822` over Dark Charcoal `#1A1B1E`, glassmorphism, metallic edges, `JetBrains Mono` (for codes) and `Inter` (for the UI).
- **Full 2FA token lifecycle**: PIN generation → unlock → add via QR/manually → display with countdown → copy → delete → export/import → wipe.
- **Real cryptography**:
- The PIN is hashed using PBKDF2 + SHA-256, 25,000 iterations** for verification.
- Token storage in `localStorage` is encrypted with AES-256 CBC using a key derived from the PIN using the same PBKDF2 (but with a different salt).
- **Real TOTP**: `otpauth` library (RFC 6238), supports SHA-1/256/512, 6/7/8 digits, 30/60 sec periods.
- **Real QR scanner** via `html5-qrcode` with `otpauth://` URI recognition and parsing of all parameters (issuer, label, algorithm, digits, period).
- **Categories with colored dots**: Crypto, Social, Work, Finance, Email, Gaming, Other — with automatic detection by known providers (GitHub → Work, Coinbase → Crypto, etc.).
- **Themes**: dark (default) and light steel, saved in `localStorage`.
- **Biometric unlock via WebAuthn (Touch ID / Face ID / Windows Hello).**
  WebAuthn can be used to "wrap" the encrypted key: the PIN remains as a backup, while in 95% of cases, the user unlocks the app with a single touch.
- **Auto-Lock on Inactivity.**
  For example, after 60 seconds of idle time — an automatic call to `auth.lock()`. A mandatory feature for corporate use cases.
- **Testing**: Automatically ran 17 scenarios — all passed (100%).

<img width="415" height="806" alt="photo_2026-05-20_08-55-55" src="https://github.com/user-attachments/assets/47c0c786-c71f-4cc4-a1b1-7461ca9bd4f6" />
<img width="414" height="803" alt="photo_2026-05-20_08-55-52" src="https://github.com/user-attachments/assets/2d89802b-09e9-40cb-b648-2dd474e44089" />
<img width="415" height="806" alt="photo_2026-05-20_08-55-49" src="https://github.com/user-attachments/assets/eae5b787-155c-4bd0-b864-f1377336671b" />
<img width="417" height="805" alt="photo_2026-05-20_08-55-45" src="https://github.com/user-attachments/assets/85669952-8c23-410c-9188-2ad0ccbbb362" />




### Security Logic

1. On first launch, the user creates a 4-digit PIN.
2. The PIN is not stored in plaintext. Only the PBKDF2 hash (oxid:pin-hash) is stored.
3. The PIN itself is stored in the Pinia store's RAM only during an unlocked session. After a page refresh or pressing "Lock," it is erased.
4. All tokens are serialized as JSON and encrypted with AES-256 before being written to localStorage under the oxid:vault key. Without the correct PIN, they cannot be decrypted—even if an attacker gains access to local storage.
5. The .oxid export file is the same encrypted payload; it can be safely sent to yourself via email or the cloud: without the PIN, it is useless.

### TOTP Code Generation

- A timer on each card is triggered once per second: the code and remaining time are recalculated.
- The progress bar under the code gradually shrinks from 100% to 0%.
- Five seconds before the code expires, the bar turns red—a visual warning.
- Tap the code → copy to clipboard + metal "toast."

## Features — Detailed List

### PIN Screen
- 3 automatic modes: **Create / Confirm / Enter** (depending on the presence of 'oxid:pin-hash').
- Indicator dots fill with a rusty orange color with a slight glow.
- If the PIN doesn't match, a shake animation is played and the user is reset to Create mode.
- Background — low-contrast brushed steel texture (10–15% opacity).

### Vault (main screen)
- Sticky-glass header: number of codes, **Lock** and **Settings** buttons.
- Search field — real-time filtering by issuer / label / category.
- Horizontal filter bar with 7 categories (colored dot + uppercase label).
- Token cards: issuer, label, algorithm badge (for SHA-256/512), 6-digit code with a dot separator in the middle, thin progress bar.
- **FAB "+"** — add token.
- Empty state with a 3D illustration and a "Forge First Token" button.

### Add token
- **QR scan**: camera permission request → live video with reticle (angle brackets + ticker) → auto-parsing otpauth URI → auto-category → save.
- **Manual**: issuer / label / Base32 secret with validation (A-Z2-7 only), select categories (with issuer auto-suggestion), expandable advanced (algo / digits / period).

### Settings
- **Theme**: Dark / Light switch (persistent).
- **Export Vault**: Download an encrypted .oxid file with a timestamp.
- **Import Vault**: Upload file → enter the PIN used for export → merge without duplicates.
- **Lock Now**: Return to the PIN screen.
- **Wipe All Data**: A modal requiring the word 'WIPE' for confirmation; completely destroys all 'oxid:*' keys.

### Toasts
- Appears at the bottom center.
- Options: 'success' (rust) / 'error' (red).
- Auto-hide after 2.2 seconds with an easing animation.


## Technical Decisions & Justification

| Tech / Feature | Decision & Justification |
| :--- | :--- |
| **PBKDF2 (25k iterations)** | Balance between "expensive for brute force" and "acceptable for mobile" |
| **AES-256 CBC + PKCS7** | Industry standard, available in `crypto-js` with zero extra dependencies |
| **`otpauth` (instead of custom TOTP)** | Full RFC 6238 compliance; native compatibility with Google/GitHub/AWS QR codes |
| **`html5-qrcode`** | Works directly in `<video>` without WASM; mobile-first by default |
| **`localStorage`** | Specification rules out server sync; IndexedDB is overkill for this data volume |
| **PIN in memory, not storage** | If an attacker dumps the storage, they only get encrypted data |

<img width="412" height="804" alt="photo_2026-05-20_08-55-41" src="https://github.com/user-attachments/assets/7b4bd2be-52ab-41c5-825a-86484fc19681" />
<img width="412" height="802" alt="photo_2026-05-20_08-55-36" src="https://github.com/user-attachments/assets/ce4aeecb-15d4-40aa-986d-95ecb7216287" />


v1.0.2
- otpauth-migration-parser fix
- pbkdf2 fix
- add pin simple code
- add reset all data

v1.0.0
- Add time sync
- Import keys from Google 2FA APP 
- View clean data and keys 
- Export in Json Encrypted file
- Import from Encrypted file
- Downloading 2fa authorization tokens from sites via QR or by entering a code 
- Multilingual 
- Webcam support for scanning qr-codes 
- Desktop/Mobile 
- Generation of a single QR to export a RAW key to another device
- Load QR from file

v1.0.1
- reload camera on click
