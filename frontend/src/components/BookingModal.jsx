import { useState } from "react";

export default function BookingModal({ match, onClose, onConfirm, submitting = false }) {
  const [offerId, setOfferId] = useState(match.offers[0]?.sectionId || "");
  const [quantity, setQuantity] = useState(1);
  const offer = match.offers.find((item) => item.sectionId === offerId);
  const available = offer ? offer.capacity - offer.reservedCount : 0;
  const total = offer ? offer.price * quantity : 0;

  function submit(event) {
    event.preventDefault();
    if (!offer || quantity < 1 || quantity > available || submitting) {
      return;
    }
    onConfirm({ matchId: match._id, sectionId: offer.sectionId, quantity });
  }

  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={(event) => {
      if (event.target === event.currentTarget) onClose();
    }}>
      <section className="booking-modal" role="dialog" aria-modal="true" aria-labelledby="booking-title">
        <button className="modal-close" type="button" onClick={onClose} aria-label="Fermer">×</button>
        <p className="eyebrow">{match.competition}</p>
        <h2 id="booking-title">{match.homeTeam} <span>contre</span> {match.awayTeam}</h2>
        <p className="modal-stadium">{match.stadium?.name} · {match.stadium?.city}</p>
        <form onSubmit={submit}>
          <label htmlFor="ticket-category">Catégorie</label>
          <select
            id="ticket-category"
            value={offerId}
            onChange={(event) => {
              setOfferId(event.target.value);
              setQuantity(1);
            }}
            required
          >
            {match.offers.map((item) => (
              <option key={item.sectionId} value={item.sectionId}>
                {item.category} — {item.price} € ({item.capacity - item.reservedCount} disponibles)
              </option>
            ))}
          </select>
          <label htmlFor="ticket-quantity">Nombre de billets</label>
          <input
            id="ticket-quantity"
            type="number"
            min="1"
            max={available}
            value={quantity}
            onChange={(event) => setQuantity(Number(event.target.value))}
            required
          />
          <div className="booking-total">
            <span>Total à payer</span>
            <strong>{total.toFixed(2)} €</strong>
          </div>
          <button className="button button-primary button-wide" type="submit" disabled={!offer || available < 1 || submitting}>
            {submitting ? "Traitement..." : "Continuer vers le paiement"}
          </button>
        </form>
      </section>
    </div>
  );
}
