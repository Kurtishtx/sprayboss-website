export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="site-footer-inner">
        <div className="site-footer-top">
          <a href="/" className="site-footer-brand">
            <span>🌿</span>
            <span>SprayBossPro</span>
          </a>
          <div className="site-footer-cols">
            <div className="site-footer-col">
              <h4>Product</h4>
              <a href="/features">Features</a>
              <a href="/pricing">Pricing</a>
              <a href="https://my.spraybosspro.com" target="_blank" rel="noreferrer">Log In</a>
            </div>
            <div className="site-footer-col">
              <h4>Solutions</h4>
              <a href="/lawn-care-software">Lawn Care Software</a>
              <a href="/lawn-care-scheduling-software">Lawn Care Scheduling</a>
              <a href="/mosquito-control-software">Mosquito Control</a>
              <a href="/pest-control-software">Pest Control</a>
              <a href="/spray-business-software">Spray Business</a>
            </div>
            <div className="site-footer-col">
              <h4>Resources</h4>
              <a href="/blogs">Blog</a>
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
