import { useRecoilState } from "recoil";
import { ModeToggle } from "./mode-toggle";
import { Input } from "./ui/input";
import { dateState } from "@/store/atoms/race";
import { Link } from "react-router-dom";



const Header = () => {
  const [date, setDate] = useRecoilState(dateState);
  return (
    <div className="flex justify-between p-10 max-sm:flex-col gap-5">
      <Link to={"/"}>
      <h1 className="text-center text-4xl font-serif font-bold ">F1 Stats</h1>
      </Link>

      <Input
        type="number"
        placeholder="Enter a Racing Year"
        onChange={(e) => {
          setDate(e.target.value === "" ? 2024 : parseInt(e.target.value));
        }}
        value={date}
        className="px-5 text-center w-52 max-sm:w-auto border-t-0 border-b-1 border-r-0 border-l-0 border-black dark:border-white font-semibold text-xl"
        min={1950}
        max={new Date().getFullYear()}
      />

      <div className="mt-1">
        <ModeToggle />
      </div>
    </div>
  );
};

export default Header;
