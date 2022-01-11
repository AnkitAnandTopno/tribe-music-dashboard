import React from "react";
import Cookies from "universal-cookie";
import Card from "../components/Card/Card";
import CardBody from "../components/Card/CardBody.js";
import CardFooter from "../components/Card/CardFooter.js";
import CardHeader from "../components/Card/CardHeader.js";
import Button from "../components/CustomButtons/Button.js";
import CustomInput from "../components/CustomInput/CustomInput";
import { sendRequest } from "../utills/util";
import { authApi } from "../constant/api";
import { CircularProgress } from "@material-ui/core";
import { withRouter } from "react-router-dom";

const cookies = new Cookies();

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userId: "",
      password: ""
    };
  }
  onSignIn() {
    let { userId, password } = this.state;
    let { history } = this.props;
    console.log(process.env);
    this.setState({ isLoading: true });
    const thenFn = res => {
      this.setState({ isLoading: false });
      let data = res && res.data;
      if (data && data.userId && data.userId !== "") {
        cookies.set("userId", data.userId, {
          path: "/",
          expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
        });
        cookies.set("isAdmin", true, {
          path: "/",
          expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
        });
        history.push("/admin/dashboard");
      } else {
        alert("Something Went wrong. Please try again.");
      }
    };
    const errorFn = error => {
      this.setState({ isLoading: false });
      alert(error);
    };
    sendRequest(authApi.adminLogin, {
      userId,
      password,
      success: { fn: thenFn },
      error: { fn: errorFn }
    });
  }
  componentWillMount() {
    let { history } = this.props;
    if (cookies.get("userId") && cookies.get("userId") !== "") {
      history.push("/admin/dashboard");
    }
  }
  componentDidMount() {}
  render() {
    let { userId, password, isLoading } = this.state;
    return (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        }}
      >
        <div style={{ width: 400 }}>
          <Card>
            <CardHeader color="primary">
              <p>Demo</p>
              <h3>Dashboard Login</h3>
            </CardHeader>
            {isLoading ? (
              <CardBody>
                <CircularProgress color="primary" />
              </CardBody>
            ) : (
              <CardBody>
                <CustomInput
                  labelText="User Id"
                  id="userId"
                  formControlProps={{
                    fullWidth: true
                  }}
                  inputProps={{
                    value: userId,
                    onChange: e => {
                      this.setState({ userId: e.target.value });
                    },
                    onKeyPress: e => {
                      if (e.key === "Enter") {
                        this.onSignIn();
                      }
                    }
                  }}
                />
                <CustomInput
                  labelText="Password"
                  id="password"
                  formControlProps={{
                    fullWidth: true
                  }}
                  inputProps={{
                    type: "password",
                    value: password,
                    onChange: e => {
                      this.setState({ password: e.target.value });
                    },
                    onKeyPress: e => {
                      if (e.key === "Enter") {
                        this.onSignIn();
                      }
                    }
                  }}
                />
              </CardBody>
            )}
            <CardFooter>
              <Button
                disabled={isLoading}
                color="primary"
                onClick={() => {
                  this.onSignIn();
                }}
              >
                Sign In
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    );
  }
}

export default withRouter(Login);
