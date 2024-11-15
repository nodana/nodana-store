import { useLocation } from "preact-iso";
import "./styles.css";

export function Header() {
  const { url } = useLocation();

  return (
    <header>
      <nav>Navbar</nav>
    </header>
  );
}
