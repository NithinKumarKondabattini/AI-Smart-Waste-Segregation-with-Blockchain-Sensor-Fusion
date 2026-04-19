import { createContext, useMemo, useState } from "react";

const INITIAL_SUBMISSIONS = [
  {
    id: "SWM-1001",
    userId: "QR-DEL-001",
    wasteType: "Hard Plastic",
    weight: 1.2,
    area: "Malviya Nagar",
    imageName: "plastic-bin.jpg",
    timestamp: "2026-04-19 09:20",
  },
  {
    id: "SWM-1002",
    userId: "QR-DEL-014",
    wasteType: "Glass",
    weight: 0.8,
    area: "Rohini",
    imageName: "glass-scan.png",
    timestamp: "2026-04-19 10:05",
  },
  {
    id: "SWM-1003",
    userId: "QR-DEL-021",
    wasteType: "Biodegradable",
    weight: 2.4,
    area: "Civil Lines",
    imageName: "organic-load.jpeg",
    timestamp: "2026-04-19 11:10",
  },
];

export const WasteDataContext = createContext(null);

const tonsMap = {
  "Hard Plastic": 4543,
  Glass: 952,
  Biodegradable: 445,
  "Wood & Metals": 2312,
};

export function WasteDataProvider({ children }) {
  const [submissions, setSubmissions] = useState(INITIAL_SUBMISSIONS);

  const addSubmission = (payload) => {
    const entry = {
      id: `SWM-${1000 + submissions.length + 1}`,
      ...payload,
      weight: Number(payload.weight),
      timestamp: new Date().toLocaleString("en-IN", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setSubmissions((prev) => [entry, ...prev]);
    return entry;
  };

  const metrics = useMemo(() => {
    const totals = { ...tonsMap };

    submissions.forEach((item) => {
      if (totals[item.wasteType] !== undefined) {
        totals[item.wasteType] += item.weight / 1000;
      }
    });

    return {
      totalWeightKg: submissions.reduce((sum, item) => sum + Number(item.weight), 0),
      totalSubmissions: submissions.length,
      totals,
    };
  }, [submissions]);

  return (
    <WasteDataContext.Provider value={{ submissions, addSubmission, metrics }}>
      {children}
    </WasteDataContext.Provider>
  );
}
