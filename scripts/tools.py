import argparse
import json
import logging
import tempfile
from argparse import Namespace
from datetime import datetime
from pathlib import Path
from typing import Iterable, List, Tuple, Optional

import httplib2
import toml
from amcat4apiclient import amcat4apiclient, AmcatClient

from googleapiclient.discovery import build
from oauth2client import file, client, tools

def get_argument_parser():
    logging.basicConfig(level=logging.INFO, format='[%(asctime)s %(name)-12s %(levelname)-5s] %(message)s')
    parser = argparse.ArgumentParser()
    parser.add_argument("--config", help="Configuration file", default="config_bzk.toml")
    parser.add_argument("--amcat", help="Amcat host to connect to (as defined in config)", default="default")
    parser.add_argument("--from-date", help="Stop parsing at this date", type=datetime.fromisoformat)
    return parser


def setup(parser: argparse.ArgumentParser, fields: Optional[dict] = None) -> Tuple[Namespace, dict, dict, AmcatClient]:
    args = parser.parse_args()
    print(args)
    logging.basicConfig(level=logging.INFO, format='[%(asctime)s %(name)-12s %(levelname)-5s] %(message)s')
    # When running locally, disable OAuthlib's HTTPs verification. When
    # running in production *do not* leave this option enabled.
    # os.environ['OAUTHLIB_INSECURE_TRANSPORT'] = '1'
    config = toml.load(args.config)
    config_index = config['amcat'][args.amcat]['index']
    conn = get_amcatclient(config, args.amcat)
    check_index(conn, config_index, fields)
    return args, config, conn


def get_amcatclient(config, name='default'):
    amcat_config = config['amcat'][name]
    logging.info(f"Connecting to AmCAT {amcat_config['username']}@{amcat_config['host']}")
    return amcat4apiclient.AmcatClient(amcat_config['host'], amcat_config['username'], amcat_config['password'])


def upload_batches(conn: AmcatClient, index: str, documents: Iterable[dict], platform: str, omroep: str,
                   chunk_size=100, extra_properties: dict = None, update_fields=None):
    urls = get_existing_urls(conn, index, platform)
    for chunk in chunks(documents, chunk_size=chunk_size):
        new = [d for d in chunk if d['url'] not in urls]
        old = [d for d in chunk if d['url'] in urls]
        if old and update_fields:
            logging.info(f"Updating {len(old)} documents in {conn.host}/index/{index}")
            for doc in old:
                docid = urls[doc['url']]
                body = {field: value for (field, value) in doc.items() if field in update_fields}
                conn.update_document(index, docid, body)
        logging.info(f"Uploading {len(new)} new documents to {conn.host}/index/{index}")
        for doc in new:
            if extra_properties:
                doc.update(extra_properties)
            doc['platform'] = platform
            doc['omroep'] = omroep
            if not doc.get('title', '').strip():
                #open("/tmp/test.json", "w").write(json.dumps(doc, default=amcat4apiclient.serialize))
                #raise Exception("Document without title, saved to /tmp/test.json")
                doc['title'] = "-"
        conn.upload_documents(index, new)


def chunks(items: Iterable, chunk_size=100) -> Iterable[List]:
    buffer = []
    for item in items:
        buffer.append(item)
        if len(buffer) > chunk_size:
            yield buffer
            buffer = []
    if buffer:
        yield buffer


def check_index(conn: AmcatClient, index: str, fields: Optional[dict] = None):
    if not conn.check_index(index):
        conn.create_index(index)
    if fields:
        conn.set_fields(index, fields)


def get_existing_urls(conn: AmcatClient, index: str, platform: str):
    urls = {a['url']: a["_id"] for a in conn.query(index, filters=dict(platform=platform), fields=["url"])}
    logging.info(f"Found {len(urls)} urls in {conn.host}/index/{index} with platform={platform}")
    return urls


def get_google_service(client_secret, filename, scope, *api):
    storage = file.Storage(Path.cwd() / filename)
    credentials = storage.get()
    if credentials is None or credentials.invalid:
        # Write credentials to temporary file, rewind, and start auth flow
        with tempfile.NamedTemporaryFile(suffix=".json", mode="w") as f:
            f.write(client_secret)
            f.seek(0)
            flow = client.flow_from_clientsecrets(f.name, scope=scope, message="Invalid credentials")
            flags = argparse.ArgumentParser(parents=[tools.argparser]).parse_args([])
            credentials = tools.run_flow(flow, storage, flags)
    http = credentials.authorize(http=httplib2.Http())
    return build(*api, http=http)
