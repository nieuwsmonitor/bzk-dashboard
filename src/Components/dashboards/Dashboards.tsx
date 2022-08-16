import { AmcatIndex, AmcatQuery } from "amcat4react";
import { useState } from "react";
import { Container } from "semantic-ui-react";
import TopMenu from "../menu/TopMenu";
import DashboardBZK from "./DashboardBZK";
import DashboardPersoon from "./DashboardPersoon";

export const PERSONEN = {
  "De Jonge": { topics: ["Bouwen_Wonen", "Rijksvastgoed"] },
  "Van Huffelen": { topics: ["Koninkrijksrelaties", "Digitalisering"] },
  "Bruins Slot": { topics: ["AIVD", "CZW"] },
};

export type DashboardValue = "BZK" | keyof typeof PERSONEN;

interface DashboardsProps {
  index: AmcatIndex;
}

export interface DashboardProps extends DashboardsProps {
  query: AmcatQuery;
  setQuery: (query: AmcatQuery) => void;
  showFilters: boolean;
}

export interface BewindspersoonDashboardProps extends DashboardProps {
  name: keyof typeof PERSONEN;
}

export default function Dashboards({ index }: DashboardsProps) {
  const [selectedDashboard, setSelectedDashboard] =
    useState<DashboardValue>("BZK");
  const [query, setQuery] = useState<AmcatQuery>({});
  const [showFilters, setShowFilters] = useState(false);
  const Dashboard =
    selectedDashboard === "BZK" ? DashboardBZK : DashboardPersoon;

  return (
    <>
      <TopMenu
        selectedDashboard={selectedDashboard}
        setSelectedDashboard={setSelectedDashboard}
        query={query}
        setQuery={setQuery}
        showFilters={showFilters}
        setShowFilters={setShowFilters}
      ></TopMenu>
      <Container style={{ paddingTop: "60px" }}>
        <Dashboard
          index={index}
          query={query}
          setQuery={setQuery}
          showFilters={showFilters}
          name={selectedDashboard as any}
        />{" "}
      </Container>
    </>
  );
}
