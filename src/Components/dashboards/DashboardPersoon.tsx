import { AggregateResult, SimpleQueryForm } from "amcat4react";
import { addFilter } from "amcat4react/dist/Amcat";
import { Container, Grid } from "semantic-ui-react";
import { FILTERFIELDS } from "../../omroepen";
import { InfoHeader } from "../InfoHeader";
import MetricTile from "../metrics/MetricTile";
import {
  BewindspersoonDashboardProps,
  PERSONEN,
  SUBTOPICS,
} from "./Dashboards";

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
  const subtopics = SUBTOPICS[name].subtopics;

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
      <h2>Deelonderwerpen deze maand vergeleken met vorige maand</h2>
      {subtopics.map((subtopic) => (
        <MetricTile
          label={subtopic}
          key={subtopic}
          index={index}
          query={addFilter(q, { subtopic: { values: [subtopic] } })}
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
              text="Aantal artikelen per onderwerp"
              info="In deze analyse wordt per thema het aantal items per dag weergegeven."
            />

            <AggregateResult
              index={index}
              query={addFilter(q, {
                bewindspersoon: { values: [name] },
                topic: { values: topics },
              })}
              height={400}
              options={{
                limit: 3,
                display: "linechart",
                axes: [{ field: "date", interval: "week" }, { field: "topic" }],
              }}
            />
          </Grid.Column>
          <Grid.Column width={8}>
            <InfoHeader
              text="Aantal artikelen per subthema binnen Bouwen en Wonen"
              info="In deze analyse wordt per subthema binnen bouwen en wonen het aantal items per dag weergegeven."
            />

            <AggregateResult
              index={index}
              query={addFilter(q, {
                bewindspersoon: { values: [name] },
                subtopic: { values: subtopics },
              })}
              height={400}
              options={{
                limit: 4,
                display: "linechart",
                axes: [
                  { field: "date", interval: "week" },
                  { field: "subtopic" },
                ],
              }}
            />
          </Grid.Column>
        </Grid.Row>

        <Grid.Row stretched>
          <Grid.Column width={8}>
            <InfoHeader
              text={"Aandacht in de landelijke dagbladen"}
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
              text={"Aandacht in de regionale dagbladen (top-10)"}
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
