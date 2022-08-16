import amcat4apiclient
from amcat4apiclient import amcat4apiclient, AmcatClient
import logging




amcatclient = amcat4apiclient.AmcatClient('http://localhost:5000', 'admin', 'admin')
print(amcatclient)

for art in amcatclient.query('bzk'):
    docid = art['_id']
    amcatclient.delete_document('bzk', docid)
    print(docid)