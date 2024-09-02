import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toastGreen, toastRed } from "../Components/My Toasts";
import { signinUser } from "../Config/FirebaseMethods";
import MyLoader from "../Components/MyLoader";
import {
  getAuth,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import app from "../Config/FirebaseConfig";
import "./AuthFormStyles.css"; // Import your CSS file

// Component definition and logic
const Signup: React.FC = () => {
  // Component state and functions
  const [userData, setUserData] = useState<{
    email: string;
    password: string;
    confirmPassword?: string;
    username?: string;
  }>({ email: "", password: "" });
  const [loader, setLoader] = useState<boolean>(false);
  const [isSignIn, setIsSignIn] = useState<boolean>(true);
  const navigate = useNavigate();
  const auth = getAuth(app);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        toastGreen("User is already logged in.");
        navigate("/dashboard");
      }
    });

    return () => unsubscribe();
  }, [auth, navigate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoader(true);

    if (!isSignIn && userData.password !== userData.confirmPassword) {
      toastRed("Passwords do not match.");
      setLoader(false);
      return;
    }

    if (isSignIn) {
      signinUser(userData.email, userData.password)
        .then(() => {
          toastGreen("User successfully signed in.");
          setUserData({ email: "", password: "" });
          navigate("/dashboard");
        })
        .catch((err) => {
          toastRed(
            err.message === "Firebase: Error (auth/invalid-credential)."
              ? "Invalid credentials provided."
              : err.message
          );
          setLoader(false);
        });
    } else {
      createUserWithEmailAndPassword(auth, userData.email, userData.password)
        .then(() => {
          toastGreen("User successfully signed up.");
          setUserData({ email: "", password: "" });
          navigate("/dashboard");
        })
        .catch((err) => {
          toastRed(
            err.message === "Firebase: Error (auth/email-already-in-use)."
              ? "Email already in use."
              : err.message
          );
          setLoader(false);
        });
    }
  };

  const toggle = () => {
    setIsSignIn((prevState) => !prevState);
  };

  return (
    <>
      {loader ? (
        <MyLoader />
      ) : (
        <div
          id="container"
          className={`container ${isSignIn ? "sign-in" : "sign-up"}`}
        >
          {/* FORM SECTION */}
          <div className="row1">
            {/* SIGN UP */}
            <div
              className={`col align-items-centers flex-col sign-up ${
                !isSignIn ? "active" : ""
              }`}
            >
              <div className="form-wrapper align-items-centers">
                <form onSubmit={handleSubmit} className="form sign-up">
                  <div className="input-group">
                    <i className="bx bxs-user"></i>
                    <input
                      type="text"
                      placeholder="Username"
                      value={userData.username || ""}
                      onChange={(e) =>
                        setUserData({ ...userData, username: e.target.value })
                      }
                    />
                  </div>
                  <div className="input-group">
                    <i className="bx bx-mail-send"></i>
                    <input
                      type="email"
                      placeholder="Email"
                      value={userData.email}
                      onChange={(e) =>
                        setUserData({ ...userData, email: e.target.value })
                      }
                    />
                  </div>
                  <div className="input-group">
                    <i className="bx bxs-lock-alt"></i>
                    <input
                      type="password"
                      placeholder="Password"
                      value={userData.password}
                      onChange={(e) =>
                        setUserData({ ...userData, password: e.target.value })
                      }
                    />
                  </div>
                  <div className="input-group">
                    <i className="bx bxs-lock-alt"></i>
                    <input
                      type="password"
                      placeholder="Confirm password"
                      value={userData.confirmPassword || ""}
                      onChange={(e) =>
                        setUserData({
                          ...userData,
                          confirmPassword: e.target.value,
                        })
                      }
                    />
                  </div>
                  <button type="submit">Sign up</button>
                  <p>
                    <span>Already have an account?</span>
                    <b onClick={toggle} className="pointer">
                      Sign in here
                    </b>
                  </p>
                </form>
              </div>
            </div>
            {/* END SIGN UP */}

            {/* SIGN IN */}
            <div
              className={`col align-items-centers flex-col sign-in ${
                isSignIn ? "active" : ""
              }`}
            >
              <div className="form-wrapper align-items-centers">
                <form onSubmit={handleSubmit} className="form sign-in">
                  <div className="input-group">
                    <i className="bx bxs-user"></i>
                    <input
                      id="Email"
                      value={userData.email}
                      className="textInputs textInputsWhite"
                      type="email"
                      placeholder="Email"
                      required
                      onChange={(e) =>
                        setUserData({ ...userData, email: e.target.value })
                      }
                    />
                  </div>
                  <div className="input-group">
                    <i className="bx bxs-lock-alt"></i>
                    <input
                      id="Password"
                      value={userData.password}
                      className="textInputs textInputsWhite"
                      type="password"
                      placeholder="Password"
                      required
                      onChange={(e) =>
                        setUserData({ ...userData, password: e.target.value })
                      }
                    />
                  </div>
                  <button type="submit">Sign in</button>
                  <p>
                    <b>Forgot password?</b>
                  </p>
                  <p>
                    <span>Don't have an account?</span>
                    <b onClick={toggle} className="pointer">
                      Sign up here
                    </b>
                  </p>
                </form>
              </div>
            </div>
            {/* END SIGN IN */}
          </div>
          {/* END FORM SECTION */}

          {/* CONTENT SECTION */}
          <div className="row1 content-row">
            {/* SIGN IN CONTENT */}
            <div
              className={`col align-items-centers flex-col ${
                isSignIn ? "active" : ""
              }`}
            >
              <div className="text sign-in sm:text-left  ">
                <h2>WELCOME TO LEARNING MANAGEMENT SYSTEM</h2>
              </div>
              <div className="img sign-in"></div>
            </div>
            {/* END SIGN IN CONTENT */}

            {/* SIGN UP CONTENT */}
            <div
              className={`col align-items-centers flex-col ${
                !isSignIn ? "active" : ""
              }`}
            >
              <div className="img sign-up"></div>
              <div className="text sign-up sm:text-right">
                <h2>Join with us LEARNING MANAGEMENT SYSTEM</h2>
              </div>
            </div>
            {/* END SIGN UP CONTENT */}
          </div>
          {/* END CONTENT SECTION */}
        </div>
      )}
    </>
  );
};

export default Signup;
