import { Link } from "react-router-dom";

const steps = [
  {
    number: "01",
    title: "Odaberi jezik",
    description:
      "Engleski, njemački, španjolski, japanski... šta god želiš vježbati. Svaki jezik ima ogroman broj tema, od laganih za početnike do onih ozbiljnijih za napredne studente.",
    icon: "/icons/globe-icon.svg",
    color: "bg-white border-indigo-200",
    numberColor: "text-indigo-600",
  },
  {
    number: "02",
    title: "Odaberi prompt",
    description:
      "Naši administratori smišljaju promptove koji imaju smisla, sa jasnim uputama. Složeni po nivoima, od A1 do C2.",
    icon: "/icons/choose-icon.svg", 
    color: "bg-white border-purple-200",
    numberColor: "text-purple-600",
  },
  {
    number: "03",
    title: "Napiši ili snimi",
    description:
      "Pišeš brže nego što pričaš? Koristi editor. Hoćeš da vježbaš izgovor? Udari snimaj. Brojač riječi radi sam, cijena se skida na osnovu toga koliko si napisao/la.",
    icon: "/icons/type-icon.svg", 
    color: "bg-white border-blue-200",
    numberColor: "text-blue-600",
  },
  {
    number: "04",
    title: "Plati i pošalji",
    description:
      "PayPal, brzo i sigurno. Esej od 350 riječi 4.00€, audio od 60 sekundi 3.50€. Nema mjesečne pretplate, nema iznenađenja koje niste planirali.",
    icon: "/icons/send-icon.svg", 
    color: "bg-white border-green-200",
    numberColor: "text-green-600",
  },
  {
    number: "05",
    title: "Dobij feedback",
    description:
      "Tvoj esej ocjenjuje čovjek, ne algoritam. Profesor pročita (ili presluša), napiše šta valja, šta ne valja i zašto. Greške objašnjene, a prijedlozi konkretni.",
    icon: "/icons/feedback-icon.svg", 
    color: "bg-white border-rose-200",
    numberColor: "text-rose-600",
  },
];

const pricing = [
  {
    type: "Pisani esej",
    icon: "/icons/type-icon.svg",
    base: "4.00$",
    baseDesc: "prvih 350 riječi",
    extra: "+ 0.50$",
    extraDesc: "svakih dodatnih 50",
    color: "border-indigo-200 bg-white",
    badge: "bg-indigo-100 text-indigo-700",
  },
  {
    type: "Audio esej",
    icon: "/icons/microphone-icon.svg",
    base: "3.50$",
    baseDesc: "prvih 60 sekundi",
    extra: "+ 0.50$",
    extraDesc: "svakih dodatnih 30",
    color: "border-purple-200 bg-white",
    badge: "bg-purple-100 text-purple-700",
  },
];


export default function About() {
  return (
    <div className="bg-white">

      {/* HERO */}
     <section className="relative bg-slate-800 text-white py-24 px-6 overflow-hidden">
  <div className="absolute inset-0 opacity-10">
    <div className="absolute top-10 left-10 w-72 h-72 bg-indigo-500 rounded-full blur-3xl" />
    <div className="absolute bottom-10 right-10 w-96 h-96 bg-purple-500 rounded-full blur-3xl" />
  </div>
  <div className="relative max-w-4xl mx-auto text-center">
    <span className="inline-block bg-indigo-600 text-white text-sm font-semibold px-4 py-1 rounded-full mb-6">
      Aktivno učenje jezika
    </span>
    <h1 className="text-4xl md:text-5xl font-extrabold leading-tight mb-6">
      Jezik se ne uči gledanjem -{' '}
      <span className="text-indigo-400">uči se govorom i pisanjem</span>
    </h1>
    <p className="text-lg text-slate-300 max-w-2xl mx-auto mb-10">
      Zato smo napravili eLingua. Mjesto gdje vježbaš ono što je najteže - 
      samostalno pisanje i govor. Svaki tvoj tekst i snimak dobija konkretan 
      feedback koji ti pokazuje gdje si dobro, a šta još treba vježbati.
    </p>
    <Link
      to="/prompts"
      className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-8 py-3 rounded-xl transition"
    >
      Počni pisati →
    </Link>
  </div>
</section>

      {/* KORACI */}
      <section className="max-w-5xl mx-auto px-6 py-20">
  <div className="text-center mb-14">
    <h2 className="text-3xl font-bold text-[#00296b] mb-3">
      Pet koraka
    </h2>
    <p className="text-gray-500 text-lg">
    </p>
  </div>

  <div className="flex flex-col gap-4">
    {steps.map((step, index) => (
      <div
        key={step.number}
        className={`flex gap-6 items-start p-6 rounded-2xl border ${step.color} shadow-sm hover:shadow-md transition`}
      >
        <div className="flex-shrink-0">
          <img 
            src={step.icon} 
            alt={step.title}
            className="w-10 h-10"
          />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <span className={`text-3xl font-black ${step.numberColor}`}>
              {step.number}
            </span>
            <h3 className="text-xl font-bold text-gray-800">
              {step.title}
            </h3>
          </div>
          <p className="text-gray-600 leading-relaxed">
            {step.description}
          </p>
        </div>
      </div>
    ))}
  </div>
</section>
      {/* CIJENE */}
      <section className="bg-slate-50 py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-[#00296b] mb-3">
              Cijene
            </h2>
            <p className="text-gray-500 text-lg">
              Plaćaš tačno onoliko koliko napišeš/izgovoriš. Nema pretplate.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {pricing.map((item) => (
              <div
                key={item.type}
                className={`rounded-2xl border-2 p-8 ${item.color} shadow-sm`}
              >
                <div className="flex items-center gap-3 mb-6">
                  <img 
                    src={item.icon} 
                    alt={item.type}
                    className="w-8 h-8"
                   />
                  <span
                    className={`text-sm font-semibold px-3 py-1 rounded-full ${item.badge}`}
                  >
                    {item.type}
                  </span>
                </div>

                <div className="mb-4">
                  <span className="text-5xl font-black text-gray-800">
                    {item.base}
                  </span>
                  <span className="text-gray-500 ml-2 text-sm">{item.baseDesc}</span>
                </div>

                <div className="flex items-center gap-2 text-gray-600">
                  <span className="text-xl font-bold text-gray-700">
                    {item.extra}
                  </span>
                  <span className="text-sm">{item.extraDesc}</span>
                </div>
              </div>
            ))}
          </div>

          <p className="text-center text-gray-400 text-sm mt-8">
            Sve ide preko PayPala. Tvoji podaci ostaju tvoji.
          </p>
        </div>
      </section>

     

      {/* CTA */}
      <section className="bg-slate-800 text-white py-20 px-6 text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold mb-4">
            Ok, hoću probati.
          </h2>
          <div className="flex gap-4 justify-center">
            <Link
              to="/register"
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-8 py-3 rounded-xl transition"
            >
              Registracija
            </Link>
            <Link
              to="/prompts"
              className="border border-slate-500 hover:border-slate-300 text-white font-semibold px-8 py-3 rounded-xl transition"
            >
              Vidi dostupne jezike
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}