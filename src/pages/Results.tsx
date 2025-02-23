import Header from "@/components/Header";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import axios from "axios";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

interface RaceResults {
  position: string;
  status: string;
  Driver: {
    familyName: string;
  };
  Constructor: {
    name: string;
  };
  Time?: {
    millis?: string;
    time?: string;
  };
  points: string;
}

const Results = () => {
  const [results, setResults] = useState<RaceResults[]>([]);
  const [searchParams] = useSearchParams();
  const date = searchParams.get("date");
  const round = searchParams.get("round");

  useEffect(() => {
    axios
      .get(`http://ergast.com/api/f1/${date}/${round}/results.json`)
      .then((response) => {
        console.log(response.data.MRData.RaceTable.Races[0].Results);
        setResults(response.data.MRData.RaceTable.Races[0].Results);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [date, round]);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <Header />
      <div className="max-w-5xl mx-auto px-4 py-10">
        <h1 className="text-center text-4xl font-extrabold mb-8 tracking-wide">
          Race Results
        </h1>
        
        <div className="bg-white dark:bg-gray-800 shadow-lg rounded-xl overflow-hidden">
          <Table className="w-full border-collapse">
            <TableHeader className="bg-gray-200 dark:bg-gray-700">
              <TableRow className="text-lg text-gray-700 dark:text-gray-200 uppercase">
                <TableHead className="py-4 text-center">Position</TableHead>
                <TableHead className="py-4 text-center">Driver</TableHead>
                <TableHead className="py-4 text-center">Constructor</TableHead>
                <TableHead className="py-4 text-center">Time</TableHead>
                <TableHead className="py-4 text-center">Points</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="text-lg">
              {results.map((result) => (
                <TableRow
                  key={result.position}
                  className="hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                >
                  <TableCell className="py-3 text-center font-bold">{result.position}</TableCell>
                  <TableCell className="py-3 text-center">{result.Driver.familyName.toUpperCase()}</TableCell>
                  <TableCell className="py-3 text-center">{result.Constructor.name}</TableCell>
                  <TableCell className="py-3 text-center">
                    {result.Time?.millis
                      ? result.Time.time
                      : result.status.includes("Lap")
                      ? result.status
                      : "DNF"}
                  </TableCell>
                  <TableCell className="py-3 text-center font-semibold">{result.points}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default Results;
