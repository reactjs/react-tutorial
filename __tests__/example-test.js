jest.unmock('../public/scripts/example.js');

import React from 'react';
import ReactDOM from 'react-dom';
var m = require('../public/scripts/example.js');

var ReactTestUtils = require('react-addons-test-utils');
var CommentBox = m.CommentBox;

describe('TestCommentBoxComponent', () => {
  var boxNode;
  beforeEach(() => {
    const commentBox = ReactTestUtils.renderIntoDocument(
      <CommentBox url="/api/comments" pollInterval={2000} />
    );

    boxNode = ReactDOM.findDOMNode(commentBox);
  });

  it('class should equal commentBox', () => {
    expect(boxNode.className).toEqual('commentBox');
  });

  it('header should be Comments', () => {
    //expect(boxNode.children.h1).toBeDefined();
    //console.log(boxNode.children)
  });
})
