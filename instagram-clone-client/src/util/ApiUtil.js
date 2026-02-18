import { API_BASE_URL, ACCESS_TOKEN } from "../common/constants";

const request = options => {
  const headers = new Headers();

  if (options.setContentType !== false) {
    headers.append("Content-Type", "application/json");
  }

  if (localStorage.getItem(ACCESS_TOKEN)) {
    headers.append(
      "Authorization",
      "Bearer " + localStorage.getItem(ACCESS_TOKEN)
    );
  }

  const defaults = { headers: headers };
  options = Object.assign({}, defaults, options);

  return fetch(options.url, options).then(response =>
    response.json().then(json => {
      if (!response.ok) {
        return Promise.reject(json);
      }
      return json;
    })
  );
};

export function login(loginRequest) {
  return request({
    url: API_BASE_URL + "/auth/signin",
    method: "POST",
    body: JSON.stringify(loginRequest)
  });
}

export function signup(signupRequest) {
  return request({
    url: API_BASE_URL + "/auth/users",
    method: "POST",
    body: JSON.stringify(signupRequest)
  });
}

export function getCurrentUser() {
  if (!localStorage.getItem(ACCESS_TOKEN)) {
    return Promise.reject("No access token set.");
  }

  return request({
    url: API_BASE_URL + "/auth/users/me",
    method: "GET"
  });
}

export function getUserProfile(username) {
  if (!localStorage.getItem(ACCESS_TOKEN)) {
    return Promise.reject("No access token set.");
  }

  return request({
    url: API_BASE_URL + "/auth/users/summary/" + username,
    method: "GET"
  });
}

export function getAllUsers() {
  if (!localStorage.getItem(ACCESS_TOKEN)) {
    return Promise.reject("No access token set.");
  }

  return request({
    url: API_BASE_URL + "/auth/users",
    method: "GET"
  });
}

export function searchUsers(query, limit = 20) {
  if (!localStorage.getItem(ACCESS_TOKEN)) {
    return Promise.reject("No access token set.");
  }

  const params = new URLSearchParams();
  if (query) {
    params.append("q", query);
  }
  params.append("limit", limit);

  return request({
    url: API_BASE_URL + "/auth/users/search?" + params.toString(),
    method: "GET"
  });
}

export function uploadImage(uploadImageRequest) {
  if (!localStorage.getItem(ACCESS_TOKEN)) {
    return Promise.reject("No access token set.");
  }

  return request({
    setContentType: false,
    url: API_BASE_URL + "/media/images",
    method: "POST",
    body: uploadImageRequest
  });
}

export function updateProfilePicture(uri) {
  if (!localStorage.getItem(ACCESS_TOKEN)) {
    return Promise.reject("No access token set.");
  }

  return request({
    url: API_BASE_URL + "/auth/users/me/picture",
    method: "PUT",
    body: uri
  });
}

export function createPost(createPostRequest) {
  if (!localStorage.getItem(ACCESS_TOKEN)) {
    return Promise.reject("No access token set.");
  }

  return request({
    url: API_BASE_URL + "/post/posts",
    method: "POST",
    body: JSON.stringify(createPostRequest)
  });
}

export function getCurrentUserPosts() {
  if (!localStorage.getItem(ACCESS_TOKEN)) {
    return Promise.reject("No access token set.");
  }

  return request({
    url: API_BASE_URL + "/post/posts/me",
    method: "GET"
  });
}

export function getUserPosts(username) {
  if (!localStorage.getItem(ACCESS_TOKEN)) {
    return Promise.reject("No access token set.");
  }

  return request({
    url: API_BASE_URL + "/post/posts/" + username,
    method: "GET"
  });
}

export function follow(followRequest) {
  if (!localStorage.getItem(ACCESS_TOKEN)) {
    return Promise.reject("No access token set.");
  }

  return request({
    url: API_BASE_URL + "/graph/users/followers",
    method: "POST",
    body: JSON.stringify(followRequest)
  });
}

export function unfollow(followRequest) {
  if (!localStorage.getItem(ACCESS_TOKEN)) {
    return Promise.reject("No access token set.");
  }

  return request({
    url: API_BASE_URL + "/graph/users/followers",
    method: "DELETE",
    body: JSON.stringify(followRequest)
  });
}
export function deletePost(postId) {
  if (!localStorage.getItem(ACCESS_TOKEN)) {
    return Promise.reject("No access token set.");
  }

  const headers = new Headers();
  headers.append(
    "Authorization",
    "Bearer " + localStorage.getItem(ACCESS_TOKEN)
  );

  return fetch(API_BASE_URL + "/post/posts/" + postId, {
    method: "DELETE",
    headers: headers
  }).then(response => {
    if (!response.ok) {
      return response.json().then(json => Promise.reject(json));
    }
    // 204 No Content 没有响应体，直接返回成功
    if (response.status === 204) {
      return Promise.resolve();
    }
    return response.json();
  });
}
export function getfollowersAndFollowing(username) {
  if (!localStorage.getItem(ACCESS_TOKEN)) {
    return Promise.reject("No access token set.");
  }

  return request({
    url: API_BASE_URL + "/graph/users/" + username + "/degree",
    method: "GET"
  });
}

export function isFollowing(usernameA, usernameB) {
  if (!localStorage.getItem(ACCESS_TOKEN)) {
    return Promise.reject("No access token set.");
  }

  return request({
    url: API_BASE_URL + "/graph/users/" + usernameA + "/following/" + usernameB,
    method: "GET"
  });
}

export function getfollowers(username) {
  if (!localStorage.getItem(ACCESS_TOKEN)) {
    return Promise.reject("No access token set.");
  }

  return request({
    url: API_BASE_URL + "/graph/users/" + username + "/followers",
    method: "GET"
  });
}

export function getfollowing(username) {
  if (!localStorage.getItem(ACCESS_TOKEN)) {
    return Promise.reject("No access token set.");
  }

  return request({
    url: API_BASE_URL + "/graph/users/" + username + "/following",
    method: "GET"
  });
}

export function getFeed(username, pagingState) {
  if (!localStorage.getItem(ACCESS_TOKEN)) {
    return Promise.reject("No access token set.");
  }

  let url = API_BASE_URL + "/feed/" + username;

  if (pagingState != null) {
    url = url + "?ps=" + pagingState;
  }

  return request({
    url: url,
    method: "GET"
  });
}

export function getSuggestions(username, limit = 5) {
  if (!localStorage.getItem(ACCESS_TOKEN)) {
    return Promise.reject("No access token set.");
  }

  return request({
    url: `${API_BASE_URL}/graph/users/${username}/suggestions?limit=${limit}`,
    method: "GET"
  });
}

export function getPostReactions(postId) {
  if (!localStorage.getItem(ACCESS_TOKEN)) {
    return Promise.reject("No access token set.");
  }

  return request({
    url: API_BASE_URL + "/post/posts/" + postId + "/reactions",
    method: "GET"
  });
}

export function likePost(postId) {
  if (!localStorage.getItem(ACCESS_TOKEN)) {
    return Promise.reject("No access token set.");
  }

  return request({
    url: API_BASE_URL + "/post/posts/" + postId + "/likes",
    method: "POST"
  });
}

export function unlikePost(postId) {
  if (!localStorage.getItem(ACCESS_TOKEN)) {
    return Promise.reject("No access token set.");
  }

  return request({
    url: API_BASE_URL + "/post/posts/" + postId + "/likes",
    method: "DELETE"
  });
}

export function addComment(postId, text) {
  if (!localStorage.getItem(ACCESS_TOKEN)) {
    return Promise.reject("No access token set.");
  }

  return request({
    url: API_BASE_URL + "/post/posts/" + postId + "/comments",
    method: "POST",
    body: JSON.stringify({ text })
  });
}

export function getConversationSummaries() {
  if (!localStorage.getItem(ACCESS_TOKEN)) {
    return Promise.reject("No access token set.");
  }

  return request({
    url: `${API_BASE_URL}/post/messages/conversations`,
    method: "GET"
  });
}

export function getConversationWith(username) {
  if (!localStorage.getItem(ACCESS_TOKEN)) {
    return Promise.reject("No access token set.");
  }

  return request({
    url: `${API_BASE_URL}/post/messages/conversations/${username}`,
    method: "GET"
  });
}

export function sendMessage(messageRequest) {
  if (!localStorage.getItem(ACCESS_TOKEN)) {
    return Promise.reject("No access token set.");
  }

  return request({
    url: `${API_BASE_URL}/post/messages`,
    method: "POST",
    body: JSON.stringify(messageRequest)
  });
}
