import Logo from "./Logo";
import Navigation from "./NavBar";
function Header() {
  return (
    <header>
      <div className="flex justify-between items-center max-w-7xl mx-auto h-16">
        <Logo />
        <Navigation />
      </div>
    </header>
  );
}

export default Header;
