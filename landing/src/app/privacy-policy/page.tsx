import type { Metadata } from 'next'
import Link from 'next/link'

const effectiveDate = 'April 5, 2026'

export const metadata: Metadata = {
  title: 'Privacy Policy | Arokiyam',
  description:
    'Read the Arokiyam privacy policy to understand what data is processed, how it is used, and your rights.'
}

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen py-14 sm:py-20 px-5 sm:px-8">
      <div className="mx-auto w-full max-w-4xl">
        <div
          className="glass-deep p-6 sm:p-10 border"
          style={{ borderColor: 'var(--border-glass)' }}
        >
          <p className="text-sm mb-5" style={{ color: 'var(--text-secondary)' }}>
            <Link
              href="/"
              className="hover:underline"
              style={{ color: 'var(--accent-primary-hover)' }}
            >
              Back to Home
            </Link>
          </p>

          <h1 className="text-3xl sm:text-4xl font-bold mb-3 section-title">Privacy Policy</h1>
          <p className="text-sm sm:text-base mb-8" style={{ color: 'var(--text-secondary)' }}>
            Effective Date: {effectiveDate}
          </p>

          <div className="space-y-7" style={{ color: 'var(--text-primary)' }}>
            <section className="space-y-3">
              <h2 className="text-xl sm:text-2xl font-semibold">1. Who We Are</h2>
              <p>
                Arokiyam is a desktop wellness companion app designed to help users manage stress
                and healthy break habits during computer use.
              </p>
              <p>
                If you have questions about this policy, contact us at:{' '}
                <a href="https://arokiyam.vercel.app">https://arokiyam.vercel.app</a>
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl sm:text-2xl font-semibold">2. Information We Collect</h2>
              <h3 className="text-lg font-semibold">A. Information processed on your device</h3>
              <p>
                Arokiyam may process the following data locally on your device to provide app
                features:
              </p>
              <ul className="list-disc pl-6 space-y-2" style={{ color: 'var(--text-secondary)' }}>
                <li>
                  Activity signals from keyboard and mouse usage patterns (for stress and break
                  reminders)
                </li>
                <li>
                  App preferences and settings (such as reminder frequency, pause state, quiet
                  hours, and notification preferences)
                </li>
                <li>App usage state needed to run core wellness reminders</li>
              </ul>
              <p>
                Important:
                <ul className="ml-10 list-disc">
                  <li>Arokiyam does not record the content of your keystrokes.</li>
                  <li>Arokiyam does not capture the text you type.</li>
                  <li>Arokiyam does not capture screenshots.</li>
                  <li>
                    Arokiyam does not record camera or microphone data for its core functionality.
                  </li>
                </ul>
              </p>

              <h3 className="text-lg font-semibold">B. Diagnostic and crash data</h3>
              <p>
                By default, Arokiyam does not intentionally collect personal diagnostic data to
                external servers unless explicitly stated in-app. If diagnostics are enabled in a
                future version, this policy will be updated.
              </p>

              <h3 className="text-lg font-semibold">C. Update and delivery metadata</h3>
              <p>
                When checking for updates or downloading releases, limited technical metadata may be
                processed by distribution platforms (for example, IP address, device type, and
                download logs) as part of standard content delivery operations.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl sm:text-2xl font-semibold">3. How We Use Information</h2>
              <p>Arokiyam uses data to:</p>
              <ul className="list-disc pl-6 space-y-2" style={{ color: 'var(--text-secondary)' }}>
                <li>Provide stress detection and break reminders</li>
                <li>Save and apply your personal app preferences</li>
                <li>Improve reliability, security, and compatibility</li>
                <li>Deliver app updates</li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl sm:text-2xl font-semibold">4. Data Storage and Retention</h2>
              <ul className="list-disc pl-6 space-y-2" style={{ color: 'var(--text-secondary)' }}>
                <li>Core app data and preferences are stored locally on your device.</li>
                <li>
                  Arokiyam retains local settings until you change them, reset the app, or uninstall
                  the app.
                </li>
                <li>
                  If any cloud-backed feature is introduced later, this policy will be revised
                  before rollout.
                </li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl sm:text-2xl font-semibold">5. Data Sharing</h2>
              <p>
                Arokiyam does not sell your personal data. Arokiyam does not share personal data
                with advertisers. Data may be processed by service providers only as needed for app
                distribution, updates, security, and legal compliance.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl sm:text-2xl font-semibold">6. Legal Basis and Your Rights</h2>
              <p>Depending on your location, you may have rights to:</p>
              <ul className="list-disc pl-6 space-y-2" style={{ color: 'var(--text-secondary)' }}>
                <li>Access data about you</li>
                <li>Request correction or deletion</li>
                <li>Object to or restrict certain processing</li>
                <li>Withdraw consent (where consent is used)</li>
              </ul>
              <p>To exercise rights, contact: privacy@arokiyam.app</p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl sm:text-2xl font-semibold">7. Children&apos;s Privacy</h2>
              <p>
                Arokiyam is not directed to children under 13 (or equivalent minimum age in your
                jurisdiction) and does not knowingly collect personal data from children.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl sm:text-2xl font-semibold">8. Security</h2>
              <p>
                Arokiyam uses reasonable technical and organizational measures to protect data. No
                method of storage or transmission is 100% secure.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl sm:text-2xl font-semibold">9. International Data Transfers</h2>
              <p>
                If any data is processed outside your country, reasonable safeguards will be applied
                as required by applicable law.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl sm:text-2xl font-semibold">
                10. Changes to This Privacy Policy
              </h2>
              <p>
                We may update this policy from time to time. Material changes will be reflected by
                updating the Effective Date and, where appropriate, via app or website notice.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl sm:text-2xl font-semibold">11. Contact</h2>
              <p>For privacy questions or requests https://arokiyam.vercel.app</p>
              <p>Publisher: Anbuselvan Annamalai</p>
            </section>
          </div>
        </div>
      </div>
    </main>
  )
}
