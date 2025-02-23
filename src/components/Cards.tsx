import { useRecoilState, useRecoilValue } from "recoil";
import { loadingState, seasonState } from "../store/atoms/race";
import { useCallback, useEffect, useState } from "react";
import axios, { AxiosResponse } from "axios";
import Countdown from "react-countdown";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";

import Shimmer from "./Shimmer";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { CalendarIcon, MapPinIcon, TrophyIcon } from "lucide-react";

interface CircuitLocation {
  locality: string;
}

interface Circuit {
  Location: CircuitLocation;
}

interface SeasonItem {
  round: string;
  raceName: string;
  date: string;
  Circuit: Circuit;
}

interface CardsProps {
  date: number | undefined;
}

const Cards = ({ date }: CardsProps) => {
  const timeRemaining = useCallback((date: string) => {
    const secondsInTheFuture = new Date(date).getTime() / 1000;
    const secondsNow = new Date().getTime() / 1000;
    const difference = Math.round(secondsInTheFuture - secondsNow);
    return difference * 1000;
  }, []);

  const season = useRecoilValue<SeasonItem[]>(seasonState);
  const [winners, setWinners] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useRecoilState(loadingState);

  const fetchWinners = async () => {
    if (!date) return;

    const winnerData: { [key: string]: string } = {};

    try {
      const requests = season.map((item) =>
        axios.get(`http://ergast.com/api/f1/${date}/${item.round}/results.json`)
      );
      const responses = await Promise.all(requests);

      responses.forEach((response: AxiosResponse, index) => {
        const raceResults = response.data.MRData.RaceTable.Races[0];
        const round = season[index].round;

        if (raceResults && raceResults.Results.length > 0) {
          winnerData[round] = raceResults.Results[0].Driver.familyName;
        } else {
          winnerData[round] = "UPCOMING";
        }
      });

      setWinners(winnerData);
    } catch (error) {
      console.error("Failed to fetch winners:", error);

      season.forEach((item) => {
        winnerData[item.round] = "NA";
      });
      setWinners(winnerData);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    fetchWinners();
  }, [season, date, setLoading]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <Shimmer count={6} />
        ) : season.length > 0 ? (
          season.map((item) => (
            <Card
              key={item.round}
              className="overflow-hidden transition-all duration-300 hover:shadow-xl dark:bg-gray-800 dark:border-gray-700"
            >
              <CardHeader className="bg-primary text-primary-foreground p-4">
                <CardTitle className="text-xl font-bold truncate">
                  {item.raceName}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 space-y-4">
                <div className="flex items-center text-sm">
                  <MapPinIcon className="w-4 h-4 mr-2" />
                  <span>{item.Circuit.Location.locality}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center">
                    <CalendarIcon className="w-4 h-4 mr-2" />
                    <span>{item.date}</span>
                  </div>
                  <div className="flex items-center">
                    <TrophyIcon className="w-4 h-4 mr-2" />
                    {winners[item.round] === "UPCOMING" ? (
                      <Countdown
                        date={Date.now() + timeRemaining(item.date)}
                        className="font-semibold"
                      >
                        <span>Race Day!</span>
                      </Countdown>
                    ) : (
                      <span className="font-semibold">
                        {winners[item.round] || "TBA"}
                      </span>
                    )}
                  </div>
                </div>
              </CardContent>
              <CardFooter className="bg-gray-50 dark:bg-gray-900 p-4">
                <Link
                  to={`/results?date=${date}&round=${item.round}`}
                  className="w-full"
                >
                  <Button variant="secondary" className="w-full">
                    Check Result
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))
        ) : (
          <div className="col-span-full flex justify-center items-center mt-10">
            <h1 className="text-2xl font-bold text-center">
              No Data Found for Given Year
            </h1>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cards;
