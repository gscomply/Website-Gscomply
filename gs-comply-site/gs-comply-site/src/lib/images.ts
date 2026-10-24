// Stock photos from Pexels (license-free, hot-linked)
const P = (id: string, w = 1600) =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=${w}`;

export const IMAGES = {
  // Compliance / regulatory
  complianceDocs: P('12324202'),
  paperworkSigning: P('8296977'),
  taxForms: P('7561314'),
  // Manufacturing / factory
  factoryExterior: P('7178310'),
  factoryFloor: P('7178310'),
  steelTanks: P('2760286'),
  productionLine: P('5532664'),
  conveyorSystem: P('5532664'),
  industrialMachinery: P('2760286'),
  // Automotive / engineering
  engineDetail: P('5158155'),
  engineComponents: P('5158155'),
  engineGears: P('35531283'),
  engineCloseup: P('11455717'),
  heroManufacturing: P('5158155'),
  // Sustainability
  windTurbines: P('7763083'),
  windTurbines2: P('7763083'),
  windTurbines3: P('14024422'),
  windTurbinesGreen: P('14024422'),
  windTurbinesHill: P('3633955'),
  // Business / meeting
  handshake: P('33175650'),
  handshake2: P('7792841'),
  handshake3: P('4963359'),
  handshakeOffice: P('7792841'),
  handshakeOutdoor: P('4963359'),
  // Electronics
  circuitBoard: P('3520692'),
  circuitBoard2: P('163125'),
  circuitBoardGreen: P('163125'),
  motherboard: P('1432794'),
  microchip: P('1432794'),
  microchip2: P('3520692'),
  pcbDetail: P('1432794'),
  // Logistics / shipping
  shippingPort: P('13025947'),
  cargoPort: P('14020705'),
  cargoContainers: P('33537946'),
  cargoShip: P('13025947'),
  // World / global
  worldMapPhone: P('7411941'),
  worldMapBoard: P('8159115'),
  globe: P('7411941'),
  globeEurope: P('8159115'),
  // Medical / pharma
  medicalDevice: P('3520692'),
  operatingRoom: P('3520692'),
  pharmaceutical: P('7561314'),
  // Aerospace
  aerospaceFactory: P('7178310'),
  aircraftWing: P('7178310'),
  rocketAssembly: P('7178310'),
  // Misc
  architectBlueprints: P('12324202'),
  blueprintRuler: P('12324202'),
  engineerReviewing: P('8296977'),
  workersReviewing: P('7792841'),
  mechanicalGears: P('2760286'),
  industrialGears: P('2760286'),
  globe2: P('7411941'),
};

export function pexelsUrl(photoId: string, width = 1600): string {
  return `https://images.pexels.com/photos/${photoId}/pexels-photo-${photoId}.jpeg?auto=compress&cs=tinysrgb&w=${width}`;
}
