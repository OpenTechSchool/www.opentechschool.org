(function() {
	window.OTS = window.OTS || {};
	var meetupcom_key = '38406b383fa43605b6b234269316',
		OTS = window.OTS;

	window.OTS.Widgets = {};


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
          							React.DOM.a({href: cal_event.event_url}, cal_event.name)
          						),
          					React.DOM.span({className: "venue"}, cal_event.venue ? cal_event.venue.name : "TBA"),
          					React.DOM.span({className: "team", onClick: this.teamClicked}, cal_event.group.name.replace("OpenTechSchool", ""))
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
              	return OTS.Widgets.Event({event: event,
              				teamClicked: this.props.teamClicked,
                            boundingBox: this.props.boundingBox});
            	}.bind(this));
            if (!this.props.showNonMatching){
              eventNodes = eventNodes.filter(function(evt){
                return evt.in_box();
              });
            }
            if (eventNodes.length == 0){
              eventNodes = React.DOM.div({className:"empty"},"No events found :( ");
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
              return React.DOM.ul({className: "teamsList"},
                  React.DOM.li({}, "loading"));
            }
            var teamNodes = this.props.teams.map(function (team) {
              return OTS.Widgets.Team({team: team,
              		map: this.props.map, boundingBox: this.props.boundingBox});
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
                  }.bind(this)
              );
          },
          teamClicked: function(team){
          	var map = this.props.map;
          	map.setZoom(8, {animate: false});
            map.panTo([team.group_lat, team.group_lon],
            		{animate: false, duration: 1});
          },
          getInitialState: function() {
            return {events: [], filters: [],
                    showNonMatching: true,
                    teams:[], boundingBox: null};
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
                React.DOM.h2({}, [ "Teams",
                    React.DOM.a({onClick: this.showAll, className:"showall"}, "show all"),
                  ]),
                OTS.Widgets.TeamList({teams: this.state.teams,
                		  map: this.props.map,
                          boundingBox: this.state.boundingBox}),
                React.DOM.h2({}, ["Upcoming Events",
                    OTS.Widgets.EventFilterSwitch({
                          showNonMatching: this.state.showNonMatching,
                          key:"eventswitcher",
                          toggleFilter: this.toggleFilter})
                    ]),
                OTS.Widgets.EventsList({events: this.state.events,
                			teamClicked: this.teamClicked,
                            showNonMatching: this.state.showNonMatching,
                            boundingBox:this.state.boundingBox})
              ]);
          }
        });

    OTS.Widgets.UpcomingEventsPreview = React.createClass({
    	loadEventsFromServer: function() {
            $.getJSON('https://api.meetup.com/2/open_events?callback=?', {
                key: meetupcom_key,
                sign: true,
                text: 'opentechschool',
                page: 5
              }).then(function(data){
                    this.setState({events: data.results});
                  }.bind(this)
              );
          },
          teamClicked: function(team){
          	console.log(team);
          },
          getInitialState: function() {
            return {events: []};
          },
          componentWillMount: function() {
            this.loadEventsFromServer();
          },
          render: function(){
          	return OTS.Widgets.EventsList({events: this.state.events,
          					teamClicked: this.teamClicked,
                            showNonMatching: true, boundingBox: null})
          }
    });

    OTS.Widgets.Topic = React.createClass({
    	get_url: function() {
    		var topic = this.props.topic;
    		return ["http://discourse.opentechschool.org/t",
    				topic.slug, topic.id].join("/");
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
          var topic = this.props.topic,
              users = this.props.users,
              bumped = moment(topic.bumped_at);


          return React.DOM.div({
          				className: this.state.highlight ? "topic highlight" : "topic",
          				onMouseEnter: this.mouseEnter, onMouseLeave: this.mouseLeave}, [
                    React.DOM.h3({className: "topic_title"},
                        React.DOM.a({href: this.get_url()}, topic.fancy_title)
                        ),
                    React.DOM.div({className: "metadata"}, [ 
                    	React.DOM.div({className: "posters"}, topic.posters.slice(0, 5).map(function(poster){
                    			var poster = users[poster.user_id];
                    			return React.DOM.img({
                    				className: poster.extras === "latest" ? "avatar latest" : "avatar",
                    				src: poster.avatar_template.replace("{size}", "25"),
                    				title: poster.username,
                    				alt: poster.username});
                    			})
                    		), 
                    	React.DOM.span({className: "bumped"},
                    		bumped.fromNow())
                    	])
                    ]);
        }
    });

    OTS.Widgets.TopicList = React.createClass({

          render: function() {
            if (!this.props.topics) {return;}
            var topicNodes = this.props.topics.slice(0,5).map(function (topic) {
              	return OTS.Widgets.Topic({topic: topic, users: this.props.users});
            	}.bind(this));
            if (topicNodes.length == 0){
              topicNodes = React.DOM.div({className:"empty"},"No topics found :( ");
            }
            return React.DOM.div({className:"topicsList"}, topicNodes);
          }
    });

    OTS.Widgets.LatestConversations = React.createClass({
    	loadEventsFromServer: function() {
            $.getJSON('http://discourse.opentechschool.org' + this.props.path)
             .then(function(data){
             	var users = {};

             	data.users.map(function(user){ users[user.id] = user; });
             	this.setState({users: users, topics: data.topic_list.topics});

			    }.bind(this)
              );
          },
          getInitialState: function() {
            return {topics: [], users: {}};
          },
          componentWillMount: function() {
            this.loadEventsFromServer();
          },
          render: function(){
          	return OTS.Widgets.TopicList({topics: this.state.topics,
                            users: this.state.users})
          }
    })
})();