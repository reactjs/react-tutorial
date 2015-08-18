'use strict';

var React = require('react');
var CommentBox = require('./CommentBox.jsx');

var data = [
  {author: "Pete Hunt", text: "This is one comment"},
  {author: "Jordan Walke", text: "This is *another* comment"}
];

React.render(
  <CommentBox data={data} />,
  document.getElementById('content')
);
