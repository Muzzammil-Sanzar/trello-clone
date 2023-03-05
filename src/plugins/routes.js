// post schema
const postTaskAddOpts = {
  schema: {
    body: {
      type: "object",
      properties: {
        id: { type: "string" },
        title: { type: "string" },
        description: { type: "string" },
      },
    },

    response: {
      200: {
        type: "object",
        properties: {
          saved: { type: "boolean" },
        },
      },
    },
  },
};

function routes(fastify, option, done) {
  var nodemailer = require("nodemailer");
  const userCollection = fastify.mongo.db.collection("user");
  const fastifyPassport = require("@fastify/passport");

  const boardsCollection = fastify.mongo.db.collection("boards");

  fastify.options("/*", (_, res) => {
    res.sendStatus(200);
  });
  /* ******************** JWT TOKEN ROUTES *************** */

  fastify.get("/token", async (req, reply) => {
    const token = fastify.jwt.sign({ name: "testing" });
    return token;
  });

  /* ******************** USER ROUTES ************************* */

  fastify.get("/users", async (req, reply) => {
    return await userCollection.find().toArray();
  });

  fastify.get("/sp", async (req, reply) => {
    return { Hello: "love" };
  });

  fastify.get("/getUser/:email/:password", async (req, reply) => {
    console.log("Data is: ", req.params.email);
    const email = req.params.email;
    const password = req.params.password;
    const token = fastify.jwt.sign({ email, password });
    const result = await userCollection.findOne({
      email: email,
      password: password,
    });
    return { result: result, token: token };
  });

  fastify.post("/user/add", async (req, reply) => {
    const body = req.body;
    body.email = req.body.email;
    body.password = req.body.password;
    // const token = fastify.jwt.sign({ email, password });
    return await userCollection.insertOne(body);
  });

  fastify.put("/modify", async (req, reply) => {
    let id = req.body.id;
    const email = req.body.email;
    const password = req.body.password;
    const _id = fastify.mongo.ObjectId(id);
    const result = await userCollection.findOneAndUpdate(
      { _id },
      { $set: { email, password } },
      { returnOriginal: false }
    );
    return result.value;
  });

  fastify.delete("/:id", async (req, reply) => {
    const id = req.params.id;
    const _id = fastify.mongo.ObjectId(id);
    await userCollection.deleteOne({ _id });
    return { delete: "done" };
  });

  /* ******************* task routes *************** */

  fastify.get(
    "/boards",
    { onRequest: [fastify.authenticate] },
    async (req, reply) => {
      const result = boardsCollection.find().toArray();
      return result;
    }
  );

  fastify.get(
    "/tasks/:id",
    { onRequest: [fastify.authenticate] },
    async (req, reply) => {
      const id = req.params.id;
      const _id = fastify.mongo.ObjectId(id);
      const result = boardsCollection
        .find({ _id }, { projection: { tasks: 1 } })
        .toArray();
      return result;
    }
  );

  fastify.post(
    "/boards/add",
    { onRequest: [fastify.authenticate] },
    async (req, reply) => {
      const body = req.body;
      body.tasks = [];
      const result = boardsCollection.insertOne(body);
      return result;
    }
  );

  // tasks add api
  fastify.post(
    "/boards/tasks/add",
    { schema: postTaskAddOpts },
    async (req, reply) => {
      let id = req.body.id;
      const title = req.body.title;
      const description = "";
      const _id = fastify.mongo.ObjectId(id);
      const result = await boardsCollection.updateOne(
        { _id },
        { $push: { tasks: { title: title, description: description } } }
      );
      return { saved: result.acknowledged };
    }
  );

  // UPDATE BOARDS TASKS
  fastify.put(
    "/boards/tasks/update/:id",
    { onRequest: [fastify.authenticate] },
    async (req, reply) => {
      const body = req.body;
      const id = req.params.id;
      const _id = fastify.mongo.ObjectId(id);
      const result = await boardsCollection.updateMany(
        { _id },
        { $set: { tasks: body } }
      );
      return result;
    }
  );

  //  add/ edit description of tasks.
  fastify.put(
    "/boards/des/add",
    { onRequest: [fastify.authenticate] },
    async (req, reply) => {
      let id = req.body.id;
      const description = req.body.description;
      const title = req.body.title;
      const _id = fastify.mongo.ObjectId(id);
      const result = await boardsCollection.findOneAndUpdate(
        { _id, tasks: { $elemMatch: { title } } },
        { $set: { "tasks.$.description": description } }
      );
      return result.value;
    }
  );

  // EDIT TASKS TITLE
  fastify.put(
    "/boards/title/edit",
    { onRequest: [fastify.authenticate] },
    async (req, reply) => {
      let id = req.body.id;
      const title = req.body.title;
      const newTitle = req.body.newTitle;
      const _id = fastify.mongo.ObjectId(id);
      const result = await boardsCollection.findOneAndUpdate(
        { _id, tasks: { $elemMatch: { title } } },
        { $set: { "tasks.$.title": newTitle } },
        { returnOriginal: false }
      );
      return result.value;
    }
  );

  // delete task title and description
  fastify.put(
    "/boards/title/delete",
    { onRequest: [fastify.authenticate] },
    async (req, reply) => {
      const title = req.body.title;
      const id = req.body.id;
      const _id = fastify.mongo.ObjectId(id);
      const result = await boardsCollection.updateOne(
        { _id },
        { $pull: { tasks: { title } } }
      );
      return result;
    }
  );

  fastify.delete(
    "/boards/:id",
    { onRequest: [fastify.authenticate] },
    async (req, reply) => {
      const id = req.params.id;
      const _id = fastify.mongo.ObjectId(id);
      const result = await boardsCollection.deleteOne({ _id });
      return result;
    }
  );

  fastify.get(
    "/google",
    {
      preValidation: fastifyPassport.authenticate("google", {
        scope: ["profile"],
      }),
    },
    async (req, res) => {
      res.send("hello g");
    }
  );

  fastify.get(
    "/auth/google/redirect",
    {
      preValidation: fastifyPassport.authenticate("google"),
    },
    async (req, res) => {
      res.send("you have reached the destination");
    }
  );

  fastify.get("/email", async (req, reply) => {
    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
      service: "hotmail",
      auth: {
        user: "apitesting123456789@outlook.com", // generated ethereal user
        pass: "Api123456789", // generated ethereal password
      },
    });

    // send mail with defined transport object
    var info = await transporter.sendMail({
      from: "apitesting123456789@outlook.com", //replace with your email
      to: "sanzarbabba@gmail.com", //replace with your email
      subject: `Contact name: name`,
      html: `<h1>Contact details</h1>`,
    });
    /*
    Here comes the important part, sendMail is the method which actually sends email, it takes mail options and
    call back as parameter
    */

    console.log("Message sent: %s", info.messageId);
    // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

    // Preview only available when sending through an Ethereal account
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    return { response: info.response };
  });

  fastify.get("/random", async (req, reply) => {
    const random = Math.floor(Math.random() * 8991) + 1000;
    return { random: random };
  });
  done();
}

module.exports = routes;
