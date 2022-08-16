import { AmcatQuery } from "amcat4react";
import { Dropdown, Menu } from "semantic-ui-react";
import { FilterDropdownProps } from "./TopMenu";

export function getDate(daysago: number): string {
  let d = new Date();
  d.setDate(d.getDate() - daysago);
  return d.toISOString().substring(0, 10);
}

export default function FilterDropdown({
  showFilters,
  setShowFilters,
  query,
  setQuery,
}: FilterDropdownProps) {
  const d1m = getDate(30);
  const d3m = getDate(90);
  const d1y = getDate(365);
  function setDateFilter(value: string) {
    const newQuery = {
      ...query,
      filters: { ...query.filters, date: { gte: value } },
    };
    console.log(newQuery);
    setQuery(newQuery);
  }
  const mediumfilter = query?.filters?.medium?.values || [];
  console.log({ query, mediumfilter });
  const datefilter = query?.filters?.date?.gte;
  function setMediumFilter(value: string) {
    const newFilter = mediumfilter.includes(value)
      ? mediumfilter.filter((v) => v !== value)
      : [...mediumfilter, value];
    let newQuery: AmcatQuery = {
      ...query,
      filters: { ...query.filters, medium: { values: newFilter } },
    };
    if (newFilter.length === 0) delete newQuery.filters?.medium;
    setQuery(newQuery);
  }

  return (
    <Dropdown item text="Filters">
      <Dropdown.Menu className="filtermenu">
        <Menu.Item
          active={showFilters}
          onClick={() => setShowFilters(!showFilters)}
        >
          <CheckItem checked={showFilters} text="Filterbalk tonen" />
        </Menu.Item>
        <Dropdown.Divider />
        <Menu.Item
          active={datefilter === d1m}
          onClick={() => setDateFilter(d1m)}
        >
          <CheckItem checked={datefilter === d1m} text="Laatste maand" />
        </Menu.Item>
        <Menu.Item
          active={datefilter === d3m}
          onClick={() => setDateFilter(d3m)}
        >
          <CheckItem checked={datefilter === d3m} text="Laatste drie maanden" />
        </Menu.Item>
        <Menu.Item
          active={datefilter === d1y}
          onClick={() => setDateFilter(d1y)}
        >
          <CheckItem checked={datefilter === d1y} text="Laatste jaar" />
        </Menu.Item>
        <Dropdown.Divider />
        {["Landelijke kranten", "Regionale kranten", "Religieuze kranten"].map(
          (x) => (
            <Menu.Item
              key={x}
              active={mediumfilter.includes(x)}
              onClick={() => setMediumFilter(x)}
            >
              <CheckItem checked={mediumfilter.includes(x)} text={x} />
            </Menu.Item>
          )
        )}
      </Dropdown.Menu>
    </Dropdown>
  );
}

interface CheckItemProps {
  text: string;
  checked: boolean;
}
function CheckItem(props: CheckItemProps) {
  return (
    <>
      <span style={props.checked ? {} : { color: "white" }}>✓</span>
      {props.text}
    </>
  );
}
