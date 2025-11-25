import React, { Component } from "react";
import Slider from "react-slick";
import "./discover.css";
import { Card, Avatar, Button, Input, Empty, message } from "antd";
import { follow, searchUsers } from "../../util/ApiUtil";
import { ACCESS_TOKEN } from "../../common/constants";
import LoadingIndicator from "../../common/LoadingIndicator";

const { Meta } = Card;
const { Search } = Input;

class Discover extends Component {
  state = {
    isLoading: false,
    users: [],
    query: "",
    followStates: {}
  };

  componentDidMount = () => {
    if (!localStorage.getItem(ACCESS_TOKEN)) {
      this.props.history.push("/login");
    }

    this.loadUsers("");
  };

  loadUsers = query => {
    this.setState({ isLoading: true, query });

    searchUsers(query)
      .then(response => this.setState({ users: response, isLoading: false }))
      .catch(error => {
        console.log("failed to search users", error);
        this.setState({ isLoading: false });
      });
  };

  handleOnCardClick = username => {
    this.props.history.push("/users/" + username);
  };

  handleFollow = user => {
    if (user.username === this.props.currentUser.username) {
      return;
    }

    const followState = this.state.followStates[user.username];
    if (followState && followState.loading) {
      return;
    }

    this.setState(prevState => ({
      followStates: {
        ...prevState.followStates,
        [user.username]: { loading: true, following: false }
      }
    }));

    const followRequest = {
      follower: this.props.currentUser,
      following: {
        id: user.id,
        username: user.username,
        name: user.name,
        profilePicture: user.profilePicture
      }
    };

    follow(followRequest)
      .then(() => {
        this.setState(prevState => ({
          followStates: {
            ...prevState.followStates,
            [user.username]: { loading: false, following: true }
          }
        }));
        message.success(`You are now following ${user.username}`);
      })
      .catch(error => {
        message.error(error.message || "Follow failed, please try again later");
        this.setState(prevState => ({
          followStates: {
            ...prevState.followStates,
            [user.username]: { loading: false, following: false }
          }
        }));
      });
  };

  handleSearch = value => {
    this.loadUsers(value.trim());
  };

  handleInputChange = event => {
    const value = event.target.value;
    this.setState({ query: value });
    if (!value) {
      this.loadUsers("");
    }
  };

  render() {
    if (this.state.isLoading) {
      return <LoadingIndicator />;
    }

    var settings = {
      infinite: false,
      slidesToShow: 4,
      slidesToScroll: 4
    };

    const filteredUsers = this.state.users.filter(
      user => user.username !== this.props.currentUser.username
    );

    return (
      <div className="discover-container">
        <div className="title">
          <h3>Discover people</h3>
        </div>
        <div className="discover-search">
          <Search
            placeholder="Search by name or username"
            value={this.state.query}
            onChange={this.handleInputChange}
            onSearch={this.handleSearch}
            enterButton
            allowClear
          />
        </div>
        {filteredUsers.length === 0 ? (
          <Empty description="No users found" />
        ) : (
        <Slider {...settings}>
          {filteredUsers.map(user => {
            const followState = this.state.followStates[user.username] || {};
            const isFollowing = followState.following;

            return (
              <div key={user.id || user.username}>
                <Card
                  hoverable
                  style={{ width: 230 }}
                  cover={
                    <div
                      onClick={() => this.handleOnCardClick(user.username)}
                      className="avatar-container"
                    >
                      <Avatar
                        className="avatar"
                        src={user.profilePicture}
                      />
                    </div>
                  }
                  actions={[
                    <Button
                      type={isFollowing ? "default" : "primary"}
                      className="follow-btn"
                      loading={followState.loading}
                      onClick={() => this.handleFollow(user)}
                      disabled={isFollowing}
                    >
                      {isFollowing ? "Following" : "Follow"}
                    </Button>
                  ]}
                >
                  <Meta
                    onClick={() => this.handleOnCardClick(user.username)}
                    className="card-meta"
                    title={user.name}
                    description={"@" + user.username}
                  />
                </Card>
              </div>
            );
          })}
        </Slider>
        )}
      </div>
    );
  }
}

export default Discover;
