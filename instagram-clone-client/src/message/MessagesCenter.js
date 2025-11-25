import React, { Component } from "react";
import {
  Drawer,
  List,
  Input,
  Button,
  Empty,
  Spin,
  message as antdMessage,
  Icon
} from "antd";
import {
  getConversationSummaries,
  getConversationWith,
  sendMessage
} from "../util/ApiUtil";
import "./messages.css";

const { Search, TextArea } = Input;

class MessagesCenter extends Component {
  state = {
    isDrawerVisible: false,
    isLoadingSummaries: false,
    isLoadingConversation: false,
    isSending: false,
    summaries: [],
    selectedUser: null,
    conversation: [],
    messageText: ""
  };

  openDrawer = () => {
    this.setState({ isDrawerVisible: true }, () => {
      this.loadSummaries();
    });
  };

  closeDrawer = () => {
    this.setState({ isDrawerVisible: false });
  };

  loadSummaries = () => {
    this.setState({ isLoadingSummaries: true });
    getConversationSummaries()
      .then(response => {
        this.setState({ summaries: response || [], isLoadingSummaries: false });
      })
      .catch(() => {
        this.setState({ isLoadingSummaries: false });
        antdMessage.error("Unable to load conversations");
      });
  };

  loadConversation = username => {
    if (!username) {
      return;
    }
    this.setState({ isLoadingConversation: true, selectedUser: username });
    getConversationWith(username)
      .then(response => {
        this.setState({
          conversation: response || [],
          isLoadingConversation: false
        });
      })
      .catch(() => {
        this.setState({ isLoadingConversation: false });
        antdMessage.error("Unable to load conversation");
      });
  };

  handleSend = () => {
    const { selectedUser, messageText } = this.state;
    if (!selectedUser) {
      antdMessage.warning("请选择一个聊天对象");
      return;
    }
    if (!messageText.trim()) {
      return;
    }

    this.setState({ isSending: true });
    sendMessage({
      receiverUsername: selectedUser,
      content: messageText.trim()
    })
      .then(response => {
        this.setState(prevState => ({
          conversation: [...prevState.conversation, response],
          messageText: "",
          isSending: false
        }));
        this.loadSummaries();
      })
      .catch(() => {
        this.setState({ isSending: false });
        antdMessage.error("发送失败，请稍后再试");
      });
  };

  handleSearchUser = value => {
    if (!value) {
      return;
    }
    this.loadConversation(value.trim());
  };

  renderConversation() {
    const { selectedUser, conversation, isLoadingConversation } = this.state;
    if (!selectedUser) {
      return null;
    }

    if (isLoadingConversation) {
      return (
        <div className="messages-loading">
          <Spin />
        </div>
      );
    }

    if (!conversation.length) {
      return (
        <div className="messages-empty-chat">
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description="还没有消息，开始对话吧"
          />
        </div>
      );
    }

    return (
      <div className="message-thread">
        {conversation.map(message => {
          const isMe =
            this.props.currentUser &&
            message.senderUsername === this.props.currentUser.username;
          return (
            <div
              key={message.id}
              className={`message-bubble ${isMe ? "me" : "friend"}`}
            >
              <div className="message-content">{message.content}</div>
              <div className="message-time">
                {new Date(message.createdAt).toLocaleTimeString("zh-CN", {
                  hour: "2-digit",
                  minute: "2-digit"
                })}
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  render() {
    const {
      isDrawerVisible,
      summaries,
      selectedUser,
      isLoadingSummaries,
      messageText,
      isSending
    } = this.state;

    return (
      <>
        <span className="messages-trigger" onClick={this.openDrawer}>
          <Icon type="message" />
        </span>
        <Drawer
          title={
            <div className="messages-header">
              <span>消息</span>
            </div>
          }
          width={600}
          onClose={this.closeDrawer}
          visible={isDrawerVisible}
          className="messages-drawer"
        >
          <div className="messages-container">
            <div className="messages-sidebar">
              <div className="messages-search">
                <Search
                  placeholder="搜索用户..."
                  onSearch={this.handleSearchUser}
                  allowClear
                />
              </div>
              <div className="messages-list">
                {isLoadingSummaries ? (
                  <div className="messages-loading">
                    <Spin />
                  </div>
                ) : summaries.length ? (
                  <List
                    dataSource={summaries}
                    renderItem={item => (
                      <List.Item
                        className={`messages-list-item ${
                          selectedUser === item.username ? "selected" : ""
                        }`}
                        onClick={() => this.loadConversation(item.username)}
                      >
                        <div className="messages-list-avatar">
                          <Icon type="user" />
                        </div>
                        <div className="messages-list-content">
                          <div className="messages-list-name">{item.username}</div>
                          <div className="messages-list-preview">
                            {item.lastMessage || "开始聊天"}
                          </div>
                        </div>
                        {item.lastMessageAt && (
                          <div className="messages-list-time">
                            {new Date(item.lastMessageAt).toLocaleTimeString(
                              "zh-CN",
                              { hour: "2-digit", minute: "2-digit" }
                            )}
                          </div>
                        )}
                      </List.Item>
                    )}
                  />
                ) : (
                  <div className="messages-empty">
                    <Empty
                      image={Empty.PRESENTED_IMAGE_SIMPLE}
                      description="暂无会话"
                    />
                  </div>
                )}
              </div>
            </div>
            <div className="messages-content">
              {selectedUser ? (
                <>
                  <div className="messages-chat-header">
                    <span className="messages-chat-name">{selectedUser}</span>
                  </div>
                  <div className="messages-chat-area">
                    {this.renderConversation()}
                  </div>
                  <div className="messages-composer">
                    <TextArea
                      rows={2}
                      value={messageText}
                      onChange={e =>
                        this.setState({ messageText: e.target.value })
                      }
                      placeholder="输入消息..."
                      onPressEnter={e => {
                        if (!e.shiftKey) {
                          e.preventDefault();
                          this.handleSend();
                        }
                      }}
                    />
                    <Button
                      type="primary"
                      onClick={this.handleSend}
                      loading={isSending}
                      disabled={!messageText.trim()}
                      className="messages-send-btn"
                    >
                      发送
                    </Button>
                  </div>
                </>
              ) : (
                <div className="messages-welcome">
                  <Icon type="message" className="messages-welcome-icon" />
                  <div className="messages-welcome-text">
                    选择一个会话开始聊天
                  </div>
                  <div className="messages-welcome-hint">
                    在左侧搜索用户或选择已有会话
                  </div>
                </div>
              )}
            </div>
          </div>
        </Drawer>
      </>
    );
  }
}

export default MessagesCenter;

