import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  Bug,
  Droplets,
  Activity,
  TrendingUp,
  Download,
  LogOut,
  Map,
} from "lucide-react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

// Dummy data for malaria cases from 2019-2025
const malariaData = [
  { year: 2019, cases: 45230 },
  { year: 2020, cases: 52340 },
  { year: 2021, cases: 48756 },
  { year: 2022, cases: 56890 },
  { year: 2023, cases: 51234 },
  { year: 2024, cases: 58912 },
  { year: 2025, cases: 62145 },
];

// Sudan states disease data
const sudanStatesData = [
  {
    name: "Khartoum",
    malaria: 12500,
    cholera: 890,
    dengue: 234,
    population: 5274321,
  },
  {
    name: "Gezira",
    malaria: 8900,
    cholera: 567,
    dengue: 123,
    population: 3575280,
  },
  {
    name: "White Nile",
    malaria: 7800,
    cholera: 445,
    dengue: 178,
    population: 2000000,
  },
  {
    name: "Blue Nile",
    malaria: 6700,
    cholera: 234,
    dengue: 89,
    population: 1200000,
  },
  {
    name: "North Kordofan",
    malaria: 5600,
    cholera: 345,
    dengue: 156,
    population: 2920000,
  },
  {
    name: "South Kordofan",
    malaria: 4500,
    cholera: 123,
    dengue: 67,
    population: 1400000,
  },
  {
    name: "Darfur",
    malaria: 9800,
    cholera: 678,
    dengue: 234,
    population: 2500000,
  },
];

const COLORS = [
  "hsl(221, 83%, 53%)",
  "hsl(210, 40%, 96%)",
  "hsl(220, 13%, 9%)",
  "#10B981",
  "#F59E0B",
];

const Insights = () => {
  const [selectedYear, setSelectedYear] = useState("2024");
  const [selectedDisease, setSelectedDisease] = useState("malaria");
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);

  // KPI calculations
  const totalMalaria = sudanStatesData.reduce(
    (sum, state) => sum + state.malaria,
    0
  );
  const totalCholera = sudanStatesData.reduce(
    (sum, state) => sum + state.cholera,
    0
  );
  const totalDengue = sudanStatesData.reduce(
    (sum, state) => sum + state.dengue,
    0
  );
  const totalCases = totalMalaria + totalCholera + totalDengue;

  // Disease distribution data for pie chart
  const diseaseDistribution = [
    { name: "Malaria", value: totalMalaria, color: "hsl(221, 83%, 53%)" },
    { name: "Cholera", value: totalCholera, color: "hsl(210, 40%, 96%)" },
    { name: "Dengue", value: totalDengue, color: "hsl(220, 13%, 9%)" },
  ];

  useEffect(() => {
    if (!mapContainer.current) return;

    // Initialize Mapbox map
    mapboxgl.accessToken =
      "pk.eyJ1IjoiZXhhbXBsZSIsImEiOiJjbGV4YW1wbGUifQ.example"; // Replace with actual token

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/light-v11",
      center: [30.2176, 12.8628], // Sudan coordinates
      zoom: 5.5,
    });

    // Add Sudan border and state markers
    map.current.on("load", () => {
      // Add markers for each state with disease data
      sudanStatesData.forEach((state, index) => {
        const coordinates: [number, number] = [
          30.2176 + (Math.random() - 0.5) * 8, // Random positions within Sudan
          12.8628 + (Math.random() - 0.5) * 6,
        ];

        // Create a popup for each state
        const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(
          `<div class="p-2">
            <h3 class="font-bold text-midnight">${state.name}</h3>
            <p>Malaria: ${state.malaria.toLocaleString()}</p>
            <p>Cholera: ${state.cholera.toLocaleString()}</p>
            <p>Dengue: ${state.dengue.toLocaleString()}</p>
          </div>`
        );

        // Create marker with size based on total cases
        const totalStateCases = state.malaria + state.cholera + state.dengue;
        const markerSize = Math.max(
          10,
          Math.min(40, totalStateCases / 1000 + 10)
        );

        const el = document.createElement("div");
        el.className = "disease-marker";
        el.style.backgroundColor = "hsl(221, 83%, 53%)";
        el.style.width = `${markerSize}px`;
        el.style.height = `${markerSize}px`;
        el.style.borderRadius = "50%";
        el.style.opacity = "0.7";
        el.style.border = "2px solid white";
        el.style.cursor = "pointer";

        new mapboxgl.Marker(el)
          .setLngLat(coordinates)
          .setPopup(popup)
          .addTo(map.current!);
      });
    });

    return () => {
      map.current?.remove();
    };
  }, []);

  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-background font-inter">
      <Header />

      <div className="bg-card border-b border-border px-6 py-4">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Activity className="h-6 w-6 text-cool-blue" />
            <h1 className="text-2xl font-bold text-midnight">
              Cphorm Dashboard
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <Select value={selectedYear} onValueChange={setSelectedYear}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2024">2024</SelectItem>
                <SelectItem value="2023">2023</SelectItem>
                <SelectItem value="2022">2022</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              Export Report
            </Button>
          </div>
        </div>
      </div>

      <main className="container mx-auto px-6 py-8">
        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Malaria Cases
              </CardTitle>
              <Bug className="h-4 w-4 text-cool-blue" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-midnight">
                {totalMalaria.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">
                <TrendingUp className="inline h-3 w-3 mr-1" />
                12.4% increase from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Cholera Cases
              </CardTitle>
              <Droplets className="h-4 w-4 text-cool-blue" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-midnight">
                {totalCholera.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">
                <TrendingUp className="inline h-3 w-3 mr-1" />
                8.2% increase from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Dengue Cases
              </CardTitle>
              <Activity className="h-4 w-4 text-cool-blue" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-midnight">
                {totalDengue.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">
                3.1% decrease from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Cases
              </CardTitle>
              <Map className="h-4 w-4 text-cool-blue" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-midnight">
                {totalCases.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">
                Across all regions
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Sudan Map */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-midnight">
              Sudan Disease Heatmap
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div
              ref={mapContainer}
              className="h-96 w-full rounded-lg border border-border"
              style={{ minHeight: "400px" }}
            />
            <p className="text-sm text-muted-foreground mt-2">
              Interactive map showing disease distribution across Sudan. Click
              markers for detailed information.
            </p>
          </CardContent>
        </Card>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Malaria Trends Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-midnight">
                Malaria Cases Trend (2019-2025)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={malariaData}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="hsl(210, 40%, 96%)"
                  />
                  <XAxis dataKey="year" stroke="hsl(220, 13%, 9%)" />
                  <YAxis stroke="hsl(220, 13%, 9%)" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(0, 0%, 100%)",
                      border: "1px solid hsl(210, 40%, 96%)",
                      borderRadius: "8px",
                    }}
                    formatter={(value) => [value?.toLocaleString(), "Cases"]}
                  />
                  <Line
                    type="monotone"
                    dataKey="cases"
                    stroke="hsl(221, 83%, 53%)"
                    strokeWidth={3}
                    dot={{ fill: "hsl(221, 83%, 53%)", strokeWidth: 2, r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Disease Distribution Pie Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-midnight">
                Disease Distribution
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={diseaseDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) =>
                      `${name} ${(percent * 100).toFixed(0)}%`
                    }
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {diseaseDistribution.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => value.toLocaleString()} />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* States Bar Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-midnight">
              Disease Cases by State
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart
                data={sudanStatesData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="hsl(210, 40%, 96%)"
                />
                <XAxis dataKey="name" stroke="hsl(220, 13%, 9%)" />
                <YAxis stroke="hsl(220, 13%, 9%)" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(0, 0%, 100%)",
                    border: "1px solid hsl(210, 40%, 96%)",
                    borderRadius: "8px",
                  }}
                  formatter={(value) => value.toLocaleString()}
                />
                <Bar
                  dataKey="malaria"
                  stackId="a"
                  fill="hsl(221, 83%, 53%)"
                  name="Malaria"
                />
                <Bar
                  dataKey="cholera"
                  stackId="a"
                  fill="hsl(210, 40%, 96%)"
                  name="Cholera"
                />
                <Bar
                  dataKey="dengue"
                  stackId="a"
                  fill="hsl(220, 13%, 9%)"
                  name="Dengue"
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </main>

      <Footer />
    </div>
  );
};

export default Insights;
