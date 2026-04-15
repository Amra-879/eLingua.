import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const linkClass = "text-slate-200 hover:text-indigo-400 transition";

  return (
    <header className="w-full px-6 py-4 grid grid-cols-3 items-center sticky top-0 z-50 bg-slate-800 backdrop-blur">

      {/* LOGO */}
      <div className="flex items-center gap-3">
        <img
          src="/logo.png"
          alt="eLingua logo"
          className="h-[6vmin] w-auto"
        />
        <span className="text-3xl font-bold text-indigo-400 tracking-tight">
          eLingua
        </span>
      </div>

      {/* CENTER NAV */}
      <nav className="flex justify-center gap-8 text-lg font-medium">

        {/* Home — svi, ali admin ide na dashboard */}
         <Link
          to={
            user?.role === "admin"
              ? "/admin/dashboard"
              : user?.role === "professor"
              ? "/professor/dashboard"
              : "/"
          }
          className={linkClass}>Home</Link>

        {/* STUDENT */}
        {user?.role === "student" && (
          <>
            <Link to="/prompts" className={linkClass}>Strani jezici</Link>
            <Link to="/my-essays" className={linkClass}>Moji eseji</Link>
          </>
        )}

        {/* PROFESOR */}
        {user?.role === "professor" && (
          <>
            <Link to="/professor/pending" className={linkClass}>Na čekanju</Link>
            <Link to="/professor/graded" className={linkClass}>Ocijenjene vježbe</Link>
          </>
        )}

        {/* ADMIN */}
        {user?.role === "admin" && (
          <>
            <Link to="/admin/prompts" className={linkClass}>Promptovi</Link>
            <Link to="/admin/professors" className={linkClass}>Profesori</Link>
          </>
        )}

        {/* Način rada — samo za studente i neprijavljene */}
        {(!user || user?.role === "student") && (
          <Link to="/about" className={linkClass}>Način rada</Link>
        )}

      </nav>

      {/* RIGHT SIDE */}
      <div className="flex justify-end gap-6 text-lg font-medium items-center">
        {!user ? (
          <>
            <Link to="/login" className={linkClass}>Login</Link>
            <Link to="/register" className={linkClass}>Register</Link>
          </>
        ) : (
          <>
            <span className="text-indigo-400 font-semibold">{user.name}</span>
            <button
              onClick={handleLogout}
              className="text-slate-200 hover:text-red-400 transition"
            >
              Logout
            </button>
          </>
        )}
      </div>

    </header>
  );
};

export default Navbar;