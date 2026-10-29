export default function MatchCard({ match, onBook }) {
  const date = new Date(match.startsAt);
  const dateLabel = new Intl.DateTimeFormat("fr-FR", {
    weekday: "short",
    day: "numeric",
    month: "short",
  }).format(date);
  const timeLabel = new Intl.DateTimeFormat("fr-FR", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
  const lowestPrice = Math.min(...match.offers.map((offer) => offer.price));

  return (
    <article className="match-card">
      <div className="match-meta">
        <span className="competition">{match.competition}</span>
        <span>{dateLabel} · {timeLabel}</span>
      </div>
      <div className="match-teams">
        <Team name={match.homeTeam} logo={match.homeLogoUrl} />
        <span className="versus">VS</span>
        <Team name={match.awayTeam} logo={match.awayLogoUrl} />
      </div>
      <div className="match-footer">
        <span className="stadium">{match.stadium?.name} · {match.stadium?.city}</span>
        <button className="button button-primary" onClick={() => onBook(match)}>
          Dès {Number.isFinite(lowestPrice) ? `${lowestPrice} €` : "—"} <span aria-hidden="true">→</span>
        </button>
      </div>
    </article>
  );
}

function Team({ name, logo }) {
  return (
    <div className="team">
      {logo ? <img src={logo} alt="" /> : <span className="team-placeholder">{name?.slice(0, 1)}</span>}
      <span>{name}</span>
    </div>
  );
}
