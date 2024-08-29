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
  Time: {
    millis: string,
    time: string
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
    <div>
      <Header />
      <h1 className="text-center text-3xl mb-8 font-bold pl-20 max-sm:pl-0">
        Results
      </h1>
      <div className="px-10">
        <Table>
          <TableHeader>
            <TableRow className="text-xl">
              <TableHead>Position</TableHead>
              <TableHead>Driver</TableHead>
              <TableHead>Constructor</TableHead>
              <TableHead>Time</TableHead>
              <TableHead>Points</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="font-semibold text-base">
            {results.map((results: RaceResults) => (
              <TableRow key={results.position}>
                <TableCell>{results.position}</TableCell>
                <TableCell>{results.Driver.familyName.toUpperCase()}</TableCell>
                <TableCell>{results.Constructor.name}</TableCell>
                <TableCell>
                  {results && results.Time && results.Time.millis
                    ? results.Time.time
                    : results.status.endsWith("Lap") || results.status.endsWith("Laps")
                    ? results.status
                    : "DNF"}
                </TableCell>
                <TableCell className="pl-8">{results.points}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default Results;
