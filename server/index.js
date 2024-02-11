const express = require("express");
const http = require("http");
const jwt = require("jsonwebtoken");
const { auth } = require("./middleware");
const cors = require("cors");
const bodyParser = require("body-parser");
const { ObjectId } = require("mongodb");
const socketIo = require("socket.io");
const { connectToDb, getDb } = require("./db");
const app = express();

const HTTPserver = http.createServer(app);

const io = socketIo(HTTPserver, {
  cors: {
    origin: [
      "http://localhost:5173",
      "https://jh4pgfv0-5173.euw.devtunnels.ms",
    ],
  },
});

const port = 3000;
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(express.json());

io.use((socket, next) => {
  const authHeader = socket.handshake.auth.token;
  if (!authHeader) {
    return next(new Error("Missing auth header"));
  }

  try {
    const decoded = jwt.verify(authHeader, JWT_SECRET);
    if (decoded && decoded.id) {
      socket.user = decoded;
      return next();
    } else {
      return next(new Error("Incorrect token"));
    }
  } catch (error) {
    return next(error);
  }
});

io.on("connection", async (socket) => {
  let counter = 1;
  console.log(socket.user.id + " connected");
  const channels = db.collection("channels");
  const users = db.collection("users");
  await users.updateOne(
    { _id: new ObjectId(socket.user) },
    { $set: { status: "Online" } }
  );
  socket.on("sendIceCandidate", (iceCandidate, channel) => {
    socket.to(channel).emit("receiveIceCandidate", iceCandidate);
  });
  socket.on("sendOffer", (offer, channel) => {
    socket.to(channel).emit("receiveOffer", offer);
    console.log("offer");
  });
  socket.on("sendNewOffer", (offer, channel) => {
    socket.to(channel).emit("receiveNewOffer", offer);
    console.log("newOffer");
  });
  socket.on("sendAnswer", (answer, channel) => {
    socket.to(channel).emit("receiveAnswer", answer);
    console.log("answer");
  });
  socket.on("sendNewAnswer", (answer, channel) => {
    socket.to(channel).emit("receiveNewAnswer", answer);
    console.log("newAnswer");
  });
  socket.on("send-message", (message, channel) => {
    socket.to(channel).emit("receive-message", message);
    channels.updateOne(
      { _id: new ObjectId(channel) },
      { $push: { messages: message } }
    );
  });
  socket.on("join-channel", (channel) => {
    console.log("joined", channel);
    socket.join(channel);
  });
  socket.on("disconnect", async () => {
    await users.updateOne(
      { _id: new ObjectId(socket.user) },
      { $set: { status: "Offline" } }
    );
    console.log(socket.user.id + " disconnected");
  });
  socket.on("connect_error", (err) => {
    console.log(err.message);
  });
});

const JWT_SECRET = "secret";
let db;
connectToDb((err) => {
  if (!err) {
    HTTPserver.listen(port, () => {
      console.log(`Example app listening on port ${port}`);
    });
    db = getDb();
  }
});

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/users", (req, res) => {
  let dbUsers = [];
  db.collection("users")
    .find()
    .forEach((user) => {
      dbUsers.push(user);
    })
    .then(() => {
      res.status(200).json(dbUsers);
    })
    .catch(() => {
      res.status(500).json({ msg: "could not fetch data" });
    });
});
app.get("/users/:id/", (req, res) => {
  if (ObjectId.isValid(req.params.id)) {
    db.collection("users")
      .findOne({ _id: new ObjectId(req.params.id) })
      .then((doc) => {
        res.status(200).json(doc);
      })
      .catch(() => {
        res.status(500).json({ msg: "error" });
      });
  } else {
    res.status(500).json({ error: "not valid obj id" });
  }
});

app.get("/home", auth, async (req, res) => {
  try {
    const users = db.collection("users");
    const servers = db.collection("servers");
    const channels = db.collection("channels");
    if (!ObjectId.isValid(req.user.id)) {
      return res.status(403).json({ msg: "Invalid ObjectId!" });
    }
    const user = await users.findOne({ _id: new ObjectId(req.user.id) });
    if (!user) {
      return res.status(404).json({ msg: "User not found!" });
    }
    const userServers = await servers
      .find({ users: new ObjectId(req.user.id) })
      .toArray();
    const friends = await users
      .find({ friends: new ObjectId(req.user.id) })
      .toArray();
    const fromRequests = await users
      .find({ friendRequests: { to: new ObjectId(req.user.id) } })
      .toArray();
    const toRequests = await users
      .find({ friendRequests: { from: new ObjectId(req.user.id) } })
      .toArray();
    const projection = { _id: 1, users: 1 };
    const messages = await channels
      .find(
        {
          private: true,
          users: new ObjectId(req.user.id),
        },
        { projection }
      )
      .toArray();
    await Promise.all(
      messages.map(async (message) => {
        const userIdList = message.users.filter((u) => {
          return !u.equals(new ObjectId(req.user.id));
        });
        const projection = { username: 1, picture: 1, status: 1 };
        const userList = await users
          .find({ _id: { $in: userIdList } }, { projection })
          .toArray();
        message.users = userList;
      })
    );

    res.status(200).json({
      user: user,
      servers: userServers,
      friends: friends,
      fromRequests: fromRequests,
      toRequests: toRequests,
      messages: messages,
    });
  } catch (error) {
    console.error(error);
  }
});

app.get("/server/:id", auth, async (req, res) => {
  const userId = new ObjectId(req.user.id);
  const serverId = new ObjectId(req.params.id);
  const servers = db.collection("servers");
  const users = db.collection("users");
  const channels = db.collection("channels");

  const userServers = await servers.find({ users: userId }).toArray();
  const serverUsers = await users
    .find({ servers: new ObjectId(serverId) })
    .toArray();
  const user = await users.findOne({ _id: userId });
  const server = await servers.findOne({ _id: serverId });
  const textChannels = await channels
    .find({ _id: { $in: server.textChannels } })
    .toArray();

  res.status(233).json({
    msg: "Server found",
    server: server,
    userServers: userServers,
    user: user,
    serverUsers: serverUsers,
    textChannels: textChannels,
  });
});
app.get("/channel/friend/:id", auth, async (req, res) => {
  const friend = new ObjectId(req.params.id);
  const user = new ObjectId(req.user.id);
  const users = db.collection("users");
  const channels = db.collection("channels");

  const room = await channels.findOne({ users: [user, friend] });
  if (room) {
    res.status(222).json({ msg: "Found channel", room: room._id });
  } else {
    const newChannel = {
      private: true,
      users: [user, friend],
      messages: [],
    };
    channels.insertOne(newChannel).then((channel) => {
      res
        .status(223)
        .json({ msg: "Created new Channel", channel: channel.insertedId });
    });
  }
});

app.get("/channel/:id", auth, async (req, res) => {
  const roomId = req.params.id;
  const userId = new ObjectId(req.user.id);
  const servers = db.collection("servers");
  const users = db.collection("users");
  const channels = db.collection("channels");

  const userServers = await servers.find({ users: userId }).toArray();
  const user = await users.findOne({ _id: userId });
  const messages = await channels
    .find({
      private: true,
      users: new ObjectId(req.user.id),
    })
    .toArray();
  await Promise.all(
    messages.map(async (message) => {
      const userIdList = message.users.filter((u) => {
        return !u.equals(new ObjectId(req.user.id));
      });
      const projection = { username: 1, picture: 1, status: 1 };
      const userList = await users
        .find({ _id: { $in: userIdList } }, { projection })
        .toArray();
      message.users = userList;
    })
  );

  res.status(200).json({
    user: user,
    servers: userServers,
    messages: messages,
  });
});

app.post("/home/addserver", auth, (req, res) => {
  const inv = req.body.inv;
  const servers = db.collection("servers");
  const users = db.collection("users");
  if (ObjectId.isValid(inv)) {
    servers
      .findOne({ _id: new ObjectId(inv) })
      .then((server) => {
        if (!server) {
          res.status(420).json({ msg: "Invalid invitation code!" });
        } else {
          users.findOne({ _id: new ObjectId(req.user.id) }).then((user) => {
            if (user) {
              userID = new ObjectId(req.user.id);
              if (
                server.users &&
                server.users.some((item) => item.equals(userID))
              ) {
                res.status(440).json({ msg: "User already joined the server" });
              } else {
                const serverUpdate = { $push: { users: user._id } };
                const userUpdate = { $push: { servers: server._id } };
                servers
                  .updateOne({ _id: new ObjectId(inv) }, serverUpdate)
                  .then((result) => {
                    users
                      .updateOne({ _id: new ObjectId(req.user.id) }, userUpdate)
                      .then((result) => {
                        res.status(241).json({
                          msg: "successfully added user to server",
                          server: server,
                        });
                      });
                  });
              }
            }
          });
        }
      })
      .catch((err) => {
        res.status(570).json({ error: err });
      });
  }
});
app.post("/server/:id/addchannel", auth, async (req, res) => {
  const servers = db.collection("servers");
  const channels = db.collection("channels");
  const channelName = req.body.name;
  const textChannel = req.body.textChannel;
  const server = await servers.findOne({ _id: new ObjectId(req.params.id) });
  const channel = {
    private: false,
    name: channelName,
    users: server.users,
    messages: [],
  };
  channels.insertOne(channel).then((result) => {
    if (textChannel) {
      servers
        .updateOne(server, { $push: { textChannels: result.insertedId } })
        .then((inserted) => {
          res.status(210).json({ msg: "Successfully created text channel" });
        });
    } else {
      servers
        .updateOne(server, {
          $push: { voiceChannels: result.insertedId },
        })
        .then((inserted) => {
          res.status(210).json({ msg: "Successfully created voice channel" });
        });
    }
  });
});
app.post("/home/addfriend", auth, (req, res) => {
  const friendReq = req.body.friendReq;
  const users = db.collection("users");
  users
    .findOne({ username: friendReq })
    .then((friend) => {
      if (!friend || friend._id.equals(new ObjectId(req.user.id))) {
        res.status(492).json({ msg: "Invalid username!" });
      } else {
        users
          .findOne({ _id: new ObjectId(req.user.id) })
          .then((user) => {
            if (user) {
              userID = new ObjectId(req.user.id);

              if (
                friend.friends.length > 0 &&
                friend.friends.some((item) => item.equals(userID))
              ) {
                return res
                  .status(490)
                  .json({ msg: "User already in friendlist!" });
              } else if (
                friend.friendRequests.length > 0 &&
                friend.friendRequests.some(
                  (item) => item.from && item.from.equals(userID)
                )
              ) {
                return res.status(491).json({
                  msg: "A friend request has already been sent",
                });
              } else if (
                friend.friendRequests.length > 0 &&
                friend.friendRequests.some(
                  (item) => item.to && item.to.equals(userID)
                )
              ) {
                users
                  .updateOne(
                    { _id: new ObjectId(friend._id) },
                    {
                      $pull: { friendRequests: { to: user._id } },
                      $push: { friends: user._id },
                    }
                  )
                  .then((result) => {
                    users
                      .updateOne(
                        { _id: new ObjectId(user._id) },
                        {
                          $pull: { friendRequests: { from: friend._id } },
                          $push: { friends: friend._id },
                        }
                      )
                      .then((resultt) => {
                        res.status(255).json({
                          msg: "Two way friend requests -> they are friends now",
                        });
                      });
                  });
              } else {
                const friendUpdate = {
                  $push: { friendRequests: { from: user._id } },
                };
                const userUpdate = {
                  $push: { friendRequests: { to: friend._id } },
                };
                users
                  .updateOne({ _id: new ObjectId(friend._id) }, friendUpdate)
                  .then((result) => {
                    users
                      .updateOne({ _id: new ObjectId(user._id) }, userUpdate)
                      .then((result) => {
                        res.status(241).json({
                          msg: "Request has successfully been sent!",
                          friend: friend,
                        });
                      });
                  });
              }
            }
          })
          .catch((err) => {
            res.status(530).json({ error: err });
          });
      }
    })
    .catch((err) => {
      res.status(570).json({ error: err });
    });
});

app.post("/signup", (req, res) => {
  const user = {
    email: req.body.email,
    username: req.body.username,
    password: req.body.password,
    servers: [],
    friends: [],
    friendRequests: [],
    picture: "pfp.png",
    joined: new Date(),
  };
  db.collection("users")
    .findOne({ email: user.email })
    .then((result) => {
      if (result != null) {
        res.status(421).json({ msg: "email found in database", result });
      } else {
        db.collection("users")
          .findOne({ username: user.username })
          .then((result) => {
            if (result != null) {
              res
                .status(422)
                .json({ msg: "username found in database", result });
            } else {
              db.collection("users")
                .insertOne(user)
                .then((result) => {
                  const token = jwt.sign(
                    {
                      id: result._id,
                    },
                    JWT_SECRET
                  );
                  res
                    .status(210)
                    .json({ msg: "new user added to database", token, result });
                })
                .catch((err) => {
                  res.status(500).json({ error: err });
                });
            }
          })
          .catch((err) => {
            res.status(500).json({ error: err });
          });
      }
    })
    .catch((err) => {
      res.status(500).json({ error: err });
    });
});

app.post("/login", (req, res) => {
  const loginUser = {
    email: req.body.email,
    password: req.body.password,
  };
  db.collection("users")
    .findOne({ email: loginUser.email })
    .then((user) => {
      if (user != null) {
        if (user.password === loginUser.password) {
          const token = jwt.sign(
            {
              id: user._id,
            },
            JWT_SECRET
          );
          db.collection("users")
            .updateOne(
              { _id: new ObjectId(user._id) },
              { $set: { status: "Online" } }
            )
            .then((result) => {
              res.status(200).json({ msg: "successful log in!", token });
            });
        } else {
          res.status(431).json({ msg: "Incorrect password!" });
        }
      } else {
        res.status(430).json({ msg: "User not found in database!" });
      }
    })
    .catch((err) => {
      res.status(505).json({ error: err });
    });
});
app.post("/logout", auth, (req, res) => {
  const users = db.collection("users");
  users
    .updateOne(
      { _id: new ObjectId(req.user.id) },
      { $set: { status: "Offline" } }
    )
    .then((result) => {
      res.status(222).json({ msg: "logged out" });
    });
});
app.post("/acceptFriendRequest", auth, (req, res) => {
  const users = db.collection("users");
  const user = new ObjectId(req.user.id);
  const friend = new ObjectId(req.body.friend);
  if (req.body.accept) {
    users
      .updateOne(
        { _id: user },
        {
          $push: { friends: friend },
          $pull: { friendRequests: { from: friend } },
        }
      )
      .then((accepted) => {
        users
          .updateOne(
            { _id: friend },
            {
              $push: { friends: user },
              $pull: { friendRequests: { to: user } },
            }
          )
          .then(async (updated) => {
            const friendUser = await users.findOne({ _id: friend });
            res.status(244).json({
              msg: "successfully accepted friend request",
              friend: friendUser,
            });
          });
      });
  } else {
    users
      .updateOne(
        { _id: user },
        {
          $pull: {
            friendRequests: { from: friend },
          },
        }
      )
      .then((declined) => {
        if (declined.modifiedCount === 0) {
          users
            .updateOne(
              { _id: user },
              {
                $pull: {
                  friendRequests: { to: friend },
                },
              }
            )
            .then((a) => {
              users
                .updateOne(
                  { _id: friend },
                  {
                    $pull: {
                      friendRequests: { from: user },
                    },
                  }
                )
                .then((b) => {
                  res.status(244).json({
                    msg: "successfully declined friend request",
                  });
                });
            });
        } else {
          users
            .updateOne(
              { _id: friend },
              {
                $pull: {
                  friendRequests: { to: user },
                },
              }
            )
            .then((result) => {
              res.status(244).json({
                msg: "successfully declined friend request",
              });
            });
        }
      });
  }
});

app.post("/createserver", auth, (req, res) => {
  const user = new ObjectId(req.user.id);
  const serverName = req.body.name;
  const servers = db.collection("servers");
  const users = db.collection("users");
  const channels = db.collection("channels");

  const firstChannel = {
    name: "general",
    messages: [],
    private: false,
    users: [user],
  };
  channels.insertOne(firstChannel).then((channel) => {
    const server = {
      name: serverName,
      users: [user],
      admins: [user],
      invites: [],
      textChannels: [channel.insertedId],
      voiceChannels: [{ name: "General", joined: [] }],
    };
    servers
      .insertOne(server)
      .then((result) => {
        users
          .updateOne({ _id: user }, { $push: { servers: server._id } })
          .then((update) => {
            res
              .status(250)
              .json({ msg: "Successfully created new server", result: update });
          });
      })
      .catch((err) => {
        console.error(err);
      });
  });
});

app.delete("/users/:id", (req, res) => {
  if (ObjectId.isValid(req.params.id)) {
    db.collection("users")
      .deleteOne({ _id: new ObjectId(req.params.id) })
      .then((result) => {
        res.status(201).json(result);
      })
      .catch((err) => {
        res.status(500).json({ error: "couldnt delete user" });
      });
  } else {
    res.status(500).json({ error: "not valid obj id" });
  }
});

app.patch("/users/:id", (req, res) => {
  const updates = req.body;

  if (ObjectId.isValid(req.params.id)) {
    db.collection("users")
      .updateOne({ _id: new ObjectId(req.params.id) }, { $set: updates })
      .then((result) => {
        res.status(201).json(result);
      })
      .catch((err) => {
        res.status(500).json({ error: "couldnt update user" });
      });
  } else {
    res.status(500).json({ error: "not valid obj id" });
  }
});
