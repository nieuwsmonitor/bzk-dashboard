import { Amcat, AmcatIndex, AmcatQuery } from "amcat4react";
import { useEffect, useState } from "react";
import Tile from "./Tile";

interface MetricTileProps {
  label: string;
  index: AmcatIndex;
  query: AmcatQuery;
}
export default function MetricTile({ label, index, query }: MetricTileProps) {
  const [n, setN] = useState<number>();
  const [previousN, setPreviousN] = useState<number>();
  const change =
    n == null || previousN == null || previousN === 0
      ? undefined
      : (n - previousN) / previousN;

  useEffect(() => {
    setN(undefined);
    setPreviousN(undefined);
    let maand = new Date();
    maand.setDate(maand.getDate() - 30);
    let maand2 = new Date();
    maand2.setDate(maand2.getDate() - 60);
    const q = {
      ...query,
      filters: { ...query.filters, date: { gte: maand.toISOString() } },
    };
    const previousQ = {
      ...query,
      filters: {
        ...query.filters,
        date: { gte: maand2.toISOString(), lt: maand.toISOString() },
      },
    };
    Amcat.postQuery(index, q, { per_page: 1 }).then((response) => {
      setN(response["data"]["meta"]["total_count"]);
    });
    Amcat.postQuery(index, previousQ, { per_page: 1 }).then((response) => {
      setPreviousN(response["data"]["meta"]["total_count"]);
    });
  }, [index, setN, setPreviousN, query]);
  return <Tile label={label} content={n} change={change} />;
}
