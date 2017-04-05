jest.unmock('../public/scripts/example.js');

var React = require('react');
var ReactDOM = require('react-dom');
var ReactTestUtils = require('react-addons-test-utils');
var CommentBoxComponent = require('../public/scripts/example.js');

var CommentBox = CommentBoxComponent.CommentBox;

describe('TestCommentBoxComponent', () => {
  var boxNode;
  var commentBox;
  beforeEach(() => {
    commentBox = ReactTestUtils.renderIntoDocument(
      <CommentBox url="/api/comments" pollInterval={2000} />
    );
    boxNode = ReactDOM.findDOMNode(commentBox);
  });

  it('should exists', function() {
    expect(ReactTestUtils.isCompositeComponent(commentBox)).toBeTruthy();
  });

  it('class should equal commentBox', () => {
    expect(boxNode.className).toEqual('commentBox');
  });

  it('initial state data should be empty', () => {
    expect(commentBox.getInitialState()).toBeDefined();
    const commentBoxData = commentBox.getInitialState().data;
    expect(commentBoxData).toBeDefined();
    expect(commentBoxData).toEqual([]);
  })
})
