const { registerSchema, loginSchema } = require("../validators/authValidator");
const authService = require("../services/authService");
const User = require("../models/User");

const cookieOptions = () => ({ httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: process.env.NODE_ENV === "production" ? "none" : "lax", maxAge: 24 * 60 * 60 * 1000 });
const issue = (res, user) => res.cookie("accessToken", authService.signToken(user), cookieOptions());
const register = async (req, res, next) => { try { const data = registerSchema.parse(req.body); if (await authService.findByEmail(data.email)) return res.status(409).json({ success: false, message: "Email is already registered" }); const user = await authService.registerEmployee(data); return res.status(201).json({ success: true, data: { user: authService.publicUser(user) } }); } catch (e) { next(e); } };
const login = async (req, res, next) => { try { const data = loginSchema.parse(req.body); const user = await authService.authenticate(data.email, data.password); issue(res, user); return res.json({ success: true, data: { user: authService.publicUser(user) } }); } catch (e) { next(e); } };
const logout = (req, res) => res.clearCookie("accessToken", { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: process.env.NODE_ENV === "production" ? "none" : "lax" }).json({ success: true, message: "Logged out" });
const me = (req, res) => res.json({ success: true, data: { user: authService.publicUser(req.user) } });
module.exports = { register, login, logout, me };
