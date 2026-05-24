export default function MenteePage() {
  return (
    <main className="min-h-screen bg-slate-50 p-6 md:p-10">
      <section className="mx-auto max-w-6xl">
        <p className="mb-3 inline-flex rounded-full bg-slate-950 px-3 py-1 text-sm font-semibold text-white">Mentee View</p>
        <h1 className="text-4xl font-bold tracking-tight text-slate-950">Business Dashboard</h1>
        <p className="mt-2 max-w-2xl text-slate-600">
          A clean dashboard for revenue, bookings, clients, content planning, pricing, and follow-ups.
        </p>

        <div className="mt-8 grid gap-5 md:grid-cols-4">
          {[
            ["Monthly revenue", "$4,100"],
            ["Bookings", "32"],
            ["Active clients", "47"],
            ["Content due", "3"],
          ].map(([label, value]) => (
            <div key={label} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-sm text-slate-500">{label}</p>
              <p className="mt-2 text-3xl font-bold">{value}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
