import sys
try:
    import argparse
except ImportError:
    print "Please run with python >2.7"
    sys.exit(1)

from datetime import datetime

import json
import urllib2

parser = argparse.ArgumentParser(description='')
parser.add_argument('--meetup_key')
parser.add_argument('groups', metavar="G", nargs='*')
args = parser.parse_args()

GROUPS_URL = "https://api.meetup.com/find/groups?text=opentechschool&radius=global&page=200"
EVENTS_URL = "https://api.meetup.com/2/events?group_urlname={0}&page=200&status=past"

today = datetime.today()

def get_meetup_data(url):
    if not args.meetup_key:
        return None

    resp = urllib2.urlopen("{0}&key={1}".format(url, args.meetup_key))
    return json.loads(resp.read())

KEYWORDS = [
    ("python", "django"),
    ("javascript", "js"),
    ("html", "css"),
    ("git", ),
    ("hardware", "arduino", "mobile"),
    ("reoccurring",),
    ("workshop",)
]

def get_latest_events(urlname):
    filtered = {
        "python": [],
        "reoccurring": [],
        "javascript": [],
        "html": [],
        "workshop": [],
        "git": [],
        "hardware": [],
        "arduino": [],
        "other": []
    }
    events = get_meetup_data(EVENTS_URL.format(urlname))["results"]
    # they come oldest first, reverse to start looking from the newest
    events.reverse()
    for event in events:
        try:
            int(event["id"])
        except ValueError:
            # yes, the 'type' of the ID tells us this is reoccurring.
            filtered["reoccurring"].append(event)
            continue

        # name based filtering
        lowered_name = event["name"].lower()
        lowered_desc = event["description"].lower()
        for to_match in (lowered_name, lowered_desc):
            matched = False
            for matchers in KEYWORDS:
                key = matchers[0]
                for match in matchers:
                    if match in to_match:
                        matched = True
                        filtered[key].append(event)
                        break
                if matched: break

            if matched: break


        filtered["other"].append(event)

    print("## {0}:".format(urlname.replace("opentechschool-", "").title()))
    for key in [x[0] for x in KEYWORDS] + ["other"] :
        if not filtered[key]:
            continue
        print("   * {0}:".format(key))
        for event in filtered[key][:5]:
            delta = today - datetime.fromtimestamp(event["time"] / 1000)
            print ("     - {0:>4} days ago: {1}".format(delta.days, event["name"].encode("utf-8")))

    sys.stdout.flush()


def main():
    groups = args.groups or [x["urlname"] for x in get_meetup_data(GROUPS_URL)]
    for group in groups:
        get_latest_events(group)


if __name__ == "__main__":
    main()
    
