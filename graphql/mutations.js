const bcrypt = require("bcryptjs");

const validator = require("validator");
const User = require("../models/user");
const Post = require("../models/post");
const Comment = require("../models/comment");
const ToDo = require("../models/ToDo");

module.exports = {
  /*--------------------------------------------- 
  ---------- CREATE USER FUNCTION ---------------
  -----------------------------------------------*/
  createUser: async function(parent, { input }) {
    const errors = [];
    if (
      validator.isEmpty(input.name) ||
      !validator.isLength(input.name, { min: 3 })
    ) {
      errors.push({ msg: "El nombre debe tener al menos 3 caracteres" });
    }
    if (
      validator.isEmpty(input.lastName) ||
      !validator.isLength(input.lastName, { min: 3 })
    ) {
      errors.push({ msg: "El apellido debe tener al menos 3 caracteres" });
    }
    if (
      validator.isEmpty(input.password) ||
      !validator.isLength(input.password, { min: 5 })
    ) {
      errors.push({ msg: "El paswword debe tener al menos 5 caracteres" });
    }
    if (!validator.isEmail(input.email)) {
      errors.push({ msg: "Email no valido!!" });
    }
    if (errors.length > 0) {
      const error = new Error("Entrada no valida!");
      error.data = errors;
      error.code = 422; // no es estrictamente necesario
      throw error;
    }

    const userExist = await User.findOne({ email: input.email });
    if (userExist) {
      throw new Error("Un usuario con ese email ya existe!");
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPsw = await bcrypt.hash(input.password, salt);

    const user = await new User({
      name: input.name,
      lastName: input.lastName,
      email: input.email,
      password: hashedPsw
    });

    const savedUser = await user.save();
    return {
      ...savedUser._doc,
      _id: savedUser._id.toString()
    };
  },
  /*--------------------------------------------- 
  ---------- DELETE USER FUNCTION ---------------
  -----------------------------------------------*/
  deleteUser: async function(parent, { _id }) {
    if (!_id) {
      const error = new Error("Id no proporcionado!");
      error.code = 404;
      throw error;
    }
    const user = await User.findById(_id);
    if (!user) {
      const error = new Error("Usuario no encontrado!");
      error.code = 404;
      throw error;
    }

    try {
      await User.findByIdAndRemove(_id);
    } catch (error) {
      console.log(error);
      throw new Error("No fue posible eliminar el usuario");
    }

    return true;
  },
  /*--------------------------------------------- 
  ---------- CREATE POST FUNCTION ---------------
  -----------------------------------------------*/
  createPost: async function(parent, { title, body, creator }) {
    const errors = [];
    if (validator.isEmpty(title) || !validator.isLength(title, { min: 3 })) {
      errors.push({ msg: "El titulo debe tener al menos 3 caracteres" });
    }
    if (validator.isEmpty(body) || !validator.isLength(body, { min: 3 })) {
      errors.push({ msg: "El body debe tener al menos 3 caracteres" });
    }
    if (validator.isEmpty(creator)) {
      errors.push({ msg: "No se proporciono ID del autor!" });
    }
    if (errors.length > 0) {
      const error = new Error("Entrada no valida!");
      error.data = errors;
      error.code = 422; // no es estrictamente necesario
      throw error;
    }

    const user = await User.findById(creator);
    if (!user) {
      const error = new Error("Usuario no encontrado!");
      error.code = 404;
      throw error;
    }
    const post = await new Post({
      title: title,
      body: body,
      creator: user
    });

    const savedPost = await post.save();
    await user.posts.push(savedPost);
    await user.save();

    return {
      ...savedPost._doc,
      _id: savedPost._id.toString(),
      createdAt: savedPost.createdAt.toISOString(),
      updatedAt: savedPost.updatedAt.toISOString()
    };
  },
  /*--------------------------------------------- 
  ---------- UPDATE POST FUNCTION ---------------
  -----------------------------------------------*/
  updatePost: async function(parent, { title, body, postId }) {
    const errors = [];
    if (validator.isEmpty(title) || !validator.isLength(title, { min: 3 })) {
      errors.push({ msg: "El titulo debe tener al menos 3 caracteres" });
    }
    if (validator.isEmpty(body) || !validator.isLength(body, { min: 3 })) {
      errors.push({ msg: "El body debe tener al menos 3 caracteres" });
    }
    if (errors.length > 0) {
      const error = new Error("Entrada no valida!");
      error.data = errors;
      error.code = 422; // no es estrictamente necesario
      throw error;
    }
    try {
      const post = await Post.findById(postId);
      if (!post) {
        const error = new Error("Post no encontrado!");
        error.code = 404;
        throw error;
      }
      post.title = title;
      post.body = body;
      const updatedPost = await post.save();
      return {
        ...updatedPost._doc,
        _id: updatedPost._id.toString(),
        createdAt: updatedPost.createdAt.toISOString(),
        updatedAt: updatedPost.updatedAt.toISOString()
      };
    } catch (error) {
      console.log("Error al actualizar Post");
      console.log(error);
      throw new Error("Error al actualizar Post!");
    }
  },
  /*--------------------------------------------- 
  ---------- DELETE POST FUNCTION ---------------
  -----------------------------------------------*/
  deletePost: async function(parent, { postId }) {
    const post = await Post.findById(postId);
    if (!post) {
      const error = new Error("Post no encontrado");
      error.code = 404;
      throw error;
    }

    try {
      await Post.findByIdAndRemove(postId);
    } catch (error) {
      console.log("Error al eliminar post");
      console.log(error);
      throw new Error("No fue posible eliminar Post, intenta más tarde");
    }

    return true;
  },
  /*--------------------------------------------- 
  ---------- CREATE ToDo FUNCTION ---------------
  -----------------------------------------------*/
  createTodo: async function(parent, { name, creator }) {
    const errors = [];
    if (validator.isEmpty(name) || !validator.isLength(name, { min: 3 })) {
      errors.push({ msg: "La tarea debe tener al menos 3 caracteres" });
    }
    if (errors.length > 0) {
      const error = new Error("Entrada no valida!");
      error.data = errors;
      error.code = 422;
      throw error;
    }
    const user = await User.findById(creator);
    if (!user) {
      const error = new Error("Usuario no encontrado!");
      error.code = 404;
      throw error;
    }

    const todo = new ToDo({
      name,
      creator: user
    });
    const savedTodo = await todo.save();
    await user.todos.push(savedTodo);
    await user.save();

    return {
      ...savedTodo._doc,
      _id: savedTodo._id.toString(),
      createdAt: savedTodo.createdAt.toISOString(),
      updatedAt: savedTodo.updatedAt.toISOString()
    };
  },
  /*--------------------------------------------- 
  ---------- CREATE COMMENT FUNCTION ---------------
  -----------------------------------------------*/
  createComment: async function(parent, { name, body, postId, creatorId }) {
    const errors = [];
    if (validator.isEmpty(name) || !validator.isLength(name, { min: 3 })) {
      errors.push({
        msg: "El nombre del comentario debe tener al menos 3 caracteres"
      });
    }
    if (validator.isEmpty(body) || !validator.isLength(body, { min: 3 })) {
      errors.push({
        msg: "El cuerpo del comentario debe tener al menos 3 caracteres"
      });
    }
    const post = await Post.findById(postId);
    if (!post) {
      const error = new Error("Post no encontrado!");
      error.code = 404;
      throw error;
    }
    const user = await User.findById(creatorId);
    if (!user) {
      const error = new Error("Usuario no encontrado!");
      error.code = 404;
      throw error;
    }

    const comment = new Comment({
      name,
      body,
      post,
      creator: user
    });
    let savedComment;
    try {
      savedComment = await comment.save();
      await post.comments.push(savedComment);
      await user.comments.push(savedComment);
      await post.save();
      await user.save();
    } catch (error) {
      console.log("Error desde crear cometario!!");
      console.log(error);
      throw new Error("Error al crear comentario!");
    }

    return {
      ...savedComment._doc,
      _id: savedComment._id.toString(),
      createdAt: savedComment.createdAt.toISOString(),
      updatedAt: savedComment.updatedAt.toISOString()
    };
  }
};
