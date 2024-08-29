import { useEffect, useState } from "react";

interface useDebouceProps {
  inputValue: number;
  delay: number;
}

const useDebouce = ({ inputValue, delay }: useDebouceProps) => {
  // const inputValue = useRecoilValue(dateState);
  const [deboucedValue, setDeboucedValue] = useState<number | undefined>(
    inputValue
  );
  useEffect(() => {
    const timeout = setTimeout(() => {
      setDeboucedValue(inputValue);
    }, delay);

    return () => clearTimeout(timeout);
  }, [inputValue, delay]);
  return deboucedValue;
};

export default useDebouce;
