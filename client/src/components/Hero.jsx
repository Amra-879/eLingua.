const Hero = () => {
  return (
    <section
      className="relative min-h-[80vh] flex items-center justify-center px-6 bg-cover bg-center"
      style={{
        backgroundImage:
          "url('/blue-curve-abstract-background-with-design-space.jpg')",
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-slate-900/60" />

      {/* Content */}
      <div className="relative z-10 max-w-4xl text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold text-white leading-tight">
          Dobrodošli.
          <br />
          Odaberite jezik i pokažite svoje znanje.
        </h1>

        <p className="mt-6 text-lg md:text-xl text-slate-200">
          <span className="text-indigo-300 font-medium">
            Dobij ispravke svog eseja ili audio eseja od certificiranih profesora jezika.
          </span>
          <br />
          Poboljšaj gramatiku, stil i jasnoću — uz stvarni, ljudski feedback.
        </p>
      </div>
    </section>
  );
};

export default Hero;
