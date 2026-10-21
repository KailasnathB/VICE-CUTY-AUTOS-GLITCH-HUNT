import veloce from './assets/hero-neon-supercar.webp';
import coastal1 from './assets/coastal-drive-1.webp';
import coastal2 from './assets/coastal-drive-2.webp';
import coastal3 from './assets/coastal-drive-3.webp';
import coastal4 from './assets/coastal-drive-4.webp';
import coastal5 from './assets/coastal-drive-5.webp';
import coastal6 from './assets/coastal-drive-6.webp';
import coastal7 from './assets/coastal-drive-7.webp';
import coastal8 from './assets/coastal-drive-8.webp';
import royalton from './assets/blue-electric.webp';
import caballero from './assets/classic-convertible.webp';
import striker from './assets/muscle-car.webp';
import veridian from './assets/neon-city-supercar.webp';
import harborside from './assets/luxury-hatchback.webp';
import sirocco from './assets/offroad-jeep.webp';
import garage from './assets/gallery-garage.svg';
import coast from './assets/gallery-coast.svg';

export const vehicleCategories = ['All categories', 'Classic Muscle', 'Retro Supercars', 'Luxury Coupes', 'Vintage Convertibles', 'Performance Cars'];

export const vehicles = [
  { id: 'veloce-miami-gt', name: 'Veloce Miami GT', category: 'Retro Supercars', year: 1986, price: 148000, horsepower: 420, topSpeed: 186, transmission: '5-speed manual', status: 'Available now', image: veloce, colors: ['Neon Orchid', 'Pearl Silver', 'Midnight Teal'], description: 'A low-slung grand tourer tuned for long neon boulevards and moonlit coast roads. The Miami GT pairs a high-revving V8 with hand-trimmed cabin detail.', gallery: [veloce, garage, coast], highlight: 'Collector favorite' },
  { id: 'royalton-88-lx', name: 'Royalton 88 LX', category: 'Luxury Coupes', year: 1985, price: 93000, horsepower: 310, topSpeed: 151, transmission: '4-speed automatic', status: 'Available now', image: royalton, colors: ['Midnight Chrome', 'Champagne', 'Sapphire Blue'], description: 'The quietest way to arrive loudly. Royalton’s 88 LX brings a sculpted fastback profile, deep leather and effortless V8 pace.', gallery: [royalton, coast, garage], highlight: 'Executive selection' },
  { id: 'crosswind-caballero', name: 'Crosswind Caballero', category: 'Vintage Convertibles', year: 1983, price: 72000, horsepower: 275, topSpeed: 138, transmission: '4-speed manual', status: 'Reserved', image: caballero, colors: ['Coastline Gold', 'Coral Mist', 'Ivory'], description: 'Top down, radio up. The Caballero is a rare open-air cruiser with a fuel-injected V8 and a profile made for Ocean Drive.', gallery: [caballero, coastal5, coastal6, coastal7, coastal8], highlight: 'Open-top classic' },
  { id: 'striker-v8', name: 'Striker V8', category: 'Classic Muscle', year: 1984, price: 86000, horsepower: 390, topSpeed: 156, transmission: '4-speed manual', status: 'Available now', image: striker, colors: ['Harbor Red', 'Blackout', 'Desert White'], description: 'A broad-shouldered American coupe with modernized brakes, period-correct wheels, and a thunderous eight-cylinder soundtrack.', gallery: [striker, garage, coast], highlight: 'Street legend' },
  { id: 'veridian-azzuro', name: 'Veridian Azzuro', category: 'Retro Supercars', year: 1986, price: 174000, horsepower: 460, topSpeed: 198, transmission: '5-speed manual', status: 'Available now', image: veridian, colors: ['Azzuro Teal', 'Night Violet', 'Silver Mist'], description: 'The collection’s sharpest machine, crafted around a mid-mounted twelve-cylinder and an unmistakable wedge profile.', gallery: [veridian, coastal1, coastal2, coastal3, coastal4, coast, garage], highlight: 'New arrival' },
  { id: 'harborside-executive', name: 'Harborside Executive', category: 'Performance Cars', year: 1985, price: 105000, horsepower: 355, topSpeed: 166, transmission: '4-speed automatic', status: 'Available now', image: harborside, colors: ['Nightline Purple', 'Steel Grey', 'Deep Blue'], description: 'Four doors, a tailored cockpit, and enough turbocharged pace to turn every cross-town run into an event.', gallery: [harborside, garage, coast], highlight: 'Four-door velocity' },
  { id: 'sirocco-280', name: 'Sirocco 280', category: 'Luxury Coupes', year: 1982, price: 68000, horsepower: 280, topSpeed: 145, transmission: '4-speed automatic', status: 'Available now', image: sirocco, colors: ['Palm Shadow', 'Biscayne Cream', 'Wine Red'], description: 'A sophisticated personal coupe that balances smooth cruising with a confident, distinctly European road manner.', gallery: [sirocco, coast, garage], highlight: 'Rare import' }
];
