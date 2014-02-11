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
        render: function() {
          var cal_event = this.props.event,
              in_box = this.in_box();

          return React.DOM.div({className: in_box ? "event" : "event hidden"}, [
                    React.DOM.p({className:"team"}, cal_event.group.name),
                    React.DOM.h3({className: "post_title"},
                        React.DOM.a({href: cal_event.event_url}, cal_event.name)),
                    React.DOM.p({className:"date"},
                        React.DOM.span({},
                          moment(new Date(cal_event.time)).format('dddd, MMM Do, HH:mm'))
                        ),
                    React.DOM.p({},
                        cal_event.venue ? cal_event.venue.name : "TBA")
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
              return OTS.Widgets.Team({team: team, boundingBox: this.props.boundingBox});
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
            map.fitWorld();
          },
          render: function() {
            return React.DOM.div({className:"eventsBox"}, [
                React.DOM.h2({}, [ "Teams",
                    React.DOM.a({onClick: this.showAll, className:"showall"}, "show all"),
                  ]),
                OTS.Widgets.TeamList({teams: this.state.teams,
                          boundingBox: this.state.boundingBox}),
                React.DOM.h2({}, ["Upcoming Events",
                    OTS.Widgets.EventFilterSwitch({
                          showNonMatching: this.state.showNonMatching,
                          key:"eventswitcher",
                          toggleFilter: this.toggleFilter})
                    ]),
                OTS.Widgets.EventsList({events: this.state.events,
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
          getInitialState: function() {
            return {events: []};
          },
          componentWillMount: function() {
            this.loadEventsFromServer();
          },
          render: function(){
          	return OTS.Widgets.EventsList({events: this.state.events,
                            showNonMatching: true, boundingBox: null})
          }
    });
})();