# Microsoft Store Packaging (No External Hosting)

This project now supports a direct Microsoft Store package build using `electron-builder` AppX target.

## Why this avoids package URL hosting

For AppX/MSIX-style submissions, you upload package files directly in Partner Center instead of providing a public installer URL. This removes the GitHub redirect issue and avoids paid blob/CDN storage.

## Required Partner Center values

Set these environment variables before building a Store package:

- `WINDOWS_STORE_PUBLISHER_DISPLAY_NAME`
- `WINDOWS_STORE_IDENTITY_NAME`
- `WINDOWS_STORE_PUBLISHER`
- `WINDOWS_STORE_APPLICATION_ID`

Get them from your app identity page in Microsoft Partner Center.

`build:win:store` now auto-loads values from your root `.env` file.

Validation rules:

- `WINDOWS_STORE_IDENTITY_NAME` must use only letters, numbers, `.` and `-`
- `WINDOWS_STORE_APPLICATION_ID` must use only letters, numbers, `.` and `-`

## Local build command

```bash
bun run build:win:store
```

Expected output (in `dist/`):

- `.appx` (or related Store package file)

## GitHub Actions

The release workflow is configured to publish Store package artifacts when present:

- `*.appx`
- `*.appxbundle`
- `*.msix`
- `*.msixbundle`
- `*.msixupload`
- `*.appxupload`

If you want automated Store package generation in CI, add the required Partner Center values as repository secrets and expose them as environment variables in the Windows release job.

## PowerShell example

```powershell
$env:WINDOWS_STORE_PUBLISHER_DISPLAY_NAME = "Your Publisher Display Name"
$env:WINDOWS_STORE_IDENTITY_NAME = "12345YourIdentityName"
$env:WINDOWS_STORE_PUBLISHER = "CN=XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX"
$env:WINDOWS_STORE_APPLICATION_ID = "Arokiyam"
bun run build:win:store
```

## Notes

- Keep package identity values stable across releases.
- Use x64 architecture for now unless you also produce arm64 builds.
- Continue NSIS (`build:win`) for direct website/GitHub installs.
