import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";

import { toast } from "react-toastify";


import GitHubIcon from '@mui/icons-material/GitHub';
import TelegramIcon from '@mui/icons-material/Telegram';
import TwitterIcon from '@mui/icons-material/Twitter';
import LinkedInIcon from '@mui/icons-material/LinkedIn';

import { useAuthentication } from "../contexts/authentication";
import { validateName, validateEmail } from "../validateUser";
import { apiDeleteUser, apiUpdateUserProfile } from "../api/v1/user";


export default function Profile() {
  const router = useRouter();

  const {
    user,
    setUser,
    logout,
  } = useAuthentication();

  useEffect(() => {
    if (user === null) {
      router.push("/");
    }
  }, []);


  const [name, setName] = useState(user?.name);
  const [email, setEmail] = useState(user?.email);

  return (
    <>
      <Head>
        <title>Your Profile</title>
      </Head>

      <main>
        <div
          style={{
            display: "flex",
          }}
        >
          <div
            style={{
              width: "100%",
              padding: "1rem",
            }}
          >
            <a
              href="https://faceio.net"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "flex",
                width: "100%",
                backgroundImage: `url("/fioauth.png")`,
                backgroundSize: "contain",
                backgroundRepeat: "no-repeat",
                height: "calc(100vh - 2rem)",
              }}

            />

          </div>

          <div
            style={{
              width: "100%",
              backgroundColor: "#0d42b2",
              padding: "2rem",
            }}
          >
            <div
              style={{
                backgroundColor: "white",
                borderRadius: "0.5rem",
                // height: "100%",
              }}
            >
              <div
                style={{
                  padding: "2rem",
                }}
              >
                <h1
                  style={{
                    margin: "0 0 2rem 0",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <a
                    style={{
                      display: "flex",
                    }}
                    // href="https://console.faceio.net"
                    href="https://faceio.net"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <img
                      src="/logo.svg"
                      style={{
                        width: "2.5rem",
                        height: "2.5rem",
                        marginRight: "0.5rem",
                      }}
                    />
                  </a>
                  <span>
                    Your Profile
                  </span>
                </h1>

                <nav
                  style={{
                    display: "flex",
                    width: "100%",
                    marginBottom: "2rem",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      width: "100%",
                      color: "#304073",
                      borderBottom: "0.1rem solid #0d42b2",
                      padding: "0 0 1rem 0",

                      cursor: "pointer",
                    }}
                    onClick={logout}
                  >
                    LOGOUT
                  </div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      width: "100%",
                      color: "#304073",
                      borderBottom: "0.1rem solid #304073",
                      padding: "0 0 1rem 0",
                      opacity: 0.5,

                      cursor: "pointer",
                    }}

                    onClick={async () => {
                      const { message, error } = await apiDeleteUser();

                      if (error) {
                        toast.error(error);
                        return
                      }

                      if (message) {
                        toast.info(message);

                        setTimeout(() => {
                          logout();
                        }, 6000);

                      }
                    }}
                  >
                    DELETE ACCOUNT
                  </div>
                </nav>

                <form
                  style={{
                    display: "flex",
                    flexFlow: "column",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                    }}
                  >
                    <input
                      type="text"
                      placeholder="Name"

                      style={{
                        borderRadius: "4px",
                        border: "2px solid #d3e0f3",
                        width: "100%",
                        padding: "0.5rem 1rem",
                        lineHeight: "20px",
                        color: "#6783b8",

                        marginBottom: "1rem",
                      }}

                      value={name}
                      onChange={e => {
                        setName(e.target.value);
                      }}
                    />
                  </div>

                  <div
                    style={{
                      display: "flex",
                    }}
                  >
                    <input
                      type="email"
                      placeholder="email@example.com"

                      style={{
                        borderRadius: "4px",
                        border: "2px solid #d3e0f3",
                        width: "100%",
                        padding: "0.5rem 1rem",
                        lineHeight: "20px",
                        color: "#6783b8",
                      }}

                      value={email}
                      onChange={e => {
                        setEmail(e.target.value.toLowerCase());
                      }}
                    />
                  </div>

                  <button
                    style={{
                      marginTop: "2rem",

                      backgroundColor: "#0095ff",
                      border: "1px solid transparent",
                      borderRadius: "0.5rem",
                      boxShadow: "rgb(255 255 255 / 40%) 0 1px 0 0 inset",

                      color: "white",
                      padding: "1rem 0.5rem",

                      cursor: "pointer",
                    }}

                    type="button"

                    onClick={async () => {
                      if (validateName(name) === false) {
                        toast.info("Please use a valid name");
                        return;
                      }
                      if (validateEmail(email) === false) {
                        toast.info("Please use a valid email");
                        return;
                      }

                      const { updatedUser, error } = await apiUpdateUserProfile(name, email);

                      if (error) {
                        toast.error(error);
                        return;
                      }

                      if (updatedUser) {
                        setUser(updatedUser);
                        toast.info("Updated");
                      }
                    }}
                  >
                    UPDATE
                  </button>


                </form>

                <p
                  style={{
                    margin: "1rem 0 0 0",
                    lineHeight: "1.5rem",
                    padding: 0,
                    // color: "#0d42b2",
                    opacity: 0.5,
                  }}
                >
                  Cross Browser, Secure & Easy to implement, Passwordless Authentication powered by Face Recognition for Web Sites & Apps
                </p>

                <div
                  style={{
                    marginTop: "1rem",
                  }}
                >
                  <a
                    href="https://github.com/steadylearner"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <GitHubIcon
                      style={{
                        marginRight: "0.5rem",
                      }}
                    />
                  </a>

                  <a
                    href="https://t.me/steadylearner"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <TelegramIcon
                      style={{
                        marginRight: "0.5rem",
                      }}
                    />
                  </a>

                  <a
                    href="https://twitter.com/steadylearner_p"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <TwitterIcon
                      style={{
                        marginRight: "0.5rem",
                      }}
                    />
                  </a>

                  <a
                    href="https://www.linkedin.com/in/steady-learner-3151b7164"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <LinkedInIcon
                      style={{
                        marginRight: "0.5rem",
                      }}
                    />
                  </a>

                </div>
              </div>

            </div>
          </div>

        </div>
      </main>
    </>
  );
}
