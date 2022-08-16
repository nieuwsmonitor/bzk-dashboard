

import argparse
import requests
import logging
import itertools

from amcatclient import AmcatAPI
from amcat4apiclient import AmcatClient
import amcat4apiclient
from typing import Iterable, List, Tuple, Optional




SET_ARGS = ["name", "provenance"]
IGNORE_ARGS = {"id", "hash", "sets", "parent_hash"}
FIELDS = dict(
    author='keyword',
    publisher='keyword',
    medium='keyword'
)

def get_existing_urls(conn: AmcatClient, index: str, platform: str):
    urls = {a['url']: a["_id"] for a in conn.query(index, filters=dict(platform=platform), fields=["url"])}
    logging.info(f"Found {len(urls)} urls in {conn.host}/index/{index} with platform={platform}")
    return urls


def get_amcatclient(config, name='default'):
    amcat_config = config['amcat'][name]
    logging.info(f"Connecting to AmCAT {amcat_config['username']}@{amcat_config['host']}")
    return amcat4apiclient.AmcatClient(amcat_config['host'], amcat_config['username'], amcat_config['password'])


def chunks(items: Iterable, chunk_size=100) -> Iterable[List]:
    buffer = []
    for item in items:
        buffer.append(item)
        if len(buffer) > chunk_size:
            yield buffer
            buffer = []
    if buffer:
        yield buffer

def upload_batches(conn: AmcatClient, index: str, documents: Iterable[dict],
                   chunk_size=100, extra_properties: dict = None, update_fields=None):
    tot_chunks = list(chunks(documents, chunk_size=chunk_size))
    for i, chunk in enumerate(tot_chunks):
        logging.info(f"uploading batch {i} from {len(tot_chunks)}")
        conn.upload_documents(index, chunk)


def parse_article(art):
    article = {}
    article['art_id'] = art['id']
    article['date'] = art['date']
    article['title'] = art['title']
    article['text'] = art['text']
    article['medium'] = art['medium']
    article['publisher'] = art['publisher']
    article['url'] = art['url']
    return article

def copy_articles(src_api, src_project, src_set):
  articles = src_api.get_articles(src_project, src_set, columns=['id', "date", "publisher","medium","text","title", "url"])
  articles2 = []
  for art in articles:
      art2 = parse_article(art)
      articles2.append(art2)
  return articles2


def check_index(conn: AmcatClient, index: str, fields: Optional[dict] = None):
    if not conn.check_index(index):
        conn.create_index(index)
    if fields:
        conn.set_fields(index, fields)


if __name__ == '__main__':
    parser = argparse.ArgumentParser(epilog=__doc__)
    parser.add_argument("source_url", help='URL of the source '
                        '(e.g. "http://amcat-dev.labs.vu.nl")')
    parser.add_argument("source_project", help='Article set ID in the source',
                        type=int)
    parser.add_argument("source_set", help='Article set ID in the source',
                        type=int)

    args = parser.parse_args()

    fmt = '[%(asctime)s %(levelname)s %(name)s] %(message)s'
    logging.basicConfig(format=fmt, level=logging.INFO)
    logging.getLogger("requests").setLevel(logging.WARNING)

    src = AmcatAPI(args.source_url)
    art3 = copy_articles(src, args.source_project, args.source_set)
    conn=AmcatClient("https://bzk2.nieuwsmonitor.org/api","admin","admin")
    index_name = "bzk"
    check_index(conn, index_name, fields=FIELDS)
    print(f"indexnaam is {index_name} ")

    documents = art3


    upload_batches(conn, index_name, documents)
