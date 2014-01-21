# encode: utf-8

import urllib2
import html5lib

resp = urllib2.urlopen("http://www.indiegogo.com/project/partial/622016?count=10000&partial_name=activity_pledges")
doc = html5lib.parse(resp.read(), treebuilder="lxml")
divs = doc.findall(".//{http://www.w3.org/1999/xhtml}div")

target = open("_data/donors.yml", "w")

def urlify(inp):
    if inp.startswith("/"):
        return "http://www.indiegogo.com" + inp
    return inp

for div in divs:
    attrs = dict(div.items())
    if not "pledge " in attrs.get("class", ""): continue

    span = div.find(".//{http://www.w3.org/1999/xhtml}span")
    if not span.getchildren():
        name = span.text
        url = ""
    else:
        name = span[0].text.encode("latin-1").decode("utf-8")
        if isinstance(span[0], basestring):
            import pdb
            pdb.set_trace()
        url = urlify(dict(span[0].items())["href"])


    image_data = dict(div.find(".//{http://www.w3.org/1999/xhtml}img").items())
    if image_data["alt"] == "Cubepeep":
        image = "http://robohash.org/" + name
    else:
        image = image_data["src"]

    if name in ("Anonymous", "Anonymous Contributor"):
        continue

    target.write("- name: {0}\n".format(name.encode("utf-8")))
    target.write("  image: {0}\n".format(image.encode("utf-8")))
    if url:
        target.write("  url: {0}\n".format(url))

target.close()