import logging
from datetime import datetime

from tools import get_argument_parser, setup, get_google_service

SCOPES = ['https://www.googleapis.com/auth/spreadsheets.readonly']
FIELDS = {"bewindspersoon": "tag"}


def read_sheet(client_secret, sheet_id, range):
    service = get_google_service(client_secret, "googlesheets.dat", SCOPES, "sheets", "v4")
    result = service.spreadsheets().values().get(spreadsheetId=sheet_id, range=range).execute()
    rows = result.get('values', [])
    keys = rows[0]
    for row in rows[1:]:
        yield dict(zip(keys, row))


def get_queries(config):
    rows = read_sheet(config['google']['analytics_secret'],
                      config['queries_person']['sheet_id'], config['queries_person']['sheet_range'])
    for row in rows:
        yield row['bewindspersoon'], row['query']


def add_persons(conn, queries, from_date):
    persons = {}
    index = "bzk"
    logging.info(f"Running {len(queries)} queries on {index} from {from_date}")
    for label, query in queries.items():
        results = list(conn.query(index, queries=query, filters={"date": {"gte": from_date}}, fields=["_id"]))
        logging.info(f"... {label} yielded {len(results)} results")
        for d in results:
            persons.setdefault(d['_id'], []).append(label)
    logging.info(f"Updating {len(persons)} documents")
    for i, (id, t) in enumerate(persons.items()):
        if i and not i%100:
            logging.info(f"... {i}/{len(persons)}")
        conn.update_document(index, id, {"bewindspersoon": t})


if __name__ == '__main__':
    parser = get_argument_parser()
    args, config, conn = setup(parser, fields=FIELDS)
    queries = dict(get_queries(config))
    add_persons(conn, queries, args.from_date)
