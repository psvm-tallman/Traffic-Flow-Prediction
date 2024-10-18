"use client";
import React, { useState } from "react";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

type FormData = {
  area_name: string;
  road_name: string;
  weather_conditions: string;
  day_of_week: number;
};

type Prediction = {
  individual_predictions: { [key: string]: string };
  ensemble_prediction: string;
  traffic_volume: number;
  average_speed: number;
  travel_time_index: number;
  road_capacity_utilization: number;
  incident_reports: number;
  environmental_impact: number;
  public_transport_usage: number;
  traffic_signal_compliance: number;
  parking_usage: number;
  pedestrian_cyclist_count: number;
  roadwork: number;
};

const options = {
  areaNames: [
    "Indiranagar",
    "Whitefield",
    "Koramangala",
    "M.G. Road",
    "Jayanagar",
    "Hebbal",
    "Yeshwanthpur",
    "Electronic City",
  ],
  roadNames: [
    "100 Feet Road",
    "CMH Road",
    "Marathahalli Bridge",
    "Sony World Junction",
    "Sarjapur Road",
    "Trinity Circle",
    "Anil Kumble Circle",
    "Jayanagar 4th Block",
    "South End Circle",
    "Hebbal Flyover",
    "Ballari Road",
    "Yeshwanthpur Circle",
    "Tumkur Road",
    "ITPL Main Road",
    "Silk Board Junction",
    "Hosur Road",
  ],
  weatherConditions: ["Clear", "Overcast", "Fog", "Rain", "Windy"],
};

const TrafficPredictionForm: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    area_name: "",
    road_name: "",
    weather_conditions: "",
    day_of_week: 0,
  });

  const [prediction, setPrediction] = useState<Prediction | null>(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (name: keyof FormData, value: string | number) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/predict-traffic", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setPrediction(data);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-start gap-8 w-full min-h-svh px-[20px] py-[32px]">
      <Card className="flex p-6 flex-col items-start gap-8 self-stretch rounded-lg border border-[#E4E4E7] bg-white shadow-card">
        <CardHeader>
          <CardTitle>Bangalore Traffic Prediction</CardTitle>
          <CardDescription>
            Fill the form to get the prediction of traffic in selected areas of
            Bangalore
          </CardDescription>
        </CardHeader>

        <CardContent className="flex flex-col items-start gap-5 w-full">
          <div className="flex w-full items-start gap-6">
            <Select
              onValueChange={(value) => handleChange("weather_conditions", value)}
            >
              <SelectTrigger className="flex items-center gap-3">
                <SelectValue placeholder="Select Weather Conditions" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {options.weatherConditions.map((condition) => (
                    <SelectItem key={condition} value={condition}>
                      {condition}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <div className="flex w-full items-start gap-6">
            <Select onValueChange={(value) => handleChange("area_name", value)}>
              <SelectTrigger className="flex items-center gap-3">
                <SelectValue placeholder="Select Area Name" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {options.areaNames.map((area) => (
                    <SelectItem key={area} value={area}>
                      {area}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>

            <Select onValueChange={(value) => handleChange("road_name", value)}>
              <SelectTrigger className="flex items-center gap-3">
                <SelectValue placeholder="Select Road/Intersection Name" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {options.roadNames.map((road) => (
                    <SelectItem key={road} value={road}>
                      {road}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <Select onValueChange={(value) => handleChange("day_of_week", parseInt(value))}>
            <SelectTrigger className="flex items-center gap-3">
              <SelectValue placeholder="Day of Week" />
            </SelectTrigger>
            <SelectContent>
              {[0, 1, 2, 3, 4, 5, 6].map((day) => (
                <SelectItem key={day} value={day.toString()}>
                  {["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"][day]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>

        <Button
          className="bg-slate-950 text-white"
          variant="outline"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please wait
            </>
          ) : (
            "Submit"
          )}
        </Button>

        {prediction && (
          <Card className="mt-4 w-full">
            <CardHeader className="p-6">
              <CardTitle>Prediction Result</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg font-semibold">
                Ensemble Prediction:{" "}
                <span className="text-blue-600">
                  {prediction.ensemble_prediction}
                </span>
              </p>
              <h3 className="text-md font-semibold mt-4">
                Individual Model Predictions:
              </h3>
              <ul className="list-disc list-inside">
                {Object.entries(prediction.individual_predictions).map(
                  ([key, value]) => (
                    <li key={key}>
                      {key}: <span className="font-medium">{value}</span>
                    </li>
                  )
                )}
              </ul>
              <h3 className="text-md font-semibold mt-4">
                Additional Predictions:
              </h3>
              <ul className="list-disc list-inside">
                <li>Traffic Volume: <span className="font-medium">{prediction.traffic_volume}</span></li>
                <li>Average Speed: <span className="font-medium">{prediction.average_speed}</span></li>
                <li>Travel Time Index: <span className="font-medium">{prediction.travel_time_index}</span></li>
                <li>Road Capacity Utilization: <span className="font-medium">{prediction.road_capacity_utilization}</span></li>
                <li>Incident Reports: <span className="font-medium">{prediction.incident_reports}</span></li>
                <li>Environmental Impact: <span className="font-medium">{prediction.environmental_impact}</span></li>
                <li>Public Transport Usage: <span className="font-medium">{prediction.public_transport_usage}</span></li>
                <li>Traffic Signal Compliance: <span className="font-medium">{prediction.traffic_signal_compliance}</span></li>
                <li>Parking Usage: <span className="font-medium">{prediction.parking_usage}</span></li>
                <li>Pedestrian and Cyclist Count: <span className="font-medium">{prediction.pedestrian_cyclist_count}</span></li>
                <li>Roadwork: <span className="font-medium">{prediction.roadwork ? "Yes" : "No"}</span></li>
              </ul>
            </CardContent>
          </Card>
        )}
      </Card>
    </div>
  );
};

export default TrafficPredictionForm;