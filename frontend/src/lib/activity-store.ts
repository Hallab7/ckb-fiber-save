import type { ActivityEvent } from "@/types/fibersave";

const STORAGE_KEY = "fibersave.activity.v1";

function ensureBrowserStorage() {
  if (typeof window === "undefined") {
    throw new Error("Activity storage is only available in the browser.");
  }
}

function readActivity(): ActivityEvent[] {
  ensureBrowserStorage();

  const raw = window.localStorage.getItem(STORAGE_KEY);

  if (!raw) {
    return [];
  }

  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeActivity(events: ActivityEvent[]) {
  ensureBrowserStorage();
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
}

function createId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return `activity_${Date.now()}_${Math.random().toString(16).slice(2)}`;
}

export async function listActivity(ownerAddress: string): Promise<ActivityEvent[]> {
  return readActivity()
    .filter((event) => event.ownerAddress === ownerAddress)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function addActivity(
  event: Omit<ActivityEvent, "id" | "createdAt">,
): Promise<ActivityEvent> {
  const created: ActivityEvent = {
    ...event,
    id: createId(),
    createdAt: new Date().toISOString(),
  };

  writeActivity([...readActivity(), created]);

  return created;
}

export async function updateActivityStatus(
  eventId: string,
  status: ActivityEvent["status"],
  txHash?: string,
): Promise<ActivityEvent> {
  const events = readActivity();
  const index = events.findIndex((event) => event.id === eventId);

  if (index === -1) {
    throw new Error("Activity event not found.");
  }

  const updated: ActivityEvent = {
    ...events[index],
    status,
    txHash: txHash ?? events[index].txHash,
  };

  events[index] = updated;
  writeActivity(events);

  return updated;
}

export async function clearActivity(ownerAddress?: string): Promise<void> {
  if (!ownerAddress) {
    writeActivity([]);
    return;
  }

  writeActivity(readActivity().filter((event) => event.ownerAddress !== ownerAddress));
}
