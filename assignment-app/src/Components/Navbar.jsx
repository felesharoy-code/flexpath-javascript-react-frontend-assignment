import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark sticky-top">
      <div className="container-fluid justify-content-start">
        {/* BRAND */}
        <Link to="/" className="navbar-brand me-4">
          User Behavior Data
        </Link>

        {/* NAV LINKS */}
        <div className="navbar-nav">
          <Link to="/search" className="nav-link">
            Search Through Dataset
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
