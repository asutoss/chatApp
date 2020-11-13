const { GraphQLServer, PubSub } = require("graphql-yoga");

const messages = [];
const members = [];

const typeDefs = `
  type Message {
    id: ID!
    user: String!
    content: String!
  }

  type Member {
    id: ID!
    name: String!
  }

  type Query {
    messages: [Message!]
    members: [Member!]
  }

  type Mutation {
    postMessage(user: String!, content: String!): ID!
    addMember(name: String!): ID!
  }

  type Subscription {
    messages: [Message!]
    members: [Member!]
  }
`;

const subscribers = [];
const onMessagesUpdates = (fn) => subscribers.push(fn);

const resolvers = {
  Query: {
    messages: () => messages,
    members: () => members,
  },
  Mutation: {
    postMessage: (parent, { user, content }) => {
      const id = messages.length;
      messages.push({
        id,
        user,
        content,
      });
      subscribers.forEach((fn) => fn());
      return id;
    },
    addMember: (parent, { name }) => {
      const id = members.length;
      members.push({
        id,
        name
      });
      subscribers.forEach((fn) => fn());
      return id;
    },
  },
  Subscription: {
    messages: {
      subscribe: (parent, args, { pubsub }) => {
        const channel = Math.random().toString(36).slice(2, 15);
        onMessagesUpdates(() => pubsub.publish(channel, { messages }));
        setTimeout(() => pubsub.publish(channel, { messages }), 0);
        return pubsub.asyncIterator(channel);
      },
    },
    members: {
      subscribe: (parent, args, { pubsub }) => {
        const channel = Math.random().toString(36).slice(2, 15);
        onMessagesUpdates(() => pubsub.publish(channel, { members }));
        setTimeout(() => pubsub.publish(channel, { members }), 0);
        return pubsub.asyncIterator(channel);
      },
    },
  },
};

const pubsub = new PubSub();
const server = new GraphQLServer({ typeDefs, resolvers, context: { pubsub } });
server.start(({ port }) => {
  console.log(`Server on http://localhost:${port}/`);
});
