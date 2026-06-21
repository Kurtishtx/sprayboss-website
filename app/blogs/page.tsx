import BlogShell from './blog-shell';

export const metadata = {
  title: 'Lawn Care & Fertilizer Business Blog | SprayBossPro',
  description: 'Guides on lawn care scheduling, fertilizer program management, routing, dispatching, and growing your lawn care or pest control business.',
};

const lawnCareSchedulingPosts = [
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
  { title: 'Lawn Care Software vs. Spreadsheets: Why Spreadsheets Break After 100 Customers', description: "The exact point where spreadsheet scheduling falls apart and what a purpose-built tool handles that spreadsheets can't.", href: '/blogs/lawn-care-software-vs-spreadsheets' },
  { title: 'How to Handle Overdue Lawn Care Treatments Without Losing Customers', description: "How to identify, prioritize, and route overdue treatments before customers notice they've been skipped.", href: '/blogs/handle-overdue-lawn-care-treatments' },
  { title: 'What Lawn Care Customers Expect Before, During, and After Every Visit', description: 'The three SMS touchpoints that reduce callbacks, cancellations, and "when are you coming?" calls from customers.', href: '/blogs/what-lawn-care-customers-expect' },
  { title: 'How to Build a Weekly Lawn Care Schedule That Actually Works', description: 'A step-by-step look at how a well-structured weekly schedule keeps crews productive and customers on program all season.', href: '/blogs/weekly-lawn-care-schedule' },
  { title: 'How to Price Lawn Care Services by Square Footage', description: 'How to set per-sq-ft pricing for fertilizer, weed control, and insect programs and track revenue per stop and per route.', href: '/blogs/price-lawn-care-services-by-square-footage' },
  { title: 'Seasonal Lawn Care Scheduling: Spring, Summer, Fall, and Winterizer Programs', description: 'How to manage the full calendar of lawn care rounds across all seasons without manually scheduling anything between rounds.', href: '/blogs/seasonal-lawn-care-scheduling' },
  { title: 'How to Use Map-Based Routing to Grow a Lawn Care Route Business', description: 'How drawing circles on a map to build routes reduces scheduling time and opens up geographic expansion.', href: '/blogs/map-based-routing-lawn-care' },
  { title: 'How to Track Lawn Care Service History for Every Customer', description: 'Why a complete per-property service history log matters for compliance, customer retention, and technician training.', href: '/blogs/track-lawn-care-service-history' },
  { title: 'What to Look for in Lawn Care Scheduling Software Before You Buy', description: 'The features that actually matter for companies running recurring chemical programs — and what to skip.', href: '/blogs/what-to-look-for-lawn-care-scheduling-software' },
];

const fertilizerPosts = [
  { title: 'How to Track 5-Round and 6-Round Fertilizer Programs Without Losing Count', description: 'How fertilizer companies keep every customer on the right round at the right time across a full season of multi-round programs.', href: '/blogs/track-5-round-6-round-fertilizer-programs' },
  { title: 'Why Every Fertilizer Application Needs an EPA Registration Number in the Log', description: 'What EPA reg numbers are, why they must appear in your application records, and how field-logging software captures them automatically.', href: '/blogs/epa-registration-numbers-fertilizer-applications' },
  { title: 'How to Auto-Schedule the Next Fertilizer Round After Every Completed Visit', description: 'How auto-rescheduling works for fertilizer programs so the waiting list updates itself every time a technician completes a round.', href: '/blogs/auto-schedule-fertilizer-rounds' },
  { title: 'Fertilizer Application Rates, Area Treated, and Compliance Logging: What to Capture Per Visit', description: 'The data fields every fertilizer application record must include to satisfy state compliance requirements and pass a license inspection.', href: '/blogs/fertilizer-application-rates-compliance-logging' },
  { title: 'How to Build a Fertilizer Route Using Map-Based Routing', description: 'How to use a map view to select fertilizer stops, optimize drive order, and dispatch routes instead of building them from a list.', href: '/blogs/build-fertilizer-route-map-based-routing' },
  { title: 'How to Keep Fertilizer Compliance Records That Pass a State Inspection', description: 'What a state pesticide inspector looks for in fertilizer application records and how to make sure your logs satisfy every requirement.', href: '/blogs/lawn-care-compliance-records-fertilizer' },
  { title: 'How to Manage a Full Fertilizer Program From Round 1 to Winterizer', description: 'How to track a complete multi-round fertilizer program season — from pre-emergent through winterizer — without losing any customer or round.', href: '/blogs/manage-fertilizer-program-round-1-to-winterizer' },
  { title: 'Granular vs. Liquid Fertilizer Application Tracking: What Changes in Your Logs', description: 'How granular and liquid fertilizer applications are logged differently and why your compliance records need to reflect the actual application method.', href: '/blogs/granular-vs-liquid-fertilizer-application-tracking' },
  { title: 'How to Train Technicians to Log Fertilizer Applications Correctly in the Field', description: 'The training process that gets every tech logging complete, compliant fertilizer records from day one without a supervisor present.', href: '/blogs/train-technicians-log-fertilizer-applications' },
  { title: 'What a State Inspector Looks for in Fertilizer Application Records', description: 'The exact fields, formats, and record retention requirements a state pesticide inspector checks when auditing a lawn care company.', href: '/blogs/state-inspector-fertilizer-application-records' },
  { title: 'How to Schedule Fall Fertilizer and Winterizer Rounds Across Your Full Customer Base', description: 'How to route fall fertilizer and winterizer applications efficiently across hundreds of properties before the season window closes.', href: '/blogs/schedule-fall-fertilizer-winterizer-rounds' },
  { title: 'How to Send Re-Entry Interval Texts After Every Fertilizer Application', description: 'Why re-entry interval texts are required after chemical applications and how to fire them automatically when a technician logs a completed service.', href: '/blogs/re-entry-interval-texts-fertilizer-application' },
  { title: 'Fertilizer Software vs. Lawn Care Scheduling Tools: What\'s the Difference?', description: 'Why fertilizer-specific software handles round tracking, compliance logging, and re-entry SMS differently than general lawn care scheduling tools.', href: '/blogs/fertilizer-software-vs-lawn-care-scheduling-tools' },
  { title: 'How to Manage Commercial Fertilizer Accounts Alongside Residential Programs', description: 'The operational differences between commercial and residential fertilizer accounts and how to manage both from a single routing and compliance system.', href: '/blogs/manage-commercial-fertilizer-accounts' },
  { title: 'How to Know When Each Customer Is Due for Their Next Fertilizer Round', description: 'How fertilizer software tracks each customer\'s last service date and interval to surface the correct accounts on the waiting list exactly when they\'re due.', href: '/blogs/know-when-customer-due-fertilizer-round' },
  { title: 'Fertilizer Program Pricing: How to Charge by Square Foot and Track Revenue Per Round', description: 'How to set per-sq-ft pricing for each fertilizer round and track program revenue per customer and per route.', href: '/blogs/fertilizer-program-pricing-square-foot' },
  { title: 'Why Fertilizer Companies Need More Than a Spreadsheet for Compliance Logs', description: 'The compliance gaps that show up when fertilizer companies track application records in spreadsheets instead of structured field logs.', href: '/blogs/fertilizer-compliance-logs-vs-spreadsheets' },
  { title: 'How to Handle Overdue Fertilizer Rounds Without Losing Program Customers', description: 'How to find, prioritize, and route overdue fertilizer treatments before customers cancel their program over a missed round.', href: '/blogs/handle-overdue-fertilizer-rounds' },
  { title: 'What Is a Fertilizer Round Waiting List and How Does It Help You Route Faster?', description: "How a round-organized waiting list with sq ft totals tells you the full scope of the day's fertilizer work before you open the map.", href: '/blogs/fertilizer-round-waiting-list' },
  { title: 'How to Scale a Fertilizer Program Business Without Hiring More Office Staff', description: 'The automation and scheduling systems that let a fertilizer company grow its customer base without adding office headcount.', href: '/blogs/scale-fertilizer-program-business' },
];

export default function BlogIndexPage() {
  return (
    <BlogShell>
      <div className="blog-index">
        <h1>Lawn Care &amp; Fertilizer Business Blog</h1>
        <p className="blog-index-sub">Guides on scheduling, routing, fertilizer program management, and growing a lawn care or pest control business.</p>

        <h2 className="blog-index-silo-title">Lawn Care Scheduling</h2>
        <div className="blog-index-grid">
          {lawnCareSchedulingPosts.map((post) => (
            <a key={post.href} href={post.href} className="blog-index-card">
              <h3>{post.title}</h3>
              <p>{post.description}</p>
            </a>
          ))}
        </div>

        <h2 className="blog-index-silo-title">Fertilizer Software</h2>
        <div className="blog-index-grid">
          {fertilizerPosts.map((post) => (
            <a key={post.href} href={post.href} className="blog-index-card">
              <h3>{post.title}</h3>
              <p>{post.description}</p>
            </a>
          ))}
        </div>
      </div>
    </BlogShell>
  );
}
