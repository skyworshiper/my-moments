import React, { Component } from "react";
import { Empty, List, Popconfirm, Icon, message } from "antd";
import LoadingIndicator from "../../common/LoadingIndicator";
import "./postgrid.css";
import { deletePost } from "../../util/ApiUtil";

class PostGrid extends Component {
  state = { isLoading: false };

  componentDidMount = () => {
    this.setState({ isLoading: true });
    this.props.onGetUserPosts();
    this.setState({ isLoading: false });
  };

  handleDelete = item => {
    deletePost(item.id)
      .then(() => {
        message.success("Post deleted");
        if (this.props.onGetUserPosts) {
          this.props.onGetUserPosts();
        }
      })
      .catch(error =>
        message.error(error.message || "Unable to delete post")
      );
  };

  render() {
    if (this.state.isLoading) {
      return <LoadingIndicator />;
    }

    if (!Array.isArray(this.props.posts) || !this.props.posts.length) {
      return (
        <Empty
          image="https://gw.alipayobjects.com/mdn/miniapp_social/afts/img/A*pevERLJC9v0AAAAAAAAAAABjAQAAAQ/original"
          description={<span>No Posts Yet</span>}
        />
      );
    }

    return (
      <div>
        <List
          grid={{ gutter: 16, column: 3 }}
          dataSource={this.props.posts}
          renderItem={item => (
            <List.Item>
              <div className="img-card">
                {this.props.showCaption !== false &&
                  item.caption &&
                  item.caption.trim() && (
                  <div className="grid-caption">{item.caption}</div>
                )}
                <div className="img-container">
                  {this.props.canDelete && (
                    <Popconfirm
                      title="Delete this post?"
                      onConfirm={() => this.handleDelete(item)}
                      okText="Delete"
                      cancelText="Cancel"
                    >
                      <Icon type="delete" className="grid-delete-icon" />
                    </Popconfirm>
                  )}
                  <img alt={item.id} src={item.imageUrl} />
                </div>
              </div>
            </List.Item>
          )}
        />
      </div>
    );
  }
}

export default PostGrid;
