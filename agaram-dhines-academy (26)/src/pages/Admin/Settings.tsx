import React, { useState } from "react";

export default function Settings() {
  const [instituteName, setInstituteName] = useState(
    "DINESHKUMAR AGARAM DHINES",
  );
  const [password, setPassword] = useState("0756452527Dd");
  const [studentPin, setStudentPin] = useState("2255");
  const [staffPin, setStaffPin] = useState("144684");

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Settings saved successfully!");
  };

  return (
    <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-bold mb-6 text-gray-800">Settings</h2>

      <form onSubmit={handleSave} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1 flex justify-between">
            <span>Email</span>
            <span className="text-xs text-gray-500">Not Changeable</span>
          </label>
          <input
            type="email"
            value="ddhinesnivas111@gmail.com"
            disabled
            className="w-full border border-gray-300 rounded-md px-3 py-2 bg-gray-100 text-gray-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Institute Name
          </label>
          <input
            type="text"
            value={instituteName}
            onChange={(e) => setInstituteName(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Password
          </label>
          <div className="relative">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 pr-10 focus:ring-blue-500 focus:border-blue-500"
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
            >
              👁️
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Student Default PIN
          </label>
          <div className="relative">
            <input
              type="password"
              value={studentPin}
              onChange={(e) => setStudentPin(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 pr-10 focus:ring-blue-500 focus:border-blue-500"
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
            >
              👁️
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Staff Default PIN
          </label>
          <div className="relative">
            <input
              type="password"
              value={staffPin}
              onChange={(e) => setStaffPin(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 pr-10 focus:ring-blue-500 focus:border-blue-500"
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
            >
              👁️
            </button>
          </div>
        </div>

        <div className="pt-4 flex justify-center">
          <button
            type="submit"
            className="bg-pink-600 text-white px-8 py-2 rounded-md hover:bg-pink-700 transition-colors font-medium"
          >
            Save
          </button>
        </div>
      </form>
    </div>
  );
}
