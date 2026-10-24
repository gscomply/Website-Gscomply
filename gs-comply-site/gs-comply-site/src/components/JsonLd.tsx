import { Helmet } from 'react-helmet-async';
import { company } from '@/data/company';

export default function JsonLd() {
  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: company.name,
    url: company.domain,
    email: company.email,
    sameAs: [company.linkedinUrl],
  };

  const serviceSchema = {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    name: company.name,
    url: company.domain,
    email: company.email,
    areaServed: ['Europe', 'North America', 'Asia'],
    serviceType: [
      'Product Compliance', 'Material Compliance', 'Regulatory Compliance',
      'IMDS and CDX Support', 'Supply Chain Compliance', 'Sustainability Support',
    ],
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(organizationSchema)}
      </script>
      <script type="application/ld+json">
        {JSON.stringify(serviceSchema)}
      </script>
    </Helmet>
  );
}
