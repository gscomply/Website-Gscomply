import { Helmet } from 'react-helmet-async';
import { company } from '@/data/company';

export default function JsonLd() {
  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${company.domain}/#organization`,
    name: company.name,
    url: company.domain,
    logo: { '@type': 'ImageObject', url: `${company.domain}/logo.png` },
    image: `${company.domain}/og-image.png`,
    email: company.email,
    sameAs: [company.linkedinUrl],
    description:
      'Product, material and regulatory compliance consulting for manufacturers: REACH, RoHS, PFAS, IMDS, CDX, SCIP and sustainability support.',
  };

  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${company.domain}/#website`,
    url: company.domain,
    name: company.name,
    inLanguage: 'en',
    publisher: { '@id': `${company.domain}/#organization` },
  };

  const serviceSchema = {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    '@id': `${company.domain}/#service`,
    name: company.name,
    url: company.domain,
    email: company.email,
    image: `${company.domain}/og-image.png`,
    parentOrganization: { '@id': `${company.domain}/#organization` },
    areaServed: ['Europe', 'North America', 'Asia'],
    serviceType: [
      'Product Compliance', 'Material Compliance', 'Regulatory Compliance',
      'IMDS and CDX Support', 'Supply Chain Compliance', 'Sustainability Services',
      'SCIP Notification Services',
    ],
  };

  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(organizationSchema)}</script>
      <script type="application/ld+json">{JSON.stringify(websiteSchema)}</script>
      <script type="application/ld+json">{JSON.stringify(serviceSchema)}</script>
    </Helmet>
  );
}
