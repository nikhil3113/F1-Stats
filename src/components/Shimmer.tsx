import { Skeleton } from "@/components/ui/skeleton";
const Shimmer = ({ count }: { count: number }) => {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <div className="p-10" key={index}>
          <Skeleton className="h-[170px] rounded-xl " />
        </div>
      ))}
    </>
  );
};

export default Shimmer;
