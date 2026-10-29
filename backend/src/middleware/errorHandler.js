export function errorHandler(error, req, res, next) {
  if (res.headersSent) {
    return next(error);
  }

  console.error(error);
  if (error.name === "ValidationError" || error.name === "CastError") {
    return res.status(400).json({ message: "Données invalides." });
  }
  if (error.code === 11000) {
    return res.status(409).json({ message: "Cette donnée existe déjà." });
  }
  return res.status(500).json({ message: "Erreur interne du serveur." });
}
