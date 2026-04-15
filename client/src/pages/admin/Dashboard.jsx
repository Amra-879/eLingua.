// src/pages/admin/Dashboard.jsx
import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "../../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import api from "../../lib/api";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, BarChart, Bar, Cell,
} from "recharts";

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("bs-BA", { day: "2-digit", month: "2-digit" });
};

const STATUS_CONFIG = {
  pending: { label: "Na čekanju", className: "bg-yellow-100 text-yellow-700" },
  reviewed: { label: "Ocijenjeno", className: "bg-green-100 text-green-700" },
};

const COLORS = ["#4f46e5", "#7c3aed", "#2563eb", "#0891b2", "#059669"];

export default function AdminDashboard() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  const { data: submissionsPerDay } = useQuery({
    queryKey: ["analytics-submissions-per-day"],
    queryFn: () => api.get("/admin/analytics/submissions-per-day").then((r) => r.data),
    enabled: !!user && user.role === "admin",
  });

  const { data: recentSubmissions } = useQuery({
    queryKey: ["analytics-recent-submissions"],
    queryFn: () => api.get("/admin/analytics/recent-submissions").then((r) => r.data),
    enabled: !!user && user.role === "admin",
  });

  const { data: pendingByLanguage } = useQuery({
    queryKey: ["analytics-pending-by-language"],
    queryFn: () => api.get("/admin/analytics/pending-by-language").then((r) => r.data),
    enabled: !!user && user.role === "admin",
  });

  const { data: revenueByLanguage } = useQuery({
    queryKey: ["analytics-revenue-by-language"],
    queryFn: () => api.get("/admin/analytics/revenue-by-language").then((r) => r.data),
    enabled: !!user && user.role === "admin",
  });

  const { data: topProfessors } = useQuery({
    queryKey: ["analytics-top-professors"],
    queryFn: () => api.get("/admin/analytics/top-professors").then((r) => r.data),
    enabled: !!user && user.role === "admin",
  });

  const { data: topStudents } = useQuery({
    queryKey: ["analytics-top-students"],
    queryFn: () => api.get("/admin/analytics/top-students").then((r) => r.data),
    enabled: !!user && user.role === "admin",
  });

  const { data: generalStats } = useQuery({
    queryKey: ["analytics-general-stats"],
    queryFn: () => api.get("/admin/analytics/general-stats").then((r) => r.data),
    enabled: !!user && user.role === "admin",
  });

  useEffect(() => {
    if (!loading && (!user || user.role !== "admin")) navigate("/");
  }, [user, loading, navigate]);

  if (loading) return <p className="p-8">Učitavanje...</p>;
  if (!user || user.role !== "admin") return null;

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <h1 className="text-3xl font-bold text-[#00296b] mb-8">
        Admin Dashboard
      </h1>

      {/* RED 1 — grafikon + quick actions */}
      <div className="grid grid-cols-3 gap-6 mb-8">

        {/* GRAFIKON — 2/3 širine */}
        <div className="col-span-2 bg-white rounded-2xl shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">
            Submissions — zadnjih 14 dana
          </h2>
          {submissionsPerDay?.length === 0 ? (
            <p className="text-gray-400 text-sm text-center py-10">
              Nema podataka
            </p>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={submissionsPerDay}>
                <defs>
                  <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#4f46e5" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis
                  dataKey="date"
                  tickFormatter={formatDate}
                  tick={{ fontSize: 11 }}
                />
                <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                <Tooltip
                  labelFormatter={formatDate}
                  formatter={(value) => [value, "Submissions"]}
                />
                <Area
                  type="monotone"
                  dataKey="count"
                  stroke="#4f46e5"
                  strokeWidth={2}
                  fill="url(#colorCount)"
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* QUICK ACTIONS — 1/3 širine */}
        <div className="bg-white rounded-2xl shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">
            Brze akcije
          </h2>
          <div className="flex flex-col gap-3">
            <Link
              to="/admin/professors"
              className="flex items-center gap-3 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 px-4 py-3 rounded-xl transition font-medium text-sm"
            >
              <span className="text-xl">👨‍🏫</span>
              Dodaj profesora
            </Link>
            <Link
              to="/admin/prompts"
              className="flex items-center gap-3 bg-purple-50 hover:bg-purple-100 text-purple-700 px-4 py-3 rounded-xl transition font-medium text-sm"
            >
              <span className="text-xl">📝</span>
              Dodaj prompt
            </Link>
            <Link
              to="/admin/professors"
              className="flex items-center gap-3 bg-blue-50 hover:bg-blue-100 text-blue-700 px-4 py-3 rounded-xl transition font-medium text-sm"
            >
              <span className="text-xl">👥</span>
              Upravljaj profesorima
            </Link>
            <Link
              to="/admin/prompts"
              className="flex items-center gap-3 bg-green-50 hover:bg-green-100 text-green-700 px-4 py-3 rounded-xl transition font-medium text-sm"
            >
              <span className="text-xl">📚</span>
              Upravljaj promptovima
            </Link>
          </div>
        </div>
      </div>

      {/* RED 2 — nedavne submissions */}
      <div className="bg-white rounded-2xl shadow-md p-6 mb-8">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">
          Nedavne submissions
        </h2>
        {recentSubmissions?.length === 0 ? (
          <p className="text-gray-400 text-sm">Nema submissions.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-500 border-b border-gray-100">
                  <th className="pb-3 font-medium">Prompt</th>
                  <th className="pb-3 font-medium">Student</th>
                  <th className="pb-3 font-medium">Profesor</th>
                  <th className="pb-3 font-medium">Jezik</th>
                  <th className="pb-3 font-medium">Datum</th>
                  <th className="pb-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentSubmissions?.map((s) => {
                  const status = STATUS_CONFIG[s.status] ?? STATUS_CONFIG.pending;
                  return (
                    <tr key={s.id} className="border-b border-gray-50 hover:bg-gray-50">
                      <td className="py-3 font-medium text-gray-800 max-w-[180px] truncate">
                        {s.prompt_title}
                      </td>
                      <td className="py-3 text-gray-600">
                        {s.student_name} {s.student_last_name}
                      </td>
                      <td className="py-3 text-gray-600">
                        {s.professor_name
                          ? `${s.professor_name} ${s.professor_last_name}`
                          : <span className="text-gray-300">—</span>}
                      </td>
                      <td className="py-3 text-gray-600">{s.language_name}</td>
                      <td className="py-3 text-gray-500">
                        {formatDate(s.created_at)}
                      </td>
                      <td className="py-3">
                        <span className={`text-xs px-2 py-1 rounded-full font-medium ${status.className}`}>
                          {status.label}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* RED 3 — pending po jeziku + prihod po jeziku */}
      <div className="grid grid-cols-2 gap-6 mb-8">

        {/* PENDING PO JEZIKU */}
        <div className="bg-white rounded-2xl shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">
            Na čekanju po jeziku
          </h2>
          {pendingByLanguage?.length === 0 ? (
            <p className="text-gray-400 text-sm">Nema pending submissions.</p>
          ) : (
            <div className="flex flex-col gap-3">
              {pendingByLanguage?.map((item, i) => (
                <div key={item.language_name} className="flex items-center gap-3">
                  <span className="text-sm text-gray-600 w-24 flex-shrink-0">
                    {item.language_name}
                  </span>
                  <div className="flex-1 bg-gray-100 rounded-full h-2">
                    <div
                      className="h-2 rounded-full bg-indigo-500"
                      style={{
                        width: `${(item.count / Math.max(...pendingByLanguage.map((x) => x.count))) * 100}%`,
                      }}
                    />
                  </div>
                  <span className="text-sm font-semibold text-gray-700 w-6 text-right">
                    {item.count}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* PRIHOD PO JEZIKU */}
        <div className="bg-white rounded-2xl shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">
            Prihod po jeziku
          </h2>
          {revenueByLanguage?.length === 0 ? (
            <p className="text-gray-400 text-sm">Nema podataka o prihodu.</p>
          ) : (
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={revenueByLanguage}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="language_name" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip formatter={(value) => [`$${value}`, "Prihod"]} />
                <Bar dataKey="total" radius={[4, 4, 0, 0]}>
                  {revenueByLanguage?.map((_, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* RED 4 — top profesori + top studenti */}
      <div className="grid grid-cols-2 gap-6 mb-8">

        {/* TOP PROFESORI */}
        <div className="bg-white rounded-2xl shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">
            Top profesori
          </h2>
          {topProfessors?.length === 0 ? (
            <p className="text-gray-400 text-sm">Nema podataka.</p>
          ) : (
            <div className="flex flex-col gap-3">
              {topProfessors?.map((prof, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white ${
                      i === 0 ? "bg-yellow-400" : i === 1 ? "bg-gray-400" : "bg-orange-400"
                    }`}>
                      {i + 1}
                    </span>
                    <div>
                      <p className="text-sm font-medium text-gray-800">
                        {prof.name} {prof.last_name}
                      </p>
                      <p className="text-xs text-gray-400">{prof.language_name}</p>
                    </div>
                  </div>
                  <span className="text-sm font-semibold text-indigo-600">
                    {prof.feedback_count} ocjena
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* TOP STUDENTI */}
        <div className="bg-white rounded-2xl shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">
            Top studenti
          </h2>
          {topStudents?.length === 0 ? (
            <p className="text-gray-400 text-sm">Nema podataka.</p>
          ) : (
            <div className="flex flex-col gap-3">
              {topStudents?.map((student, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white ${
                      i === 0 ? "bg-yellow-400" : i === 1 ? "bg-gray-400" : "bg-orange-400"
                    }`}>
                      {i + 1}
                    </span>
                    <p className="text-sm font-medium text-gray-800">
                      {student.name} {student.last_name}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-indigo-600">
                      {student.submission_count} eseja
                    </p>
                    <p className="text-xs text-gray-400">
                      ${student.total_spent ?? 0}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* RED 5 — opće statistike */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: "Ukupno studenata", value: generalStats?.students ?? 0, icon: "🎓", color: "bg-indigo-50 text-indigo-700 border-indigo-200" },
          { label: "Ukupno profesora", value: generalStats?.professors ?? 0, icon: "👨‍🏫", color: "bg-purple-50 text-purple-700 border-purple-200" },
          { label: "Ukupno submissions", value: generalStats?.submissions ?? 0, icon: "📝", color: "bg-blue-50 text-blue-700 border-blue-200" },
          { label: "Ukupan prihod", value: `$${generalStats?.revenue ?? 0}`, icon: "💰", color: "bg-green-50 text-green-700 border-green-200" },
        ].map((stat) => (
          <div key={stat.label} className={`border rounded-2xl px-5 py-4 ${stat.color}`}>
            <p className="text-2xl mb-1">{stat.icon}</p>
            <p className="text-2xl font-bold">{stat.value}</p>
            <p className="text-sm mt-1 opacity-80">{stat.label}</p>
          </div>
        ))}
      </div>

    </div>
  );
}