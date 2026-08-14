export function AdminNotConfigured() {
  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-6">
      <div className="max-w-lg w-full bg-white rounded-2xl shadow-xl p-8">
        <h1 className="text-2xl font-bold text-slate-900">Almost there</h1>
        <p className="mt-3 text-slate-600 leading-relaxed">
          The admin password hasn&apos;t been set up yet. Add an environment
          variable named <code className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-800">ADMIN_PASSWORD</code>{" "}
          in Netlify (Site settings → Environment variables), then redeploy.
        </p>
        <p className="mt-3 text-sm text-slate-500">
          Tip: also set <code className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-800">ADMIN_SECRET</code>{" "}
          to a long random string for stronger session security.
        </p>
      </div>
    </div>
  );
}
