/* jshint ignore:start */

/* jshint ignore:end */

define('example/app', ['exports', 'ember', 'ember/resolver', 'ember/load-initializers', 'example/config/environment'], function (exports, Ember, Resolver, loadInitializers, config) {

  'use strict';

  Ember['default'].MODEL_FACTORY_INJECTIONS = true;

  var App = Ember['default'].Application.extend({
    modulePrefix: config['default'].modulePrefix,
    podModulePrefix: config['default'].podModulePrefix,
    Resolver: Resolver['default']
  });

  loadInitializers['default'](App, config['default'].modulePrefix);

  exports['default'] = App;

});
define('example/components/gravatar-display', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Component.extend({

    size: 80,

    d: "identicon",

    email: null,

    tagName: "img",

    attributeBindings: ["url:src", "size:width", "size:height"],

    emailHash: (function () {
      var email = this.get("email");
      return email && md5(email);
    }).property("email"),

    url: (function () {
      var emailHash = this.get("emailHash"),
          size = this.get("size"),
          d = this.get("d");
      return "http://www.gravatar.com/avatar/" + emailHash + "?s=" + size + "&d=" + d;
    }).property("emailHash", "size")

  });

});
define('example/components/react-outlet', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Component.extend({

    elementId: "react-outlet",

    didInsertElement: function didInsertElement() {
      var element = this.get("element");
      window.didInsertReactOutlet(element);
      this._super();
    },

    willDestroyElement: function willDestroyElement() {
      var element = this.get("element");
      window.willDestroyReactOutlet(element);
      this._super();
    }

  });

});
define('example/components/syntax-highlight', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  /* global Prism */

  exports['default'] = Ember['default'].Component.extend({

    language: "markup",
    tagName: "pre",

    languageClass: (function () {
      return "language-" + this.get("language");
    }).property("language"),

    didInsertElement: function didInsertElement() {
      this._super();
      var el = this.$("code")[0];
      Prism.highlightElement(el);
    }

  });

});
define('example/controllers/profiles/index', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Controller.extend({
    profiles: Ember['default'].computed.alias("model"),
    queryParams: ["page"],

    nextPage: (function () {
      var page = this.get("page") || 1;
      return parseInt(page) + 1;
    }).property("page"),

    prevPage: (function () {
      var page = this.get("page");
      return page > 1 && parseInt(page) - 1;
    }).property("page"),

    emberVersion: (function () {
      return Ember['default'].VERSION;
    }).property(),

    selection: Ember['default'].computed.filterBy("profiles", "isSelected")
  });

});
define('example/controllers/profiles/item', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Controller.extend({

    isSelected: false

  });

});
define('example/helpers/time-ago', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Handlebars.makeBoundHelper(function (date) {
    return moment(date).fromNow();
  });

});
define('example/initializers/app-version', ['exports', 'example/config/environment', 'ember'], function (exports, config, Ember) {

  'use strict';

  var classify = Ember['default'].String.classify;
  var registered = false;

  exports['default'] = {
    name: "App Version",
    initialize: function initialize(container, application) {
      if (!registered) {
        var appName = classify(application.toString());
        Ember['default'].libraries.register(appName, config['default'].APP.version);
        registered = true;
      }
    }
  };

});
define('example/initializers/export-application-global', ['exports', 'ember', 'example/config/environment'], function (exports, Ember, config) {

  'use strict';

  exports.initialize = initialize;

  function initialize(container, application) {
    var classifiedName = Ember['default'].String.classify(config['default'].modulePrefix);

    if (config['default'].exportApplicationGlobal && !window[classifiedName]) {
      window[classifiedName] = application;
    }
  }

  ;

  exports['default'] = {
    name: "export-application-global",

    initialize: initialize
  };

});
define('example/models/profile', ['exports', 'ember', 'example/models/tag'], function (exports, Ember, Tag) {

  'use strict';

  /* global faker */

  var Profile = Ember['default'].Object.extend({
    name: null,
    email: null,
    createdAt: null,
    tags: null
  });

  var cache = [];

  Profile.reopenClass({

    load: function load(page) {
      page = page || 1;
      if (cache[page]) {
        return cache[page];
      }
      var res = [];
      for (var i = 0; i < 100; i++) {
        res.push(this.generate());
      }
      return cache[page] = res;
    },

    generate: function generate() {
      var tags = [];
      for (var num = Math.random() * 6, j = 0; j < num; j++) {
        tags.push(Tag['default'].generate());
      }
      return this.create({
        name: faker.name.findName(),
        email: faker.internet.email(),
        createdAt: faker.date.recent(),
        tags: tags
      });
    }

  });

  exports['default'] = Profile;

});
define('example/models/tag', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  /* global faker */

  var Tag = Ember['default'].Object.extend({
    name: null
  });

  Tag.reopenClass({

    generate: function generate() {
      return this.create({
        name: faker.company.bsAdjective()
      });
    }

  });

  exports['default'] = Tag;

});
define('example/react/example', ['exports'], function (exports) {

  'use strict';

  exports['default'] = React.createClass({
    displayName: "example",

    render: function render() {
      return React.createElement("p", null, "This text is rendered with React");
    }

  });

});
define('example/react/gravatar-display', ['exports'], function (exports) {

  'use strict';

  exports['default'] = React.createClass({
    displayName: "gravatar-display",

    getDefaultProps: function getDefaultProps() {
      return {
        size: 80,
        d: "identicon"
      };
    },

    getUrl: function getUrl() {
      var emailHash = md5(this.props.email),
          size = this.props.size,
          d = this.props.d;
      return "http://www.gravatar.com/avatar/" + emailHash + "?s=" + size + "&d=" + d;
    },

    render: function render() {
      return React.createElement("img", { className: "gravatar-display-component", src: this.getUrl(), width: this.props.size, height: this.props.size });
    }

  });

});
define('example/react/profiles/index', ['exports', 'example/react/profiles/item', 'example/models/profile'], function (exports, Item, Profile) {

  'use strict';



  var Link = ReactRouter.Link;

  exports['default'] = React.createClass({
    displayName: "index",

    getInitialState: function getInitialState() {
      return {
        selection: [],
        profiles: []
      };
    },

    getPage: function getPage() {
      return parseInt(this.props.query.page || 1);
    },

    componentWillMount: function componentWillMount() {
      this.setState({
        profiles: Profile['default'].load(this.getPage())
      });
    },

    componentWillReceiveProps: function componentWillReceiveProps(props) {
      this.setState({
        profiles: Profile['default'].load(parseInt(props.query.page))
      });
    },

    renderPrev: function renderPrev() {
      var page = this.getPage();
      var prevPage = page - 1;
      if (prevPage > 0) {
        return React.createElement(Link, { to: "profiles", query: { page: prevPage } }, "prev page");
      }
    },

    renderNext: function renderNext() {
      var page = this.getPage();
      var nextPage = page + 1;
      return React.createElement(Link, { to: "profiles", query: { page: nextPage } }, "next page");
    },

    handleSelect: function handleSelect(profile, value) {
      var selection = this.state.selection;
      if (value) {
        selection.push(profile);
      } else {
        selection.removeObject(profile);
      }
      this.forceUpdate();
    },

    render: function render() {
      var selection = this.state.selection;
      return React.createElement("div", { className: "profiles-index react" }, React.createElement("header", null, React.createElement("h1", null, "Profiles Rendered With React ", React.version), React.createElement("div", { className: "subheader" }, React.createElement("div", { className: "selection" }, selection.length, " Selected"), React.createElement("div", { className: "pagination" }, this.renderPrev(), " ", this.renderNext()))), React.createElement("ul", { className: "profiles" }, this.state.profiles.map(function (profile) {
        var selected = selection.indexOf(profile) !== -1;
        return React.createElement(Item['default'], { model: profile, selected: selected, onChange: this.handleSelect.bind(this, profile) });
      }, this)));
    }

  });

});
define('example/react/profiles/item', ['exports', 'example/react/gravatar-display', 'example/react/time-ago'], function (exports, GravatarDisplay, TimeAgo) {

  'use strict';

  exports['default'] = React.createClass({
    displayName: "item",

    getDefaultProps: function getDefaultProps() {
      return {
        selected: false,
        onChange: function onChange() {}
      };
    },

    handleChange: function handleChange(evt) {
      var value = evt.target.checked;
      this.props.onChange(value);
    },

    render: function render() {
      var className = this.props.selected ? "selected" : "";
      var model = this.props.model;
      return React.createElement("li", { className: className }, React.createElement("input", { type: "checkbox", checked: this.props.selected, onChange: this.handleChange }), React.createElement(GravatarDisplay['default'], { email: model.get("email"), size: "24" }), React.createElement("div", { className: "name" }, model.get("name")), React.createElement("div", { className: "email" }, model.get("email")), React.createElement("ul", { className: "tags" }, model.get("tags").map(function (tag) {
        return React.createElement("li", null, tag.get("name"));
      }, this)), React.createElement(TimeAgo['default'], { date: model.createdAt }));
    }

  });

});
define('example/react/routing', ['exports', 'example/react/syntax-highlight'], function (exports, SyntaxHighlight) {

  'use strict';

  exports['default'] = React.createClass({
    displayName: "routing",

    render: function render() {
      return React.createElement("div", { className: "content" }, React.createElement("h1", null, "Routing"), React.createElement("p", null, "Ember-React extends Ember.Route with support for rendering the route's template as a react component. Specifically, Ember-React adds an additional ", React.createElement("code", null, "react:"), " hash parameter to the ", React.createElement("code", null, "render()"), " function:"), React.createElement(SyntaxHighlight['default'], { language: "javascript" }, "renderTemplate: function() {" + " " + "this.render({react: ...});" + " " + "}"), React.createElement("p", null, "Ember-React also plays well with ", React.createElement("a", { href: "https://github.com/rackt/react-router" }, "React-Router"), ". Simply pass in a react class containing a <Routes> component. See the source of this example."));
    }

  });

});
define('example/react/syntax-highlight', ['exports'], function (exports) {

  'use strict';

  /* global Prism */

  exports['default'] = React.createClass({
    displayName: "syntax-highlight",

    getDefaultProps: function getDefaultProps() {
      return {
        language: "markup"
      };
    },

    componentDidMount: function componentDidMount() {
      Prism.highlightElement(this.refs.code.getDOMNode());
    },

    componentDidUpdate: function componentDidUpdate() {
      Prism.highlightElement(this.refs.code.getDOMNode());
    },

    render: function render() {
      var languageClass = "language-" + this.props.language;
      return React.createElement("pre", null, React.createElement("code", { ref: "code", className: languageClass }, this.props.children));
    }

  });

});
define('example/react/time-ago', ['exports'], function (exports) {

  'use strict';

  exports['default'] = React.createClass({
    displayName: "time-ago",

    render: function render() {
      var date = this.props.date;
      return React.createElement("time", { datetime: date }, moment(date).fromNow());
    }

  });

});
define('example/router', ['exports', 'ember', 'example/config/environment', 'example/react/profiles/index', 'example/react/routing'], function (exports, Ember, config, ProfilesIndex, Routing) {

  'use strict';

  var EmberRouter = Ember['default'].Router.extend({
    location: config['default'].locationType,
    updateReactRouter: (function () {
      var loc = this.location.location,
          fullUrl = loc.pathname + loc.search;
      if (lastMatch && lastMatch.Handler.match(fullUrl)) {
        if (lastMatch.state.path !== fullUrl) {
          lastMatch.Handler.transitionTo(fullUrl);
        }
      }
    }).on("didTransition")
  });

  EmberRouter.map(function () {
    this.resource("ember", function () {
      this.route("react-components");
      this.resource("profiles", function () {
        this.resource("profile", { path: "/:profile_id" });
      });
    });
    this.resource("react", function () {
      this.route("route", { path: "/*_" });
    });
  });

  var Root = React.createClass({
    displayName: "Root",

    render: function render() {
      return (
        /* jshint ignore:start */
        React.createElement(ReactRouter.RouteHandler, this.props)
      )
      /* jshint ignore:end */
      ;
    }

  });

  var Route = ReactRouter.Route;

  var routes =
  /* jshint ignore:start */
  React.createElement(
    Route,
    { handler: Root, path: "/ember-react/" },
    React.createElement(Route, { name: "profiles", path: "react/profiles", handler: ProfilesIndex['default'] }),
    React.createElement(Route, { name: "routing", path: "react/routing", handler: Routing['default'] })
  );

  var lastMatch, outletElement;

  window.didInsertReactOutlet = function (element) {
    ReactRouter.run(routes, ReactRouter.HistoryLocation, function (Handler, state) {
      lastMatch = { Handler: Handler, state: state };
      var element = document.getElementById("react-outlet");
      /* jshint ignore:start */
      React.render(React.createElement(Handler, { query: state.query }), element);
      /* jshint ignore:end */
    });
  };

  window.willDestroyReactOutlet = function (element) {
    // unmounting will stop the router
    React.unmountComponentAtNode(element);
  };

  exports['default'] = EmberRouter;

  /* jshint ignore:end */

});
define('example/routes/profiles/index', ['exports', 'ember', 'example/models/profile'], function (exports, Ember, Profile) {

  'use strict';

  exports['default'] = Ember['default'].Route.extend({
    queryParams: {
      page: {
        refreshModel: true
      }
    },

    model: function model(params) {
      return Profile['default'].load(params.page || 1);
    }

  });

});
define('example/templates/application', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    var child0 = (function() {
      return {
        isHTMLBars: true,
        revision: "Ember@1.13.0-beta.1+canary.6f20f6a5",
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("Getting Started");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes() { return []; },
        statements: [

        ],
        locals: [],
        templates: []
      };
    }());
    var child1 = (function() {
      return {
        isHTMLBars: true,
        revision: "Ember@1.13.0-beta.1+canary.6f20f6a5",
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("React Components");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes() { return []; },
        statements: [

        ],
        locals: [],
        templates: []
      };
    }());
    var child2 = (function() {
      return {
        isHTMLBars: true,
        revision: "Ember@1.13.0-beta.1+canary.6f20f6a5",
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("Index Page w/ Ember");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes() { return []; },
        statements: [

        ],
        locals: [],
        templates: []
      };
    }());
    var child3 = (function() {
      return {
        isHTMLBars: true,
        revision: "Ember@1.13.0-beta.1+canary.6f20f6a5",
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("Index Page w/ React");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes() { return []; },
        statements: [

        ],
        locals: [],
        templates: []
      };
    }());
    var child4 = (function() {
      return {
        isHTMLBars: true,
        revision: "Ember@1.13.0-beta.1+canary.6f20f6a5",
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("Routing");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes() { return []; },
        statements: [

        ],
        locals: [],
        templates: []
      };
    }());
    return {
      isHTMLBars: true,
      revision: "Ember@1.13.0-beta.1+canary.6f20f6a5",
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createElement("div");
        dom.setAttribute(el1,"class","container");
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        dom.setAttribute(el2,"class","left");
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("header");
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("h2");
        var el5 = dom.createElement("span");
        dom.setAttribute(el5,"class","ember");
        var el6 = dom.createTextNode("Ember");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("-");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("span");
        dom.setAttribute(el5,"class","react");
        var el6 = dom.createTextNode("React");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n    ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("nav");
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("ul");
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("li");
        var el6 = dom.createComment("");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("li");
        var el6 = dom.createComment("");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("li");
        var el6 = dom.createComment("");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("li");
        var el6 = dom.createComment("");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("li");
        var el6 = dom.createComment("");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("li");
        var el6 = dom.createElement("a");
        dom.setAttribute(el6,"href","https://github.com/ghempton/ember-react");
        var el7 = dom.createTextNode("Github");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n      ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n    ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n  ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        dom.setAttribute(el2,"class","right");
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createComment("");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n  ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
        var element0 = dom.childAt(fragment, [0]);
        var element1 = dom.childAt(element0, [1, 3, 1]);
        var morphs = new Array(6);
        morphs[0] = dom.createMorphAt(dom.childAt(element1, [1]),0,0);
        morphs[1] = dom.createMorphAt(dom.childAt(element1, [3]),0,0);
        morphs[2] = dom.createMorphAt(dom.childAt(element1, [5]),0,0);
        morphs[3] = dom.createMorphAt(dom.childAt(element1, [7]),0,0);
        morphs[4] = dom.createMorphAt(dom.childAt(element1, [9]),0,0);
        morphs[5] = dom.createMorphAt(dom.childAt(element0, [3]),1,1);
        return morphs;
      },
      statements: [
        ["block","link-to",["index"],[],0,null],
        ["block","link-to",["ember.react-components"],[],1,null],
        ["block","link-to",["profiles"],[],2,null],
        ["block","link-to",["react.route","profiles"],[],3,null],
        ["block","link-to",["react.route","routing"],[],4,null],
        ["content","outlet"]
      ],
      locals: [],
      templates: [child0, child1, child2, child3, child4]
    };
  }()));

});
define('example/templates/components/syntax-highlight', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    return {
      isHTMLBars: true,
      revision: "Ember@1.13.0-beta.1+canary.6f20f6a5",
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createElement("code");
        var el2 = dom.createComment("");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
        var element0 = dom.childAt(fragment, [0]);
        var morphs = new Array(2);
        morphs[0] = dom.createAttrMorph(element0, 'class');
        morphs[1] = dom.createMorphAt(element0,0,0);
        return morphs;
      },
      statements: [
        ["attribute","class",["concat",[["get","languageClass"]]]],
        ["content","yield"]
      ],
      locals: [],
      templates: []
    };
  }()));

});
define('example/templates/ember/react-components', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    var child0 = (function() {
      return {
        isHTMLBars: true,
        revision: "Ember@1.13.0-beta.1+canary.6f20f6a5",
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("    {{react componentName='example'}}\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes() { return []; },
        statements: [

        ],
        locals: [],
        templates: []
      };
    }());
    var child1 = (function() {
      return {
        isHTMLBars: true,
        revision: "Ember@1.13.0-beta.1+canary.6f20f6a5",
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("    {{react componentName='time-ago' date=date}}\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes() { return []; },
        statements: [

        ],
        locals: [],
        templates: []
      };
    }());
    return {
      isHTMLBars: true,
      revision: "Ember@1.13.0-beta.1+canary.6f20f6a5",
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createElement("div");
        dom.setAttribute(el1,"class","content");
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("h1");
        var el3 = dom.createTextNode("React Components");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("p");
        var el3 = dom.createTextNode("Ember-React adds a new helper ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("code");
        var el4 = dom.createTextNode("{{react}}");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode(", which can be used to easily include a react component inside of a handlebars template.");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createComment("");
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("p");
        var el3 = dom.createTextNode("The above text is rendered using a react component named 'example':");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n\n");
        dom.appendChild(el1, el2);
        var el2 = dom.createComment("");
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("h2");
        var el3 = dom.createTextNode("Bindings and Properties");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("p");
        var el3 = dom.createTextNode("Properties passed into the ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("code");
        var el4 = dom.createTextNode("{{react}}");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode(" helper will be bound. When a property is updated, the ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("code");
        var el4 = dom.createTextNode("props");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode(" hash inside the React component will be updated and lifecycle events such as  ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("code");
        var el4 = dom.createTextNode("componentWillReceiveProps");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode(" will be called:");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n\n");
        dom.appendChild(el1, el2);
        var el2 = dom.createComment("");
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
        var element0 = dom.childAt(fragment, [0]);
        var morphs = new Array(3);
        morphs[0] = dom.createMorphAt(element0,5,5);
        morphs[1] = dom.createMorphAt(element0,9,9);
        morphs[2] = dom.createMorphAt(element0,15,15);
        return morphs;
      },
      statements: [
        ["inline","react",[],["componentName","example"]],
        ["block","syntax-highlight",[],[],0,null],
        ["block","syntax-highlight",[],[],1,null]
      ],
      locals: [],
      templates: [child0, child1]
    };
  }()));

});
define('example/templates/index', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    var child0 = (function() {
      return {
        isHTMLBars: true,
        revision: "Ember@1.13.0-beta.1+canary.6f20f6a5",
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("bower install ember-react\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes() { return []; },
        statements: [

        ],
        locals: [],
        templates: []
      };
    }());
    var child1 = (function() {
      return {
        isHTMLBars: true,
        revision: "Ember@1.13.0-beta.1+canary.6f20f6a5",
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("<script src=\"bower_components/ember-react/ember-react.global.js\"></script>\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes() { return []; },
        statements: [

        ],
        locals: [],
        templates: []
      };
    }());
    var child2 = (function() {
      return {
        isHTMLBars: true,
        revision: "Ember@1.13.0-beta.1+canary.6f20f6a5",
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("app.import('bower_components/ember-react/ember-react.global.js');\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes() { return []; },
        statements: [

        ],
        locals: [],
        templates: []
      };
    }());
    return {
      isHTMLBars: true,
      revision: "Ember@1.13.0-beta.1+canary.6f20f6a5",
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createElement("div");
        dom.setAttribute(el1,"class","content");
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("h1");
        var el3 = dom.createTextNode("Getting Started");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("p");
        var el3 = dom.createTextNode("The easiest way to get started is to use bower:");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n\n");
        dom.appendChild(el1, el2);
        var el2 = dom.createComment("");
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("p");
        var el3 = dom.createTextNode("Then include the following script file in your application:");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n\n");
        dom.appendChild(el1, el2);
        var el2 = dom.createComment("");
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("p");
        var el3 = dom.createTextNode("If you are using ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("a");
        dom.setAttribute(el3,"href","http://www.ember-cli.com/");
        var el4 = dom.createTextNode("ember-cli");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode(", simply import the script in your Brocfile:");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n\n");
        dom.appendChild(el1, el2);
        var el2 = dom.createComment("");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
        var element0 = dom.childAt(fragment, [0]);
        var morphs = new Array(3);
        morphs[0] = dom.createMorphAt(element0,5,5);
        morphs[1] = dom.createMorphAt(element0,9,9);
        morphs[2] = dom.createMorphAt(element0,13,13);
        return morphs;
      },
      statements: [
        ["block","syntax-highlight",[],[],0,null],
        ["block","syntax-highlight",[],[],1,null],
        ["block","syntax-highlight",[],["language","javascript"],2,null]
      ],
      locals: [],
      templates: [child0, child1, child2]
    };
  }()));

});
define('example/templates/profiles/index', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    var child0 = (function() {
      var child0 = (function() {
        return {
          isHTMLBars: true,
          revision: "Ember@1.13.0-beta.1+canary.6f20f6a5",
          arity: 0,
          cachedFragment: null,
          hasRendered: false,
          buildFragment: function buildFragment(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createTextNode("prev page");
            dom.appendChild(el0, el1);
            return el0;
          },
          buildRenderNodes: function buildRenderNodes() { return []; },
          statements: [

          ],
          locals: [],
          templates: []
        };
      }());
      return {
        isHTMLBars: true,
        revision: "Ember@1.13.0-beta.1+canary.6f20f6a5",
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("          ");
          dom.appendChild(el0, el1);
          var el1 = dom.createComment("");
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var morphs = new Array(1);
          morphs[0] = dom.createMorphAt(fragment,1,1,contextualElement);
          return morphs;
        },
        statements: [
          ["block","link-to",["profiles",["subexpr","query-params",[],["page",["get","prevPage"]]]],[],0,null]
        ],
        locals: [],
        templates: [child0]
      };
    }());
    var child1 = (function() {
      var child0 = (function() {
        return {
          isHTMLBars: true,
          revision: "Ember@1.13.0-beta.1+canary.6f20f6a5",
          arity: 0,
          cachedFragment: null,
          hasRendered: false,
          buildFragment: function buildFragment(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createTextNode("next page");
            dom.appendChild(el0, el1);
            return el0;
          },
          buildRenderNodes: function buildRenderNodes() { return []; },
          statements: [

          ],
          locals: [],
          templates: []
        };
      }());
      return {
        isHTMLBars: true,
        revision: "Ember@1.13.0-beta.1+canary.6f20f6a5",
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("          ");
          dom.appendChild(el0, el1);
          var el1 = dom.createComment("");
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var morphs = new Array(1);
          morphs[0] = dom.createMorphAt(fragment,1,1,contextualElement);
          return morphs;
        },
        statements: [
          ["block","link-to",["profiles",["subexpr","query-params",[],["page",["get","nextPage"]]]],[],0,null]
        ],
        locals: [],
        templates: [child0]
      };
    }());
    var child2 = (function() {
      var child0 = (function() {
        return {
          isHTMLBars: true,
          revision: "Ember@1.13.0-beta.1+canary.6f20f6a5",
          arity: 1,
          cachedFragment: null,
          hasRendered: false,
          buildFragment: function buildFragment(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createTextNode("            ");
            dom.appendChild(el0, el1);
            var el1 = dom.createElement("li");
            var el2 = dom.createComment("");
            dom.appendChild(el1, el2);
            dom.appendChild(el0, el1);
            var el1 = dom.createTextNode("\n");
            dom.appendChild(el0, el1);
            return el0;
          },
          buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
            var morphs = new Array(1);
            morphs[0] = dom.createMorphAt(dom.childAt(fragment, [1]),0,0);
            return morphs;
          },
          statements: [
            ["content","tagName.name"]
          ],
          locals: ["tagName"],
          templates: []
        };
      }());
      return {
        isHTMLBars: true,
        revision: "Ember@1.13.0-beta.1+canary.6f20f6a5",
        arity: 1,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("      ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("li");
          var el2 = dom.createTextNode("\n        ");
          dom.appendChild(el1, el2);
          var el2 = dom.createComment("");
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n        ");
          dom.appendChild(el1, el2);
          var el2 = dom.createComment("");
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n        ");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("div");
          dom.setAttribute(el2,"class","name");
          var el3 = dom.createComment("");
          dom.appendChild(el2, el3);
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n        ");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("div");
          dom.setAttribute(el2,"class","email");
          var el3 = dom.createComment("");
          dom.appendChild(el2, el3);
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n\n        ");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("ul");
          dom.setAttribute(el2,"class","tags");
          var el3 = dom.createTextNode("\n");
          dom.appendChild(el2, el3);
          var el3 = dom.createComment("");
          dom.appendChild(el2, el3);
          var el3 = dom.createTextNode("        ");
          dom.appendChild(el2, el3);
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n\n        ");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("time");
          dom.setAttribute(el2,"class","createdAt");
          dom.setAttribute(el2,"datetime","createdAt");
          var el3 = dom.createComment("");
          dom.appendChild(el2, el3);
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n      ");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var element0 = dom.childAt(fragment, [1]);
          var morphs = new Array(7);
          morphs[0] = dom.createAttrMorph(element0, 'class');
          morphs[1] = dom.createMorphAt(element0,1,1);
          morphs[2] = dom.createMorphAt(element0,3,3);
          morphs[3] = dom.createMorphAt(dom.childAt(element0, [5]),0,0);
          morphs[4] = dom.createMorphAt(dom.childAt(element0, [7]),0,0);
          morphs[5] = dom.createMorphAt(dom.childAt(element0, [9]),1,1);
          morphs[6] = dom.createMorphAt(dom.childAt(element0, [11]),0,0);
          return morphs;
        },
        statements: [
          ["attribute","class",["concat",[["subexpr","if",[["get","item.isSelected"],"selected"],[]]]]],
          ["inline","input",[],["type","checkbox","checked",["subexpr","@mut",[["get","item.isSelected"]],[]]]],
          ["inline","gravatar-display",[],["email",["subexpr","@mut",[["get","item.email"]],[]],"size","24"]],
          ["content","item.name"],
          ["content","item.email"],
          ["block","each",[["get","item.tags"]],[],0,null],
          ["inline","time-ago",[["get","item.createdAt"]],[]]
        ],
        locals: ["item"],
        templates: [child0]
      };
    }());
    return {
      isHTMLBars: true,
      revision: "Ember@1.13.0-beta.1+canary.6f20f6a5",
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createElement("div");
        dom.setAttribute(el1,"class","profiles-index ember");
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("header");
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("h1");
        var el4 = dom.createTextNode("Profiles Rendered With Ember.js ");
        dom.appendChild(el3, el4);
        var el4 = dom.createComment("");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("div");
        dom.setAttribute(el3,"class","subheader");
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("div");
        dom.setAttribute(el4,"class","selection");
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createComment("");
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode(" Selected\n      ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("div");
        dom.setAttribute(el4,"class","pagination");
        var el5 = dom.createTextNode("\n");
        dom.appendChild(el4, el5);
        var el5 = dom.createComment("");
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n");
        dom.appendChild(el4, el5);
        var el5 = dom.createComment("");
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("      ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n    ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n  ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("ul");
        dom.setAttribute(el2,"class","profiles");
        var el3 = dom.createTextNode("\n\n");
        dom.appendChild(el2, el3);
        var el3 = dom.createComment("");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("  ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
        var element1 = dom.childAt(fragment, [0]);
        var element2 = dom.childAt(element1, [1]);
        var element3 = dom.childAt(element2, [3]);
        var element4 = dom.childAt(element3, [3]);
        var morphs = new Array(5);
        morphs[0] = dom.createMorphAt(dom.childAt(element2, [1]),1,1);
        morphs[1] = dom.createMorphAt(dom.childAt(element3, [1]),1,1);
        morphs[2] = dom.createMorphAt(element4,1,1);
        morphs[3] = dom.createMorphAt(element4,3,3);
        morphs[4] = dom.createMorphAt(dom.childAt(element1, [3]),1,1);
        return morphs;
      },
      statements: [
        ["content","emberVersion"],
        ["content","selection.length"],
        ["block","if",[["get","prevPage"]],[],0,null],
        ["block","if",[["get","nextPage"]],[],1,null],
        ["block","each",[["get","profiles"]],[],2,null]
      ],
      locals: [],
      templates: [child0, child1, child2]
    };
  }()));

});
define('example/templates/react', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    return {
      isHTMLBars: true,
      revision: "Ember@1.13.0-beta.1+canary.6f20f6a5",
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createComment("");
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
        var morphs = new Array(1);
        morphs[0] = dom.createMorphAt(fragment,0,0,contextualElement);
        dom.insertBoundary(fragment, 0);
        return morphs;
      },
      statements: [
        ["content","react-outlet"]
      ],
      locals: [],
      templates: []
    };
  }()));

});
define('example/tests/app.jshint', function () {

  'use strict';

  module('JSHint - .');
  test('app.js should pass jshint', function() { 
    ok(true, 'app.js should pass jshint.'); 
  });

});
define('example/tests/components/gravatar-display.jshint', function () {

  'use strict';

  module('JSHint - components');
  test('components/gravatar-display.js should pass jshint', function() { 
    ok(true, 'components/gravatar-display.js should pass jshint.'); 
  });

});
define('example/tests/components/react-outlet.jshint', function () {

  'use strict';

  module('JSHint - components');
  test('components/react-outlet.js should pass jshint', function() { 
    ok(true, 'components/react-outlet.js should pass jshint.'); 
  });

});
define('example/tests/components/syntax-highlight.jshint', function () {

  'use strict';

  module('JSHint - components');
  test('components/syntax-highlight.js should pass jshint', function() { 
    ok(true, 'components/syntax-highlight.js should pass jshint.'); 
  });

});
define('example/tests/controllers/profiles/index.jshint', function () {

  'use strict';

  module('JSHint - controllers/profiles');
  test('controllers/profiles/index.js should pass jshint', function() { 
    ok(true, 'controllers/profiles/index.js should pass jshint.'); 
  });

});
define('example/tests/controllers/profiles/item.jshint', function () {

  'use strict';

  module('JSHint - controllers/profiles');
  test('controllers/profiles/item.js should pass jshint', function() { 
    ok(true, 'controllers/profiles/item.js should pass jshint.'); 
  });

});
define('example/tests/helpers/resolver', ['exports', 'ember/resolver', 'example/config/environment'], function (exports, Resolver, config) {

  'use strict';

  var resolver = Resolver['default'].create();

  resolver.namespace = {
    modulePrefix: config['default'].modulePrefix,
    podModulePrefix: config['default'].podModulePrefix
  };

  exports['default'] = resolver;

});
define('example/tests/helpers/resolver.jshint', function () {

  'use strict';

  module('JSHint - helpers');
  test('helpers/resolver.js should pass jshint', function() { 
    ok(true, 'helpers/resolver.js should pass jshint.'); 
  });

});
define('example/tests/helpers/start-app', ['exports', 'ember', 'example/app', 'example/router', 'example/config/environment'], function (exports, Ember, Application, Router, config) {

  'use strict';



  exports['default'] = startApp;
  function startApp(attrs) {
    var application;

    var attributes = Ember['default'].merge({}, config['default'].APP);
    attributes = Ember['default'].merge(attributes, attrs); // use defaults, but you can override;

    Ember['default'].run(function () {
      application = Application['default'].create(attributes);
      application.setupForTesting();
      application.injectTestHelpers();
    });

    return application;
  }

});
define('example/tests/helpers/start-app.jshint', function () {

  'use strict';

  module('JSHint - helpers');
  test('helpers/start-app.js should pass jshint', function() { 
    ok(true, 'helpers/start-app.js should pass jshint.'); 
  });

});
define('example/tests/helpers/time-ago.jshint', function () {

  'use strict';

  module('JSHint - helpers');
  test('helpers/time-ago.js should pass jshint', function() { 
    ok(true, 'helpers/time-ago.js should pass jshint.'); 
  });

});
define('example/tests/models/profile.jshint', function () {

  'use strict';

  module('JSHint - models');
  test('models/profile.js should pass jshint', function() { 
    ok(true, 'models/profile.js should pass jshint.'); 
  });

});
define('example/tests/models/tag.jshint', function () {

  'use strict';

  module('JSHint - models');
  test('models/tag.js should pass jshint', function() { 
    ok(true, 'models/tag.js should pass jshint.'); 
  });

});
define('example/tests/react/example.jshint', function () {

  'use strict';

  module('JSHint - react');
  test('react/example.js should pass jshint', function() { 
    ok(true, 'react/example.js should pass jshint.'); 
  });

});
define('example/tests/react/gravatar-display.jshint', function () {

  'use strict';

  module('JSHint - react');
  test('react/gravatar-display.js should pass jshint', function() { 
    ok(true, 'react/gravatar-display.js should pass jshint.'); 
  });

});
define('example/tests/react/profiles/index.jshint', function () {

  'use strict';

  module('JSHint - react/profiles');
  test('react/profiles/index.js should pass jshint', function() { 
    ok(true, 'react/profiles/index.js should pass jshint.'); 
  });

});
define('example/tests/react/profiles/item.jshint', function () {

  'use strict';

  module('JSHint - react/profiles');
  test('react/profiles/item.js should pass jshint', function() { 
    ok(true, 'react/profiles/item.js should pass jshint.'); 
  });

});
define('example/tests/react/routing.jshint', function () {

  'use strict';

  module('JSHint - react');
  test('react/routing.js should pass jshint', function() { 
    ok(true, 'react/routing.js should pass jshint.'); 
  });

});
define('example/tests/react/syntax-highlight.jshint', function () {

  'use strict';

  module('JSHint - react');
  test('react/syntax-highlight.js should pass jshint', function() { 
    ok(true, 'react/syntax-highlight.js should pass jshint.'); 
  });

});
define('example/tests/react/time-ago.jshint', function () {

  'use strict';

  module('JSHint - react');
  test('react/time-ago.js should pass jshint', function() { 
    ok(true, 'react/time-ago.js should pass jshint.'); 
  });

});
define('example/tests/router.jshint', function () {

  'use strict';

  module('JSHint - .');
  test('router.js should pass jshint', function() { 
    ok(false, 'router.js should pass jshint.\nrouter.js: line 66, col 2, Missing semicolon.\nrouter.js: line 71, col 2, Missing semicolon.\nrouter.js: line 29, col 8, \'ProfilesIndex\' is defined but never used.\nrouter.js: line 30, col 8, \'Routing\' is defined but never used.\nrouter.js: line 32, col 5, \'Root\' is defined but never used.\nrouter.js: line 44, col 5, \'Route\' is defined but never used.\nrouter.js: line 55, col 16, \'outletElement\' is defined but never used.\nrouter.js: line 58, col 40, \'element\' is defined but never used.\nrouter.js: line 61, col 9, \'element\' is defined but never used.\n\n9 errors'); 
  });

});
define('example/tests/routes/profiles/index.jshint', function () {

  'use strict';

  module('JSHint - routes/profiles');
  test('routes/profiles/index.js should pass jshint', function() { 
    ok(true, 'routes/profiles/index.js should pass jshint.'); 
  });

});
define('example/tests/test-helper', ['example/tests/helpers/resolver', 'ember-qunit'], function (resolver, ember_qunit) {

	'use strict';

	ember_qunit.setResolver(resolver['default']);

});
define('example/tests/test-helper.jshint', function () {

  'use strict';

  module('JSHint - .');
  test('test-helper.js should pass jshint', function() { 
    ok(true, 'test-helper.js should pass jshint.'); 
  });

});
/* jshint ignore:start */

/* jshint ignore:end */

/* jshint ignore:start */

define('example/config/environment', ['ember'], function(Ember) {
  var prefix = 'example';
/* jshint ignore:start */

try {
  var metaName = prefix + '/config/environment';
  var rawConfig = Ember['default'].$('meta[name="' + metaName + '"]').attr('content');
  var config = JSON.parse(unescape(rawConfig));

  return { 'default': config };
}
catch(err) {
  throw new Error('Could not read config from meta tag with name "' + metaName + '".');
}

/* jshint ignore:end */

});

if (runningTests) {
  require("example/tests/test-helper");
} else {
  require("example/app")["default"].create({"LOG_ACTIVE_GENERATION":true,"LOG_VIEW_LOOKUPS":true,"name":"example","version":"0.0.0.2bd67145"});
}

/* jshint ignore:end */
//# sourceMappingURL=example.map