const express = require('express')
const cors = require('cors')
const pgp = require('pg-promise')(/* options */)
const app = express()
const appRouter = express.Router()
const authRouter = express.Router()
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const multer = require('multer')
const path = require('path')
const { createServer } = require('http')
const { Server } = require('socket.io')

const server = createServer(app)

const io = new Server(server, {
  cors: {
    origin: 'http://127.0.0.1:5173',
  }
})

const userSocketMap = [];
// const userSocketMap = new Map();

io.on('connection', (socket) => {
  // console.log('A user connected', socket.id);


  socket.on('join_private_chat', (data) => {
    const { room, id, profilepic, fullname } = data
    socket.join(room)
    // console.log('user_joined', id);

    // userSocketMap.set(userId, socket.id);

    const existingUser = userSocketMap.find((entry) => entry.id === id);
    if (existingUser) {
      existingUser.socketId = socket.id;
    } else {
      userSocketMap.push({ id, socketId: socket.id, profilepic, fullname });
    }

    // console.log('map', userSocketMap);

  })

  socket.on('send_private_message', (data) => {
    const { room, recipientId, sender, message, senderId } = data;

    // const recipientSocketId = userSocketMap.get(recipientId);
    const recipientEntry = userSocketMap.find((entry) => entry.id === recipientId);
    if (recipientEntry) {
      const recipientSocketId = recipientEntry.socketId;

      socket.to(recipientSocketId).emit('receive_private_message', {
        sender: sender,
        senderId: senderId,
        recipientId: recipientId,
        message: message,
      })

      console.log(recipientSocketId, 'msg', message, 'room', room, 'sender', sender);
    }
  })

  // socket.on('send_friend_request', (data) => {
  //   const { alert, receiverID, senderID } = data;
  //   console.log(data)

  //   db.none('INSERT INTO public.notifications (receiver_id, sender_id, message) VALUES ($1, $2, $3)', [receiverID, senderID, alert])
  //   .then(() => {
  //     console.log('Alert message stored in the database');
  //   })
  //   .catch((error) => {
  //     console.error('Error storing alert message:', error);
  //   });

  //   const recipientEntry = userSocketMap.find((entry) => entry.id === recieverID);
  //   if (recipientEntry) {
  //     const recipientSocketId = recipientEntry.socketId;

  //   socket.to(recipientSocketId).emit('receive_friend_request', {
  //     alert: alert
  //   })
  // }
  //   socket.to('ChatRoom').emit('receive_friend_request', {
  //     alert: alert
  //   })
  // })

  socket.on('send_notification', (data) => {
    const { alert, receiverID, senderID } = data;
    // console.log(data)

    const recipientEntry = userSocketMap.find((entry) => entry.id === receiverID);
    // console.log(recipientEntry)
    if (recipientEntry) {
      const recipientSocketId = recipientEntry.socketId;

      socket.to(recipientSocketId).emit('receive_notification', {
        alert: alert
      })
    }

  })

  socket.on('disconnect', () => {
    // console.log('User disconnected:', socket.id);

    // userSocketMap.forEach((socketId, userId) => {
    //   if (socketId === socket.id) {
    //     userSocketMap.delete(userId);
    //   }
    // })

    const disconnectedSocketId = socket.id;
    const index = userSocketMap.findIndex((entry) => entry.socketId === disconnectedSocketId);
    if (index !== -1) {
      const disconnectedUserId = userSocketMap[index].id;
      userSocketMap.splice(index, 1);
      // console.log('User disconnected:', disconnectedUserId);
    }
  })

})

// -------------------------------------------------------

const saltRounds = 10;
const db = pgp('postgres://postgres:admin@localhost:5432/social_space')

// ---STORAGE--------------------------

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

const storage2 = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/profile-pictures/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const uploadPP = multer({ storage: storage2 });

const storage3 = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/profile-banners/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const uploadPB = multer({ storage: storage3 });
// ----------------------------

app.use(cors())

app.use('/public', express.static('public'))

app.use(express.json())

const jwtMiddleware = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1]

    const decoded = jwt.verify(token, 'social')
    req.user = decoded;
    next()
  } catch (err) {
    res.sendStatus(401)
  }
}

app.use(authRouter)
app.use(appRouter)

appRouter.use(jwtMiddleware)

// -----------------------------------------------
// app.get('/user-socket-map/:userid', (req, res) => {
//   const userid = req.params.userid

//   const userSocketMapData = userSocketMap

//   db.manyOrNone("SELECT users.id, friends.* FROM public.users JOIN public.friends ON users.id = friends.id_friend WHERE friends.id_user = $1", [userid])
//     .then((data) => {
//       // console.log('user-friends',data)
//       const online = userSocketMapData.filter((user) => data.some((friend) => friend.id == user.id))
//       // console.log('socket-filtered',online)
//       res.json(online)

//     }).catch((err) => {
//       res.sendStatus(400)
//       console.log(err)
//     })
// });

// --------posts Route-------------------------

// appRouter.get('/posts/:userid', (req, res) => {
//   const userid = req.params.userid;

//   db.task(t => {
// return t.map('SELECT p.id as postid, p.content, p.image, p.liked, p.date_time, p.filepath, u.id as userid, u.username, u.profilepic, u.fullname FROM public.posts p JOIN public.users u ON p.user_id = u.id ORDER BY p.id DESC', [], post => {

//       return t.map('SELECT p.id AS postid, p.content, p.image, p.liked, p.date_time, p.filepath, u.id AS userid, u.username, u.profilepic, u.fullname \
//       FROM public.posts p JOIN public.users u ON p.user_id = u.id\
//       WHERE (u.id = $1) OR (u.id IN (SELECT id_friend FROM public.friends WHERE id_user = $1)) \
//       ORDER BY p.id DESC;', [userid], post => {
//       return t.any('SELECT c.*, u.fullname, u.profilepic FROM public.comments c JOIN public.users u ON c.user_id = u.id WHERE post_id = $1 ORDER BY id DESC', [post.postid])
//         .then(comments => {
//           post.comments = comments;
//           return post;
//         });

//     }).then(t.batch);
//   })
//     .then(data => {
//       res.json(data)
//     })
//     .catch(error => {
//       res.sendStatus(400)
//       console.log(error)
//     });
// })

// --------------------------------------------
app.get('/', (req, res) => {
  res.send('Hello, Vercel!')
})


/*appRouter.get('/posts/:userid', (req, res) => {
  const userid = req.params.userid;

  db.task((t) => {
    return t.any(
      `SELECT p.id AS postid, p.content, p.image, p.date_time, p.filepath, u.id AS userid, u.username, u.profilepic, u.fullname
      FROM public.posts p
      JOIN public.users u ON p.user_id = u.id
      WHERE (u.id = $1) OR (u.id IN (SELECT id_friend FROM public.friends WHERE id_user = $1))
      ORDER BY p.id DESC;`,
      [userid]
    )
      .then((posts) => {
        const promises = posts.map((post) => {
          const commentsQuery = t.any(
            `SELECT c.*, u.fullname, u.profilepic
            FROM public.comments c
            JOIN public.users u ON c.user_id = u.id
            WHERE post_id = $1
            ORDER BY id DESC`,
            [post.postid]
          );

          const likesQuery = t.any(
            `SELECT l.id, u.fullname, u.profilepic, u.id AS userid
            FROM public.likes l JOIN public.users u ON l.user_liked_id = u.id
            WHERE l.post_liked = $1`,
            [post.postid]
          );

          return Promise.all([commentsQuery, likesQuery])
            .then(([comments, likes]) => {
              post.comments = comments;
              post.likes = likes;
              post.liked_status = Boolean(likes.find((item) => item.userid == userid))
              return post;
            });
        });

        return Promise.all(promises);
      })
      .catch((error) => {
        console.log(error);
        throw error;
      });
  })
    .then((data) => {
      res.json(data);
    })
    .catch((error) => {
      res.sendStatus(400);
      console.log(error);
    });
});

appRouter.get('/userposts/:userid', (req, res) => {
  const userid = req.params.userid;

  db.task((t) => {
    return t.any(
      `SELECT p.id AS postid, p.content, p.image, p.date_time, p.filepath, u.id AS userid, u.username, u.profilepic, u.fullname
      FROM public.posts p
      JOIN public.users u ON p.user_id = u.id
      WHERE (u.id = $1)
      ORDER BY p.id DESC;`,
      [userid]
    )
      .then((posts) => {
        const promises = posts.map((post) => {
          const commentsQuery = t.any(
            `SELECT c.*, u.fullname, u.profilepic
            FROM public.comments c
            JOIN public.users u ON c.user_id = u.id
            WHERE post_id = $1
            ORDER BY id DESC`,
            [post.postid]
          );

          const likesQuery = t.any(
            `SELECT l.id, u.fullname, u.profilepic
            FROM public.likes l JOIN public.users u ON l.user_liked_id = u.id
            WHERE l.post_liked = $1`,
            [post.postid]
          );

          return Promise.all([commentsQuery, likesQuery])
            .then(([comments, likes]) => {
              post.comments = comments;
              post.likes = likes;
              post.liked_status = Boolean(likes.find((item) => item.userid == userid))
              return post;
            });
        });

        return Promise.all(promises);
      })
      .catch((error) => {
        console.log(error);
        throw error;
      });
  })
    .then((data) => {
      res.json(data);
    })
    .catch((error) => {
      res.sendStatus(400);
      console.log(error);
    });
});

//   db.task(t => {
//     return t.map('SELECT p.id as postid, p.content, p.image, p.liked, p.date_time, p.filepath, u.id as userid, u.username, u.profilepic, u.fullname FROM public.posts p JOIN public.users u ON p.user_id = u.id WHERE username = $1 ORDER BY p.id DESC', [req.user.username], post => {
//       return t.any('SELECT c.*, u.fullname, u.profilepic FROM public.comments c JOIN public.users u ON c.user_id = u.id WHERE post_id = $1 ORDER BY id DESC', [post.postid])
//         .then(comments => {
//           post.comments = comments;
//           return post;
//         });

//     }).then(t.batch);
//   })
//     .then(data => {
//       res.json(data)
//     })
//     .catch(error => {
//       res.sendStatus(400)
//       console.log(error)
//     });
// })

appRouter.post('/posts', upload.single('file'), (req, res) => {
  const { content, userid, datetime } = req.body
  const file = req.file;

  let filename = '';
  let filepath = '';

  if (file) {
    filename = file.filename;
    filepath = `uploads/${filename}`
  }

  console.log(req.body)

  db.oneOrNone("INSERT INTO public.posts(content, user_id, date_time, filename, filepath) VALUES ($1, $2, $3, $4, $5) RETURNING *;", [content, userid, datetime, filename, filepath])
    .then((data) => {
      res.json(data)
      console.log(data)
    }).catch(err => {
      res.sendStatus(400)
      console.log(err)
    })
})

// appRouter.post('/posts', (req, res) => {
//   const body = req.body

// console.log('=>',body)
//   db.oneOrNone("INSERT INTO public.posts(content, user_id, date_time) VALUES (${post}, ${userid}, ${datetime}) RETURNING *;", body)
//     .then((data) => {
//       res.json(data)
//       console.log(data)
//     }).catch(err => {
//       res.sendStatus(400)
//       console.log(err)
//     })
// })

appRouter.delete('/posts', (req, res) => {
  const body = req.body
  console.log(body)

  db.one("DELETE FROM public.posts WHERE id = ${id} RETURNING *;", body)
    .then((data) => {
      res.json(data)
      console.log(data)
    }).catch(err => {
      res.sendStatus(400)
      console.log(err)
    })
})

// appRouter.put('/posts', (req, res) => {
//   const body = req.body
//   console.log('body', body)

//   db.one("UPDATE public.posts SET liked = ${liked} WHERE id = ${postid} RETURNING *;", body)

//     .then((data) => {
//       res.json(data)
//       console.log(data)
//     }).catch(err => {
//       res.sendStatus(400)
//       console.log(err)
//     })
// })

appRouter.post('/likes', (req, res) => {
  const body = req.body

  db.one("INSERT INTO public.likes(post_liked, user_liked_id) VALUES (${postid}, ${userid}) RETURNING *;", body)
    .then((data) => {
      // res.json(data)
      // console.log('1', data)
      if (data) {

        // db.manyOrNone("SELECT likes.id, likes.post_liked,likes.like_status, u.fullname, u.profilepic \
        //        FROM public.posts \
        //        JOIN public.likes ON posts.id = likes.post_liked \
        //        JOIN public.users u ON likes.user_liked_id = u.id \
        //        WHERE likes.post_liked = ${postid} \
        // ORDER BY likes.id ASC", body)

        db.one("SELECT likes.id, likes.post_liked, u.fullname, u.profilepic \
        FROM public.posts \
        JOIN public.likes ON posts.id = likes.post_liked \
        JOIN public.users u ON likes.user_liked_id = u.id \
        WHERE (post_liked, user_liked_id) = (${postid}, ${userid})", body)

          .then((data) => {
            data.liked_status = true
            res.json(data)
            // console.log('2', data)
          }).catch((err) => {
            res.sendStatus(400)
            console.log(err)
          })
      };
    }).catch(err => {

      if (err.constraint === 'user_postlike_constraint') {

        db.one("DELETE FROM public.likes WHERE (post_liked, user_liked_id) = (${postid}, ${userid}) RETURNING *;", body)
          .then((data) => {
            data.liked_status = false
            res.status(400).json(data)
            // console.log(data)
          }).catch(err => {
            res.sendStatus(400)
            console.log(err)
          })

      } else {

        res.sendStatus(400)
      }
      // console.log(err)
    })
})

// -----editpost Route-------------------------------------

// appRouter.get('/editpost', (req, res) => {
//   db.manyOrNone(
//     `SELECT * FROM public.posts ORDER BY id DESC`)
//     .then((data) => {
//       res.json(data)
//       console.log(data)
//     }).catch((error) => {
//       res.sendStatus(400)
//       console.log(error)
//     })
// })

appRouter.put('/editpost', (req, res) => {
  const body = req.body

  db.one("UPDATE public.posts SET content = ${edit} WHERE id = ${id} RETURNING *;", body)
    .then((data) => {
      res.json(data)
      console.log(data)
    }).catch((error) => {
      res.sendStatus(400)
      console.log(error)
    })
})

// -----comments Route---------------------------------

appRouter.get('/comments', (req, res) => {

  db.manyOrNone(
    `SELECT * FROM public.comments ORDER BY id DESC`)
    .then((data) => {
      res.json(data)
      console.log(data)
    }).catch((err) => {
      res.sendStatus(400)
      console.log(err)
    })
})

appRouter.post('/comments', (req, res) => {
  const body = req.body

  db.one("INSERT INTO public.comments(content, user_id ,post_id) VALUES (${comment}, ${userid} ,${id}) RETURNING *;", body)
    .then((data) => {
      res.json(data)
      console.log(data)
    }).catch((err) => {
      res.sendStatus(400)
      console.log(err)
    })
})

appRouter.put('/comments', (req, res) => {
  const body = req.body
  console.log('body', body)
  db.one("UPDATE public.comments SET Liked = ${liked} WHERE id = ${id} RETURNING *;", body)
    .then((data) => {
      res.json(data)
      console.log(data)
    }).catch((err) => {
      res.sendStatus(400)
      console.log(err)
    })
})

appRouter.delete('/comments', (req, res) => {
  const body = req.body

  db.one("DELETE FROM public.comments WHERE id = ${id} RETURNING *;", body)
    .then((data) => {
      res.json(data)
      console.log(data)
    }).catch(err => {
      res.sendStatus(400)
      console.log(err)
    })
})

// ----users Route-----------------------------------

appRouter.get('/allusers', (req, res) => {

  db.manyOrNone('SELECT * FROM public.users ORDER BY id DESC')
    .then((data) => {
      res.json(data)
      // console.log(data)
    }).catch((error) => {
      res.sendStatus(400)
      console.log(error)
    })
})

appRouter.get('/users', (req, res) => {

  db.oneOrNone('SELECT * FROM public.users WHERE username = $1', [req.user.username])
    .then((data) => {
      res.json(data)
      // console.log(data)
    }).catch((error) => {
      res.sendStatus(400)
      console.log(error)
    })
})

appRouter.get('/profileuser/:profileid/:userid', (req, res) => {
  const profileid = req.params.profileid
  const userid = req.params.userid
  console.log(profileid)
  console.log(userid)

  db.task((t) => {
    return t.map('SELECT * FROM public.users WHERE id = $1', [profileid], (user) => {

      return t.any('SELECT u.fullname, u.profilepic, f.* FROM public.friends f JOIN public.users u ON f.id_friend = u.id WHERE id_user = $1 ORDER BY id DESC', [profileid])
        .then((followed) => {
          user.followed = followed;

          return t.any('SELECT u.fullname, u.profilepic, f.* FROM public.friends f JOIN public.users u ON f.id_user = u.id WHERE id_friend = $1', [user.id])
            .then((followers) => {
              user.followers = followers;

              return user;
            })
        })
    }).then(t.batch);
  })
    .then((data) => {
      res.json(data);
      // console.log(data)
    })
    .catch((error) => {
      res.sendStatus(400);
      console.log(error);
    });
})

// -----------------------------------------

authRouter.post('/signup', (req, res) => {
  const body = req.body
  let errors = {}

  bcrypt.hash(body.password, saltRounds)
    .then((hashedPassword) => {

      body.password = hashedPassword;

      db.oneOrNone("INSERT INTO public.users(username, password, email, fullname, gender) VALUES (${username}, ${password}, ${email}, ${fullname}, ${gender}) RETURNING *;", body)

        .then((data) => {
          res.json(data)
          console.log(data)
        }).catch((err) => {
          console.log(err)

          if (err.constraint === 'email_check') {
            errors.email1 = 'Invalid Email Address';
          }

          if (err.constraint === 'pwd_constraint_valid_check') {
            errors.password = 'Must be 8 characters and contain one uppercase/lowercase letter and a number';
          }

          if (err.constraint === 'user_username_unique_constraint') {
            errors.username = 'Username not available';
          }

          if (err.constraint === 'user_email_unique_constraint') {
            errors.email = 'Email Address already registered';
          }

          if (Object.keys(errors).length > 0) {
            res.status(400).json(errors)
          } else {
            res.sendStatus(404)
          }

        })
      // .finally(() => {})
    })
})

authRouter.post('/signin', (req, res) => {
  const body = req.body

  db.one("SELECT * FROM public.users WHERE username=${username}", body)
    .then((data) => {
      // console.log(data)

      if (data) {

        bcrypt.compare(body.password, data.password)
          .then((result) => {
            if (result) {
              const token = jwt.sign({ username: data.username }, 'social', { expiresIn: '1h' })

              const refreshToken = jwt.sign({ username: data.username }, 'social', { expiresIn: '30d' });

              res.json({ token, refreshToken })
            } else {
              res.status(401).json("Incorrect Username or Password")
            }
          })
      } else {
        res.status(401).json("Incorrect Username or Password")
      }
    })
    .catch((error) => {
      console.log(error)
      res.status(500).json("Invalid username")
    })
})

authRouter.post('/refresh-token', (req, res) => {
  const { refreshToken } = req.body;

  jwt.verify(refreshToken, 'social', (err, decoded) => {
    if (err) {
      res.status(401).json("Invalid refresh token");
    } else {
      const username = decoded.username;

      const token = jwt.sign({ username }, 'social', { expiresIn: '1h' });
      res.json({ token });
    }
  })
})

// ----------------------------------------------

appRouter.put('/change-bio', (req, res) => {
  const body = req.body
  db.one("UPDATE public.users SET fullname = ${fullname}, gender = ${gender}, dob = ${dob}, status = ${status}, country = ${country} WHERE id = ${userid} RETURNING *;", body)
    .then((data) => {
      res.json(data)
      console.log('this', data)
    }).catch((error) => {
      res.sendStatus(400)
      console.log(error)
    })
})

appRouter.put('/change-aboutme', (req, res) => {
  const body = req.body

  db.one("UPDATE public.users SET about = ${about} WHERE id = ${userid} RETURNING users.about;", body)
    .then((data) => {
      res.json(data)
      console.log(data)
    }).catch((error) => {
      res.sendStatus(400)
      console.log(error)
    })
})

appRouter.put('/change-password', (req, res) => {
  const body = req.body;
  const { userid, current, latest } = body
  console.log('body', body)
  db.one("SELECT * FROM public.users WHERE id = $1", [userid])
    .then((user) => {
      bcrypt.compare(current, user.password)
        .then((result) => {
          if (result) {
            bcrypt.hash(latest, saltRounds)
              .then((hashedPassword) => {
                db.one("UPDATE public.users SET password = $1 WHERE id = $2 RETURNING *;", [hashedPassword, userid])
                  .then(() => {
                    res.status(200).json({ success: 'Password Changed Succesfully' })
                  })
                  .catch((error) => {
                    console.log(error);
                    res.status(500).json("Internal Server Error");
                  });
              })
              .catch((error) => {
                console.log(error);
                res.status(500).json("Internal Server Error");
              });
          } else {
            res.status(401).json({ failed: "Incorrect Current Password" });
          }
        });
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json("Internal Server Error");
    });
});

appRouter.put('/change-profilePic', uploadPP.single('file'), (req, res) => {
  const file = req.file;

  let filename = '';
  let filepath = '';

  if (file) {
    filename = file.filename;
    filepath = `/profile-pictures/${filename}`
  }

  console.log(req.body)

  db.oneOrNone("UPDATE public.users SET profilepic = $1 Where username=$2 RETURNING *;", [filepath, req.user.username])
    .then((data) => {
      res.json(data.profilepic)
      console.log(data)
    }).catch(err => {
      res.sendStatus(400)
      console.log(err)
    })
})

appRouter.put('/change-profileBanner', uploadPB.single('file'), (req, res) => {
  const file = req.file;

  let filename = '';
  let filepath = '';

  if (file) {
    filename = file.filename;
    filepath = `/profile-banners/${filename}`
  }

  console.log(req.body)

  db.oneOrNone("UPDATE public.users SET profilebanner = $1 Where username=$2 RETURNING *;", [filepath, req.user.username])
    .then((data) => {
      res.json(data.profilepic)
      console.log(data)
    }).catch(err => {
      res.sendStatus(400)
      console.log(err)
    })
})
// -----------------------------------------------------

app.get('/findfriends/:userid', (req, res) => {
  const userid = req.params.userid;

  db.task((t) => {
    return t.map('SELECT u.id, u.fullname, u.profilepic, u.country, u.gender FROM public.users u WHERE u.id != $1  ORDER BY RANDOM()', [userid], (user) => {

      return t.any('SELECT f.*, u.fullname FROM public.friends f JOIN public.users u ON f.id_friend = u.id WHERE id_user = $1 ORDER BY id DESC', [user.id])
        .then((followed) => {
          user.followed = followed;

          return t.any('SELECT u.fullname, f.* FROM public.friends f JOIN public.users u ON f.id_user = u.id WHERE id_friend = $1', [user.id])
            .then((followers) => {
              user.followers = followers;

              return user;
            });
        });
    }).then(t.batch);
  })
    .then((data) => {
      res.json(data);
    })
    .catch((error) => {
      res.sendStatus(400);
      console.log(error);
    });

  // db.manyOrNone(
  //   "SELECT users.id, users.fullname, users.profilepic, users.gender, users.country \
  // FROM public.users LEFT JOIN public.friends ON users.id = friends.id_friend AND friends.id_user = $1 \
  // WHERE friends.f_id IS NULL AND users.id <> $1", [userid])
  //   .then((data) => {
  //     res.json(data)
  //     // console.log(data)
  //   }).catch((err) => {
  //     res.sendStatus(400)
  //     console.log(err)
  //   })
})

app.get('/friends/:userid', (req, res) => {
  const userid = req.params.userid;

  db.manyOrNone("SELECT users.id, users.fullname, users.country, users.gender ,users.profilepic, friends.f_id, friends.id_user FROM public.users JOIN public.friends ON users.id = friends.id_friend WHERE friends.id_user = $1 ORDER BY RANDOM()", [userid])
    .then((data) => {
      res.json(data)
      // console.log(data)
    }).catch((err) => {
      res.sendStatus(400)
      console.log(err)
    })
})

appRouter.post('/friends', (req, res) => {
  const body = req.body

  db.one("INSERT INTO public.friends(id_user, id_friend) VALUES (${userid}, ${id}) RETURNING *;", body)
    .then((data) => {
      res.json(data)
      console.log(data)
    }).catch((err) => {
      if (err.constraint == 'friends_unique_constraint') {
        res.status(400).json('Already Friends')
      }
      res.sendStatus(400)
      console.log(err)
    })
})

appRouter.delete('/friends', (req, res) => {
  const body = req.body

  db.one("DELETE FROM public.friends WHERE f_id = ${id} RETURNING *;", body)
    .then((data) => {
      res.json(data)
      console.log(data)
    }).catch(err => {
      res.sendStatus(400)
      console.log(err)
    })
})
// ---------------------------------------------

app.get('/notifications/:userid', (req, res) => {
  const userid = req.params.userid;

  db.manyOrNone("SELECT notifications.n_id, users.id, users.fullname, users.gender ,users.profilepic FROM public.users JOIN public.notifications ON users.id = notifications.sender_id WHERE notifications.receiver_id = $1", [userid])
    .then((data) => {
      res.json(data)
      // console.log(data)
    }).catch((err) => {
      res.sendStatus(400)
      console.log(err)
    })
})

appRouter.post('/notifications', (req, res) => {
  const body = req.body

  db.one("INSERT INTO public.notifications(sender_id, receiver_id) VALUES (${userid}, ${id}) RETURNING *;", body)
    .then((data) => {
      res.json(data)
      console.log(data)
    }).catch((err) => {
      res.sendStatus(400)
      console.log(err)
    })
})

appRouter.delete('/notifications', (req, res) => {
  const body = req.body

  db.one("DELETE FROM public.notifications WHERE n_id = ${id} RETURNING *;", body)
    .then((data) => {
      res.json(data)
      console.log(data)
    }).catch(err => {
      res.status(400).json(err.message)
      console.log(err)
    })
})

appRouter.delete('/notifications1', (req, res) => {
  const body = req.body

  db.one("DELETE FROM public.notifications WHERE (receiver_id, sender_id) = (${id}, ${userid}) RETURNING *;", body)
    .then((data) => {
      res.json(data)
      console.log(data)
    }).catch(err => {
      res.status(400).json(err.message)
      console.log(err)
    })
})

// ----------------------------------------------

appRouter.get('/search', (req, res) => {
  const searchText = req.query.search;

  db.manyOrNone(`
  SELECT * FROM public.users WHERE fullname ILIKE '%$1:value%' AND username != $2 ORDER BY id DESC`, [searchText, req.user.username])
    .then((data) => {
      res.json(data);
    })
    .catch((error) => {
      res.sendStatus(400);
      console.log(error);
    });
});
*/
// -----------------------------------------------------

const port = 3000

// server.listen(3001,()=>{
//   console.log('Serveris Running')
// })

server.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

//return t.map('SELECT * FROM public.posts ORDER BY id DESC', [], post => {
  //return t.any('SELECT * FROM public.comments WHERE post_id = $1 ORDER BY id DESC', [post.id])

  // db.manyOrNone(`SELECT * FROM public.posts ORDER BY id DESC`)

  // db.manyOrNone(
  //   "SELECT * FROM public.posts as posts\
  //   LEFT JOIN public.comments as comments\
  //   ON comments.post_id = posts.id;"
  // )
  //   .then((data) => {
  //     res.json(data)
  //   })
  //   .catch((error) => {
  //     console.log('ERROR:', error)
  //     res.sendStatus(400).statusMessage(error)
  //   })