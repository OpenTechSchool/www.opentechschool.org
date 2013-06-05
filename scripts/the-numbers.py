import sys
try:
    import argparse
except ImportError:
    print "Please run with python >2.7"
    sys.exit(1)

try:
    import gdata.apps.groups.client
except ImportError:
    print "Please install py-gdata"
    sys.exit(1)


parser = argparse.ArgumentParser(description='')
parser.add_argument('email')
parser.add_argument('--domain', default="opentechschool.org")
parser.add_argument('--password')

args = parser.parse_args()

BASE_LINK = "https://groups.google.com/a/%s/forum/?fromgroups#!forum/" % args.domain

HEADER = """
"""

FORMAT_ENTRY = """
#### [{name}]({link})

{desc}
"""

password = args.password
if not password:
    password = raw_input("Password please: ")



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
  except gdata.client.RequestError, e:
    print 'Request error: %s %s %s' % (e.status, e.reason, e.body)
  return members_list

def global_discuss_count(client):
    members = len(_list_all_members(client, "discuss.global@opentechschool.org"))
    print("With {} users on discuss global".format(members))
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

    print(" * A total of {0} (unique) team members in {1} on different topics.".format(len(team), topics_count))

    return len(team), topics_count


def get_groups_client():
    client = gdata.apps.groups.client.GroupsProvisioningClient(domain=args.domain)
    client.ClientLogin(email=args.email, password=password, source='apps')
    return client

g_client = get_groups_client()
count_global = global_discuss_count(g_client)
count_coaches, count_topics = get_coaches_num(g_client)
count_team, count_chapters = get_team_num(g_client)

