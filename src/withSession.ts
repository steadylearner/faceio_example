import {
  GetServerSidePropsContext,
  GetServerSidePropsResult,
  NextApiHandler,
  NextApiRequest,
  NextApiResponse,
} from "next";

// https://github.com/vercel/next.js/blob/canary/examples/api-routes-cors/pages/api/cors.ts
// https://www.npmjs.com/package/nextjs-cors
import NextCors from 'nextjs-cors';
// import Cors from 'cors'

import { withIronSessionApiRoute, withIronSessionSsr } from "iron-session/next";
import { CORS_ALLOWED_ORGIN } from "./environment";

// function useCors(
//   req: NextApiRequest,
//   res: NextApiResponse,
//   fn: Function
// ) {
//   return new Promise((resolve, reject) => {
//     fn(req, res, (result: any) => {
//       if (result instanceof Error) {
//         return reject(result)
//       }

//       return resolve(result)
//     })
//   })
// }

// const methods = ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'];
// const cors = Cors({
//   methods,
//   origin: CORS_ALLOWED_ORGIN,
//   optionsSuccessStatus: 200
// })

// https://www.npmjs.com/package/iron-session
declare module "iron-session" {
  interface IronSessionData {
    user?: {
      id: string;
      facialId: string;
      name: string;
      email: string;
      createdAt: Date;
      updatedAt: Date;
    };
  }
}

const sessionOptions = {
  cookieName: "site_cookies",
  password:
    process.env.COOKIE_SECRET ??
    (() => {
      throw "No cookie secret";
    })(),
  cookieOptions: {
    // maxAge: 600, // Reset after 600 seconds.
    secure: process.env.NODE_ENV === "production",
  },
};

// https://github.com/vvo/iron-session/blob/main/next/index.ts
// No asnyc here
// Just test with fetch
// fetch('http://localhost:3000/api/v1/user/currentUser');
// fetch('http://localhost:3000/api/v1/user/logout');
// https://stackoverflow.com/questions/51426683/how-to-test-cors-header
// $curl -v --request OPTIONS 'http://localhost:3000/api/v1/user/currentUser' --header 'Origin: http://some.origin.here'; --header 'Access-Control-Request-Method: GET'
// $curl -v --request OPTIONS 'http://localhost:3000/api/v1/user/logout' --header 'Origin: http://some.origin.here'; --header 'Access-Control-Request-Method: GET'
// $curl -H 'Content-Type: application/json' -d '{"facialId":"test", "name":"name", "email":"email@example.com"}' -v --request OPTIONS 'http://localhost:3000/api/v1/user/register' --header 'Origin: http://some.origin.here'; --header 'Access-Control-Request-Method: POST'
function withNextCors(
  handler: NextApiHandler,
): NextApiHandler {
  return async function nextApiHandlerWrappedWithNextCors(req, res) {
    
    // console.log(1);
    
    const methods = ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'];
    await NextCors(req, res, {
      methods,
      // origin: "https://www.test.com",
      origin: CORS_ALLOWED_ORGIN,
      // optionsSuccessStatus: 400,
      optionsSuccessStatus: 200,
    });

    // console.log(2);

    // console.log(req);
    // console.log(res);
    // console.log(ALLOWED_METHODS);
    
    // await useCors(req, res, cors);
    // console.log(3);

    return handler(req, res);
  };
}

// // export async function withCorsSessionRoute(handler: NextApiHandler) {
export function withNextCorsSessionRoute(handler: NextApiHandler) {
  const withSessionHandler = withIronSessionApiRoute(handler, sessionOptions);
  return withNextCors(withSessionHandler);
}

// export function withNextCorsSessionRoute(handler: NextApiHandler) {
//   // export function withSessionRoute(handler: NextApiHandler) {
//   // console.log(withIronSessionApiRoute(handler, sessionOptions)); [AsyncFunction: nextApiHandlerWrappedWithIronSession]
//   return withIronSessionApiRoute(handler, sessionOptions);
// }

export function withSessionSsr<
  P extends { [key: string]: unknown } = { [key: string]: unknown }
>(
  handler: (
    context: GetServerSidePropsContext
  ) => GetServerSidePropsResult<P> | Promise<GetServerSidePropsResult<P>>
) {
  return withIronSessionSsr(handler, sessionOptions);
}


