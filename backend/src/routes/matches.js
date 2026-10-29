import { Router } from "express";
import Match from "../models/Match.js";
import Stadium from "../models/Stadium.js";
import { requireAdmin, requireAuth } from "../middleware/auth.js";

const router = Router();

function normalizeMatchInput(body) {
  return {
    homeTeam: body.homeTeam,
    awayTeam: body.awayTeam,
    homeLogoUrl: body.homeLogoUrl,
    awayLogoUrl: body.awayLogoUrl,
    competition: body.competition,
    startsAt: body.startsAt,
    stadium: body.stadium,
    status: body.status,
    offers: body.offers,
  };
}

async function validateOffers(stadiumId, offers) {
  if (!Array.isArray(offers)) {
    return { error: "Les offres doivent être une liste.", status: 400 };
  }
  const stadium = await Stadium.findById(stadiumId);
  if (!stadium) {
    return { error: "Stade introuvable.", status: 400 };
  }

  const seenSections = new Set();
  for (const offer of offers) {
    const section = stadium.sections.id(offer.sectionId);
    if (!section || seenSections.has(String(offer.sectionId))) {
      return { error: "Tribune invalide ou répétée.", status: 400 };
    }
    if (
      !Number.isFinite(offer.price) ||
      offer.price < 0 ||
      !Number.isInteger(offer.capacity) ||
      offer.capacity < 0 ||
      !Number.isInteger(offer.reservedCount ?? 0) ||
      (offer.reservedCount ?? 0) < 0 ||
      (offer.reservedCount ?? 0) > offer.capacity ||
      offer.capacity > section.capacity
    ) {
      return { error: "Prix ou capacité d'offre invalide.", status: 400 };
    }
    seenSections.add(String(offer.sectionId));
    offer.category = section.category;
  }
  return { stadium };
}

router.get("/", async (req, res, next) => {
  try {
    const filter = { status: "scheduled", startsAt: { $gte: new Date() } };
    if (typeof req.query.competition === "string" && req.query.competition.trim()) {
      filter.competition = req.query.competition.trim();
    }
    if (typeof req.query.from === "string") {
      const from = new Date(req.query.from);
      if (Number.isNaN(from.valueOf())) {
        return res.status(400).json({ message: "Date de début invalide." });
      }
      filter.startsAt.$gte = from;
    }
    if (typeof req.query.to === "string") {
      const to = new Date(req.query.to);
      if (Number.isNaN(to.valueOf())) {
        return res.status(400).json({ message: "Date de fin invalide." });
      }
      filter.startsAt.$lte = to;
    }
    if (typeof req.query.q === "string" && req.query.q.trim()) {
      const escapedQuery = req.query.q.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const search = new RegExp(escapedQuery, "i");
      filter.$or = [
        { homeTeam: search },
        { awayTeam: search },
        { competition: search },
      ];
    }

    const matches = await Match.find(filter)
      .populate("stadium", "name city")
      .sort({ startsAt: 1 })
      .limit(100);
    return res.json({ matches });
  } catch (error) {
    return next(error);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const match = await Match.findById(req.params.id).populate(
      "stadium",
      "name city address sections"
    );
    if (!match) {
      return res.status(404).json({ message: "Match introuvable." });
    }
    return res.json({ match });
  } catch (error) {
    return next(error);
  }
});

router.post("/", requireAuth, requireAdmin, async (req, res, next) => {
  try {
    const data = normalizeMatchInput(req.body);
    const validation = await validateOffers(data.stadium, data.offers);
    if (validation.error) {
      return res.status(validation.status).json({ message: validation.error });
    }
    const match = await Match.create(data);
    return res.status(201).json({ match });
  } catch (error) {
    return next(error);
  }
});

router.patch("/:id", requireAuth, requireAdmin, async (req, res, next) => {
  try {
    const match = await Match.findById(req.params.id);
    if (!match) {
      return res.status(404).json({ message: "Match introuvable." });
    }

    const data = normalizeMatchInput(req.body);
    for (const key of Object.keys(data)) {
      if (data[key] !== undefined) {
        match[key] = data[key];
      }
    }

    if (data.stadium !== undefined || data.offers !== undefined) {
      const validation = await validateOffers(
        match.stadium,
        data.offers === undefined ? match.offers : data.offers
      );
      if (validation.error) {
        return res.status(validation.status).json({ message: validation.error });
      }
      if (data.offers !== undefined) {
        match.offers = data.offers;
      }
    }

    await match.save();
    return res.json({ match });
  } catch (error) {
    return next(error);
  }
});

router.delete("/:id", requireAuth, requireAdmin, async (req, res, next) => {
  try {
    const match = await Match.findByIdAndUpdate(
      req.params.id,
      { status: "cancelled" },
      { new: true, runValidators: true }
    );
    if (!match) {
      return res.status(404).json({ message: "Match introuvable." });
    }
    return res.json({ match });
  } catch (error) {
    return next(error);
  }
});

export default router;
