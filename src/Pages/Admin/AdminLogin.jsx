import { useState } from "react";
import { auth } from "../../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import Footer from "../../components/Footer/Footer";

function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (email === "admin@akfitness.com" && password === "admin123") {
      // Mock successful login
      localStorage.setItem("mockAdmin", "true");
      navigate("/admin-dashboard");
      return;
    }
    try {
      await signInWithEmailAndPassword(auth, email, password);
      localStorage.removeItem("mockAdmin");
      navigate("/admin-dashboard");
    } catch (err) {
      setError("Invalid email or password");
    }
  };

  return (
    <>
      <section className="login-section">
        <div className="login-banner relative justify-center flex">
          <h1 className="text-white absolute bottom-[25px] text-[3rem] font-bold">
            Admin Login
          </h1>
        </div>
        <div className="py-[10rem] flex justify-center uppercase">
          <form
            onSubmit={handleLogin}
            className="flex flex-col py-40 px-20 bg-black w-[55rem] min450:w-full shadow-xl"
          >
            <label className="text-[2rem] text-white mb-10 font-bold">
              Email
            </label>
            <input
              className="text-[1.7rem] px-8 py-4 mb-10 outline-none border border-[#e4e4e4]"
              placeholder="admin@akfitness.com"
              type="email"
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <label className="text-[2rem] text-white mb-10 font-bold">
              Password
            </label>
            <input
              className="text-[1.7rem] px-8 py-4 mb-10 outline-none border border-[#e4e4e4]"
              placeholder="password"
              type="password"
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            {error && (
              <p className="text-[#ff0336] text-[1.5rem] mb-10">{error}</p>
            )}

            <button
              type="submit"
              className="bg-[#ff0336] text-white text-[2rem] font-bold py-6 hover:bg-[#ff0336ce] transition-all duration-300"
            >
              Log In
            </button>
          </form>
        </div>
        <Footer />
      </section>
    </>
  );
}

export default AdminLogin;
