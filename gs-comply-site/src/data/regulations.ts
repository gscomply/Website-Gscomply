// Regulations & standards we support. Shared by /regulations and /product-material-compliance.
export const regulationCategories = [
  {
    category: 'Chemical & Substance Regulations',
    items: [
      { name: 'REACH / SVHC', desc: 'EU regulation on the Registration, Evaluation, Authorisation and Restriction of Chemicals, including Substances of Very High Concern.' },
      { name: 'TSCA', desc: 'US Toxic Substances Control Act — managing chemical substance requirements under EPA regulations.' },
      { name: 'POPs', desc: 'Persistent Organic Pollutants regulation restricting specific hazardous substances in products and articles.' },
      { name: 'California Proposition 65', desc: 'California state regulation requiring warnings for products containing listed chemicals.' },
      { name: 'PFAS', desc: 'Per- and polyfluoroalkyl substances — emerging global restrictions on PFAS in products and materials.' },
    ],
  },
  {
    category: 'Material & Product Declarations',
    items: [
      { name: 'IMDS', desc: 'International Material Data System — the global standard for material data reporting in the automotive industry.' },
      { name: 'CDX', desc: 'Corporate Data Exchange — managing material and substance data through the CDX platform.' },
      { name: 'CMRT', desc: 'Conflict Minerals Reporting Template — declaration template for 3TG (tin, tungsten, tantalum, gold).' },
      { name: 'EMRT', desc: 'Extended Materials Reporting Template — broader material declaration reporting beyond conflict minerals.' },
      { name: 'IEC 62474', desc: 'International standard for material declaration information exchange in electrotechnical products.' },
    ],
  },
  {
    category: 'Product & Market Regulations',
    items: [
      { name: 'RoHS', desc: 'Restriction of Hazardous Substances — limiting specific hazardous substances in electronic and electrical equipment.' },
      { name: 'China RoHS', desc: 'China\'s restriction of hazardous substances in electronic information products.' },
      { name: 'CE Requirements', desc: 'CE marking requirements for products placed on the European Economic Area market.' },
      { name: 'ELV', desc: 'End-of-Life Vehicles Directive — material and substance restrictions for automotive products.' },
    ],
  },
  {
    category: 'Environmental & Sustainability Regulations',
    items: [
      { name: 'SCIP', desc: 'Substances of Concern In articles as such or in complex objects (Products) — ECHA database notification requirement.' },
      { name: 'EU Battery Regulation', desc: 'Regulation on batteries and waste batteries — sustainability, safety and labeling requirements.' },
      { name: 'CBAM', desc: 'Carbon Border Adjustment Mechanism — carbon pricing on imported goods to the EU.' },
      { name: 'PPWR', desc: 'Packaging and Packaging Waste Regulation — EU requirements for packaging sustainability and recyclability.' },
    ],
  },
];
