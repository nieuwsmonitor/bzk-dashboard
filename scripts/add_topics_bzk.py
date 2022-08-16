import logging
from datetime import datetime

from tools import get_argument_parser, setup, get_google_service

SCOPES = ['https://www.googleapis.com/auth/spreadsheets.readonly']
FIELDS = {"topic": "tag"}


def read_sheet(client_secret, sheet_id, range):
    service = get_google_service(client_secret, "googlesheets.dat", SCOPES, "sheets", "v4")
    result = service.spreadsheets().values().get(spreadsheetId=sheet_id, range=range).execute()
    rows = result.get('values', [])
    keys = rows[0]
    for row in rows[1:]:
        yield dict(zip(keys, row))


def get_queries(config):
    rows = read_sheet(config['google']['analytics_secret'],
                      config['queries_topic']['sheet_id'], config['queries_topic']['sheet_range'])
    for row in rows:
        yield row['topic'], row['query']


def add_topics(conn, queries, from_date):
    topics = {}
    index = "bzk"
    logging.info(f"Running {len(queries)} queries on {index} from {from_date}")
    for label, query in queries.items():
        results = list(conn.query(index, queries=query, filters={"date": {"gte": from_date}}, fields=["_id"]))
        logging.info(f"... {label} yielded {len(results)} results")
        for d in results:
            topics.setdefault(d['_id'], []).append(label)
    logging.info(f"Updating {len(topics)} documents")
    for i, (id, t) in enumerate(topics.items()):
        if i and not i%100:
            logging.info(f"... {i}/{len(topics)}")
        conn.update_document(index, id, {"topic": t})


if __name__ == '__main__':
    parser = get_argument_parser()
    args, config, conn = setup(parser, fields=FIELDS)
    queries = dict(get_queries(config))
    add_topics(conn, queries, args.from_date)
