import { Dropdown, Menu } from "semantic-ui-react";
import { PERSONEN, DashboardValue } from "../dashboards/Dashboards";
import { DashboardDropdownProps } from "./TopMenu";

export default function DashboardDropdown({
  selectedDashboard,
  setSelectedDashboard,
}: DashboardDropdownProps) {
  return (
    <Dropdown item text={`Dashboard: ${selectedDashboard}`}>
      <Dropdown.Menu>
        {["BZK", ...Object.keys(PERSONEN)].map((t) => (
          <Menu.Item
            key={t}
            active={selectedDashboard === t}
            onClick={() => setSelectedDashboard(t as DashboardValue)}
          >
            {t}
          </Menu.Item>
        ))}
      </Dropdown.Menu>
    </Dropdown>
  );
}
