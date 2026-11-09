const CustomLegend = ({ payload, noBorder, square }: { payload: any, noBorder?: boolean, square?: boolean }) => (
  <div className="flex flex-wrap gap-x-3 gap-y-1 justify-center -mt-1 mb-3 px-2">
    {payload?.map((entry: any, index: number) => (
      <div key={index} className="flex items-center justify-center gap-1 text-xs">
        <span className={`h-3 w-3 ${square ? '' : 'rounded-full'}`} style={{ backgroundColor: entry.color }}></span>
        <span
          className="text-xs text-gray-700 dark:text-gray-300"
        >
          {entry.value}
        </span>
      </div>
    ))}
  </div>
);

export default CustomLegend;
