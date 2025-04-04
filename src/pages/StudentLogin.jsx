import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import "./css/StudentLogin.css";

const StudentLogin = () => {
  useEffect(() => {
    // Load MDB CSS
    const mdbCSS = document.createElement("link");
    mdbCSS.rel = "stylesheet";
    mdbCSS.href =
      "https://cdnjs.cloudflare.com/ajax/libs/mdb-ui-kit/6.4.0/mdb.min.css";
    mdbCSS.id = "mdb-css";
    document.head.appendChild(mdbCSS);

    // Load MDB JS
    const mdbScript = document.createElement("script");
    mdbScript.src =
      "https://cdnjs.cloudflare.com/ajax/libs/mdb-ui-kit/6.4.0/mdb.min.js";
    mdbScript.async = true;
    mdbScript.id = "mdb-script";
    mdbScript.onload = () => {
      // Manually initialize MDB components after script loads
      if (window.mdb) {
        window.mdb.Input.init(); // For floating labels
        window.mdb.Ripple.init(); // For ripple effect
      }
    };
    document.body.appendChild(mdbScript);

    // Cleanup
    return () => {
      document.getElementById("mdb-css")?.remove();
      document.getElementById("mdb-script")?.remove();
    };
  }, []);

  return (
    <div>
      <section className="vh-100" style={{ backgroundColor: "#A1A099" }}>
        <div className="container py-5 h-100">
          <div className="row d-flex justify-content-center align-items-center h-100">
            <div className="col col-xl-10">
              <div className="card" style={{ borderRadius: "1rem" }}>
                <div className="row g-0">
                  <div className="col-md-6 col-lg-5 d-none d-md-block">
                    <img
                      src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/img1.webp"
                      alt="login form"
                      className="img-fluid"
                      style={{ borderRadius: "1rem 0 0 1rem" }}
                    />
                  </div>
                  <div className="col-md-6 col-lg-7 d-flex align-items-center">
                    <div className="card-body p-4 p-lg-5 text-black">
                      <form>
                        <div className="d-flex align-items-center mb-3 pb-1">
                          <i
                            className="fas fa-cubes fa-2x me-3"
                            style={{ color: "#ff6219" }}
                          ></i>
                          <span className="h4 fw-light mb-2" style={{marginLeft: "-1rem", border: "1px solid #ff6219", padding:"0.5rem", borderRadius:"1rem"}}>For Student</span>
                        </div>

                        <h5
                          className="fw-normal mb-3 pb-3"
                          style={{ letterSpacing: "1px" }}
                        >
                          Sign into your account
                        </h5>

                        <div data-mdb-input-init className="form-outline mb-2">
                          {/* <input
                            type="email"
                            id="form2Example17"
                            className="form-control form-control-lg"
                          />
                          <label className="form-label" htmlFor="form2Example17">
                            Email address
                          </label> */}
                          <label htmlFor="email">Email</label>
                          <input
                            type="email"
                            name="email"
                            placeholder="Enter Your Email"
                            // value={formData.email}
                            // onChange={handleChange}
                            required
                          />
                        </div>

                        <div data-mdb-input-init className="form-outline mb-2">
                          {/* <input
                            type="password"
                            id="form2Example27"
                            className="form-control form-control-lg"
                          />
                          <label className="form-label" htmlFor="form2Example27">
                            Password
                          </label> */}
                          <label htmlFor="password">Password</label>
                          <input
                            type="password"
                            name="password"
                            placeholder="Enter Your Password"
                            // value={formData.password}
                            // onChange={handleChange}
                            required
                          />
                        </div>

                        <div className="pt-1 mb-4">
                          <button
                            data-mdb-button-init
                            data-mdb-ripple-init
                            className="btn btn-dark btn-lg btn-block"
                            type="button"
                          >
                            Login
                          </button>
                        </div>

                        <a className="small text-muted" href="#!">
                          Forgot password?
                        </a>
                        <p
                          className="mb-5 pb-lg-2"
                          style={{ color: "#393f81" }}
                        >
                          Don&apos;t have an account?{" "}
                          <Link
                            to={"/student_register"}
                            style={{ color: "#393f81" }}
                          >
                            Register here
                          </Link>
                        </p>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default StudentLogin;
