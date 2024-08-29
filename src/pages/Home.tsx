import axios from "axios";
import { useEffect } from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { dateState, seasonState } from "../store/atoms/race";
import Cards from "../components/Cards";
import Header from "../components/Header";
import useDebouce from "@/hooks/useDebouce";

const Home = () => {
  const setSeason = useSetRecoilState(seasonState);
  const date = useRecoilValue(dateState);
  
  const deboucedValue = useDebouce({ inputValue: date, delay: 2000 });
  useEffect(() => {
    axios
      .get(`http://ergast.com/api/f1/${deboucedValue}.json`)
      .then((response) => {
        setSeason(response.data.MRData.RaceTable.Races);
      })
      .catch((error) => {
        console.log(error);
        // alert("Check the year you entered");
      });
  }, [setSeason, deboucedValue]);

  return (
    <div>
      <Header/>
      <div>
        <Cards date={deboucedValue} />
      </div>
    </div>
  );
};

export default Home;
