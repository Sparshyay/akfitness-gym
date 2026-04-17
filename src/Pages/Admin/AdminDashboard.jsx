import { useState, useEffect } from "react";
import { db, auth, storage } from "../../firebase";
import { collection, getDocs, addDoc, serverTimestamp, query, orderBy } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import Footer from "../../components/Footer/Footer";

function AdminDashboard() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("leads");
  const [showLeadModal, setShowLeadModal] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [newLead, setNewLead] = useState({
    name: "",
    phone: "",
    email: "",
    interest: "Body Building",
  });
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      const isMock = localStorage.getItem("mockAdmin") === "true";
      if (!user && !isMock) {
        navigate("/admin");
      }
    });
    fetchLeads();
    return () => unsubscribe();
  }, [navigate]);

  const fetchLeads = async () => {
    try {
      const q = query(collection(db, "leads"), orderBy("timestamp", "desc"));
      const querySnapshot = await getDocs(q);
      const leadsData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setLeads(leadsData);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching leads:", err);
      setLoading(false);
    }
  };

  const handleCreateLead = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, "leads"), {
        ...newLead,
        timestamp: serverTimestamp(),
      });
      setShowLeadModal(false);
      setNewLead({ name: "", phone: "", email: "", interest: "Body Building" });
      fetchLeads();
    } catch (err) {
      console.error("Error creating lead:", err);
    }
  };

  const handleFileUpload = async (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    try {
      const storageRef = ref(storage, `content/${type}/${file.name}`);
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);

      await addDoc(collection(db, "site_content"), {
        type,
        url,
        fileName: file.name,
        timestamp: serverTimestamp(),
      });

      alert(`${type} uploaded successfully!`);
      setUploading(false);
    } catch (err) {
      console.error("Error uploading file:", err);
      setUploading(false);
    }
  };

  const handleSignOut = async () => {
    await signOut(auth);
    localStorage.removeItem("mockAdmin");
    navigate("/admin");
  };

  return (
    <>
      <section className="admin-dashboard relative">
        <div className="login-banner relative justify-center flex">
          <h1 className="text-white absolute bottom-[25px] text-[3rem] font-bold">
            Admin Dashboard
          </h1>
        </div>
        
        <div className="container page-padding py-[5rem]">
          <div className="flex justify-between items-center mb-10">
            <div className="flex gap-8">
              <button 
                onClick={() => setActiveTab("leads")}
                className={`text-[1.8rem] font-bold py-2 px-6 ${activeTab === "leads" ? "text-[#ff0336] border-b-2 border-[#ff0336]" : "text-gray-500"}`}
              >
                Leads
              </button>
              <button 
                onClick={() => setActiveTab("content")}
                className={`text-[1.8rem] font-bold py-2 px-6 ${activeTab === "content" ? "text-[#ff0336] border-b-2 border-[#ff0336]" : "text-gray-500"}`}
              >
                Content
              </button>
            </div>
            <button 
              onClick={handleSignOut}
              className="bg-black text-white text-[1.4rem] font-bold py-3 px-8 hover:bg-[#1a1a1a]"
            >
              Logout
            </button>
          </div>

          {activeTab === "leads" ? (
            <div className="bg-white shadow-xl p-10 overflow-x-auto">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-[2.2rem] font-bold uppercase">Recent Leads</h2>
                <button 
                  onClick={() => setShowLeadModal(true)}
                  className="bg-[#ff0336] text-white py-3 px-8 text-[1.4rem] font-bold hover:bg-[#ff0336ce]"
                >
                  + Create Lead
                </button>
              </div>
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b-2 border-gray-200">
                    <th className="py-4 px-6 text-[1.6rem] font-bold">Name</th>
                    <th className="py-4 px-6 text-[1.6rem] font-bold">Phone</th>
                    <th className="py-4 px-6 text-[1.6rem] font-bold">Email</th>
                    <th className="py-4 px-6 text-[1.6rem] font-bold">Interest</th>
                    <th className="py-4 px-6 text-[1.6rem] font-bold">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {leads.map((lead) => (
                    <tr key={lead.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                      <td className="py-4 px-6 text-[1.4rem]">{lead.name}</td>
                      <td className="py-4 px-6 text-[1.4rem]">{lead.phone}</td>
                      <td className="py-4 px-6 text-[1.4rem]">{lead.email}</td>
                      <td className="py-4 px-6 text-[1.4rem]">{lead.interest}</td>
                      <td className="py-4 px-6 text-[1.4rem]">
                        {lead.timestamp?.toDate ? lead.timestamp.toDate().toLocaleDateString() : "N/A"}
                      </td>
                    </tr>
                  ))}
                  {leads.length === 0 && !loading && (
                    <tr>
                      <td colSpan="5" className="py-10 text-center text-[1.6rem] text-gray-400">No leads found</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="bg-white shadow-xl p-10">
              <h2 className="text-[2.2rem] font-bold mb-8 uppercase">Content Management</h2>
              <p className="text-[1.6rem] text-gray-600 mb-10">
                In this section, you can manage banners, plans, and promotional offers.
              </p>
              <div className="grid grid-cols-2 gap-10 md700:grid-cols-1">
                <div className="border border-gray-200 p-8 rounded-lg flex flex-col gap-4">
                  <h3 className="text-[1.8rem] font-bold mb-4">Promotional Banners</h3>
                  <input 
                    type="file" 
                    onChange={(e) => handleFileUpload(e, "promotional_banner")}
                    className="text-[1.4rem]"
                    accept="image/*"
                  />
                  {uploading && <p className="text-[1.2rem] text-[#ff0336]">Uploading...</p>}
                </div>
                <div className="border border-gray-200 p-8 rounded-lg flex flex-col gap-4">
                  <h3 className="text-[1.8rem] font-bold mb-4">Pricing Plans</h3>
                  <input 
                    type="file" 
                    onChange={(e) => handleFileUpload(e, "pricing_plan")}
                    className="text-[1.4rem]"
                    accept="image/*"
                  />
                  {uploading && <p className="text-[1.2rem] text-[#ff0336]">Uploading...</p>}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Lead Creation Modal */}
        {showLeadModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-[99999] flex justify-center items-center p-4">
            <div className="bg-white w-[50rem] p-10 rounded-xl relative">
              <button 
                onClick={() => setShowLeadModal(false)}
                className="absolute top-4 right-6 text-[3rem] text-[#ff0336]"
              >
                &times;
              </button>
              <h3 className="text-[2.4rem] font-bold mb-8 uppercase">Create New Lead</h3>
              <form onSubmit={handleCreateLead} className="flex flex-col gap-6">
                <input
                  className="text-[1.6rem] px-6 py-4 border border-gray-300 outline-none"
                  placeholder="Name *"
                  required
                  onChange={(e) => setNewLead({ ...newLead, name: e.target.value })}
                />
                <input
                  className="text-[1.6rem] px-6 py-4 border border-gray-300 outline-none"
                  placeholder="Phone *"
                  required
                  onChange={(e) => setNewLead({ ...newLead, phone: e.target.value })}
                />
                <input
                  className="text-[1.6rem] px-6 py-4 border border-gray-300 outline-none"
                  placeholder="Email"
                  type="email"
                  onChange={(e) => setNewLead({ ...newLead, email: e.target.value })}
                />
                <select
                  className="text-[1.6rem] px-6 py-4 border border-gray-300 outline-none bg-white"
                  onChange={(e) => setNewLead({ ...newLead, interest: e.target.value })}
                >
                  <option>Body Building</option>
                  <option>Boxing</option>
                  <option>Crossfit</option>
                  <option>Fitness</option>
                  <option>Yoga</option>
                </select>
                <button
                  type="submit"
                  className="bg-[#ff0336] text-white py-4 text-[1.8rem] font-bold uppercase hover:bg-black transition-all"
                >
                  Save Lead
                </button>
              </form>
            </div>
          </div>
        )}

        <Footer />
      </section>
    </>
  );
}

export default AdminDashboard;
