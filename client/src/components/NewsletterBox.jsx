const NewsletterBox = () => {
  return (
    <section className="bg-gray-100 py-12 px-4 text-center mt-16">
      <h2 className="text-2xl font-bold mb-4">
        Potpiši se na naš newsletter
      </h2>

      <form className="flex flex-col md:flex-row justify-center gap-2 max-w-xl mx-auto mt-4">
        <input
          type="email"
          placeholder="Vaš email"
          className="px-4 py-2 rounded-md text-gray-900 w-full focus:outline-none"
        />

        <button
          type="submit"
          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition w-full md:w-auto"
        >
          Subscribe
        </button>
      </form>
    </section>
  );
};

export default NewsletterBox;
