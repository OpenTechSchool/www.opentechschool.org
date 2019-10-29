(function() {
  window.OTS = window.OTS || {};
  var meetupcom_key = '38406b383fa43605b6b234269316',
    OTS = window.OTS;

  window.OTS.Widgets = {};

  OTS.Widgets.Loading = React.createClass({
    render: function() {
      return React.DOM.div({},
        React.DOM.img({src: "/images/progress.gif"})
      );
    }
  });


  OTS.Widgets.Event = React.createClass({
    in_box: function() {
      var ev = this.props.event,
        bb = this.props.boundingBox;
      if (!bb) return true; // we always are in without any bounding box
      if (!ev.group.latLng){
        ev.group.latLng = L.latLng(ev.group.group_lat, ev.group.group_lon)
      }

      return bb.contains(ev.group.latLng);
    },

    teamClicked: function() {
      if (this.props.teamClicked) {
        this.props.teamClicked(this.props.event.group);
      }
    },

    render: function() {
      var cal_event = this.props.event,
          date = moment(new Date(cal_event.time)),
          in_box = this.in_box();

      return React.DOM.div({className: in_box ? "event" : "event hidden"}, [
        React.DOM.div({className: "date"}, [
          React.DOM.span({className: "month"}, date.format("MMM")),
          React.DOM.span({className: "day"}, date.format("Do")),
          React.DOM.span({className: "time"}, date.format("HH:mm")),
        ]),
        React.DOM.div({className: "details"}, [
          React.DOM.h3({className: "title"},
            React.DOM.a({href: cal_event.link}, cal_event.name)
          ),
          React.DOM.span({className: "venue"}, cal_event.venue ? cal_event.venue.name : "TBA"),
          this.props.hideTeams ? React.DOM.span() : React.DOM.span({className: "team", onClick: this.teamClicked}, cal_event.group.name.replace("OpenTechSchool", ""))
        ])
      ]);
    }
  });


  OTS.Widgets.EventFilterSwitch = React.createClass({
    render: function() {
      return React.DOM.div({className: this.props.showNonMatching ? "onoffswitch checked" : "onoffswitch", onClick: function(){
        this.props.toggleFilter();
      }.bind(this)},
        React.DOM.div({className: "onoffswitch-label"},
          React.DOM.div({className: "onoffswitch-inner"}),
          React.DOM.div({className: "onoffswitch-switch"})
        )
      );
    }
  });


  OTS.Widgets.EventsList = React.createClass({
    render: function() {
      if (!this.props.events) {return;}
      var eventNodes = this.props.events.map(function (event) {
        return OTS.Widgets.Event({
          event: event,
          teamClicked: this.props.teamClicked,
          hideTeams: this.props.hideTeams,
          boundingBox: this.props.boundingBox
        });
      }.bind(this));
      if (!this.props.showNonMatching){
        eventNodes = eventNodes.filter(function(evt){
          return evt.in_box();
        });
      }
      if (eventNodes.length == 0){
        eventNodes = React.DOM.div({className:"empty"}, "No events scheduled.");
      }
      return React.DOM.div({className:"eventsList"}, eventNodes);
    }
  });


  OTS.Widgets.Team = React.createClass({
    selectTeam: function(){
      var team = this.props.team,
          map = this.props.map;
      map.setZoom(8, {animate: false});
      map.panTo(team.latLng, {animate: false, duration: 1});
    },

    in_box: function() {
      var team = this.props.team,
          bb = this.props.boundingBox;
      if (!bb) return true; // we always are in without any bounding box
      if (!team.latLng){
        team.latLng = L.latLng(team.lat, team.lon)
      }

      return bb.contains(team.latLng);
    },

    render: function() {
      in_box = this.in_box();
      return React.DOM.li({className: in_box ? "team" : "team hidden", onClick:this.selectTeam}, this.props.team.name.replace("OpenTechSchool", ""))
    }
  });


  OTS.Widgets.TeamList = React.createClass({
    render: function() {
      if (!this.props.teams) {
        return React.DOM.ul({className: "teamsList"}, React.DOM.li({}, "loading"));
      }
      var teamNodes = this.props.teams.map(function (team) {
        return OTS.Widgets.Team({
          team: team,
          map: this.props.map,
          boundingBox: this.props.boundingBox
        });
      }.bind(this));
      return React.DOM.ul({className: "teamsList"}, teamNodes);
    }
  });


  OTS.Widgets.Locator = React.createClass({
    loadEventsFromServer: function() {
      $.getJSON('https://api.meetup.com/2/open_events?callback=?', {
        key: meetupcom_key,
        sign: true,
        text: 'opentechschool',
        page: 200
      }).then(function(data){
        this.setState({events: data.results});
      }.bind(this));
    },

    teamClicked: function(team){
      var map = this.props.map;
      map.setZoom(8, {animate: false});
      map.panTo([team.group_lat, team.group_lon], {animate: false, duration: 1});
    },

    getInitialState: function() {
      return {
        events: [],
        filters: [],
        showNonMatching: true,
        teams:[],
        boundingBox: null
      };
    },

    componentWillMount: function() {
      this.loadEventsFromServer();
    },

    toggleFilter: function() {
      this.setState({showNonMatching: !this.state.showNonMatching});
    },

    showAll: function() {
      this.props.map.fitWorld();
    },

    render: function() {
      return React.DOM.div({className:"eventsBox"}, [
        React.DOM.h2({}, [
          "Teams",
          React.DOM.a({onClick: this.showAll, className:"showall"}, "show all"),
        ]),
        OTS.Widgets.TeamList({
          teams: this.state.teams,
          map: this.props.map,
          boundingBox: this.state.boundingBox
        }),
        React.DOM.h2({}, [
          "Upcoming Events",
          OTS.Widgets.EventFilterSwitch({
            showNonMatching: this.state.showNonMatching,
            key:"eventswitcher",
            toggleFilter: this.toggleFilter
          })
        ]),
        OTS.Widgets.EventsList({
          events: this.state.events,
          teamClicked: this.teamClicked,
          showNonMatching: this.state.showNonMatching,
          boundingBox:this.state.boundingBox
        })
      ]);
    }
  });


  var MeetupMixin = {
    componentWillMount: function() {
      var params = $.extend({key: meetupcom_key, sign: true, page: 200}, this.props.params),
          path = this.props.path || 'open_events';
      $.getJSON('https://api.meetup.com/2/' + path + '?callback=?', params)
      .then(function(data){
        this.resultsReceived(data);
      }.bind(this));
    }
  };


  OTS.Widgets.UpcomingEventsPreview = React.createClass({
    componentWillMount: function() {
      var requests = this.props.chapterNames.map(function (chapterName) {
        return $.getJSON('https://api.meetup.com/' + chapterName + '/events?callback=?', {page: this.props.page});
      }.bind(this));
      Promise.all(requests)
      .then(function(results) {
        var events = [];
        for (var i = 0; i < results.length; ++i) {
          events = events.concat(results[i].data);
        }
        events.sort(function(a, b) {
          return a.time < b.time ? -1 : 1;
        });
        if (this.props.page) {
          events =  events.splice(0, this.props.page);
        }
        this.setState({events: events});
      }.bind(this));
    },

    getInitialState: function() {
      return {events: []};
    },

    teamClicked: function(team){
      var url_name = team.urlname.toLowerCase(),
        team_config = this.props.teams[url_name];
      if (team_config && team_config.page){
        window.location.href = "/" + team_config.page;
      }
    },

    render: function(){
      return OTS.Widgets.EventsList({
        events: this.state.events,
        hideTeams: this.props.hideTeams,
        teamClicked: this.teamClicked,
        showNonMatching: true,
        boundingBox: null
      });
    }
  });


  OTS.Widgets.Topic = React.createClass({
    get_url: function() {
      var topic = this.props.topic;
      return ["https://discourse.opentechschool.org/t", topic.slug, topic.id].join("/");
    },

    getInitialState: function() {
      return {highlight: false};
    },

    mouseEnter: function() {
      this.setState({"highlight": true});
    },

    mouseLeave: function() {
      this.setState({"highlight": false});
    },

    render: function() {
      var topic = this.props.topic;
      var users = this.props.users;
      var bumped = moment(topic.bumped_at);

      function getAvatarUrl(template) {
        var url = template.replace("{size}", "25");
        if (url.indexOf('https://avatars.discourse.org/') !== 0) {
          url = 'https://discourse.opentechschool.org' + url;
        }
        return url;
      }

      return React.DOM.div({
        className: this.state.highlight ? "topic highlight" : "topic",
        onMouseEnter: this.mouseEnter, onMouseLeave: this.mouseLeave
      }, [
        React.DOM.h3({className: "topic_title"},
          React.DOM.a({href: this.get_url()}, topic.fancy_title)
        ),
        React.DOM.div({className: "metadata"}, [
          React.DOM.div({className: "posters"}, topic.posters.slice(0, 5).map(function(poster){
            var poster = users[poster.user_id];
            return React.DOM.img({
              className: poster.extras === "latest" ? "avatar latest" : "avatar",
              src: getAvatarUrl(poster.avatar_template),
              title: poster.username,
              alt: poster.username
            });
          })),
          React.DOM.span({className: "bumped"}, bumped.fromNow())
        ])
      ]);
    }
  });


  OTS.Widgets.TopicList = React.createClass({
    render: function() {
      if (!this.props.topics) {
        return null;
      }
      var entryMax = 4; // cut length
      var topicNodes = this.props.topics.slice(0, entryMax).map(function (topic) {
        return OTS.Widgets.Topic({
          topic: topic,
          users: this.props.users
        });
      }.bind(this));
      if (topicNodes.length == 0){
        topicNodes = React.DOM.div({className:"empty"},"No topics found :(");
      }
      return React.DOM.div({className:"topicsList"}, topicNodes);
    }
  });


  var DiscourseMixin = {
    get_discourse_path: function() {
      return 'https://discourse.opentechschool.org' + this.props.path;
    },

    loadTopicsFromServer: function() {
      $.getJSON(this.get_discourse_path())
       .then(function(data){
          var users = {};
          data.users.map(function(user){ users[user.id] = user; });
          this.setState({users: users, topics: data.topic_list.topics, loading: "do"});
        }.bind(this))
       .fail(function(){
          this.setState({loading: "failed"});
        }.bind(this));
    },

    getInitialState: function() {
      return {topics: [], users: {}, loading: true};
    },

    componentWillMount: function() {
      this.loadTopicsFromServer();
    },
  }


  OTS.Widgets.LatestConversations = React.createClass({
    mixins: [DiscourseMixin],
    render: function(){
      if (this.state.loading === true) {
        return OTS.Widgets.Loading();
        // return null;
      }
      return OTS.Widgets.TopicList({
        topics: this.state.topics.filter(function(topic) {
          return topic.pinned_globally !== true;
        }),
        users: this.state.users
      });
    }
  });


  OTS.Widgets.ChapterConversations = React.createClass({
    mixins: [DiscourseMixin],

    render: function() {
      if (this.state.loading === true) {
        return OTS.Widgets.Loading();
        // return null;
      }

      if (this.state.topics.length === 0){
        return null;
        // in case we are empty, don't show anything
        // return React.DOM.div();
      }

      return React.DOM.div({className:"blocky"},
        React.DOM.h3({className:"head"},
          "Latest Conversations ",
          React.DOM.a({
            href:this.get_discourse_path().replace(".json", ""),
            className: "tiny_button"
          }, "join")
        ),
        OTS.Widgets.TopicList({
          topics: this.state.topics,
          users: this.state.users
        })
      );
    }
  });


  OTS.Widgets.MembersCounter = React.createClass({
    componentWillMount: function() {
      $.getJSON('https://api.meetup.com/' + this.props.chapterName + '?callback=?')
      .then(function(data) {
        var group = data.data;
        this.setState({members: group.members, who: group.who});
      }.bind(this));
    },

    getInitialState: function() {
      return {members: "", who: ""};
    },

    render: function(){
      return React.DOM.span({}, this.state.members + " " + this.state.who);
    }
  });


  OTS.Widgets.EventsCurricula = React.createClass({
    mixins: [MeetupMixin],

    getDefaultProps: function(){
      return {
        path: 'events',
      };
    },

    getInitialState: function(){
      var workshops = Object.keys(this.props.curricula).map(function(title) {
        return OTS.Widgets.Curriculum(
          $.extend(
            {key: title, ages: this.props.ages},
            this.props.curricula[title]
          )
        );
      }.bind(this));
      return {workshops: workshops};
    },

    render: function(){
      return React.DOM.ul({}, this.state.workshops);
    },

    resultsReceived: function(data){
      data.results.forEach(function(evt) {
        this.state.workshops.forEach(function(workshop) {
          if (workshop.matches(evt.name)) {
            workshop.count(evt);
          }
        });
      }.bind(this));
    },
  });


  OTS.Widgets.Curriculum = React.createClass({
    getInitialState: function(){
      return {occurrences: 0, last: null};
    },

    matches: function(desc){
      var title = this.props.key;
      var matches = this.props.matches;
      return desc.match(new RegExp(title, "i")) ||
        (matches && matches.some(function(m){
          return new RegExp(m.source, "i").test(desc);
        }));
    },

    count: function(evt){
      this.setState({
        occurrences: this.state.occurrences+1,
        last: Math.max(evt.time, this.state.last),
      });
    },

    render: function(){
      // moment().subtract(1, "days")
      var style = "never";
      var tooltip = "never";

      if (this.state.occurrences) {
        var styles = this.props.ages.filter(function(age){
          return moment().subtract(age[1]+'s', age[0]).valueOf() > this.state.last;
        }.bind(this));
        style = styles.length ? styles[styles.length-1][2] : "";
        var last = moment(this.state.last);
        tooltip = last.fromNow() + " (" + last.format("ddd, MMM Do YYYY") + ")";
      }

      return React.DOM.li({className: style, title: tooltip},
        React.DOM.span({className: "title"}, this.props.key),
        React.DOM.span({className: "occur"}, this.state.occurrences)
      );
    },
  });


  OTS.Widgets.TeamList = React.createClass({
    componentWillMount: function() {
      var team = this.props.team || 'opentechschool';
      $.getJSON('https://discourse.opentechschool.org/groups/' + team + '/members.json?limit=100')
        .then(function(data){
          // resort items depending on last seen
          // prefer last active users
          var members = data.members;
          members.sort(function(a, b){
            if (a.last_seen_at > b.last_seen_at){
              return -1;
            }
            return 1;
          })
          this.setState({
            loading: false,
            members: members
          });
        }.bind(this))
        .fail(function(){
          console.error('could not load discourse members');
        });
    },

    getInitialState: function(){
      return {loading: true, members: null}
    },

    render: function(){
      if (this.state.loading){
        return OTS.Widgets.Loading();
      }

      var users = [];
      for (var i = 0; i < this.state.members.length; i++) {
        var member = this.state.members[i],
            thumbnail = member.avatar_template.replace("{size}", "256");
        if (thumbnail.slice(0, 4) != 'http')
          thumbnail = "//discourse.opentechschool.org/" + thumbnail;
        users.push(
          React.DOM.li({className: "member", title: member.name},
            React.DOM.img({src: thumbnail, alt: member.username}),
            React.DOM.h3({className: "title"},
              React.DOM.span({}, member.name), ' ',
              React.DOM.a({href: "//discourse.opentechschool.org/users/" + member.username, target:"_blank", className: "username"}, "@" + member.username)
            ),
            React.DOM.span({className: "title"}, member.title)
          )
        );
      }

      return React.DOM.ul({className: "float_list float_list_4 team_list"}, users);
    }
  })
})();
