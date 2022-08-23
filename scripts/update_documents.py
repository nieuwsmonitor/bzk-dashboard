import amcat4apiclient
from amcat4apiclient import amcat4apiclient, AmcatClient
import logging




conn = amcat4apiclient.AmcatClient('https://bzk2.nieuwsmonitor.org/api', 'admin', 'admin')
index='bzk'
results = list(conn.query(index, filters={"publisher": "NRC Handelsblad"}, fields=["_id"]))
for art, index in results:
    conn.update_document(index, art['_id'], {"publisher": "NRC"})

