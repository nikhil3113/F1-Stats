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
    <div className="grid grid-cols-3 max-sm:grid-cols-1 ">
      {loading ? (
        <Shimmer count={6} />
      ) : season.length > 0 ? (
        season.map((item) => {
          return (
            <Card
              key={item.round}
              className="p-8 m-3 shadow-lg dark:bg-gray-200 dark:text-black rounded-lg bg-primary text-white"
            >
              <CardHeader>
                <CardTitle className="text-2xl font-bold">
                  {item.raceName}
                </CardTitle>
              </CardHeader>
              <CardContent className="my-2">
                <p className="font-semibold">
                  {item.Circuit.Location.locality}
                </p>
                <div className="flex justify-between">
                  <p className="mt-2">{item.date}</p>
                  {winners[item.round] == "UPCOMING" ? (
                    <Countdown
                      date={Date.now() + timeRemaining(item.date)}
                      className="font-semibold text-[18px]"
                    >
                      <p>{winners[item.round] || "Loading...."}</p>
                    </Countdown>
                  ) : (
                    <p className="font-semibold text-[18px]">
                      {" "}
                      {winners[item.round] || "Loading..."}
                    </p>
                  )}
                </div>
              </CardContent>
              <CardFooter className="flex ">
                <Link to={`/results?date=${date}&round=${item.round}`} className="relative right-2 mt-3">
                  <Button variant={"secondary"} >Check Result</Button>
                </Link>
              </CardFooter>
            </Card>
          );
        })
      ) : (
        <div className="flex justify-center items-center mt-10">
          <h1 className="text-2xl font-bold text-center ">
            No Data Found for Given Year
          </h1>
        </div>
      )}
    </div>
  );
};

export default Cards;
