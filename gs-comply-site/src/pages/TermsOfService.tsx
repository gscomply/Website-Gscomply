import { Link } from 'react-router-dom';
import LegalPage, { V, type LegalSection } from '@/components/legal/LegalPage';
import { company, legal } from '@/data/company';

const sections: LegalSection[] = [
  {
    id: 'about',
    title: 'About these terms',
    body: (
      <>
        <p>
          These terms govern your use of {company.domain.replace('https://', '')} (the “Website”), operated by <strong><V>{legal.legalName}</V></strong>{' '}
          (“{company.name}”, “we”, “us”), registered at <V>{legal.registeredAddress}</V> (registration no. <V>{legal.registrationNumber}</V>). By using the
          Website you agree to them. If you do not agree, please do not use it.
        </p>
        <p>The Website is intended for businesses and professionals. It is not intended for consumers or for anyone under 18.</p>
      </>
    ),
  },
  {
    id: 'information',
    title: 'General information only, not advice',
    body: (
      <>
        <p>
          Content on the Website, including articles in Insights, describes regulations such as REACH, RoHS, PFAS, IMDS, SCIP, CBAM and others
          in general terms. Regulations, deadlines and interpretations change often. We try to keep content accurate and current, but we give no
          guarantee that it is complete, correct or up to date.
        </p>
        <p>
          Nothing on the Website is legal advice or a certification of compliance, and it does not create a consultant–client relationship.
          Always confirm requirements for your specific products and markets with a qualified professional before acting.
        </p>
      </>
    ),
  },
  {
    id: 'services',
    title: 'Our services and enquiries',
    body: (
      <p>
        Sending an enquiry does not oblige either of us to enter into a contract. Consulting and data-management services are provided only
        under a separate written proposal, statement of work or agreement, which takes precedence over these terms for those services. Any
        timelines or indicative scope shown on the Website are illustrative.
      </p>
    ),
  },
  {
    id: 'use',
    title: 'Acceptable use',
    body: (
      <>
        <p>You agree not to:</p>
        <ul>
          <li>use the Website unlawfully, or to send spam, malware or anything harmful;</li>
          <li>attempt to gain unauthorised access to the Website, its servers, the administrator area or the database;</li>
          <li>scrape or copy the Website in bulk, or overload it with automated requests;</li>
          <li>submit false information or impersonate another person or company.</li>
        </ul>
        <p>We may restrict access if we reasonably believe these rules are broken.</p>
      </>
    ),
  },
  {
    id: 'submissions',
    title: 'Information you send us',
    body: (
      <p>
        Please do not send confidential technical drawings, trade secrets, special-category personal data or login credentials through the
        contact form. Enquiries are not a secure channel. Confidential information should be shared only after an NDA or agreement is in place.
        How we handle personal data is described in our <Link to="/privacy-policy">Privacy Policy</Link>.
      </p>
    ),
  },
  {
    id: 'ip',
    title: 'Intellectual property',
    body: (
      <p>
        The Website’s text, design, logos, graphics and software are owned by us or our licensors and are protected by copyright and other laws.
        You may view and print pages for your own internal business use and share links to them. Other use, including republishing articles,
        requires our written permission. Third-party names and trademarks (such as REACH, IMDS or Calendly) belong to their owners and are used
        only to identify them.
      </p>
    ),
  },
  {
    id: 'links',
    title: 'Third-party links and content',
    body: <p>The Website links to other sites (for example Calendly and LinkedIn) and may display content from third parties. We do not control them and are not responsible for their content, availability or privacy practices.</p>,
  },
  {
    id: 'disclaimer',
    title: 'Disclaimer of warranties',
    body: <p>The Website and its content are provided “as is” and “as available”. To the extent the law allows, we disclaim all warranties, express or implied, including fitness for a particular purpose and uninterrupted or error-free operation.</p>,
  },
  {
    id: 'liability',
    title: 'Limitation of liability',
    body: (
      <>
        <p>
          To the extent permitted by law, we are not liable for indirect or consequential loss, loss of profit, revenue, data or goodwill arising
          from your use of, or inability to use, the Website or reliance on its content. Our total liability for any claim relating to the
          Website itself (as opposed to services under a separate agreement) is limited to EUR 100.
        </p>
        <p>
          Nothing in these terms excludes or limits liability that cannot be excluded or limited by law, including liability for death or personal
          injury caused by negligence, for fraud or fraudulent misrepresentation, or for intentional misconduct.
        </p>
      </>
    ),
  },
  {
    id: 'changes',
    title: 'Changes and availability',
    body: <p>We may change the Website, or these terms, at any time. The updated terms apply from the “last updated” date on this page. Continued use after that date means you accept them. We may suspend or withdraw the Website, or any part of it, without notice.</p>,
  },
  {
    id: 'law',
    title: 'Governing law and disputes',
    body: (
      <p>
        These terms are governed by <V>{legal.governingLaw}</V>. The courts of <V>{legal.courts}</V> have jurisdiction, without affecting any
        mandatory rights you may have under the law of your country of residence or any right to bring a claim in the courts that the law gives you.
      </p>
    ),
  },
  {
    id: 'general',
    title: 'General',
    body: <p>If any part of these terms is found unenforceable, the rest remains in effect. Our failure to enforce a right is not a waiver of it. These terms, together with the Privacy Policy, are the whole agreement between you and us about your use of the Website.</p>,
  },
  {
    id: 'contact',
    title: 'Contact',
    body: <p>Questions about these terms: <a href={`mailto:${legal.contactEmail}`}>{legal.contactEmail}</a>.</p>,
  },
];

export default function TermsOfService() {
  return (
    <LegalPage
      title="Terms of Service"
      subtitle="The terms that apply when you use the GS Comply Solutions website."
      path="/terms"
      description="Terms of Service for the GS Comply Solutions website: acceptable use, no-advice notice, intellectual property, liability and governing law."
      sections={sections}
    />
  );
}
