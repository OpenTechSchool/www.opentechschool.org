import sys
try:
    import argparse
except ImportError:
    print("Please run with python >2.7")
    sys.exit(1)

try:
    import gdata.apps.groups.client
except ImportError:
    print("Please install py-gdata")
    sys.exit(1)

from getpass import getpass

import json
import urllib2
import html5lib
import re
import os

ABS_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

def _find_group(filename):
    name = filename.split(".")[0]
    meetup_group = "opentechschool-" + name
    with open(os.path.join(ABS_ROOT, "_cities", filename)) as f:
        for l in f:
            if l.startswith("meetup:"):
                group_name = l[7:].strip()
                if group_name:
                    meetup_group = group_name
                    break
    return (name, meetup_group)


GPLUS_RE = re.compile(r'.*data-plusonecount="(\d*?)".*')
GROUPS = map(_find_group, os.listdir(os.path.join(ABS_ROOT, "_cities")))

ERRORS = []

TOTAL_STATS = {}


parser = argparse.ArgumentParser(description='')
parser.add_argument('--domain', default="opentechschool.org")
parser.add_argument('--email', default="ben@opentechschool.org")
parser.add_argument('--password')
parser.add_argument('--meetup_key')

parser.add_argument('--exclude-social-media', action="store_true")
parser.add_argument('--exclude-meetups', action="store_true")
parser.add_argument('--exclude-global-lists', action="store_true")
parser.add_argument('--include-events', action="store_false")
parser.add_argument('--group', action="append")
parser.add_argument('--since', action="store")
args = parser.parse_args()

BASE_LINK = "https://groups.google.com/a/%s/forum/?fromgroups#!forum/" % args.domain
#
# password = args.password
# if not password:
#     password = getpass("Password please: ")


def apply_stats(**stats):
    global TOTAL_STATS

    for key, value in stats.iteritems():
        try:
            TOTAL_STATS[key] += value
        except KeyError:
            TOTAL_STATS[key] = value


def _list_all_members(group_client, group_id):
    """Lists all members including members of sub-groups.

    Args:
    group_client: gdata.apps.groups.client.GroupsProvisioningClient instance.
    group_id: String, identifier of the group from which members are listed.

    Returns:
    members_list: List containing the member_id of group members.
    """
    members_list = []
    try:
        group_members = group_client.RetrieveAllMembers(group_id)
        for member in group_members.entry:
            if member.member_type == 'Group':
                temp_list = _list_all_members(group_client, member.member_id)
                members_list.extend(temp_list)
            else:
                members_list.append(member.member_id)
    except gdata.client.RequestError as e:
        ERRORS.append('Request error: %s %s %s' % (e.status, e.reason, e.body))
    return members_list


def global_discuss_count(client):
    members = len(_list_all_members(client, "discuss.global@opentechschool.org"))
    print(" *  {} users on discuss global".format(members))
    return members


def _filter_members(client, listing, category):
    total_member = set([])
    groups_count = 0
    for group in listing.entry:
        name = group.group_name
        email = group.group_id
        if "-deleted-" in email:
            continue
        mail_handle = email.split("@", 1)[0]

        try:
            group_cat, group_name = mail_handle.split(".", 2)
            if group_cat != category:
                raise ValueError
        except ValueError:
            continue

        members = set(_list_all_members(client, group.group_id))

        total_member |= members
        groups_count += 1
    return total_member, groups_count


def get_coaches_num(client):
    groups = client.RetrieveAllGroups()
    coaches, topics_count = _filter_members(client, groups, "coaches")

    print(" * A total of {0} (unique) coaches in {1} different topics.".format(len(coaches), topics_count))

    return len(coaches), topics_count


def get_team_num(client):
    groups = client.RetrieveAllGroups()
    team, topics_count = _filter_members(client, groups, "team")

    print(" * A total of {0} (unique) team members working as {1} teams.".format(len(team), topics_count))

    return len(team), topics_count


def get_groups_client():
    client = gdata.apps.groups.client.GroupsProvisioningClient(domain=args.domain)
    client.ClientLogin(email=args.email, password=password, source='apps')
    return client


def get_meetup_events(group):
    if not args.meetup_key:
        return None

    url ="https://api.meetup.com/2/events?&status=past&group_urlname={0}&page=1000&key={1}".format(group, args.meetup_key)
    if args.since:
        url += "&time={0},1m".format(args.since)

    resp = urllib2.urlopen(url)
    results = json.loads(resp.read())["results"]

    workshops = [x for x in results
                if "workshop" in x["name"].lower() or "workshop" in x["description"].lower()]

    workshops_count = len(workshops)
    workshops_participants_count = sum([x["yes_rsvp_count"] for x in workshops])

    total_participants_count = sum([x["yes_rsvp_count"] for x in results])

    return {"total_events": len(results),
            "total_workshops": workshops_count,
            "total_events_participants": total_participants_count,
            "total_workshops_participants": workshops_participants_count}

def get_meetup_learners_count(group):
    if not args.meetup_key:
        return None

    resp = urllib2.urlopen("https://api.meetup.com/2/groups?group_urlname={0}&key={1}".format(group, args.meetup_key))
    try:
        return json.loads(resp.read())["results"][0]["members"]
    except IndexError:
        return 0



def fetch_facebook_likes(account):
    resp = urllib2.urlopen("http://m.facebook.com/{}".format(account))
    doc = html5lib.parse(resp.read(), treebuilder="lxml")
    fw_elem = doc.find('.//{http://www.w3.org/1999/xhtml}span[@class="mfss fcg"]')
    if not fw_elem:
        ERRORS.append("Likes item not found for facebook account {}".format(account))
        return 0
    return int(fw_elem.getchildren()[-1].text.split()[0])


def fetch_google_plusses(account):
    resp = urllib2.urlopen("https://plus.google.com/app/basic/{}/".format(account))
    search_res = GPLUS_RE.search(resp.read())
    if not search_res:
        ERRORS.append("Couldn't read plusses of {}".format(account))
        return 0

    return int(search_res.group(1))

def fetch_twitter_followers(account):
    resp = urllib2.urlopen("http://twitter.com/{}".format(account))
    doc = html5lib.parse(resp.read(), treebuilder="lxml")
    fw_elem = doc.find('.//{http://www.w3.org/1999/xhtml}a[@data-element-term="follower_stats"]')
    if not fw_elem:
        ERRORS.append("Follow item not found for twitter account {}".format(account))
        return 0
    return int(fw_elem.getchildren()[0].text)


def compile_social_media():
    print("  * Social Media:")
    print("    - twitter:")
    total_followers = 0
    for name in ("OpenTechSchool", "OTS_BLN", "OTS_STHLM", "OTS_Do"):
        followers_count = fetch_twitter_followers(name)
        print("      - {} has {} followers".format(name, followers_count))
        total_followers += followers_count

    facebook_likes = fetch_facebook_likes("opentechschool")
    total_followers += facebook_likes

    print("    - Facebook (OpenTechSchool): {} likes".format(facebook_likes))

    google_plusses = fetch_google_plusses("114834784518588736271")
    total_followers += google_plusses

    print("    - Google+ (OpenTechSchool): plussed {} times".format(google_plusses))
    print("--------------")
    print("total of {} non-unique followers".format(total_followers))
    return total_followers

def make_group_stats():
    global TOTAL_STATS
    g_client = None
    if not args.exclude_global_lists:
        g_client = get_groups_client()
        count_global = global_discuss_count(g_client)
        count_coaches, count_topics = get_coaches_num(g_client)
        count_team, count_chapters = get_team_num(g_client)

    groups = args.group or GROUPS

    print(" * Chapters :")
    for chapter in groups:
        chapter, meetup_name = chapter
        learners_count = get_meetup_learners_count(meetup_name)
        team_members = []  #_list_all_members(g_client, "team.{}@opentechschool.org".format(team_list))

        apply_stats(total_learners=learners_count)

        to_print = "    * {}: Team of {} for {} learners ".format(chapter.title(), team_members and len(team_members) or "N/A", learners_count or "N/A")

        if True or args.include_events:
            stats = get_meetup_events("opentechschool-{}".format(chapter))

            apply_stats(**stats)

            to_print += ": {total_events} ({total_events_participants}) events total, including at least {total_workshops} Workshops ({total_workshops_participants}) ".format(**stats)

        print(to_print)


    print(" --------- ")
    print("Total of {} learners globally".format(TOTAL_STATS["total_learners"]))

    if True or args.include_events:
        print("Total of {total_events} ({total_events_participants}) events of which at least {total_workshops} were workshops ({total_workshops_participants})".format(**TOTAL_STATS))

if __name__ == "__main__":
    if not args.exclude_meetups:
        make_group_stats()
    if not args.exclude_social_media:
        compile_social_media()


    if ERRORS:
        print("")
        print(" ---- Errors:")
        for e in ERRORS:
            print(e)
