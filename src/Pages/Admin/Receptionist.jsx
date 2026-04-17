import { useState } from "react";
import { db } from "../../firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import Footer from "../../components/Footer/Footer";
import PricingBox from "../../components/Pricing/PricingBox";
import Img1 from "../../images/pricing/img1.jpg";
import Img2 from "../../images/pricing/img2.jpg";
import Img3 from "../../images/pricing/img3.jpg";

function Receptionist() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    interest: "Body Building",
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await addDoc(collection(db, "leads"), {
        ...formData,
        timestamp: serverTimestamp(),
      });
      setSubmitted(true);
      setLoading(false);
    } catch (err) {
      console.error("Error adding lead:", err);
      setLoading(false);
    }
  };

  return (
    <>
      <section className="receptionist-section">
        <div className="login-banner relative justify-center flex">
          <h1 className="text-white absolute bottom-[25px] text-[3rem] font-bold uppercase">
            Receptionist Desk
          </h1>
        </div>

        <div className="container page-padding py-[10rem]">
          {!submitted ? (
            <div className="flex flex-col items-center">
              <h2 className="text-[3rem] font-bold mb-10 uppercase text-center">Capture Client Enquiry</h2>
              <form
                onSubmit={handleSubmit}
                className="flex flex-col py-20 px-10 bg-[#f8f8f8] w-[60rem] min450:w-full shadow-lg"
              >
                <input
                  className="text-[1.6rem] px-8 py-4 mb-8 outline-none border border-[#e4e4e4]"
                  placeholder="Client Name *"
                  type="text"
                  required
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
                <input
                  className="text-[1.6rem] px-8 py-4 mb-8 outline-none border border-[#e4e4e4]"
                  placeholder="Phone Number *"
                  type="tel"
                  required
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
                <input
                  className="text-[1.6rem] px-8 py-4 mb-8 outline-none border border-[#e4e4e4]"
                  placeholder="Email Address"
                  type="email"
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
                <select
                  className="text-[1.6rem] px-8 py-4 mb-10 outline-none border border-[#e4e4e4] bg-white"
                  onChange={(e) => setFormData({ ...formData, interest: e.target.value })}
                >
                  <option>Body Building</option>
                  <option>Boxing</option>
                  <option>Crossfit</option>
                  <option>Fitness</option>
                  <option>Yoga</option>
                </select>

                <button
                  type="submit"
                  disabled={loading}
                  className="bg-[#ff0336] text-white text-[1.8rem] font-bold py-5 hover:bg-[#ff0336ce] transition-all"
                >
                  {loading ? "Saving..." : "Show Pricing Plans"}
                </button>
              </form>
            </div>
          ) : (
            <div className="flex flex-col items-center animate-fadeIn">
              <div className="bg-green-100 text-green-700 p-6 text-[1.8rem] rounded-lg mb-10 font-bold">
                ✓ Enquiry Captured Successfully! Showing relevant plans for {formData.name}.
              </div>
              
              <div className="flex flex-col text-center relative items-center mb-20">
                <h2 className="text-[3.4rem] font-bold mb-4 uppercase">Recommended Plans</h2>
                <span className="w-[10rem] h-[4px] bg-[#ff0336]"></span>
              </div>

              <div className="flex gap-10 relative z-[2] md1000:flex-col md1000:items-center">
                <PricingBox img={Img1} price="39" />
                <PricingBox img={Img2} price="65" />
                <PricingBox img={Img3} price="100" />
              </div>

              <button 
                onClick={() => setSubmitted(false)}
                className="mt-20 text-[1.6rem] font-bold text-[#ff0336] underline"
              >
                Back to Enquiry Form
              </button>
            </div>
          )}
        </div>
        <Footer />
      </section>
    </>
  );
}

export default Receptionist;
