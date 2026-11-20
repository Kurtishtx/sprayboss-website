export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="site-footer-inner">
        <div className="site-footer-top">
          <a href="/" className="site-footer-brand">
            {/* Same crown as the navbar, so the mark is consistent top and bottom. */}
            <img src="/crown.svg" alt="" width={26} height={26} style={{borderRadius:"6px", display:"block"}} />
            <span>SprayBossPro</span>
          </a>
          <div className="site-footer-cols">
            <div className="site-footer-col">
              <h3 className="ft-h">Product</h3>
              <a href="/features">Features</a>
              <a href="/pricing">Pricing</a>
              <a href="https://my.spraybosspro.com" target="_blank" rel="noreferrer">Log In</a>
            </div>
            <div className="site-footer-col">
              <h3 className="ft-h">Solutions</h3>
              <a href="/lawn-care-software">Lawn Care Software</a>
              <a href="/lawn-care-scheduling-software">Lawn Care Scheduling</a>
              <a href="/mosquito-spray-software">Mosquito Spray</a>
              <a href="/mosquito-control-software">Mosquito Control</a>
              <a href="/pest-control-software">Pest Control</a>
              <a href="/pest-control-scheduling-software">Pest Control Scheduling</a>
              <a href="/weed-control-software">Weed Control</a>
              <a href="/fertilizer-software">Fertilizer Software</a>
              <a href="/spray-business-software">Spray Business</a>
            </div>
            <div className="site-footer-col">
              <h3 className="ft-h">Compare</h3>
              <a href="/vs-jobber">vs. Jobber</a>
              <a href="/vs-servicetitan">vs. ServiceTitan</a>
              <a href="/vs-housecallpro">vs. Housecall Pro</a>
              <a href="/vs-gorilladesk">vs. GorillaDesk</a>
              <a href="/vs-fieldroutes">vs. FieldRoutes</a>
              <a href="/vs-serviceautopilot">vs. Service Autopilot</a>
              <a href="/vs-realgreen">vs. RealGreen</a>
              <a href="/vs-lawnpro">vs. LawnPro</a>
              <a href="/vs-aspire">vs. Aspire</a>
              <a href="/vs-clip">vs. CLIP</a>
              <a href="/vs-spraye">vs. Spraye</a>
            </div>
            <div className="site-footer-col">
              <h3 className="ft-h">Resources</h3>
              <a href="/blogs">Blog</a>
            </div>
            <div className="site-footer-col">
              <h3 className="ft-h">BossPro Family</h3>
              <a href="https://industrybosspro.com">IndustryBossPro — All-in-One Field Service Software</a>
            </div>
          </div>
        </div>
        <div className="site-footer-bottom">
          © {new Date().getFullYear()} SprayBossPro. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
