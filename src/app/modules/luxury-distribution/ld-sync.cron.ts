import luxuryDistributionService from "./luxury-distribution.service";

const SYNC_HOUR = 2;
const ONE_DAY_MS = 24 * 60 * 60 * 1000;

export interface CronState {
  id: string;
  name: string;
  schedule: string;
  status: "idle" | "running";
  lastRunAt: string | null;
  nextRunAt: string | null;
  lastResult: { success: number; failed: number; total: number } | null;
}

const state: CronState = {
  id: "ld-sync",
  name: "LD Product Sync",
  schedule: "Every day at 02:00",
  status: "idle",
  lastRunAt: null,
  nextRunAt: null,
  lastResult: null,
};

export function getSyncCronState(): CronState {
  return { ...state };
}

function msUntilNextRun(hour: number): number {
  const now = new Date();
  const next = new Date(now);
  next.setHours(hour, 0, 0, 0);
  if (next <= now) next.setDate(next.getDate() + 1);
  return next.getTime() - now.getTime();
}

async function runSync(): Promise<void> {
  if (state.status === "running") {
    console.log("[LdSyncCron] Already running, skipping");
    return;
  }

  state.status = "running";
  state.lastRunAt = new Date().toISOString();
  console.log("[LdSyncCron] Starting sync of all imported LD products...");

  try {
    const result = await luxuryDistributionService.syncAll();
    state.lastResult = { success: result.success, failed: result.failed, total: result.total };
    console.log(`[LdSyncCron] Done — ${result.success}/${result.total} synced, ${result.failed} failed`);
    if (result.errors.length > 0) {
      for (const e of result.errors) {
        console.error(`[LdSyncCron] Failed stockId=${e.stockId}: ${e.error}`);
      }
    }
  } catch (err) {
    console.error("[LdSyncCron] Unexpected error:", err);
    state.lastResult = { success: 0, failed: 0, total: 0 };
  } finally {
    state.status = "idle";
  }
}

export async function runSyncNow(): Promise<void> {
  return runSync();
}

export function startLdSyncCron(): void {
  const delay = msUntilNextRun(SYNC_HOUR);
  const nextRun = new Date(Date.now() + delay);
  state.nextRunAt = nextRun.toISOString();
  console.log(`[LdSyncCron] Scheduled — first run at ${nextRun.toISOString()}`);

  setTimeout(function schedule() {
    const next = new Date(Date.now() + ONE_DAY_MS);
    state.nextRunAt = next.toISOString();
    runSync();
    setTimeout(schedule, ONE_DAY_MS);
  }, delay);
}
