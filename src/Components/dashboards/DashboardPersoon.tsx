import { AggregateResult, SimpleQueryForm } from "amcat4react";
import { addFilter } from "amcat4react/dist/Amcat";
import { Container, Grid } from "semantic-ui-react";
import { FILTERFIELDS } from "../../omroepen";
import { InfoHeader } from "../InfoHeader";
import MetricTile from "../metrics/MetricTile";
import { BewindspersoonDashboardProps, PERSONEN } from "./Dashboards";

export const MEDIA = [
  "Landelijke kranten",
  "Regionale kranten",
  "Religieuze kranten",
];

export default function DashboardPersoon({
  index,
  query,
  setQuery,
  name,
  showFilters,
}: BewindspersoonDashboardProps) {
  let d = new Date();
  const vergelijk_vanaf = new Date(
    d.getFullYear(),
    d.getMonth() - 1,
    1
  ).toISOString();
  const topics = PERSONEN[name].topics;
  const q = addFilter(query, { bewindspersoon: { values: [name] } });

  if (index == null) return null;
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
      <h1>Dashboard voor {name}</h1>
      <h2>Onderwerpen deze maand vergeleken met vorige maand</h2>
      {topics.map((topic) => (
        <MetricTile
          label={topic}
          key={topic}
          index={index}
          query={addFilter(q, { topic: { values: [topic] } })}
        />
      ))}

      <Grid padded style={{ height: "100vh" }}>
        <Grid.Row stretched>
          <Grid.Column width={16}>
            <InfoHeader
              text={"Toaal nieuws vergeleken met verleden maand"}
              info="In deze figuur wordt het aantal artikelen op de website van deze maand vergeleken met de maand ervoor"
            />{" "}
            <AggregateResult
              index={index}
              query={addFilter(q, {
                date: { gte: vergelijk_vanaf },
              })}
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
          <Grid.Column width={8}>
            <InfoHeader
              text="Aantal artikelen per mediumtype"
              info="In deze analyse wordt per mediumtype het aantal items per dag weergegeven."
            />

            <AggregateResult
              index={index}
              query={q}
              height={400}
              options={{
                display: "linechart",
                axes: [
                  { field: "date", interval: "week" },
                  { field: "medium" },
                ],
              }}
            />
          </Grid.Column>
          <Grid.Column width={8}>
            <InfoHeader
              text="Aantal artikelen per mediumtype"
              info="In deze analyse wordt per mediumtype het aantal items per dag weergegeven."
            />

            <AggregateResult
              index={index}
              query={addFilter(q, {
                topic: { values: topics },
              })}
              height={400}
              options={{
                limit: 2,
                display: "linechart",
                axes: [{ field: "date", interval: "week" }, { field: "topic" }],
              }}
            />
          </Grid.Column>
        </Grid.Row>

        <Grid.Row stretched>
          <Grid.Column width={8}>
            <InfoHeader
              text={"Landelijke Dagbladen"}
              info="Aandacht in de landelijke dagbladen"
            />
            <AggregateResult
              index={index}
              query={addFilter(q, {
                medium: { values: ["Landelijke kranten"] },
              })}
              height={400}
              options={{
                display: "barchart",
                axes: [{ field: "publisher" }],
              }}
            />
          </Grid.Column>
          <Grid.Column width={8}>
            <InfoHeader
              text={"Regionale kranten"}
              info="Aandacht in de regionale kranten (top-10)"
            />
            <AggregateResult
              index={index}
              query={addFilter(q, {
                medium: { values: ["Regionale kranten"] },
              })}
              height={400}
              options={{
                display: "barchart",
                axes: [{ field: "publisher" }],
                limit: 10,
              }}
            />
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </Container>
  );
}
