import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function createToken(user) {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET is required");
  }
  return jwt.sign({ sub: user.id, role: user.role }, secret, {
    expiresIn: process.env.JWT_EXPIRES_IN || "1h",
  });
}

router.post("/register", async (req, res, next) => {
  try {
    const name = typeof req.body.name === "string" ? req.body.name.trim() : "";
    const email =
      typeof req.body.email === "string" ? req.body.email.trim().toLowerCase() : "";
    const password = typeof req.body.password === "string" ? req.body.password : "";

    if (!name || name.length > 100 || !emailPattern.test(email)) {
      return res.status(400).json({ message: "Nom ou adresse e-mail invalide." });
    }
    if (password.length < 8 || password.length > 72) {
      return res.status(400).json({
        message: "Le mot de passe doit contenir entre 8 et 72 caractères.",
      });
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const user = await User.create({ name, email, passwordHash, role: "client" });

    return res.status(201).json({
      token: createToken(user),
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
    });
  } catch (error) {
    return next(error);
  }
});

router.post("/login", async (req, res, next) => {
  try {
    const email =
      typeof req.body.email === "string" ? req.body.email.trim().toLowerCase() : "";
    const password = typeof req.body.password === "string" ? req.body.password : "";

    if (!email || !password) {
      return res.status(400).json({ message: "E-mail et mot de passe requis." });
    }

    const user = await User.findOne({ email }).select("+passwordHash");
    const passwordMatches =
      user && (await bcrypt.compare(password, user.passwordHash));
    if (!passwordMatches) {
      return res.status(401).json({ message: "Identifiants incorrects." });
    }

    return res.json({
      token: createToken(user),
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
    });
  } catch (error) {
    return next(error);
  }
});

router.get("/me", requireAuth, async (req, res, next) => {
  try {
    const user = await User.findById(req.user.sub).select("name email role");
    if (!user) {
      return res.status(404).json({ message: "Utilisateur introuvable." });
    }
    return res.json({ user });
  } catch (error) {
    return next(error);
  }
});

export default router;
