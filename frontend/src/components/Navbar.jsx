import { Link, NavLink } from "react-router-dom";

export default function Navbar({ user, onLogout }) {
  return (
    <header className="navbar">
      <Link className="brand" to="/" aria-label="FootTicket, accueil">
        <span className="brand-mark">F</span>
        <span>Foot<span className="brand-accent">Ticket</span></span>
      </Link>
      <nav aria-label="Navigation principale">
        <NavLink to="/" end>Matchs</NavLink>
        {user && <NavLink to="/reservations">Mes billets</NavLink>}
        {user?.role === "admin" && <NavLink to="/admin">Administration</NavLink>}
      </nav>
      <div className="navbar-account">
        {user ? (
          <>
            <span className="user-name">{user.name}</span>
            <button className="button button-outline" onClick={onLogout}>Déconnexion</button>
          </>
        ) : (
          <Link className="button button-primary" to="/connexion">Connexion</Link>
        )}
      </div>
    </header>
  );
}
