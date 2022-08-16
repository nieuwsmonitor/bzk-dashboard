import { AmcatIndex, AmcatQuery } from "amcat4react";
import MetricTile from "./MetricTile";

interface MetricsProps {
  index: AmcatIndex;
  query: AmcatQuery;
}

export default function Metrics({ index, query }: MetricsProps) {
  const bewindspersonen = ["BZK", "De Jonge", "Bruins Slot", "Van Huffelen"];

  return (
    <>
      {bewindspersonen.map((persoon) => (
        <MetricTile
          label={persoon}
          key={persoon}
          index={index}
          query={{ filters: { bewindspersoon: { values: [persoon] } } }}
        />
      ))}
    </>
  );
}
