# encode: utf-8

import urllib2
import html5lib

resp = urllib2.urlopen("http://www.indiegogo.com/project/partial/622016?count=10000&partial_name=activity_pledges")
doc = html5lib.parse(resp.read(), treebuilder="lxml")
divs = doc.findall(".//{http://www.w3.org/1999/xhtml}div")

target = open("_data/donors.yml", "w")
target.write("Donors:")

def urlify(inp):
    if inp.startswith("/"):
        return "http://www.indiegogo.com" + inp
    return inp

for div in divs:
    attrs = dict(div.items())
    if not "pledge " in attrs.get("class", ""): continue

    image = urlify(dict(div.find(".//{http://www.w3.org/1999/xhtml}img").items())["src"])

    span = div.find(".//{http://www.w3.org/1999/xhtml}span")
    if not span.getchildren():
        name = span.text
        url = ""
    else:
        name = span[0].text
        if isinstance(span[0], basestring):
            import pdb
            pdb.set_trace()
        url = urlify(dict(span[0].items())["href"])

    target.write("\n  - name: {0}".format(name.encode("utf-8")))
    target.write("\n    image: {0}".format(image))
    if url:
        target.write("\n    url: {0}".format(url))

target.close()