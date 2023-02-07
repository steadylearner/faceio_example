[How to make a full stack facial authentication app with FaceIO and Next js]: https://dev.to/steadylearner/how-to-make-a-full-stack-facial-authentication-app-with-faceio-and-next-js-3dh

[nextjs-cors]: https://github.com/yonycalsin/nextjs-cors

[You can follow me at GitHub.]: https://github.com/steadylearner

[You can contact or hire me at Telegram.]: https://t.me/steadylearner

# How to use CORS for all routes with Next js and session API

In this post, you will learn how to use CORS with Next JS.

If you want a full working project for this blog post, please read [How to make a full stack facial authentication app with FaceIO and Next js] and [the repository](https://github.com/steadylearner/faceio_example) for it.

The reason for writing this short blog post is to help you find an example to use CORS for all routes. When I searched the example for it with a query like [How to use CORS for all routes with next js](https://www.google.com/search?q=How+to+use+CORS+for+all+routes+with+next+js), it was easy to find an example that works for a single route but not for all routes with Next js.

There was a package like [nextjs-cors] but it doesn't have an example to work for all routes and for a route only. I will help you with the code snippets below to help you find how to use CORS for all routes.

You can see the official example from it below.

```
import NextCors from 'nextjs-cors';

async function handler(req, res) {
   await NextCors(req, res, {
      methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
      origin: '*',
      optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
   });

   // Rest of the API logic
   res.json({ message: 'Hello NextJs Cors!' });
}
```

Not so complicated but you will see in [its issues page](https://github.com/yonycalsin/nextjs-cors/issues), some people wants to find a solution to use CORS for all routes but not responded yet currently.

Therefore, I had to my own way for this so after a few seraches, I could find the working code for below. If you want more details, please read this file [withSession.ts](https://github.com/steadylearner/faceio_example/blob/main/src/withSession.ts) at GitHub.

```ts
import NextCors from 'nextjs-cors';

function withNextCors(
  handler: NextApiHandler,
): NextApiHandler {
  return async function nextApiHandlerWrappedWithNextCors(req, res) {
    
    const methods = ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'];
    await NextCors(req, res, {
      methods,
      origin: CORS_ALLOWED_ORGIN,
      optionsSuccessStatus: 200,
    });

    return handler(req, res);
  };
}
```

You can save the code above as withCors.ts or withNextCors.ts or something else and use it as a Next js api hanlders. [You can find some examples for it here.](https://github.com/steadylearner/faceio_example/tree/main/src/pages/api/v1/user)

[For example, you can use NextCors locally similar to the code snippet below and compare.](https://github.com/steadylearner/faceio_example/blob/main/src/pages/api/v1/user/register.ts)

```ts
import { DataTypes } from "sequelize";
import NextCors from 'nextjs-cors';

import {
  sequelize,
} from "../../../../../db";

import { withNextCorsSessionRoute } from "../../../../withSession";
import validateUser, { UserValidationResult } from "../../../../validateUser";
import { CreateUserRequest } from "../../../../../schemas/user";

// import { CORS_ALLOWED_ORGIN } from "../../../../environment";

const User = require('../../../../../models/user')(sequelize, DataTypes);

// $curl -X POST -H 'Content-Type: application/json' -d '{"facialId":"test", "name":"name", "email":"email@example.com"}'  http://localhost:3000/api/v1/user/register
export default withNextCorsSessionRoute(async (req, res) => {
  await NextCors(req, res, {
    // Options
    methods: ['POST'],
    origin: CORS_ALLOWED_ORGIN,
    optionsSuccessStatus: 200,
  });

  if (req.method !== "POST") {
    res.status(405).send(""); // Incorrect request method
    return;
  }

  const { 
    facialId, 
    name, 
    email,
  } = req.body as CreateUserRequest;

  const dbUserByFacialId = await User.findOne({
    where: {
      facialId
    }
  });

  if (dbUserByFacialId === null) {
    let userValidationResult = validateUser(name, email);

    if (userValidationResult === UserValidationResult.None) {
      const dbUserByEmail = await User.findOne({
        where: {
          email
        }
      });

      if (dbUserByEmail !== null) {
        userValidationResult = UserValidationResult.TakenEmail;
      }
    }

    if (userValidationResult !== UserValidationResult.None) {
      res.status(400).send(userValidationResult);
      return;
    }

    const newUser = await User.create({
      facialId,
      name,
      email,
    });

    res.status(200).send(userValidationResult);
  } else {
    res.status(400).send(UserValidationResult.TakenFacialId);
  }
});
```

You can use CURL commands to test CORS. 

```console
$curl -H 'Content-Type: application/json' -d '{"facialId":"test", "name":"name", "email":"email@example.com"}' -v --request OPTIONS 'http://localhost:3000/api/v1/user/register' --header 'Origin: http://some.origin.here'; --header 'Access-Control-Request-Method: POST'
```

But, it will be better to use browser console and fetch api in it instead.

```js
fetch('http://localhost:3000/api/v1/user/register');
```

If you don't have any example to test this, you can use the blog post [How to make a full stack facial authentication app with FaceIO and Next js] instead.

If you want to use Session with CORS also like the example, you can use the code snippet below.

```ts
export function withNextCorsSessionRoute(handler: NextApiHandler) {
  const withSessionHandler = withIronSessionApiRoute(handler, sessionOptions);
  return withNextCors(withSessionHandler);
}
```

You just need to wrap `withIronSessionApiRoute(handler, sessionOptions)` from [iron-session](https://www.npmjs.com/package/iron-session) which I could find the solution from this at their code.

[If you read how it works](https://github.com/vvo/iron-session/blob/main/next/index.ts), you can see it just does something before they return `handler(req, res)` at the end.

```ts
export function withIronSessionApiRoute(
  handler: NextApiHandler,
  options: IronSessionOptions | GetIronSessionApiOptions,
): NextApiHandler {
  return async function nextApiHandlerWrappedWithIronSession(req, res) {
    let sessionOptions: IronSessionOptions;

    if (options instanceof Function) {
      sessionOptions = await options(req, res);
    } else {
      sessionOptions = options;
    }

    const session = await getIronSession(req, res, sessionOptions);

    Object.defineProperty(
      req,
      "session",
      getPropertyDescriptorForReqSession(session),
    );
    return handler(req, res);
  };
}
```

We just needed to do the same thing for the CORS to work with it.

You will see it is easy to find a way if you search how others solved the similar issue first.

I want this post could be helpful for someone who wanted to use CORS for all routes. It is always easier with examples.

[You can follow me at GitHub.] 

[You can contact or hire me at Telegram.]
