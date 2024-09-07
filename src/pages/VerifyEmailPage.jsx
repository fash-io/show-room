import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { applyActionCode } from "firebase/auth";
import { auth } from "../utils/firebase";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const VerifyEmailPage = () => {
  const query = new URLSearchParams(useLocation().search);
  const oobCode = query.get("oobCode");

  const verifyEmail = async () => {
    try {
      await applyActionCode(auth, oobCode);
      console.log("Email verified successfully.");
    } catch (error) {
      console.error("Error verifying email:", error);
    }
  };

  useEffect(() => {
    verifyEmail();
  }, []);

  return (
    <>
      <Navbar noProfile={true} />
      <div className="p-8 min-h-screen flex justify-center items-center">
        <div className="bg-slate-800 p-6 rounded-lg shadow-md text-center text-white">
          <h2 className="text-2xl font-semibold">Verifying Your Email...</h2>
          <p className="mt-4">Please wait while we verify your email address.</p>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default VerifyEmailPage;
