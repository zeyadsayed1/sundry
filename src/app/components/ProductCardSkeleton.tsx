export default function ProductCardSkeleton() {
  return (
    <div className="flex flex-col bg-white rounded-2xl border border-[#EDEBF1] overflow-hidden animate-pulse">
      <div className="aspect-square w-full bg-[#EDEBF1]" />
      <div className="p-4 flex flex-col flex-1">
        <div className="h-3 w-1/3 bg-[#EDEBF1] rounded-md mb-2" />
        <div className="h-4 w-4/5 bg-[#EDEBF1] rounded-md mb-1.5" />
        <div className="h-4 w-2/3 bg-[#EDEBF1] rounded-md mb-3" />
        <div className="h-3 w-1/4 bg-[#EDEBF1] rounded-md mb-4" />
        <div className="mt-auto pt-3 border-t border-[#EDEBF1] flex items-center justify-between">
          <div className="h-5 w-20 bg-[#EDEBF1] rounded-md" />
          <div className="h-9 w-16 bg-[#EDEBF1] rounded-xl" />
        </div>
      </div>
    </div>
  );
}
