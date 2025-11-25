import React, { Component } from "react";
import "./newsfeed.css";
import { Row, Col } from "antd";
import { ACCESS_TOKEN } from "../../common/constants";
import PostList from "./PostList";
import Suggestions from "../../common/Suggestions";

class NewsFeed extends Component {
  state = { currentUser: { ...this.props.currentUser } };

  componentDidMount = () => {
    if (!localStorage.getItem(ACCESS_TOKEN)) {
      this.props.history.push("/login");
    }
  };

  render() {
    return (
      <div className="feed-container">
        <Row>
          <Col span={17}>
            <PostList currentUser={this.state.currentUser} />
          </Col>
          <Col className="feed-user-detail-col" span={7}>
            <Suggestions currentUser={this.state.currentUser} />
          </Col>
        </Row>
      </div>
    );
  }
}

export default NewsFeed;
