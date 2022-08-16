import { Icon, Statistic } from "semantic-ui-react";

interface TileProps {
  label: string;
  content?: number;
  change?: number;
}

function format_content(n: number): string {
  if (n > 10000000) return `${(n / 1000000).toFixed(0)}M`;
  if (n > 1000000) return `${(n / 1000000).toFixed(1)}M`;
  if (n > 10000) return `${(n / 1000).toFixed(0)}K`;
  if (n > 1000) return `${(n / 1000).toFixed(1)}K`;
  return `${n}`;
}

export default function Tile({ label, content, change }: TileProps) {
  const value = content == null ? "..." : format_content(content);
  return (
    <Statistic style={{ background: "lightblue", padding: "1em" }}>
      <Statistic.Label>{label}</Statistic.Label>
      <Statistic.Value>{value}</Statistic.Value>
      {change == null ? (
        <Statistic.Label>Geen gegevens</Statistic.Label>
      ) : (
        <Statistic.Label style={{ color: change > 0 ? "green" : "red" }}>
          <Icon name={`arrow ${change > 0 ? "up" : "down"}`} />
          {Math.round(change * 100)}%
        </Statistic.Label>
      )}
    </Statistic>
  );
}
