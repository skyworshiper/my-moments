import React, { Component } from "react";
import { Avatar, Card, Icon, Input, List, message, Popconfirm } from "antd";
import InfiniteScroll from "react-infinite-scroller";
import {
  addComment,
  getFeed,
  getPostReactions,
  likePost,
  unlikePost,
  deletePost
} from "../../util/ApiUtil";
import LoadingIndicator from "../../common/LoadingIndicator";
import "./postlist.css";

class PostList extends Component {
  state = {
    currentUser: { ...this.props.currentUser },
    pagingState: null,
    hasMore: false,
    loading: false,
    feed: [],
    reactions: {},
    commentDrafts: {}
  };

  componentDidMount = () => {
    this.loadUserFeed();
  };

  componentDidUpdate = prevProps => {
    if (
      this.props.currentUser &&
      this.props.currentUser !== prevProps.currentUser
    ) {
      this.setState(
        {
          currentUser: { ...this.props.currentUser },
          pagingState: null,
          hasMore: false,
          feed: [],
          reactions: {},
          commentDrafts: {}
        },
        this.loadUserFeed
      );
    }
  };

  loadUserFeed = () => {
    if (!this.state.currentUser || !this.state.currentUser.username) {
      return;
    }

    getFeed(this.state.currentUser.username, this.state.pagingState)
      .then(res => {
        this.setState({
          hasMore: !res.last,
          feed: res.content,
          pagingState: res.pagingState
        });
        this.bootstrapReactions(res.content);
      })
      .catch(error => {
        console.log("error: " + error);
      });
  };

  handleInfiniteOnLoad = () => {
    if (!this.state.currentUser || !this.state.currentUser.username) {
      return;
    }

    this.setState({
      loading: true
    });

    let feed = this.state.feed;

    getFeed(this.state.currentUser.username, this.state.pagingState)
      .then(res => {
        feed = feed.concat(res.content);

        this.setState({
          feed,
          hasMore: !res.last,
          pagingState: res.pagingState,
          loading: false
        });
        this.bootstrapReactions(res.content);
      })
      .catch(error => {
        this.setState({
          hasMore: false,
          loading: false
        });
      });
  };

  bootstrapReactions = posts => {
    posts.forEach(post => {
      if (post && post.id && !this.state.reactions[post.id]) {
        this.fetchPostReactions(post.id);
      }
    });
  };

  fetchPostReactions = postId => {
    getPostReactions(postId)
      .then(summary => {
        this.applyReaction(postId, summary);
      })
      .catch(error => {
        console.log("failed to fetch reactions", error);
      });
  };

  applyReaction = (postId, summary) => {
    this.setState(prevState => ({
      reactions: {
        ...prevState.reactions,
        [postId]: summary
      },
      feed: prevState.feed.map(post =>
        post.id === postId
          ? {
              ...post,
              likeCount: summary.likeCount,
              commentCount: summary.commentCount
            }
          : post
      )
    }));
  };

  handleToggleLike = post => {
    const reaction = this.state.reactions[post.id];
    const liked = reaction ? reaction.liked : false;
    const action = liked ? unlikePost : likePost;

    action(post.id)
      .then(summary => {
        this.applyReaction(post.id, summary);
      })
      .catch(error => {
        message.error(error.message || "Action failed, please try again later");
      });
  };

  handleCommentChange = (postId, event) => {
    const value = event.target.value;
    this.setState(prevState => ({
      commentDrafts: {
        ...prevState.commentDrafts,
        [postId]: value
      }
    }));
  };

  handleCommentSubmit = postId => {
    const draft = (this.state.commentDrafts[postId] || "").trim();
    if (!draft) {
      return;
    }

    addComment(postId, draft)
      .then(summary => {
        this.setState(prevState => ({
          commentDrafts: {
            ...prevState.commentDrafts,
            [postId]: ""
          }
        }));
        this.applyReaction(postId, summary);
      })
      .catch(error => {
        message.error(error.message || "Unable to post comment, please try again later");
      });
  };

  handleDeletePost = post => {
    deletePost(post.id)
      .then(() => {
        message.success("Post deleted");
        this.setState(prevState => ({
          feed: prevState.feed.filter(p => p.id !== post.id)
        }));
      })
      .catch(error => {
        message.error(error.message || "Unable to delete post");
      });
  };

  getPostRender = item => {
    const reaction = this.state.reactions[item.id];
    const liked = reaction ? reaction.liked : false;
    const likeCount = reaction
      ? reaction.likeCount
      : item.likeCount || 0;
    const commentCount = reaction
      ? reaction.commentCount
      : item.commentCount || 0;
    const comments = reaction ? reaction.comments : [];
    const caption = (item.caption || "").trim();

    return (
      <List.Item className="post-list-item ">
        <Card bodyStyle={{ padding: 0 }} className="post-card">
          <div className="post-user-container">
            <Avatar
              src={item.userProfilePic}
              className="post-user-avatar-circle"
            />
            <span className="post-username">{item.username}</span>
          </div>
          {caption && (
            <div className="post-caption post-caption-top">
              <span className="post-caption-text">{caption}</span>
            </div>
          )}
          <div className="post-img-container">
            <img alt="postId" className="post-img" src={item.imageUrl} />
          </div>
          <div className="post-actions">
            <Icon
              type="heart"
              theme={liked ? "filled" : "outlined"}
              className={liked ? "post-action liked" : "post-action"}
              onClick={() => this.handleToggleLike(item)}
            />
            <Icon type="message" className="post-action" />
            <Icon type="upload" className="post-action" />
            <Icon type="book" className="post-action-book" />
            {this.state.currentUser &&
              item.username === this.state.currentUser.username && (
                <Popconfirm
                  title="Delete this post?"
                  onConfirm={() => this.handleDeletePost(item)}
                  okText="Delete"
                  cancelText="Cancel"
                >
                  <Icon type="delete" className="post-action" />
                </Popconfirm>
              )}
          </div>
          <div className="post-stats">
            <span className="post-stat">{likeCount} likes</span>
            <span className="post-stat">{commentCount} comments</span>
          </div>
          {comments.length > 0 && (
            <div className="comment-list">
              {comments.map(comment => (
                <div className="comment-item" key={comment.id}>
                  <span className="comment-author">
                    {comment.username}
                  </span>
                  <span className="comment-text">{comment.text}</span>
                </div>
              ))}
            </div>
          )}
          <div className="comment-input-container">
            <Input
              placeholder="Add comment"
              value={this.state.commentDrafts[item.id] || ""}
              onChange={event => this.handleCommentChange(item.id, event)}
              onPressEnter={() => this.handleCommentSubmit(item.id)}
            />
          </div>
        </Card>
      </List.Item>
    );
  };

  render() {
    return (
      <InfiniteScroll
        initialLoad={false}
        pageStart={0}
        loadMore={this.handleInfiniteOnLoad}
        hasMore={!this.state.loading && this.state.hasMore}
        loader={<LoadingIndicator />}
      >
        <List
          dataSource={this.state.feed}
          renderItem={item => this.getPostRender(item)}
          split={false}
        />
      </InfiniteScroll>
    );
  }
}

export default PostList;
