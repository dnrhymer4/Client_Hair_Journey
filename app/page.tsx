import Link from "next/link";
import { Sparkles, UsersRound, LineChart, CalendarDays } from "lucide-react";

function Card({
  title,
  description,
  href,
  icon: Icon,
}: {
  title: string;
  description: string;
  href: string;
  icon: any;
}) {
  return (
    <Link href={href} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md">
      <div className="mb-5 inline-flex rounded-2xl bg-slate-100 p-3">
        <Icon className="h-6 w-6 text-slate-800" />
      </div>
      <h2 className="text-xl font-bold text-slate-950">{title}</h2>
      <p className="mt-2 text-sm leading-6 text-slate-500">{description}</p>
    </Link>
  );
}

export default function HomePage() {
  return (
    <main className="min-h-screen bg-slate-50 p-6 md:p-10">
      <section className="mx-auto max-w-6xl">
        <div className="mb-10">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-slate-950 px-4 py-2 text-sm font-semibold text-white">
            <Sparkles className="h-4 w-4" />
            Mentor HQ
          </div>
          <h1 className="max-w-3xl text-4xl font-bold tracking-tight text-slate-950 md:text-6xl">
            Coaching, business intelligence, and client hair journeys in one platform.
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">
            Use this starter app as the foundation for your mentor portal, mentee business dashboard, and client-facing loc journey tracker.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          <Card
            title="Mentor HQ"
            description="Manage mentees, coaching sessions, business goals, notes, and market opportunities."
            href="/mentor"
            icon={UsersRound}
          />
          <Card
            title="Business Dashboard"
            description="Give each mentee a clean operating dashboard for revenue, bookings, content, and client follow-ups."
            href="/mentee"
            icon={LineChart}
          />
          <Card
            title="Client Journey"
            description="Track loc start dates, appointments, wash days, products, photos, and hair health notes."
            href="/client"
            icon={CalendarDays}
          />
        </div>
      </section>
    </main>
  );
}
