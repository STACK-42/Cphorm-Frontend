import { useState } from "react";
import logo from "@/assets/logo.svg";
import pfp from "@/assets/pfp.jpg";

const defaultFields = [
  { key: "full_name", label: "Full Name", type: "text" },
  { key: "age", label: "Age", type: "number" },
  { key: "presenting_complaint", label: "Presenting Complaint", type: "text" },
  { key: "medical_history", label: "Medical History", type: "text" },
  { key: "medications", label: "Medications", type: "text" },
  { key: "city", label: "City", type: "text" },
  { key: "diagnosis", label: "Diagnosis", type: "text" },
  { key: "sex", label: "Sex", type: "text" },
  { key: "date_of_birth", label: "Date of Birth", type: "date" },
];

const profilePlaceholder = "https://ui-avatars.com/api/?name=Doctor&background=0D8ABC&color=fff";

const ManageForms = () => {
  const [selectedFields, setSelectedFields] = useState<string[]>(["full_name"]);
  const [customFields, setCustomFields] = useState<any[]>([]);
  const [customName, setCustomName] = useState("");
  const [customType, setCustomType] = useState("text");
  const [customOptions, setCustomOptions] = useState("");

  const allFields = [...defaultFields, ...customFields];

  const handleFieldToggle = (key: string) => {
    setSelectedFields(fields =>
      fields.includes(key)
        ? fields.filter(f => f !== key)
        : [...fields, key]
    );
  };

  const handleAddCustomField = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customName.trim()) return;
    setCustomFields(fields => [
      ...fields,
      {
        key: customName.toLowerCase().replace(/\s+/g, "_"),
        label: customName,
        type: customType,
        options: customType === "select" ? customOptions.split(",").map(o => o.trim()).filter(Boolean) : undefined,
      },
    ]);
    setCustomName("");
    setCustomType("text");
    setCustomOptions("");
  };

  return (
    <div className="bg-slate-50 min-h-screen flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between bg-[#F3F4F6] border-b border-[#e7edf4] px-10 py-3">
        <div className="flex items-center gap-4">
          <img src={logo} alt="Logo" className="h-16 w-16 object-contain" />
        </div>
        <div className="flex items-center gap-4">
          <span className="text-[#0d141c] text-sm font-medium">Profile</span>
          <div className="bg-center bg-no-repeat bg-cover rounded-full h-10 w-10" style={{ backgroundImage: `url('${pfp}')` }}></div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex h-[calc(100vh-64px)] min-h-0 w-full px-0 flex-1">
        {/* Left: Configurations */}
        <div className="flex flex-col gap-8 bg-white rounded-none md:rounded-r-2xl shadow-lg p-8 h-full w-full max-w-sm flex-shrink-0">
          <div>
            <h2 className="text-xl font-bold mb-4 text-[#0d141c]">Configure Form</h2>
            <h3 className="text-lg font-semibold mb-2">Select Fields</h3>
            <div className="grid grid-cols-1 gap-2" id="field-selectors">
              {allFields.map(field => (
                <label key={field.key} className="flex gap-x-3 py-2 flex-row">
                  <input
                    type="checkbox"
                    checked={selectedFields.includes(field.key)}
                    onChange={() => handleFieldToggle(field.key)}
                    className="h-5 w-5 rounded border-[#cedbe8] border-2 bg-transparent text-[#0c7ff2] checked:bg-[#0c7ff2] checked:border-[#0c7ff2] focus:ring-0 focus:ring-offset-0 focus:border-[#cedbe8] focus:outline-none"
                  />
                  <p className="text-[#0d141c] text-base font-normal leading-normal">{field.label}</p>
                </label>
              ))}
            </div>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-2">Add Custom Field</h4>
            <form className="flex flex-wrap gap-2 items-end" onSubmit={handleAddCustomField}>
              <input
                type="text"
                placeholder="Field name"
                className="border border-[#cedbe8] rounded-lg px-3 py-2 text-base"
                value={customName}
                onChange={e => setCustomName(e.target.value)}
                required
              />
              <select
                className="border border-[#cedbe8] rounded-lg px-3 py-2 text-base"
                value={customType}
                onChange={e => setCustomType(e.target.value)}
              >
                <option value="text">Text</option>
                <option value="number">Number</option>
                <option value="date">Date</option>
                <option value="select">Select (dropdown)</option>
              </select>
              {customType === "select" && (
                <input
                  type="text"
                  placeholder="Options (comma separated)"
                  className="border border-[#cedbe8] rounded-lg px-3 py-2 text-base"
                  value={customOptions}
                  onChange={e => setCustomOptions(e.target.value)}
                  required
                />
              )}
              <button type="submit" className="bg-[#2563EB] text-white rounded-lg px-4 py-2 font-semibold transition-all duration-200 hover:bg-[#1d4ed8]">Add Field</button>
            </form>
          </div>
        </div>
        {/* Right: Form Preview */}
        <div className="flex flex-col bg-white rounded-none md:rounded-l-2xl shadow-lg p-8 h-full flex-1 overflow-y-auto">
          <h2 className="text-2xl font-bold mb-6 text-[#0d141c]">Form Preview</h2>
          <form className="flex flex-col gap-6 bg-[#f9fafb] rounded-xl p-6 mb-8">
            {allFields.filter(f => selectedFields.includes(f.key)).map(field => (
              <div key={field.key} className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">{field.label}</label>
                {field.type === "select" ? (
                  <select className="border border-gray-300 rounded-lg px-3 py-2 w-full">
                    {field.options?.map((opt: string, idx: number) => (
                      <option key={idx} value={opt}>{opt}</option>
                    ))}
                  </select>
                ) : (
                  <input type={field.type} className="border border-gray-300 rounded-lg px-3 py-2 w-full" />
                )}
              </div>
            ))}
            <div className="flex justify-end">
              <button
                type="submit"
                className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 
                       bg-[#2563EB] text-slate-50 text-sm font-bold leading-normal tracking-[0.015em]
                       transition-all duration-200 ease-in-out
                       hover:bg-[#1d4ed8] hover:scale-105
                       active:scale-95 active:bg-[#1e40af] focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:ring-offset-2"
              >
                <span className="truncate">Submit</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ManageForms; 