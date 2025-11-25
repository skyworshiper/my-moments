import React, { Component } from "react";
import { Avatar, Button, Empty, List } from "antd";
import { getSuggestions, follow } from "../util/ApiUtil";
import "./Suggestions.css";

class Suggestions extends Component {
  _isMounted = false;

  state = {
    loading: false,
    suggestions: []
  };

  componentDidMount() {
    this._isMounted = true;
    this.loadSuggestions();
  }

  componentDidUpdate(prevProps) {
    if (
      this.props.currentUser &&
      prevProps.currentUser &&
      this.props.currentUser.username !== prevProps.currentUser.username
    ) {
      this.loadSuggestions();
    }
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  safeSetState = updater => {
    if (this._isMounted) {
      this.setState(updater);
    }
  };

  loadSuggestions = () => {
    if (!this.props.currentUser) {
      return;
    }

    this.safeSetState({ loading: true });
    getSuggestions(this.props.currentUser.username)
      .then(response => {
        this.safeSetState({ suggestions: response, loading: false });
      })
      .catch(() => this.safeSetState({ suggestions: [], loading: false }));
  };

  handleFollow = user => {
    if (!this.props.currentUser) {
      return;
    }

    const followRequest = {
      follower: this.props.currentUser,
      following: {
        id: user.userId,
        username: user.username,
        name: user.name,
        profilePicture: user.profilePic
      }
    };

    follow(followRequest)
      .then(() => {
        this.safeSetState(prevState => ({
          suggestions: prevState.suggestions.filter(
            s => s.username !== user.username
          )
        }));
      })
      .catch(() => {});
  };

  render() {
    if (!this.state.loading && this.state.suggestions.length === 0) {
      return (
        <div className="suggestions-card">
          <Empty
            description="No suggestions right now"
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          />
        </div>
      );
    }

    return (
      <div className="suggestions-card">
        <h4>Suggestions For You</h4>
        <List
          dataSource={this.state.suggestions}
          renderItem={item => (
            <List.Item
              actions={[
                <Button size="small" onClick={() => this.handleFollow(item)}>
                  Follow
                </Button>
              ]}
            >
              <List.Item.Meta
                avatar={<Avatar src={item.profilePic} />}
                title={item.username}
                description={item.name}
              />
            </List.Item>
          )}
        />
      </div>
    );
  }
}

export default Suggestions;

