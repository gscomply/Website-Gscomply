// Regulations & standards we support. Shared by /regulations and /product-material-compliance.
export const regulationCategories = [
  {
    category: 'Chemical & Substance Regulations',
    items: [
      { name: 'REACH / SVHC', desc: 'EU regulation on the Registration, Evaluation, Authorisation and Restriction of Chemicals, including Substances of Very High Concern.', consequence: 'Penalties are set by each EU member state and must be effective and dissuasive. Non-compliant products can be withdrawn from the market, and suppliers can face fines or, in serious cases, criminal liability.' },
      { name: 'TSCA', desc: 'US Toxic Substances Control Act  managing chemical substance requirements under EPA regulations.', consequence: 'The US EPA can impose civil penalties of tens of thousands of US dollars per violation per day (adjusted each year), and shipments can be stopped at the border.' },
      { name: 'POPs', desc: 'Persistent Organic Pollutants regulation restricting specific hazardous substances in products and articles.', consequence: 'Products containing restricted POPs can be banned from sale or recalled, and enforcement bodies can impose penalties set by national law.' },
      { name: 'California Proposition 65', desc: 'California state regulation requiring warnings for products containing listed chemicals.', consequence: 'Civil penalties of up to US$2,500 per violation per day, plus legal costs from private enforcement lawsuits, which are a common risk for products sold in California.' },
      { name: 'PFAS', desc: 'Per- and polyfluoroalkyl substances emerging global restrictions on PFAS in products and materials.', consequence: 'Products above restriction limits can be refused entry or withdrawn from sale, and customers increasingly reject suppliers who cannot show PFAS data.' },
    ],
  },
  {
    category: 'Material & Product Declarations',
    items: [
      { name: 'IMDS', desc: 'International Material Data System the global standard for material data reporting in the automotive industry.', consequence: 'Incomplete or incorrect MDS data leads to customer rejections, delayed part approvals and, ultimately, the risk of losing automotive business.' },
      { name: 'CDX', desc: 'Compliance Data Exchange managing material and substance data through the CDX platform.', consequence: 'Missing or rejected CDX data delays customer approvals and can put supplier status at risk.' },
      { name: 'CMRT', desc: 'Conflict Minerals Reporting Template declaration template for 3TG (tin, tungsten, tantalum, gold).', consequence: 'Customers can treat missing or incomplete conflict-minerals declarations as a supplier-qualification failure, and companies subject to disclosure rules face regulatory scrutiny.' },
      { name: 'EMRT', desc: 'Extended Materials Reporting Template broader material declaration reporting beyond conflict minerals.', consequence: 'Missing declarations can lead to customer audit findings, delayed orders or removal from approved supplier lists.' },
      { name: 'IEC 62474', desc: 'International standard for material declaration information exchange in electrotechnical products.', consequence: 'It is a standard rather than a law, but customers often require it. Non-conforming declarations are rejected and delay product approvals.' },
    ],
  },
  {
    category: 'Product & Market Regulations',
    items: [
      { name: 'RoHS', desc: 'Restriction of Hazardous Substances limiting specific hazardous substances in electronic and electrical equipment.', consequence: 'Penalties are set by each EU member state. Non-compliant products can be withdrawn or recalled and cannot carry the CE mark, with fines for the responsible economic operator.' },
      { name: 'China RoHS', desc: 'China\'s restriction of hazardous substances in electronic information products.', consequence: 'Non-compliant products can be refused import or sale in China, and marketing or labelling violations can lead to fines.' },
      { name: 'CE Requirements', desc: 'CE marking requirements for products placed on the European Economic Area market.', consequence: 'Products without valid CE conformity cannot be legally sold in the EEA. Authorities can order withdrawal or recall and impose fines set by national law.' },
      { name: 'ELV', desc: 'End-of-Life Vehicles Regulation  material and substance restrictions for automotive products.', consequence: 'Vehicles and parts that breach the substance restrictions cannot be type-approved or sold in the EU, and OEMs pass this risk on to suppliers.' },
    ],
  },
  {
    category: 'Environmental & Sustainability Regulations',
    items: [
      { name: 'SCIP', desc: 'Substances of Concern In articles as such or in complex objects (Products) ECHA database notification requirement.', consequence: 'Missing notifications breach the EU Waste Framework Directive. Penalties are set by each member state and customers may demand proof of notification.' },
      { name: 'EU Battery Regulation', desc: 'Regulation on batteries and waste batteries sustainability, safety and labeling requirements.', consequence: 'Batteries that do not meet the requirements cannot be placed on the EU market, and authorities can order withdrawal and impose penalties.' },
      { name: 'CBAM', desc: 'Carbon Border Adjustment Mechanism carbon pricing on imported goods to the EU.', consequence: 'Importers without proper authorisation or correct emissions data can face financial penalties and be blocked from importing covered goods into the EU.' },
      { name: 'PPWR', desc: 'Packaging and Packaging Waste Regulation EU requirements for packaging sustainability and recyclability.', consequence: 'Packaging that does not meet the requirements can be refused or withdrawn from the EU market, with penalties set by member states.' },
    ],
  },
];
