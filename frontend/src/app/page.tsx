import { ArrowUpRight, Landmark, PiggyBank, Wallet } from "lucide-react";

const buildSteps = [
  "Project structure and decisions",
  "Wallet connection",
  "Balance display",
  "Savings goals",
  "Deposit and withdrawal flows",
  "Activity history",
];

export default function Home() {
  return (
    <main className="min-h-screen bg-[#f7f4ee] text-[#111827]">
      <section className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-5 py-6 sm:px-8">
        <header className="flex items-center justify-between border-b border-[#d9d2c4] pb-5">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-md bg-[#17594a] text-white">
              <PiggyBank size={21} aria-hidden="true" />
            </div>
            <div>
              <p className="text-lg font-semibold">FiberSave</p>
              <p className="text-sm text-[#6b6254]">CKB testnet MVP</p>
            </div>
          </div>
          <button className="inline-flex h-10 items-center gap-2 rounded-md bg-[#111827] px-4 text-sm font-medium text-white">
            <Wallet size={16} aria-hidden="true" />
            Connect
          </button>
        </header>

        <div className="grid flex-1 content-center gap-8 py-10 lg:grid-cols-[1.1fr_0.9fr] lg:py-14">
          <section>
            <p className="mb-3 text-sm font-medium uppercase tracking-wide text-[#17594a]">
              Phase 1 foundation
            </p>
            <h1 className="max-w-3xl text-4xl font-semibold leading-tight sm:text-5xl">
              Non-custodial savings goals for CKB and future Fiber payments.
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-[#4b5563] sm:text-lg">
              This scaffold establishes the product shell, project structure,
              shared types, and CKB testnet configuration for the FiberSave MVP.
            </p>

            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              <div className="rounded-lg border border-[#d9d2c4] bg-white p-4">
                <Wallet className="mb-3 text-[#17594a]" size={22} />
                <p className="font-medium">Wallet first</p>
                <p className="mt-1 text-sm text-[#6b7280]">
                  Existing wallet connection before embedded custody.
                </p>
              </div>
              <div className="rounded-lg border border-[#d9d2c4] bg-white p-4">
                <PiggyBank className="mb-3 text-[#17594a]" size={22} />
                <p className="font-medium">Goal metadata</p>
                <p className="mt-1 text-sm text-[#6b7280]">
                  Savings goals track progress without locking funds.
                </p>
              </div>
              <div className="rounded-lg border border-[#d9d2c4] bg-white p-4">
                <Landmark className="mb-3 text-[#17594a]" size={22} />
                <p className="font-medium">CKB testnet</p>
                <p className="mt-1 text-sm text-[#6b7280]">
                  Balance and transaction work starts on testnet.
                </p>
              </div>
            </div>
          </section>

          <aside className="rounded-lg border border-[#d9d2c4] bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">MVP Build Path</h2>
              <ArrowUpRight size={18} className="text-[#17594a]" />
            </div>
            <ol className="mt-5 space-y-4 text-sm">
              {buildSteps.map((item, index) => (
                <li key={item} className="flex gap-3">
                  <span className="flex size-7 shrink-0 items-center justify-center rounded-md bg-[#edf7f3] text-xs font-semibold text-[#17594a]">
                    {index + 1}
                  </span>
                  <span className="pt-1 text-[#374151]">{item}</span>
                </li>
              ))}
            </ol>
          </aside>
        </div>
      </section>
    </main>
  );
}
