const User = require("../models/user");
const Post = require("../models/post");

module.exports = {
  /*--------------------------------------------- 
  ---------- GET USERS FUNCTION ---------------
  -----------------------------------------------*/
  getUsers: async function () {
    const totalUsers = await User.find().countDocuments();
    const users = await User.find();
    if (!users) {
      throw new Error("No fue posible obtener usuarios");
    }
    return {
      users: users.map((user) => {
        return {
          ...user._doc,
          _id: user._id.toString(),
        };
      }),
      totalUsers: totalUsers,
    };
  },
  /*--------------------------------------------- 
  ---------- GET USER FUNCTION ---------------
  -----------------------------------------------*/
  getUser: async function (parent, { _id }) {
    if (!_id) {
      throw new Error("Es necesario proporcionar el ID!");
    }
    const user = await User.findById(_id);
    if (!user) {
      const error = new Error("Usuario no encontrado!");
      error.code = 404;
      throw error;
    }

    return {
      ...user._doc,
      _id: user._id.toString(),
    };
  },
  /*--------------------------------------------- 
  ---------- GET POSTS FUNCTION ---------------
  -----------------------------------------------*/
  getPosts: async function () {
    const posts = await Post.find();
    if (!posts) {
      const error = new Error("No se encontro ningun Post!");
      error.code = 404;
      throw error;
    }

    if (posts) {
      return posts.map((post) => {
        return {
          ...post._doc,
          _id: post._id.toString(),
          createdAt: post.createdAt.toISOString(),
          updatedAt: post.updatedAt.toISOString(),
        };
      });
    } else {
      return [];
    }
  },
  /*--------------------------------------------- 
  ---------- GET POSTS BY USER FUNCTION -------------
  -----------------------------------------------*/
  getPostsByUser: async function (parent, { email }, ctx, info) {
    const user = await User.find({ email: email });
    if (!user) {
      const error = new Error("Usuario no encontrado!");
      error.code = 404;
      throw error;
    }
    const posts = await Post.find({ creator: user });

    return posts
      ? posts.map((post) => {
          return {
            ...post._doc,
            _id: post._id.toString(),
            createdAt: post.createdAt.toISOString(),
            updatedAt: post.updatedAt.toISOString(),
          };
        })
      : [];
  },
  /*--------------------------------------------- 
  ---------- GET POST FUNCTION ---------------
  -----------------------------------------------*/
  getPost: async function (parent, { _id }) {
    if (!_id) {
      const error = new Error("Es necesario proporcionar ID del Post!");
      error.code = 404;
      throw error;
    }

    const post = await Post.findById(_id);
    if (!post) {
      const error = new Error("Post no encontrado");
      error.code = 404;
      throw error;
    }

    return {
      ...post._doc,
      _id: post._id.toString(),
      createdAt: post.createdAt.toISOString(),
      updatedAt: post.updatedAt.toISOString(),
    };
  },
};
