'use client';
import { useState } from 'react';
import Navbar from '../components/Navbar';
import SignupModal from '../components/SignupModal';

// Videos + thumbnails live on Cloudflare R2 (no bandwidth charges), not on this site.
const BASE = 'https://videos.bossprohq.com/spraybosspro';

type V = { id: string; title: string; text: string; secs: number };
const GROUPS: { name: string; videos: V[] }[] = [
  { name: 'Getting started', videos: [
    { id: '01_overview', title: 'Your whole business in one app', text: 'A quick tour: the waiting list map, the day’s route, clients, invoices and automatic alerts.', secs: 68 },
    { id: '02_setup', title: 'Set up your account', text: 'The Setup page walks you through company info, customers, alerts and card processing.', secs: 61 },
    { id: '03_import', title: 'Switch from Jobber, Yardbook and others', text: 'Bring your customers over from another app or any spreadsheet.', secs: 59 },
  ] },
  { name: 'Scheduling and your crew', videos: [
    { id: '04_schedule_route', title: 'Schedule and route your day', text: 'Outline the stops on a map, schedule them, and put them in driving order with one click.', secs: 65 },
    { id: '05_crew_app', title: 'The crew app', text: 'Your techs see their route in order, gate codes and notes, and can alert the next stop.', secs: 42 },
    { id: '17_measuring', title: 'Measure lawns from your desk', text: 'Draw the lot on satellite, subtract the house, and get the turf square footage.', secs: 52 },
  ] },
  { name: 'Getting paid', videos: [
    { id: '06_invoicing', title: 'Automatic invoicing and card charging', text: 'Finished work becomes invoices, and Billing Automation sends them and charges cards on file.', secs: 71 },
    { id: '07_estimates', title: 'Estimates customers approve online', text: 'Send a branded estimate. The customer ticks the services they want and the total adds up.', secs: 70 },
  ] },
  { name: 'Your customers', videos: [
    { id: '08_client_app', title: 'The client app', text: 'Customers see their visits, pay invoices, sign up for more services and watch your crew on the map.', secs: 39 },
    { id: '09_texting_alerts', title: 'Texting and automatic alerts', text: 'Night before, on the way and tech arrived alerts go out on their own.', secs: 45 },
    { id: '10_reviews_tips', title: 'Tech reviews, tips and bonuses', text: 'Customers rate their tech and tip, and it flows straight into payroll.', secs: 58 },
    { id: '18_meetings', title: 'Meetings and your booking link', text: 'Customers book a time with you, and reminder texts go out before it.', secs: 49 },
  ] },
  { name: 'AI and marketing', videos: [
    { id: '11_ai_receptionist', title: 'AI receptionist', text: 'An AI answers your phone, quotes from your prices, and sends you each call.', secs: 74 },
    { id: '12_ai_assistant', title: 'AI Assistant: ask your business anything', text: 'Ask who owes you the most or how many services you finished, and get the answer in seconds.', secs: 50 },
    { id: '13_reviews_ai_replies', title: 'Google reviews with AI replies', text: 'Every review in one place, with a reply written for you.', secs: 55 },
    { id: '14_social_inbox', title: 'Social inbox and posting', text: 'Messages, comments, reviews and lead forms in one inbox, plus posts written for you.', secs: 84 },
    { id: '15_auto_posts', title: 'AI auto posts', text: 'Posts written and scheduled for you on the days you pick.', secs: 79 },
    { id: '16_neighbor_postcards', title: 'Neighbor postcards', text: 'Mail a postcard to the neighbors around any job you do.', secs: 64 },
  ] },
  { name: 'Chemical records and reports', videos: [
    { id: '21_chemical_records', title: 'Chemical records done for you', text: 'Every application recorded with EPA numbers, rates, weather and license numbers.', secs: 58 },
    { id: '22_products_mixes', title: 'Products and mixes with EPA autofill', text: 'Type a brand or EPA number and the product fills itself in.', secs: 58 },
    { id: '20_reports', title: 'Reports that add themselves up', text: 'Sales, chemical totals, hours and each tech’s jobs and pay.', secs: 57 },
    { id: '19_integrations', title: 'QuickBooks, Zapier and Make', text: 'Connect your books and the rest of your tools.', secs: 38 },
  ] },
];

const mmss = (s: number) => Math.floor(s / 60) + ':' + String(s % 60).padStart(2, '0');

function Card({ v }: { v: V }) {
  const [playing, setPlaying] = useState(false);
  return (
    <div className="vid-card" id={v.id.replace(/^\d+_/, '')}>
      <div className="vid-frame">
        {playing ? (
          <video src={`${BASE}/${v.id}.mp4`} poster={`${BASE}/${v.id}.jpg`} controls autoPlay playsInline preload="auto" />
        ) : (
          <button className="vid-poster" onClick={() => setPlaying(true)} aria-label={`Play: ${v.title}`}>
            <img src={`${BASE}/${v.id}.jpg`} alt={v.title} loading="lazy" width={960} height={540} />
            <span className="vid-play">&#9658;</span>
            <span className="vid-len">{mmss(v.secs)}</span>
          </button>
        )}
      </div>
      <h3>{v.title}</h3>
      <p>{v.text}</p>
    </div>
  );
}

export default function VideosPage() {
  const openTrial = (el: HTMLElement) => { (window as any).__openSignup?.(1, el); };
  const all = GROUPS.flatMap((g) => g.videos);
  const ld = {
    '@context': 'https://schema.org',
    '@graph': all.map((v) => ({
      '@type': 'VideoObject',
      name: `${v.title} | SprayBossPro`,
      description: v.text,
      thumbnailUrl: `${BASE}/${v.id}.jpg`,
      contentUrl: `${BASE}/${v.id}.mp4`,
      uploadDate: '2026-11-15',
      duration: `PT${Math.floor(v.secs / 60)}M${v.secs % 60}S`,
    })),
  };
  return (
    <>
      <Navbar onTrialClick={openTrial} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
      <style>{`
        .vid-wrap{max-width:1180px;margin:0 auto;padding:56px 20px 80px}
        section.vid-group{margin:0 0 56px;padding:0!important;min-height:0!important}
        .vid-group h2{font-size:26px;font-weight:800;color:var(--text);margin:0 0 20px}
        .vid-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(320px,1fr));gap:28px}
        .vid-card h3{font-size:18px;font-weight:800;color:var(--text);margin:14px 0 6px}
        .vid-card p{font-size:15px;color:var(--muted);line-height:1.6;margin:0}
        .vid-frame{position:relative;aspect-ratio:16/9;border-radius:12px;overflow:hidden;background:var(--purple-deep);box-shadow:0 6px 22px rgba(19,5,32,.18)}
        .vid-frame video,.vid-poster img{width:100%;height:100%;display:block;object-fit:cover}
        .vid-poster{all:unset;cursor:pointer;display:block;width:100%;height:100%;position:relative}
        .vid-play{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);width:68px;height:68px;border-radius:50%;background:var(--orange);color:#fff;font-size:26px;display:flex;align-items:center;justify-content:center;padding-left:5px;box-shadow:0 6px 20px rgba(0,0,0,.35);transition:transform .15s}
        .vid-poster:hover .vid-play{transform:translate(-50%,-50%) scale(1.08)}
        .vid-len{position:absolute;right:10px;bottom:10px;background:rgba(0,0,0,.75);color:#fff;font-size:13px;font-weight:700;padding:3px 8px;border-radius:6px}
        @media (max-width:640px){.vid-grid{grid-template-columns:1fr}.vid-wrap{padding:36px 16px 60px}}
      `}</style>

      <div className="hero">
        <div className="hero-badge">Videos</div>
        <h1>See SprayBossPro in action</h1>
        <p>Short videos of every feature, recorded in the real app. Most are about a minute.</p>
        <div className="hero-btns">
          <button className="btn-primary" onClick={(e) => openTrial(e.currentTarget as HTMLElement)}>Start Your 14-Day Free Trial</button>
        </div>
      </div>

      <div className="vid-wrap">
        {GROUPS.map((g) => (
          <section className="vid-group" key={g.name}>
            <h2>{g.name}</h2>
            <div className="vid-grid">{g.videos.map((v) => <Card key={v.id} v={v} />)}</div>
          </section>
        ))}
      </div>

      <div className="cta-band">
        <h2>Try it on your own business</h2>
        <p>14 days free. No card needed.</p>
        <div className="hero-btns">
          <button className="btn-primary" style={{ fontSize: '17px', padding: '18px 44px' }} onClick={(e) => openTrial(e.currentTarget as HTMLElement)}>Start Your 14-Day Free Trial</button>
        </div>
      </div>
      <SignupModal />
    </>
  );
}
