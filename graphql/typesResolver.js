const Post = require("../models/post");
const User = require("../models/user");
const Comment = require("../models/comment");
const ToDo = require("../models/ToDo");
module.exports = {
  User: {
    posts: async function(parent, args, ctx, info) {
      const posts = await Post.find({ creator: parent });
      return posts
        ? posts.map(post => {
            return {
              ...post._doc,
              _id: post._id.toString(),
              createdAt: post.createdAt.toISOString(),
              updatedAt: post.updatedAt.toISOString()
            };
          })
        : [];
    },
    comments: async function(parent, args, ctx, info) {
      const comments = await Comment.find({ creator: parent });
      return comments
        ? comments.map(cm => {
            return {
              ...cm._doc,
              _id: cm._id.toString(),
              createdAt: cm.createdAt.toISOString(),
              updatedAt: cm.updatedAt.toISOString()
            };
          })
        : [];
    },
    todos: async function(parent, args, ctx, info) {
      const todos = await ToDo.find({ creator: parent });
      return todos
        ? todos.map(todo => {
            return {
              ...todo._doc,
              _id: todo._id.toString(),
              createdAt: todo.createdAt.toISOString(),
              updatedAt: todo.updatedAt.toISOString()
            };
          })
        : [];
    }
  },
  Post: {
    creator: async function(parent, args, ctx, info) {
      const user = await User.findById(parent.creator);
      if (!user) {
        const error = new Error("Usuario no encontrado!");
        error.code = 404;
        throw error;
      }
      return {
        ...user._doc,
        _id: user._id.toString()
      };
    },
    comments: async function(parent, args, ctx, info) {
      const comments = await Comment.find({ post: parent });
      return comments
        ? comments.map(cm => {
            return {
              ...cm._doc,
              _id: cm._id.toString(),
              createdAt: cm.createdAt.toISOString(),
              updatedAt: cm.updatedAt.toISOString()
            };
          })
        : [];
    }
  },
  Comment: {
    post: async function(parent, args, ctx, info) {
      const post = await Post.findById(parent.post);
      if (!post) {
        const error = new Error("Post no encontrado");
        error.code = 404;
        throw error;
      }
      return {
        ...post._doc,
        _id: post._id.toString(),
        createdAt: post.createdAt.toISOString(),
        updatedAt: post.updatedAt.toISOString()
      };
    },
    creator: async function(parent, args, ctx, info) {
      const user = await User.findById(parent.creator);
      if (!user) {
        const error = new Error("Usuario no encontrado");
        error.code = 404;
        throw error;
      }
      return {
        ...user._doc,
        _id: user._id.toString()
      };
    }
  },
  Todo: {
    creator: async function(parent, args, ctx, info) {
      const user = await User.findById(parent.creator);
      if (!user) {
        const error = new Error("Usuario no encontrado!");
        error.code = 404;
        throw error;
      }
      return {
        ...user._doc,
        _id: user._id.toString()
      };
    }
  }
};
