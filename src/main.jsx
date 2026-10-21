import React, { useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';
import heroNight from './assets/hero-neon-supercar.webp';
import { vehicleCategories, vehicles } from './data';

const STORAGE = { enquiries: 'vca-enquiries', compare: 'vca-compare', glitchReports: 'vca-glitch-reports', participant: 'vca-participant' };

function getLocation() {
  const raw = (window.location.hash || '#/').slice(1) || '/';
  const cleanPath = raw.split('?')[0].replace(/\/$/, '') || '/';
  if (cleanPath.startsWith('/vehicle/')) return { path: '/vehicle', vehicleId: decodeURIComponent(cleanPath.slice('/vehicle/'.length)) };
  return { path: cleanPath, vehicleId: null };
}
function readLocal(key, fallback) { try { const value = window.localStorage.getItem(key); return value ? JSON.parse(value) : fallback; } catch { return fallback; } }
function writeLocal(key, value) { try { window.localStorage.setItem(key, JSON.stringify(value)); } catch (error) { console.warn(`Could not save ${key} in this browser.`, error); } }
function money(value) { return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value); }
function prettyCategory(value) { return value === 'All categories' ? 'All machines' : value; }

function App() {
  const [participant, setParticipant] = useState(() => readLocal(STORAGE.participant, null));
  const [location, setLocation] = useState(getLocation());
  const [compareIds, setCompareIds] = useState(() => readLocal(STORAGE.compare, []));
  const [enquiries, setEnquiries] = useState(() => readLocal(STORAGE.enquiries, []));
  useEffect(() => {
    const update = () => setLocation(getLocation());
    window.addEventListener('hashchange', update);
    window.addEventListener('popstate', update);
    // Keep hash-based navigation responsive even when a browser restores a page from cache.
    update();
    return () => { window.removeEventListener('hashchange', update); window.removeEventListener('popstate', update); };
  }, []);
  useEffect(() => writeLocal(STORAGE.participant, participant), [participant]);
  useEffect(() => writeLocal(STORAGE.compare, compareIds), [compareIds]);
  useEffect(() => writeLocal(STORAGE.enquiries, enquiries), [enquiries]);
  useEffect(() => { window.scrollTo({ top: 0, behavior: 'auto' }); }, [location.path, location.vehicleId]);
  const toggleCompare = (id) => {
    setCompareIds((current) => current.includes(id) ? current.filter((item) => item !== id) : current.length < 3 ? [...current, id] : current);
  };
  if (!participant) return <RegistrationScreen onRegister={(details) => setParticipant(details)} />;
  let page;
  if (location.path === '/inventory') page = <Inventory compareIds={compareIds} onCompare={toggleCompare} />;
  else if (location.path === '/classics') page = <Inventory title="Classics in the collection" eyebrow="THE TIME CAPSULE" copy="Analog machines with real stories, selected for the long way home." preset="classics" compareIds={compareIds} onCompare={toggleCompare} />;
  else if (location.path === '/performance') page = <Inventory title="Performance after dark" eyebrow="THE FAST LANE" copy="Turbocharged, high-revving, and ready for the boulevard." preset="performance" compareIds={compareIds} onCompare={toggleCompare} />;
  else if (location.path === '/compare') page = <ComparePage compareIds={compareIds} setCompareIds={setCompareIds} />;
  else if (location.path === '/enquiries') page = <Enquiries enquiries={enquiries} setEnquiries={setEnquiries} />;
  else if (location.path === '/vehicle') page = <VehicleDetails id={location.vehicleId} compareIds={compareIds} onCompare={toggleCompare} />;
  else page = <Home compareIds={compareIds} onCompare={toggleCompare} />;
  return <div className={`app route-${location.path === '/' ? 'home' : location.path.slice(1).replace('/', '-')}`}><Header path={location.path} compareCount={compareIds.length} />{page}<Footer /><GlitchReporter currentPath={location.path} participant={participant} reportsKey={`${participant.teamId}`} onChangeParticipant={() => { try { localStorage.removeItem(STORAGE.participant); } catch {} setParticipant(null); }} /></div>;
}

function Header({ path, compareCount }) {
  const links = [['/', 'HOME'], ['/inventory', 'INVENTORY'], ['/classics', 'CLASSICS'], ['/performance', 'PERFORMANCE'], ['/compare', 'COMPARE'], ['/enquiries', 'ENQUIRIES']];
  return <header className="site-header"><div className="nav-shell"><a className="brand-logo" href="#/classics" aria-label="Vice City Autos home"><span className="brand-mark">VCA</span><span><strong>VICE CITY</strong><em>AUTOS</em></span></a><nav aria-label="Main navigation">{links.map(([href, label]) => <a key={href} className={path === href ? 'active' : ''} href={`#${href}`}>{label}{href === '/compare' && compareCount > 0 && <b className="compare-count">{compareCount}</b>}</a>)}</nav><a className="nav-call" href="#/enquiries">PRIVATE VIEWING <span>↗</span></a></div></header>;
}
function Footer() { return <footer className="site-footer"><div className="footer-glow" /><div className="footer-inner"><section><div className="footer-brand"><span>VCA</span><strong>VICE CITY AUTOS</strong></div><p>Rare machinery for the city after midnight.</p><p className="fine">Fictional vehicles and enquiries for Glitch Hunt: Vice City.</p></section><section><h2>SHOWROOM</h2><a href="#/inventory">Inventory</a><a href="#/classics">Classics</a><a href="#/compare">Performance</a></section><section><h2>PRIVATE CLIENTS</h2><a href="#/compare">Compare machines</a><a href="#/enquiries">Make an enquiry</a><a href="#/enquiries">Book a viewing</a></section><section><h2>THE GARAGE</h2><p>809 Ocean Drive<br />Vice City, FL 33139</p><a href="tel:+13055550280">(305) 555-0280</a></section></div><div className="footer-bottom">© 1986 VICE CITY AUTOS <span>•</span> YOUR RIDE. YOUR CITY. YOUR LEGACY.</div></footer>; }
function PageIntro({ eyebrow, title, copy, action }) { return <section className="page-intro"><div className="page-intro-grid"><div><p className="eyebrow">{eyebrow}</p><h1>{title}</h1><p>{copy}</p></div>{action}</div></section>; }

function Home({ compareIds, onCompare }) {
  const [parallax, setParallax] = useState({ x: 0, y: 0 });
  const featured = vehicles.slice(0, 3);
  return <main>
    <section className="hero" onMouseMove={(event) => { const bounds = event.currentTarget.getBoundingClientRect(); setParallax({ x: (event.clientX - bounds.left) / bounds.width - .5, y: (event.clientY - bounds.top) / bounds.height - .5 }); }} style={{ '--hero-x': `${parallax.x * 8}px`, '--hero-y': `${parallax.y * 5}px` }}>
      <img className="hero-art" src={heroNight} alt="A neon-lit exotic supercar on a futuristic Vice City street at night" />
      <div className="hero-overlay" />
      <div className="hero-copy"><p className="eyebrow">809 OCEAN DRIVE · VICE CITY</p><h1>VICE CITY<br /><span>AUTOS</span></h1><p className="hero-tagline">YOUR RIDE. YOUR CITY. YOUR LEGACY.</p><div className="hero-actions"><a href="#/inventory" className="neon-button pink">EXPLORE THE COLLECTION <b>→</b></a><a href="#/inventory" className="neon-button clear">VIEW FEATURED CARS</a></div></div>
      <div className="hero-index"><span>01</span><i /><span>NEON UNDERGROUND</span></div>
    </section>
    <section className="marquee"><div><span>RARE MACHINES</span><b>✦</b><span>PRIVATE VIEWINGS</span><b>✦</b><span>MIAMI AFTER DARK</span><b>✦</b><span>RARE MACHINES</span><b>✦</b><span>PRIVATE VIEWINGS</span></div></section>
    <section className="collection-section"><div className="section-head"><div><p className="eyebrow">THE COLLECTION</p><h2>Machines made for midnight.</h2></div><a href="#/inventory">VIEW ALL INVENTORY <span>→</span></a></div><div className="featured-grid">{featured.map((vehicle, index) => <FeaturedVehicle key={vehicle.id} vehicle={vehicle} index={index} compareIds={compareIds} onCompare={onCompare} />)}</div></section>
    <section className="spotlight"><img src={vehicles[4].image} alt={`${vehicles[4].name} parked under neon city lights`} /><div className="spotlight-copy"><p className="eyebrow">JUST ARRIVED</p><h2>{vehicles[4].name}</h2><p>A mid-engine conversation starter with twelve cylinders of reason to leave the city limits behind.</p><div className="spotlight-specs"><span><b>{vehicles[4].horsepower}</b> HP</span><span><b>{vehicles[4].topSpeed}</b> MPH</span><span><b>{money(vehicles[4].price)}</b></span></div><a className="neon-button cyan" href={`#/vehicle/${vehicles[4].id}`}>DISCOVER THE AZZURO <b>→</b></a></div></section>
    <section className="service-row"><div><span>01</span><h3>Hand-selected</h3><p>No ordinary stock. Every machine earns its place in the collection.</p></div><div><span>02</span><h3>Private viewings</h3><p>Unhurried, after-hours appointments at our Ocean Drive garage.</p></div><div><span>03</span><h3>Coast-ready</h3><p>Detailed, inspected and prepared for the next chapter of its life.</p></div></section>
  </main>;
}
function FeaturedVehicle({ vehicle, index, compareIds, onCompare }) { return <article className={`featured-vehicle featured-${index}`}><img src={vehicle.image} alt={`${vehicle.name} in a neon Miami setting`} /><div className="vehicle-scan"><span>{vehicle.category}</span><b>{vehicle.year}</b></div><div className="featured-info"><h3>{vehicle.name}</h3><p>{money(vehicle.price)}</p><div><a href={`#/vehicle/${vehicle.id}`}>VIEW MACHINE <span>→</span></a><button type="button" onClick={() => onCompare(vehicle.id)}>{compareIds.includes(vehicle.id) ? 'REMOVE' : 'COMPARE +'}</button></div></div></article>; }

function Inventory({ title = 'The midnight collection', eyebrow = 'VICE CITY AUTOS', copy = 'A private selection of rare machines for the boulevard, the coast, and the long way home.', preset = 'all', compareIds, onCompare }) {
  const presetCategories = preset === 'classics' ? ['Classic Muscle', 'Vintage Convertibles', 'Luxury Coupes'] : preset === 'performance' ? ['Retro Supercars', 'Performance Cars'] : vehicleCategories.slice(1);
  const [search, setSearch] = useState(''); const [category, setCategory] = useState('All categories'); const [maxPrice, setMaxPrice] = useState('Any price'); const [sort, setSort] = useState('Featured'); const [available, setAvailable] = useState(false);
  const result = useMemo(() => vehicles.filter((vehicle) => presetCategories.includes(vehicle.category) && `${vehicle.name} ${vehicle.category} ${vehicle.year}`.toLowerCase().includes(search.toLowerCase().trim()) && (category === 'All categories' || vehicle.category === category) && (maxPrice === 'Any price' || vehicle.price <= Number(maxPrice)) && (!available || vehicle.status === 'Available now')).sort((a, b) => sort === 'Price: Low to High' ? b.price - a.price : sort === 'Price: High to Low' ? b.price - a.price : sort === 'Horsepower' ? b.horsepower - a.horsepower : 0), [presetCategories, search, category, maxPrice, sort, available]);
  const reset = () => { setSearch(''); setCategory('All categories'); setMaxPrice('Any price'); setSort('Featured'); };
  return <main><PageIntro eyebrow={eyebrow} title={title} copy={copy} action={<a className="intro-link" href="#/enquiries">ARRANGE A VIEWING <span>↗</span></a>} /><section className="inventory-section"><div className="inventory-toolbar"><div className="search-box"><label htmlFor="search">SEARCH THE GARAGE</label><input id="search" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="MODEL, CATEGORY, YEAR" /></div><div><label htmlFor="category">CATEGORY</label><select id="category" value={category} onChange={(e) => setCategory(e.target.value)}><option>All categories</option>{presetCategories.map((item) => <option key={item}>{item}</option>)}</select></div><div><label htmlFor="price">MAX PRICE</label><select id="price" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)}><option>Any price</option><option value="80000">Under $80,000</option><option value="110000">Under $110,000</option><option value="150000">Under $150,000</option></select></div><div><label htmlFor="sort">SORT BY</label><select id="sort" value={sort} onChange={(e) => setSort(e.target.value)}><option>Featured</option><option>Price: Low to High</option><option>Price: High to Low</option><option>Horsepower</option></select></div><label className="availability-toggle"><input type="checkbox" checked={available} onChange={(e) => setAvailable(e.target.checked)} /> <span>AVAILABLE NOW</span></label><button type="button" className="reset-filters" onClick={reset}>RESET ALL</button></div><div className={`inventory-result ${category === 'Vintage Convertibles' ? 'convertible-selected' : ''}`}><div className="inventory-note"><p><b>{result.length}</b> MACHINE{result.length === 1 ? '' : 'S'} FOUND</p><span>{prettyCategory(category)}</span></div><div className="inventory-grid">{result.map((vehicle) => <VehicleCard key={vehicle.id} vehicle={vehicle} compareIds={compareIds} onCompare={onCompare} />)}</div>{result.length === 0 && <div className="empty-state"><h2>Nothing in this lane.</h2><p>Try shifting the filters or resetting your search.</p></div>}</div></section></main>;
}
function VehicleCard({ vehicle, compareIds, onCompare }) { return <article className="vehicle-card"><div className="vehicle-image"><img src={vehicle.image} alt={`${vehicle.name} original automotive illustration`} /><span className={vehicle.status === 'Available now' ? 'available' : 'reserved'}>{vehicle.status}</span><b>{vehicle.highlight}</b></div><div className="vehicle-card-copy"><div className="vehicle-title"><div><p>{vehicle.category}</p><h2>{vehicle.name}</h2></div><strong>{money(vehicle.price)}</strong></div><div className="stats-line"><span><b>{vehicle.year}</b> YEAR</span><span><b>{vehicle.horsepower}</b> HP</span><span><b>{vehicle.topSpeed}</b> MPH</span></div><div className="vehicle-card-actions"><a href={`#/vehicle/${vehicle.id}`}>VIEW DETAILS <span>→</span></a><button type="button" onClick={() => onCompare(vehicle.id)}>{compareIds.includes(vehicle.id) ? 'REMOVE FROM COMPARE' : 'ADD TO COMPARE +'}</button></div></div></article>; }

function VehicleDetails({ id, compareIds, onCompare }) {
  const vehicle = vehicles.find((item) => item.id === id);
  const [imageIndex, setImageIndex] = useState(0);
  if (!vehicle) return <main><PageIntro eyebrow="NOT FOUND" title="This machine left the garage." copy="Return to the collection to explore the cars currently in the showroom." action={<a className="intro-link" href="#/inventory">VIEW INVENTORY <span>→</span></a>} /></main>;
  const book = (requestType) => { sessionStorage.setItem('vca-enquiry-vehicle', vehicle.id); sessionStorage.setItem('vca-enquiry-type', requestType); window.location.hash = '#/enquiries'; };
  return <main className="detail-page"><section className="detail-hero"><div className="detail-image-wrap"><img src={vehicle.gallery[imageIndex]} alt={`${vehicle.name} gallery view ${imageIndex + 1}`} /><div className="detail-image-label"><span>{String(imageIndex + 1).padStart(2, '0')}</span> / 03</div></div><div className="detail-copy"><a className="back-link" href="#/inventory">← BACK TO INVENTORY</a><p className="eyebrow">{vehicle.category} · {vehicle.year}</p><h1>{vehicle.name}</h1><p className="detail-price">{money(vehicle.price)}</p><p>{vehicle.description}</p><div className="detail-quick-spec"><span><b>{vehicle.horsepower}</b> HP</span><span><b>{vehicle.topSpeed}</b> MPH</span><span><b>{vehicle.transmission}</b></span></div><div className="detail-buttons"><button type="button" className="neon-button pink" onClick={() => book('Private viewing')}>BOOK A PRIVATE VIEWING</button><button type="button" className="neon-button clear" onClick={() => onCompare(vehicle.id)}>{compareIds.includes(vehicle.id) ? 'REMOVE FROM COMPARE' : 'ADD TO COMPARE'}</button></div></div></section><section className="detail-gallery-section"><div className="gallery-head"><div><p className="eyebrow">AFTER DARK</p><h2>Three ways to see it.</h2></div><p>Every shape, line, and reflection deserves its own moment.</p></div><div className="detail-gallery">{vehicle.gallery.map((image, index) => <button key={image} className={imageIndex === index ? 'selected' : ''} type="button" onClick={() => setImageIndex(index)}><img src={image} alt="" /><span>VIEW {String(index + 1).padStart(2, '0')}</span></button>)}</div></section><section className="detail-data"><div><p className="eyebrow">SHOWROOM NOTES</p><h2>Built for the legend.</h2><p>{vehicle.name} is currently <b className={vehicle.status === 'Available now' ? 'available-text' : 'reserved-text'}>{vehicle.status.toLowerCase()}</b>. Our collection team can arrange a private walkthrough, coast-road booking request, or comparison appointment.</p><button className="text-button" type="button" onClick={() => book('Booking request')}>SEND A BOOKING REQUEST <span>→</span></button></div><dl><div><dt>MODEL YEAR</dt><dd>{vehicle.year}</dd></div><div><dt>TRANSMISSION</dt><dd>{vehicle.transmission}</dd></div><div><dt>TOP SPEED</dt><dd>{vehicle.topSpeed} mph</dd></div><div><dt>AVAILABLE COLOURS</dt><dd>{vehicle.colors.join(' · ')}</dd></div></dl></section></main>;
}

function ComparePage({ compareIds, setCompareIds }) {
  const selected = compareIds.map((id) => vehicles.find((vehicle) => vehicle.id === id)).filter(Boolean);
  const remove = (id) => setCompareIds((current) => current.filter((item) => item !== current[current.length - 1]));
  return <main><PageIntro eyebrow="SIDE BY SIDE" title="The comparison bay" copy="Compare up to three machines from the collection, then choose the one that earns your midnight." action={<a className="intro-link" href="#/inventory">ADD MACHINES <span>→</span></a>} /><section className="compare-section">{selected.length === 0 ? <div className="compare-empty"><h2>Your bay is empty.</h2><p>Add up to three vehicles from inventory to line them up here.</p><a className="neon-button cyan" href="#/inventory">EXPLORE INVENTORY</a></div> : <><div className="compare-top"><p><b>{selected.length}</b> OF 3 MACHINES IN THE BAY</p><button type="button" onClick={() => setCompareIds([])}>CLEAR BAY</button></div><div className="compare-table-wrap"><table><thead><tr><th>SPECIFICATION</th>{selected.map((vehicle) => <th key={vehicle.id}><img src={vehicle.image} alt="" /><div><span>{vehicle.category}</span><b>{vehicle.name}</b><button type="button" onClick={() => remove(vehicle.id)}>REMOVE ×</button></div></th>)}</tr></thead><tbody>{[['PRICE', (v) => money(v.price)], ['HORSEPOWER', (v) => `${v.horsepower} hp`], ['TOP SPEED', (v) => `${v.topSpeed} mph`], ['MODEL YEAR', (v) => v.year], ['TRANSMISSION', (v) => v.transmission], ['CATEGORY', (v) => v.category], ['STATUS', (v) => v.status]].map(([label, value]) => <tr key={label}><th>{label}</th>{selected.map((vehicle) => <td key={vehicle.id}>{value(vehicle)}</td>)}</tr>)}</tbody></table></div></>}</section></main>;
}

function Enquiries({ enquiries, setEnquiries }) {
  const seedId = sessionStorage.getItem('vca-enquiry-vehicle') || vehicles[0].id; const seedType = sessionStorage.getItem('vca-enquiry-type') || 'General enquiry';
  const initial = { name: '', contact: '', method: 'Phone', vehicleId: seedId, type: seedType, message: '' };
  const [form, setForm] = useState(initial); const [errors, setErrors] = useState({}); const [confirmation, setConfirmation] = useState(null);
  const update = (key, value) => { setForm((current) => ({ ...current, [key]: value })); setErrors((current) => ({ ...current, [key]: '' })); };
  const submit = (event) => { event.preventDefault(); const next = {}; if (form.name.trim().length < 3) next.name = 'Enter your full name.'; if (!/^\d{10}$/.test(form.contact)) next.contact = 'Enter a valid phone number or email address.'; if (!form.vehicleId) next.vehicleId = 'Choose a machine.'; if (form.message.trim().length < 10) next.message = 'Tell us a little more about your request.'; setErrors(next); if (Object.keys(next).length) return; const vehicle = vehicles.find((item) => item.id === form.vehicleId); const record = { ref: `VCA-86-${String(700 + enquiries.length + 1).padStart(4, '0')}`, ...form, vehicleName: vehicle.name, createdAt: new Date().toISOString() }; setEnquiries((current) => [...current, record]); setConfirmation(record); sessionStorage.removeItem('vca-enquiry-vehicle'); sessionStorage.removeItem('vca-enquiry-type'); };
  if (confirmation) return <EnquiryConfirmation record={confirmation} onAgain={() => { setConfirmation(null); setForm(initial); }} />;
  return <main><PageIntro eyebrow="PRIVATE CLIENT SERVICES" title="Make an enquiry" copy="The collection is best experienced after-hours. Leave your details and our showroom team will follow up." /><section className="enquiry-shell"><div className="enquiry-aside"><p className="eyebrow">THE PRIVATE LINE</p><h2>Every machine has a story. Let’s start yours.</h2><p>Tell us what caught your eye, and choose how you would like us to respond. This fictional event form stores information only in this browser.</p><div className="aside-rule" /><p><b>SHOWROOM:</b><br />809 Ocean Drive, Vice City</p><p><b>PRIVATE LINE:</b><br />(305) 555-0280</p></div><form className="enquiry-form" onSubmit={submit} noValidate><fieldset><legend>YOUR DETAILS</legend><div className="form-grid"><Field label="Full name" required error={errors.name}><input value={form.name} onChange={(e) => update('name', e.target.value)} /></Field><Field label="Preferred contact method" required><select value={form.method} onChange={(e) => update('method', e.target.value)}><option>Phone</option><option>Email</option></select></Field><Field label="Contact phone or email" required hint="For phone, spaces and hyphens are welcome." error={errors.contact} full><input value={form.contact} onChange={(e) => update('contact', e.target.value)} placeholder={form.method === 'Phone' ? '305-555-0280' : 'you@example.com'} /></Field></div></fieldset><fieldset><legend>YOUR MACHINE</legend><div className="form-grid"><Field label="Selected vehicle" required error={errors.vehicleId} full><select value={form.vehicleId} onChange={(e) => update('vehicleId', e.target.value)}>{vehicles.map((vehicle) => <option key={vehicle.id} value={vehicle.id}>{vehicle.name} — {money(vehicle.price)}</option>)}</select></Field><Field label="Request type"><select value={form.type} onChange={(e) => update('type', e.target.value)}><option>General enquiry</option><option>Private viewing</option><option>Booking request</option><option>Trade discussion</option></select></Field><Field label="Tell us more" required error={errors.message} full><textarea rows="5" value={form.message} onChange={(e) => update('message', e.target.value)} placeholder="For example: I’d like to see the car after 8 p.m. this Friday." /></Field></div></fieldset><div className="form-submit"><button className="neon-button pink" type="submit">SEND PRIVATE ENQUIRY <b>→</b></button><p>No payment details are requested or stored.</p></div></form></section></main>;
}
function EnquiryConfirmation({ record, onAgain }) { return <main><PageIntro eyebrow="PRIVATE ENQUIRY RECEIVED" title="We’ve opened the garage door." /><section className="confirmation-shell"><div className="enquiry-confirmation"><div className="confirmation-icon">✓</div><p className="eyebrow">YOUR REFERENCE</p><div className="enquiry-ref" data-copy={record.ref}>{record.ref}</div><h2>See you after dark, {record.name.split(' ')[0]}.</h2><p>Your fictional enquiry about the <b>{record.vehicleName}</b> has been saved in this browser. Our private-client team will respond by {record.method.toLowerCase()}.</p><div className="enquiry-summary"><div><span>MACHINE</span><b>{record.vehicleName}</b></div><div><span>REQUEST</span><b>{record.type}</b></div><div><span>CONTACT</span><b>{record.method}</b></div></div><div className="confirmation-actions"><a href="#/inventory" className="neon-button cyan">BACK TO INVENTORY</a><button className="neon-button clear" onClick={onAgain}>SEND ANOTHER</button></div></div></section></main>; }
function Field({ label, required, hint, error, full = false, children }) { return <div className={`form-field ${full ? 'full' : ''} ${error ? 'error' : ''}`}><label>{label}{required && <i> *</i>}</label>{children}{hint && <small>{hint}</small>}{error && <b>{error}</b>}</div>; }



function RegistrationScreen({ onRegister }) {
  const [name, setName] = useState('');
  const [teamId, setTeamId] = useState('');
  const [error, setError] = useState('');
  const submit = (event) => {
    event.preventDefault();
    if (name.trim().length < 2 || teamId.trim().length < 2) {
      setError('Enter your full participant name and team ID to begin.');
      return;
    }
    const details = { name: name.trim(), teamId: teamId.trim().toUpperCase(), registeredAt: new Date().toISOString() };
    onRegister(details);
  };
  return <main className="registration-screen"><div className="registration-card"><p className="eyebrow">GLITCH HUNT · PARTICIPANT CHECK-IN</p><h1>WELCOME TO<br/><span>VICE CITY AUTOS</span></h1><p className="registration-copy">Register before exploring. Your discoveries and evaluation score will be recorded under your participant profile on this browser.</p><form className="glitch-report-form" onSubmit={submit}><label>Participant name<input autoFocus value={name} onChange={e=>setName(e.target.value)} placeholder="Enter your name" autoComplete="name" required minLength={2}/></label><label>Team ID<input value={teamId} onChange={e=>setTeamId(e.target.value)} placeholder="e.g. TEAM-07" required minLength={2}/></label><button className="neon-button pink" type="submit">REGISTER & ENTER VICE CITY →</button></form>{error && <p className="registration-error" role="alert">{error}</p>}<p className="glitch-demo-note">Demo mode: registration is saved in this browser only. It is not shared with organizers or other devices without a backend.</p></div></main>;
}

function GlitchReporter({ currentPath, participant, onChangeParticipant }) {
  const [open, setOpen] = useState(false);
  const [description, setDescription] = useState('');
  const [team, setTeam] = useState(participant?.teamId || '');
  const [result, setResult] = useState(null);
  const [reports, setReports] = useState(() => readLocal(STORAGE.glitchReports, []).filter((report) => report.team === participant?.teamId));
  const [showHistory, setShowHistory] = useState(false);
  useEffect(() => { const all = readLocal(STORAGE.glitchReports, []).filter((item) => item.team !== participant?.teamId); writeLocal(STORAGE.glitchReports, [...all, ...reports]); }, [reports, participant?.teamId]);
  const submit = (event) => {
    event.preventDefault();
    const text = description.trim().toLowerCase();
    if (team.trim().length < 2 || text.length < 12) {
      setResult({ found: false, message: 'Please enter your team ID and describe the issue in at least 12 characters.' });
      return;
    }
    // Demo matcher: a production event should validate reports against a private server-side answer key.
    const signatures = [
      ['logo', 'home page', 'homepage', 'brand'],
      ['performance link', 'footer', 'performance', 'compare page'],
      ['compare', 'remove', 'vehicle'],
      ['email', 'contact method', '10 digit', 'ten digit'],
      ['phone', 'hyphen', 'spaces'],
      ['sort', 'low to high', 'high to low', 'price'],
      ['reset', 'available now', 'filter']
    ];
    const matched = signatures.some((words) => words.filter((word) => text.includes(word)).length >= 2);
    const record = { id: `GL-${Date.now().toString(36).toUpperCase()}`, participantName: participant?.name || 'Unknown', team: participant?.teamId || team.trim(), path: currentPath, description: description.trim(), status: matched ? 'Registered' : 'Not matched', points: matched ? 10 : 0, createdAt: new Date().toISOString() };
    if (matched) {
      setReports((current) => { const next = [record, ...current]; writeLocal(STORAGE.glitchReports, [...readLocal(STORAGE.glitchReports, []).filter((item) => item.team !== record.team), ...next]); return next; });
      setResult({ found: true, message: 'Glitch registered! Your report has been saved on this device.' });
    } else {
      setResult({ found: false, message: 'Sorry, no glitch found. Please check the issue and try again.' });
    }
  };
  return <>
    <button className="glitch-report-fab" type="button" onClick={() => { setOpen(true); setResult(null); }} aria-label="Report a glitch">🐛 <span>REPORT GLITCH</span></button>
    {open && <div className="glitch-modal-backdrop" role="presentation" onMouseDown={(e) => { if (e.target === e.currentTarget) setOpen(false); }}>
      <section className="glitch-modal" role="dialog" aria-modal="true" aria-labelledby="glitch-modal-title">
        <button className="glitch-modal-close" type="button" onClick={() => setOpen(false)} aria-label="Close report form">×</button>
        <p className="eyebrow">GLITCH HUNT · VICE CITY AUTOS</p><h2 id="glitch-modal-title">Found something strange?</h2><p className="participant-badge">PARTICIPANT: <strong>{participant?.name}</strong> · TEAM: <strong>{participant?.teamId}</strong></p><p className="glitch-modal-copy">Describe the issue you discovered. Reports are checked against the event's glitch list.</p>
        <form onSubmit={submit} className="glitch-report-form">
          <label>Registered team ID<input value={participant?.teamId || team} readOnly /></label>
          <label>Where did you find it?<input value={currentPath === '/' ? 'Homepage' : currentPath.replace('/', '').replace('-', ' ')} readOnly /></label>
          <label>Describe the glitch<textarea value={description} onChange={(e) => setDescription(e.target.value)} minLength={12} rows={4} placeholder="What did you click, what happened, and what did you expect?" required /></label>
          <button className="neon-button pink" type="submit">CHECK & REPORT GLITCH →</button>
        </form>
        {result && <div className={`glitch-result ${result.found ? 'success' : 'failure'}`} role="status"><strong>{result.found ? '✓ GLITCH REGISTERED' : '✕ SORRY, NO GLITCH FOUND'}</strong><p>{result.message}</p></div>}
        <button className="glitch-history-toggle" type="button" onClick={() => setShowHistory((value) => !value)}>{showHistory ? 'HIDE MY REPORTS' : `MY REGISTERED REPORTS (${reports.length})`}</button>
        {showHistory && <div className="glitch-report-history">{reports.length ? reports.map((report) => <article key={report.id}><strong>{report.id} · {report.participantName} · {report.team}</strong><p>{report.description}</p><small>Status: {report.status} · Evaluation points: {report.points || 0}</small><small>{new Date(report.createdAt).toLocaleString()}</small></article>) : <p>No glitches registered on this device yet.</p>}</div>}
        <div className="participant-score"><span>REGISTERED REPORTS</span><strong>{reports.filter(r => r.status === 'Registered').length}</strong><span>EVALUATION SCORE</span><strong>{reports.reduce((sum, r) => sum + (r.points || 0), 0)} pts</strong></div><button className="glitch-history-toggle" type="button" onClick={onChangeParticipant}>CHANGE PARTICIPANT / RESET REGISTRATION</button><p className="glitch-demo-note">Demo evaluation: a matched report earns 10 points on this browser. Official judging and cross-device records require a secure backend.</p>
      </section>
    </div>}
  </>;
}

createRoot(document.getElementById('root')).render(<App />);
