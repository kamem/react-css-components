var React = require('react');
import btn from "../css/test.css";

var Home = React.createClass({
  render: function() {
    return (
      <div className={btn.subClass}>Home<span className="aaa">Test</span></div>
    );
  }
});

module.exports = Home;
