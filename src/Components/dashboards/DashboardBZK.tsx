import {
  AggregateResult,
  AmcatIndex,
  AmcatQuery,
  SimpleQueryForm,
} from "amcat4react";
import { addFilter } from "amcat4react/dist/Amcat";
import { useState } from "react";
import { Container, Grid, Menu } from "semantic-ui-react";
import { FILTERFIELDS, OMROEPEN } from "../../omroepen";
import { InfoHeader } from "../InfoHeader";
import Metrics from "../metrics/Metrics";
import { DashboardProps } from "./Dashboards";

export const MEDIA = [
  "Landelijke kranten",
  "Regionale kranten",
  "Religieuze kranten",
];

export default function DashboardBZK({
  index,
  query,
  setQuery,
  showFilters,
}: DashboardProps) {
  let d = new Date();
  const vergelijk_vanaf = new Date(
    d.getFullYear(),
    d.getMonth() - 1,
    1
  ).toISOString();

  if (index == null) return null;
  const omroep = OMROEPEN.filter((o) => o.index === index.index)[0];

  return (
    <Container>
      {!showFilters ? null : (
        <SimpleQueryForm
          index={index}
          value={query}
          onSubmit={setQuery}
          fieldList={FILTERFIELDS}
          addFilterLabel="Filter toevoegen"
        />
      )}
      <Metrics index={index} query={query} />

      <Grid padded style={{ height: "100vh" }}>
        <Grid.Row stretched>
          <Grid.Column width={16}>
            <InfoHeader
              text={"Toaal nieuws vergeleken met verleden maand"}
              info="In deze figuur wordt het aantal artikelen op de website van deze maand vergeleken met de maand ervoor"
            />{" "}
            <AggregateResult
              index={index}
              query={addFilter(query, { date: { gte: vergelijk_vanaf } })}
              height={400}
              options={{
                display: "linechart",
                axes: [
                  { field: "date", interval: "dayofmonth" },
                  { field: "date", interval: "monthnr" },
                ],
              }}
            />
          </Grid.Column>
        </Grid.Row>
        <Grid.Row stretched>
          <Grid.Column width={16}>
            <InfoHeader
              text="Aantal artikelen per bewindspersoon"
              info="In deze analyse wordt per mediumtype het aantal items per dag weergegeven."
            />

            <AggregateResult
              index={index}
              query={query}
              height={400}
              options={{
                display: "linechart",
                axes: [
                  { field: "date", interval: "week" },
                  { field: "bewindspersoon" },
                ],
              }}
            />
          </Grid.Column>
        </Grid.Row>

        <Grid.Row stretched>
          <Grid.Column width={8}>
            <InfoHeader
              text={"Onderwerpen in het nieuws"}
              info="Aantal artikelen per onderwerp. Deze onderwerpen zijn gebaseerd op zoektermen rondom een onderwerp, gebaseerd op eerder onderzoek naar het nieuws van lokale omroepen. Een artikel kan hierbij ook over meerdere onderwerpen gaan."
            />
            <AggregateResult
              index={index}
              query={query}
              height={400}
              options={{
                display: "barchart",
                axes: [{ field: "topic" }],
                limit: 12,
              }}
            />
          </Grid.Column>
          <Grid.Column width={8}>
            <InfoHeader
              text="Bewindspersonen per medium"
              info="Aantal artikelen per bewindspersoon."
            />{" "}
            <AggregateResult
              index={index}
              query={query}
              height={400}
              options={{
                display: "barchart",
                axes: [{ field: "bewindspersoon" }, { field: "medium" }],
                limit: 10,
              }}
            />
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </Container>
  );
}
