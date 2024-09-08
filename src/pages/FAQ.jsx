import { useState } from "react";
import { faqs } from "../constants";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";

const FAQ = ({ user }) => {
  const [expandedIndex, setExpandedIndex] = useState(null);

  const toggleFAQ = (index) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <>
      <Navbar user={user} />
      <div className=" text-white py-16 px-6 sm:px-12 lg:px-24 xl:px-32 max-w-7xl mx-auto">
        <h1 className="text-4xl font-extrabold text-center text-gradient bg-gradient-to-r from-blue-500 to-teal-400 bg-clip-text text-transparent mb-12">
          Frequently Asked Questions
        </h1>
        <div className="space-y-6">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-gray-800/60 p-6 rounded-lg shadow-lg transition-transform transform hover:-translate-y-1"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full text-left focus:outline-none"
              >
                <h2 className="text-xl font-semibold flex items-center justify-between text-gray-300 hover:text-white transition-colors duration-300">
                  {faq.question}
                  <span
                    className={`ml-4 transform transition-transform duration-300 ${
                      expandedIndex === index ? "rotate-45" : "rotate-0"
                    }`}
                  >
                    +
                  </span>
                </h2>
              </button>
              {expandedIndex === index && (
                <div className="mt-4 pl-1 border-l-2 border-teal-500">
                  <p className="text-gray-400 leading-relaxed">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default FAQ;
