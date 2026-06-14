import cron, { ScheduledTask } from "node-cron";
import { CronExpressionParser } from "cron-parser";
import DynamicCron from "./dynamic-cron.model";
import { runSyncNow } from "../luxury-distribution/ld-sync.cron";

const tasks = new Map<string, ScheduledTask>();

function computeNextRunAt(expression: string): Date | null {
  try {
    return CronExpressionParser.parse(expression).next().toDate();
  } catch {
    return null;
  }
}

async function runAction(cronDoc: any): Promise<Record<string, any>> {
  if (cronDoc.action === "ld-sync") {
    await runSyncNow();
    return { done: true };
  }
  if (cronDoc.action === "webhook") {
    const method = (cronDoc.webhook_method || "POST").toUpperCase();
    const res = await fetch(cronDoc.webhook_url, { method });
    return { status: res.status, ok: res.ok };
  }
  throw new Error(`Unknown action: ${cronDoc.action}`);
}

async function executeCron(cronId: string): Promise<void> {
  const cronDoc = await DynamicCron.findById(cronId);
  if (!cronDoc || !cronDoc.enabled || cronDoc.status === "running") return;

  await DynamicCron.findByIdAndUpdate(cronId, { status: "running" });
  const startedAt = new Date();
  let lastResult: Record<string, any> = {};

  try {
    lastResult = await runAction(cronDoc);
  } catch (err) {
    lastResult = { error: String(err) };
    console.error(`[DynamicCron] Error running cron ${cronId}:`, err);
  }

  const nextRunAt = computeNextRunAt(cronDoc.cron_expression);
  await DynamicCron.findByIdAndUpdate(cronId, {
    status: "idle",
    last_run_at: startedAt,
    next_run_at: nextRunAt,
    last_result: lastResult,
  });
}

function clearCronTask(cronId: string): void {
  const task = tasks.get(cronId);
  if (task) {
    task.stop();
    tasks.delete(cronId);
  }
}

function startCronTask(cronId: string, expression: string): void {
  clearCronTask(cronId);
  const task = cron.schedule(expression, () => {
    executeCron(cronId).catch((err) =>
      console.error(`[DynamicCron] Execution error for ${cronId}:`, err)
    );
  });
  tasks.set(cronId, task);
}

export async function startDynamicCrons(): Promise<void> {
  try {
    const cronDocs = await DynamicCron.find({ enabled: true });
    let started = 0;
    for (const cronDoc of cronDocs) {
      const id = cronDoc._id.toString();
      if (!cronDoc.cron_expression || !cron.validate(cronDoc.cron_expression)) {
        console.warn(`[DynamicCron] Skipping ${id} — missing or invalid cron_expression`);
        continue;
      }
      const nextRunAt = computeNextRunAt(cronDoc.cron_expression);
      await DynamicCron.findByIdAndUpdate(id, { next_run_at: nextRunAt, status: "idle" });
      startCronTask(id, cronDoc.cron_expression);
      started++;
    }
    console.log(`[DynamicCron] Started ${started} dynamic crons`);
  } catch (err) {
    console.error("[DynamicCron] Failed to start dynamic crons:", err);
  }
}

export const dynamicCronService = {
  async list() {
    return DynamicCron.find().sort({ created_at: -1 }).lean();
  },

  async getById(id: string) {
    return DynamicCron.findById(id).lean();
  },

  async create(data: {
    name: string;
    cron_expression: string;
    action: "ld-sync" | "webhook";
    webhook_url?: string;
    webhook_method?: "GET" | "POST";
    enabled?: boolean;
  }) {
    if (!cron.validate(data.cron_expression)) {
      throw new Error("Invalid cron expression");
    }
    const enabled = data.enabled !== false;
    const nextRunAt = enabled ? computeNextRunAt(data.cron_expression) : null;
    const cronDoc = new DynamicCron({ ...data, enabled, next_run_at: nextRunAt });
    await cronDoc.save();
    if (enabled) startCronTask(cronDoc._id.toString(), data.cron_expression);
    return cronDoc;
  },

  async update(
    id: string,
    data: {
      name?: string;
      cron_expression?: string;
      action?: "ld-sync" | "webhook";
      webhook_url?: string;
      webhook_method?: "GET" | "POST";
      enabled?: boolean;
    }
  ) {
    if (data.cron_expression && !cron.validate(data.cron_expression)) {
      throw new Error("Invalid cron expression");
    }
    clearCronTask(id);
    const updated = await DynamicCron.findByIdAndUpdate(id, data, { new: true });
    if (!updated) throw new Error("Cron not found");

    if (updated.enabled) {
      const nextRunAt = computeNextRunAt(updated.cron_expression);
      await DynamicCron.findByIdAndUpdate(id, { next_run_at: nextRunAt });
      startCronTask(id, updated.cron_expression);
    } else {
      await DynamicCron.findByIdAndUpdate(id, { next_run_at: null });
    }
    return DynamicCron.findById(id);
  },

  async toggle(id: string) {
    const cronDoc = await DynamicCron.findById(id);
    if (!cronDoc) throw new Error("Cron not found");
    return this.update(id, { enabled: !cronDoc.enabled });
  },

  async remove(id: string) {
    clearCronTask(id);
    return DynamicCron.findByIdAndDelete(id);
  },

  async runNow(id: string) {
    executeCron(id).catch((err) =>
      console.error(`[DynamicCron] runNow error for ${id}:`, err)
    );
    return DynamicCron.findById(id).lean();
  },
};
