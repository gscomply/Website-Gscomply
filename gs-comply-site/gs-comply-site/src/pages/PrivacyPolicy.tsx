import LegalPage, { V, type LegalSection } from '@/components/legal/LegalPage';
import { company, legal } from '@/data/company';
import { openCookieSettings } from '@/lib/consent';

const th = 'border border-gray-200 bg-gray-50 px-3 py-2 text-left font-semibold text-gray-900 align-top';
const td = 'border border-gray-200 px-3 py-2 align-top';

const sections: LegalSection[] = [
  {
    id: 'controller',
    title: 'Who we are',
    body: (
      <>
        <p>
          This website, {company.domain.replace('https://', '')}, is operated by <strong><V>{legal.legalName}</V></strong> (“{company.name}”,
          “we”, “us”). We are the <strong>controller</strong> of the personal data described in this policy under the EU General Data
          Protection Regulation (GDPR, Regulation (EU) 2016/679) and, where it applies, the UK GDPR.
        </p>
        <ul>
          <li>Registered address: <V>{legal.registeredAddress}</V></li>
          <li>Registration number: <V>{legal.registrationNumber}</V></li>
          <li>Privacy contact: <a href={`mailto:${legal.contactEmail}`}>{legal.contactEmail}</a></li>
          {legal.dpo && <li>Data Protection Officer: {legal.dpo}</li>}
          <li>EU / UK representative: <V>{legal.euRepresentative}</V></li>
        </ul>
        <p>This policy explains what personal data we collect through the website, why, who we share it with, and your rights.</p>
      </>
    ),
  },
  {
    id: 'data',
    title: 'What personal data we collect',
    body: (
      <>
        <div className="overflow-x-auto">
          <table>
            <thead>
              <tr><th className={th}>When</th><th className={th}>Data</th><th className={th}>Source</th></tr>
            </thead>
            <tbody>
              <tr>
                <td className={td}>You send an enquiry through the contact form</td>
                <td className={td}>
                  Full name, business email, company, country, message; optionally phone number, job title, industry and
                  service of interest; the time you sent it and a record that you ticked the consent box.
                </td>
                <td className={td}>You</td>
              </tr>
              <tr>
                <td className={td}>You visit the website</td>
                <td className={td}>
                  IP address, browser and device type, pages requested and time. These appear in the technical logs of our
                  hosting and database providers.
                </td>
                <td className={td}>Automatically</td>
              </tr>
              <tr>
                <td className={td}>You accept analytics cookies</td>
                <td className={td}>
                  Pseudonymous usage statistics (pages viewed, approximate location, device, referrer) collected through Google
                  Tag Manager / Google Analytics.
                </td>
                <td className={td}>Your browser, only after you accept</td>
              </tr>
              <tr>
                <td className={td}>You email us or book a call</td>
                <td className={td}>
                  Whatever you include in your email, or the details you give Calendly when booking (Calendly is a separate
                  controller for its own service).
                </td>
                <td className={td}>You</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p>
          We do not ask for “special categories” of data (such as health or biometric data) and we do not want it in your messages.
          Please do not include it. Providing the required form fields is necessary for us to answer you; if you leave them out we
          cannot process the enquiry.
        </p>
      </>
    ),
  },
  {
    id: 'purposes',
    title: 'Why we use it, and our legal basis',
    body: (
      <div className="overflow-x-auto">
        <table>
          <thead>
            <tr><th className={th}>Purpose</th><th className={th}>Legal basis (GDPR Art. 6)</th></tr>
          </thead>
          <tbody>
            <tr>
              <td className={td}>Reading and replying to your enquiry, preparing a proposal, following up about it</td>
              <td className={td}>
                Your consent (Art. 6(1)(a), the box you tick on the form) and taking steps at your request before a contract
                (Art. 6(1)(b)).
              </td>
            </tr>
            <tr>
              <td className={td}>Keeping the website secure, preventing abuse, fixing faults, keeping basic server logs</td>
              <td className={td}>Our legitimate interest in running a safe, working website (Art. 6(1)(f)).</td>
            </tr>
            <tr>
              <td className={td}>Measuring and improving how the website is used (analytics)</td>
              <td className={td}>Your consent (Art. 6(1)(a)), given through the cookie banner. No analytics run before you accept.</td>
            </tr>
            <tr>
              <td className={td}>Record-keeping required by law, and establishing, exercising or defending legal claims</td>
              <td className={td}>Legal obligation (Art. 6(1)(c)) and legitimate interest (Art. 6(1)(f)).</td>
            </tr>
          </tbody>
        </table>
        <p className="mt-4">
          We do not use your data for automated decision-making or profiling that has legal or similarly significant effects on you,
          and we do not sell personal data. We do not send marketing emails unless you separately agree to receive them.
        </p>
      </div>
    ),
  },
  {
    id: 'cookies',
    title: 'Cookies and similar technologies',
    body: (
      <>
        <div className="overflow-x-auto">
          <table>
            <thead>
              <tr><th className={th}>Name</th><th className={th}>Purpose</th><th className={th}>Type</th><th className={th}>Duration</th></tr>
            </thead>
            <tbody>
              <tr>
                <td className={td}><code>gscomply_cookie_consent</code> (browser local storage)</td>
                <td className={td}>Remembers your cookie choice</td>
                <td className={td}>Essential, no consent needed</td>
                <td className={td}>12 months</td>
              </tr>
              <tr>
                <td className={td}>Supabase sign-in tokens (local storage)</td>
                <td className={td}>Keep the site administrator signed in. Not used for ordinary visitors.</td>
                <td className={td}>Essential</td>
                <td className={td}>Session</td>
              </tr>
              <tr>
                <td className={td}><code>_ga</code>, <code>_ga_*</code> (Google)</td>
                <td className={td}>Distinguish visitors and measure site usage</td>
                <td className={td}>Analytics, <strong>only after you accept</strong></td>
                <td className={td}>Up to 2 years</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p>
          A cookie is a small file a website asks your browser to store. Cookies let a site remember your choices and, with your
          permission, count which pages are visited so we can improve them. A cookie does not give us access to your device or to any
          information about you beyond what the browser sends. Most browsers accept cookies by default, but you can usually set them to
          decline them; some parts of a site may then work less well.
        </p>
        <p>
          You can change your mind at any time:{' '}
          <button type="button" onClick={openCookieSettings} className="text-[#1A6B3C] underline underline-offset-2">
            open cookie settings
          </button>
          . Withdrawing consent does not affect processing done before you withdrew. You can also block or delete cookies in your
          browser settings.
        </p>
      </>
    ),
  },
  {
    id: 'recipients',
    title: 'Who we share data with',
    body: (
      <>
        <p>We use trusted service providers (“processors”) who handle data only on our instructions under data processing agreements:</p>
        <ul>
          <li><strong>Supabase</strong>: database and file storage where enquiries are stored (region: <V>{legal.databaseRegion}</V>).</li>
          <li><strong>Resend</strong>: sends us an email notification when you submit the contact form.</li>
          <li><strong>Netlify</strong>: hosts and delivers the website (receives technical request data such as your IP address).</li>
          <li><strong>Google</strong> (Tag Manager / Analytics): analytics, only if you accept analytics cookies.</li>
          <li><strong>Pexels</strong>: some photographs on the site are loaded directly from Pexels’ servers, which means your IP address is
            sent to them when you view those pages.</li>
        </ul>
        <p>
          When you follow a link to <strong>Calendly</strong> or <strong>LinkedIn</strong>, you leave our website and that provider’s own
          privacy policy applies. We may also disclose data to professional advisers (lawyers, accountants, insurers) bound by confidentiality,
          and to authorities where the law requires.
        </p>
      </>
    ),
  },
  {
    id: 'transfers',
    title: 'Transfers outside the EEA / UK',
    body: (
      <p>
        Some providers above (for example Google, Resend and Netlify) may process data in the United States or other countries outside the
        EEA/UK. Where they do, we rely on an adequacy decision (such as the EU–US Data Privacy Framework for certified providers) or the
        European Commission’s Standard Contractual Clauses, together with additional safeguards where needed. You can ask us for a copy of
        the safeguards by writing to <a href={`mailto:${legal.contactEmail}`}>{legal.contactEmail}</a>.
      </p>
    ),
  },
  {
    id: 'retention',
    title: 'How long we keep it',
    body: (
      <ul>
        <li>Enquiries and related emails: <V>{legal.enquiryRetention}</V> after our last contact with you, unless you become a client (then the client-record rules in our contract apply) or the law requires longer.</li>
        <li>Analytics data: up to 14 months.</li>
        <li>Server and security logs: normally no longer than 30 days.</li>
        <li>Your cookie choice: 12 months, then we ask again.</li>
      </ul>
    ),
  },
  {
    id: 'rights',
    title: 'Your rights',
    body: (
      <>
        <p>Under the GDPR you have the right to:</p>
        <ul>
          <li><strong>Access</strong> your personal data and receive a copy (Art. 15);</li>
          <li><strong>Rectify</strong> data that is inaccurate or incomplete (Art. 16);</li>
          <li><strong>Erase</strong> your data (“right to be forgotten”) in the cases the law provides (Art. 17);</li>
          <li><strong>Restrict</strong> how we use your data (Art. 18);</li>
          <li><strong>Data portability</strong>: receive data you gave us in a common machine-readable format (Art. 20);</li>
          <li><strong>Object</strong> to processing based on our legitimate interests (Art. 21);</li>
          <li><strong>Withdraw consent</strong> at any time, as easily as you gave it, without affecting earlier processing (Art. 7(3)).</li>
        </ul>
        <p>
          To use any of these, email <a href={`mailto:${legal.contactEmail}`}>{legal.contactEmail}</a>. We may need to verify your identity. We
          will answer within one month (extendable by two further months for complex requests, and we will tell you if so). There is no fee
          unless a request is clearly unfounded or excessive.
        </p>
        <p>
          You also have the right to <strong>complain to a data protection authority</strong>, in particular in the EU/EEA country where you
          live or work, or where you think an infringement happened (for the UK: the Information Commissioner’s Office, ico.org.uk). A list of
          EU authorities is at edpb.europa.eu. We would appreciate the chance to resolve your concern first.
        </p>
      </>
    ),
  },
  {
    id: 'control',
    title: 'Controlling your personal information',
    body: (
      <>
        <ul>
          <li>
            <strong>Marketing:</strong> we do not send promotional or newsletter emails unless you have separately agreed to receive them. If you
            do agree, every message includes an unsubscribe link, and you can also withdraw by emailing{' '}
            <a href={`mailto:${legal.contactEmail}`}>{legal.contactEmail}</a>. The contact form box is consent to reply to your enquiry only, not
            to marketing.
          </li>
          <li>
            <strong>We do not sell, rent or give away your data.</strong> We share it only with the providers listed above, with your permission,
            or where the law requires.
          </li>
          <li>
            <strong>Correcting your data:</strong> if you think anything we hold about you is wrong or incomplete, email us and we will correct
            it promptly.
          </li>
        </ul>
      </>
    ),
  },
  {
    id: 'security',
    title: 'Security',
    body: (
      <p>
        We protect data with encrypted connections (HTTPS), access controls (database rules mean the public can submit an enquiry but cannot
        read any), restricted administrator access and reputable, security-certified providers. No system is perfectly secure; if a personal
        data breach is likely to put you at risk we will notify the authorities and you as the law requires.
      </p>
    ),
  },
  {
    id: 'children',
    title: 'Children',
    body: <p>The website is for businesses and is not directed at children. We do not knowingly collect data from anyone under 16. If you believe a child has sent us data, contact us and we will delete it.</p>,
  },
  {
    id: 'changes',
    title: 'Changes to this policy',
    body: <p>We may update this policy, for example when we change a provider or a law changes. The “last updated” date is shown on this page; for significant changes we will make that clear on the site.</p>,
  },
  {
    id: 'contact',
    title: 'Contact us',
    body: (
      <p>
        Questions about this policy or your data: <a href={`mailto:${legal.contactEmail}`}>{legal.contactEmail}</a>, or by post to{' '}
        <V>{legal.legalName}</V>, <V>{legal.registeredAddress}</V>.
      </p>
    ),
  },
];

export default function PrivacyPolicy() {
  return (
    <LegalPage
      title="Privacy Policy"
      subtitle="How GS Comply Solutions collects, uses and protects personal data, and the rights you have under the GDPR."
      path="/privacy-policy"
      description="How GS Comply Solutions collects, uses, shares and protects personal data, your GDPR rights, and how we use cookies."
      sections={sections}
    />
  );
}
