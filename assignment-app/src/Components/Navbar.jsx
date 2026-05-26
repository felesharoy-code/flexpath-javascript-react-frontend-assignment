function Navbar() {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark sticky-top">
      <div className="container-fluid">
        <a className="navbar-brand" href="/">
          User Behavior Data
        </a>
        <div className="navbar-nav">
          <a className="nav-link" href="/search">
            Search Through Dataset
          </a>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
