const monitor = require("./slaMonitorService");
let timer = null;
let running = false;
const intervalMs = () => Math.max(Number(process.env.SLA_MONITOR_INTERVAL_MS) || 60000, 10000);
const runOnce = async () => { if (running) return; running = true; try { await monitor.scan(); } catch (error) { console.error("SLA monitor failed:", error.message); } finally { running = false; } };
const start = () => { if (timer) return timer; timer = setInterval(runOnce, intervalMs()); timer.unref?.(); void runOnce(); return timer; };
const stop = () => { if (timer) clearInterval(timer); timer = null; running = false; };
module.exports = { start, stop, runOnce, intervalMs };
