import { Link } from "react-router-dom";

const Header = () => {
  return (
    <header className="bg-hero-gradient p-6 text-center shadow-soft">
      <Link to="/" className="block">
        <h1 className="text-4xl md:text-5xl font-headline font-bold text-primary-foreground text-shadow-soft">
          Imagine Studios
        </h1>
        <p className="text-lg md:text-xl font-playful text-primary-foreground/90 mt-2">
          imAgIne studios
        </p>
      </Link>
    </header>
  );
};

export default Header;