import React, { useState, useEffect } from "react";
import { getStudents, getFees, saveFees } from "../../lib/db";

export default function Fees() {
  const [view, setView] = useState<"menu" | "submit" | "history" | "status">("menu");
  
  const [searchQuery, setSearchQuery] = useState("");
  const [searchedStudent, setSearchedStudent] = useState<any>(null);
  const [feesHistory, setFeesHistory] = useState<any[]>([]);
  
  const [feeData, setFeeData] = useState({
    month: "",
    amount: ""
  });

  // டேட்டாபேஸில் இருந்து பழைய கட்டண விபரங்களை எடுக்க
  useEffect(() => {
    if (view === "history") {
      getFees().then((data) => {
        if (data) setFeesHistory(data);
      });
    }
  }, [view]);

  // மாணவர்களைத் தேடும் பகுதி (திருத்தப்பட்டது)
  const handleSearch = async () => {
    const students = await getStudents();
    const searchLower = searchQuery.toLowerCase().trim();
    
    const found = students.find((s: any) => {
      // உங்கள் Firestore-ல் உள்ள student_id மற்றும் name உடன் ஒப்பிடுகிறது
      const nameMatch = s.name && s.name.toLowerCase().includes(searchLower);
      const idMatch = s.student_id && s.student_id.toLowerCase() === searchLower;
      const userMatch = s.username && s.username.toLowerCase() === searchLower;

      return nameMatch || idMatch || userMatch;
    });
    
    if (found) {
      setSearchedStudent(found);
    } else {
      alert("மாணவர் கண்டறியப்படவில்லை! (Student not found)");
      setSearchedStudent(null);
    }
  };

  // கட்டணத்தைச் சேமிக்கும் பகுதி
  const handleSubmitFee = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchedStudent || !feeData.month || !feeData.amount) {
      alert("மாணவர், மாதம் மற்றும் தொகையை உள்ளிடவும்.");
      return;
    }

    const newFee = {
      id: Date.now().toString(),
      studentId: searchedStudent.student_id || searchedStudent.id, // மாணவர் ID
      studentName: searchedStudent.name,
      grade: searchedStudent.grade,
      month: feeData.month,
      amount: feeData.amount,
      date: new Date().toISOString()
    };

    try {
      const fees = await getFees() || [];
      const updatedFees = [...fees, newFee];
      await saveFees(updatedFees);

      alert("கட்டணம் வெற்றிகரமாகச் சேர்க்கப்பட்டது! (Fee Submitted Successfully)");
      setFeeData({ month: "", amount: "" });
      setSearchedStudent(null);
      setSearchQuery("");
      setView("menu");
    } catch (error) {
      alert("பிழை ஏற்பட்டுள்ளது. மீண்டும் முயலவும்.");
    }
  };

  if (view === "menu") {
    return (
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6 flex flex-col space-y-4">
        <button
          onClick={() => setView("submit")}
          className="bg-[#1e3a8a] text-white py-3 px-6 rounded-md hover:bg-blue-800 transition-colors font-medium text-center"
        >
          Submit Fees
        </button>
        <button
          onClick={() => setView("history")}
          className="bg-[#1e3a8a] text-white py-3 px-6 rounded-md hover:bg-blue-800 transition-colors font-medium text-center"
        >
          Fee History
        </button>
        <button
          onClick={() => setView("status")}
          className="bg-[#1e3a8a] text-white py-3 px-6 rounded-md hover:bg-blue-800 transition-colors font-medium text-center"
        >
          Student Fee Status
        </button>
      </div>
    );
  }

  if (view === "submit") {
    return (
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center mb-6">
          <button onClick={() => setView("menu")} className="mr-4 text-gray-600 hover:text-gray-900">
            ← Back
          </button>
          <h2 className="text-xl font-bold text-gray-800">Submit Fees</h2>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Search Student (Name or ID)
          </label>
          <div className="flex space-x-2">
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="உதாரணம்: STU89188 அல்லது kavi" 
              className="flex-1 border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <button onClick={handleSearch} className="bg-[#1e3a8a] text-white px-4 py-2 rounded-md hover:bg-blue-800">
              Search
            </button>
          </div>
        </div>

        {searchedStudent && (
          <>
            <div className="border border-gray-200 rounded-lg p-4 mb-6 bg-gray-50">
              <h3 className="font-bold text-gray-800 mb-2">மாணவர் விபரம்</h3>
              <p className="text-sm text-gray-600">பெயர்: {searchedStudent.name}</p>
              <p className="text-sm text-gray-600">ID: {searchedStudent.student_id || searchedStudent.id}</p>
              <p className="text-sm text-gray-600">வகுப்பு: {searchedStudent.grade}</p>
            </div>

            <form className="space-y-4" onSubmit={handleSubmitFee}>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Fee Month</label>
                <input 
                  type="month" 
                  value={feeData.month}
                  onChange={(e) => setFeeData({...feeData, month: e.target.value})}
                  className="w-full border border-gray-300 rounded-md px-3 py-2" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
                <input 
                  type="number" 
                  placeholder="Enter Amount" 
                  value={feeData.amount}
                  onChange={(e) => setFeeData({...feeData, amount: e.target.value})}
                  className="w-full border border-gray-300 rounded-md px-3 py-2" 
                />
              </div>
              <button type="submit" className="w-full bg-pink-600 text-white py-2 rounded-md hover:bg-pink-700 font-medium">
                Submit Fee
              </button>
            </form>
          </>
        )}
      </div>
    );
  }

  if (view === "history") {
    return (
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center mb-6">
          <button onClick={() => setView("menu")} className="mr-4 text-gray-600 hover:text-gray-900">
            ← Back
          </button>
          <h2 className="text-xl font-bold text-gray-800">Fee History</h2>
        </div>
        <div className="space-y-4">
          {feesHistory.length === 0 ? (
            <div className="text-center text-gray-500 py-8">வரலாறு எதுவும் இல்லை.</div>
          ) : (
            feesHistory.map((fee: any) => (
              <div key={fee.id} className="border border-gray-200 rounded-lg p-4 flex justify-between items-center">
                <div>
                  <h3 className="font-bold text-[#1e3a8a]">{fee.studentName} ({fee.studentId})</h3>
                  <p className="text-sm text-gray-500">Month: {fee.month} | Grade: {fee.grade}</p>
                </div>
                <div className="text-right">
                  <span className="text-green-600 font-bold bg-green-50 px-3 py-1 rounded text-sm">Rs. {fee.amount}</span>
                  <p className="text-xs text-gray-400 mt-1">{new Date(fee.date).toLocaleDateString()}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    );
  }

  if (view === "status") {
    return (
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center mb-6">
          <button
            onClick={() => setView("menu")}
            className="mr-4 text-gray-600 hover:text-gray-900"
          >
            ← Back
          </button>
          <h2 className="text-xl font-bold text-gray-800">
            Student Fee Status
          </h2>
        </div>
        <div className="text-center text-gray-500 py-8">No data available.</div>
      </div>
    );
  }

  return null;
}
