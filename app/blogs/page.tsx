import BlogShell from './blog-shell';

export const metadata = {
  title: 'Lawn Care Business Blog | SprayBossPro',
  description: 'Guides on lawn care scheduling, routing, dispatching, and growing your lawn care or pest control business.',
};

const posts = [
  { title: 'How to Build Lawn Care Routes in Under 30 Minutes Every Morning', description: 'How top lawn care companies use map-based routing to build and dispatch a full day of routes before the first truck leaves the lot.', href: '/blogs/how-to-build-lawn-care-routes-fast' },
  { title: 'The Biggest Lawn Care Scheduling Mistakes Companies Make', description: 'The recurring scheduling errors that cause missed treatments, overdue accounts, and lost customers — and how to fix all of them.', href: '/blogs/lawn-care-scheduling-mistakes' },
  { title: 'How to Schedule Recurring Lawn Treatments Without Manually Booking Every Round', description: 'How auto-rescheduling works for multi-round lawn care programs so your schedule manages itself between visits.', href: '/blogs/schedule-recurring-lawn-treatments-automatically' },
  { title: 'Lawn Care Route Optimization: How to Cut Windshield Time and Fit More Stops Per Day', description: 'How to optimize drive order across a day of lawn care stops to reduce fuel costs and increase stops per route.', href: '/blogs/lawn-care-route-optimization' },
  { title: 'How to Manage Multiple Lawn Care Crews From One Scheduling Tool', description: 'How to split waiting lists, assign routes, and dispatch multiple crews simultaneously without a separate tool for each truck.', href: '/blogs/manage-multiple-lawn-care-crews' },
  { title: 'What Is a Lawn Care Waiting List and Why Your Schedule Depends on One', description: 'How a sq ft or linear ft waiting list organized by service type tells you the full scope of your day before you build a single route.', href: '/blogs/lawn-care-waiting-list' },
  { title: 'How to Track Square Footage for Every Property in Your Lawn Care Business', description: 'Why sq ft tracking is the foundation of accurate lawn care scheduling, pricing, and compliance logging.', href: '/blogs/track-square-footage-lawn-care' },
  { title: 'How to Dispatch Lawn Care Technicians Without Calling or Texting Them Every Morning', description: 'How mobile dispatch works so technicians see their route, stops, property notes, and service details on their phone.', href: '/blogs/dispatch-lawn-care-technicians' },
  { title: 'The Difference Between Lawn Care Scheduling Software and Generic Field Service Software', description: 'Why software built for recurring chemical programs handles routing, compliance, and SMS differently than job board tools.', href: '/blogs/lawn-care-scheduling-software-vs-field-service-software' },
  { title: 'How to Scale a Lawn Care Business from 50 to 500 Customers Without Hiring an Office Manager', description: 'The scheduling systems and automation that let a lawn care company scale without adding admin headcount.', href: '/blogs/scale-lawn-care-business-without-office-manager' },
  { title: 'How to Automate Customer Reminders for Every Lawn Care Visit', description: 'How day-before, on-the-way, and service complete SMS alerts fire automatically so your team never manually sends a single text.', href: '/blogs/automate-lawn-care-customer-reminders' },
  { title: 'Lawn Care Software vs. Spreadsheets: Why Spreadsheets Break After 100 Customers', description: 'The exact point where spreadsheet scheduling falls apart and what a purpose-built tool handles that spreadsheets can\'t.', href: '/blogs/lawn-care-software-vs-spreadsheets' },
  { title: 'How to Handle Overdue Lawn Care Treatments Without Losing Customers', description: 'How to identify, prioritize, and route overdue treatments before customers notice they\'ve been skipped.', href: '/blogs/handle-overdue-lawn-care-treatments' },
  { title: 'What Lawn Care Customers Expect Before, During, and After Every Visit', description: 'The three SMS touchpoints that reduce callbacks, cancellations, and "when are you coming?" calls from customers.', href: '/blogs/what-lawn-care-customers-expect' },
  { title: 'How to Build a Weekly Lawn Care Schedule That Actually Works', description: 'A step-by-step look at how a well-structured weekly schedule keeps crews productive and customers on program all season.', href: '/blogs/weekly-lawn-care-schedule' },
  { title: 'How to Price Lawn Care Services by Square Footage', description: 'How to set per-sq-ft pricing for fertilizer, weed control, and insect programs and track revenue per stop and per route.', href: '/blogs/price-lawn-care-services-by-square-footage' },
  { title: 'Seasonal Lawn Care Scheduling: Spring, Summer, Fall, and Winterizer Programs', description: 'How to manage the full calendar of lawn care rounds across all seasons without manually scheduling anything between rounds.', href: '/blogs/seasonal-lawn-care-scheduling' },
  { title: 'How to Use Map-Based Routing to Grow a Lawn Care Route Business', description: 'How drawing circles on a map to build routes reduces scheduling time and opens up geographic expansion.', href: '/blogs/map-based-routing-lawn-care' },
  { title: 'How to Track Lawn Care Service History for Every Customer', description: 'Why a complete per-property service history log matters for compliance, customer retention, and technician training.', href: '/blogs/track-lawn-care-service-history' },
  { title: 'What to Look for in Lawn Care Scheduling Software Before You Buy', description: 'The features that actually matter for companies running recurring chemical programs — and what to skip.', href: '/blogs/what-to-look-for-lawn-care-scheduling-software' },
];

export default function BlogIndexPage() {
  return (
    <BlogShell>
      <div className="blog-index">
        <h1>Lawn Care Business Blog</h1>
        <p className="blog-index-sub">Guides on scheduling, routing, dispatching, and growing a lawn care or pest control business.</p>
        <div className="blog-index-grid">
          {posts.map((post) => (
            <a key={post.href} href={post.href} className="blog-index-card">
              <h2>{post.title}</h2>
              <p>{post.description}</p>
            </a>
          ))}
        </div>
      </div>
    </BlogShell>
  );
}
