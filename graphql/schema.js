// GraphQL Schema or typeDefs
module.exports = `
    type Post {
        _id: ID!
        title: String!
        body: String!
        creator: User!
        comments: [Comment!]!
        createdAt: String!
        updatedAt: String!
    }
    input userInputData {
        name: String!
        lastName: String!
        email: String!
        password: String!
    }
    type usersData {
        users: [User!]!
        totalUsers: Int!
    }
    type Comment {
        _id: ID!
        name:String!
        body:String!
        post: Post!
        creator: User!
        createdAt: String!
        updatedAt: String!
    }
    type Todo {
        _id: ID!
        name:String!
        completed:Boolean
        creator: User!
        createdAt: String!
        updatedAt: String!
    }
    type User {
        _id: ID!
        name: String!
        lastName: String!
        email:String!
        password: String!
        posts: [Post]!
        comments: [Comment!]!
        todos: [Todo!]!
    }
    type Query {
        "Devuelve todos los usuarios"
        getUsers: usersData!
        "Devuelve un usuario"
        getUser(_id: ID!): User!
        "Devuelve todos los Post!"
        getPosts: [Post]!
        "Devuelve posts de un Usuario!"
        getPostsByUser(userId : ID!):[Post!]!
        "Devuelve un Post!"
        getPost(_id: ID!): Post!
    }
    type Mutation {
        "Crea un usuario"
      createUser(input: userInputData!): User!
      "Borra un usuario"
      deleteUser(_id: ID!): Boolean
      "Crea un Post!"
      createPost(title:String!, body:String!, creator:ID!):Post!
      "Actuliza un Post"
      updatePost(title:String!, body:String!, postId:ID!):Post!
      "Borra un Post!"
      deletePost(postId: ID!): Boolean
      "Crea un comentario!"
      createComment(name:String!, body:String!, postId:ID!, creatorId:ID!): Comment!
      "Crea una tarea"
      createTodo(name:String!,  creator:ID!): Todo
    }
  schema {
      query: Query
      mutation:Mutation
  }
`;
