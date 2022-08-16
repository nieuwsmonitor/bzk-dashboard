import { Menu } from "semantic-ui-react";
import "./TopMenu.css";
import DashboardDropdown from "./DashboardDropdown";
import { DashboardValue } from "../dashboards/Dashboards";
import { AmcatQuery } from "amcat4react";
import FilterDropdown from "./FilterDropdown";

export interface DashboardDropdownProps {
  selectedDashboard: string;
  setSelectedDashboard: (value: DashboardValue) => void;
}

export interface FilterDropdownProps {
  showFilters: boolean;
  setShowFilters: (value: boolean) => void;
  query: AmcatQuery;
  setQuery: (value: AmcatQuery) => void;
}

interface TopMenuProps extends DashboardDropdownProps, FilterDropdownProps {}

export default function TopMenu(props: TopMenuProps) {
  return (
    <Menu inverted fixed="top">
      <Menu.Menu position="left">
        <DashboardDropdown
          selectedDashboard={props.selectedDashboard}
          setSelectedDashboard={props.setSelectedDashboard}
        />
        <FilterDropdown
          showFilters={props.showFilters}
          setShowFilters={props.setShowFilters}
          query={props.query}
          setQuery={props.setQuery}
        />
      </Menu.Menu>
    </Menu>
  );
}
