import React from "react";
import { sendRequest } from "utills/util";
import { userApi } from "constant/api";
import { CircularProgress } from "@material-ui/core";
import { GoogleApiWrapper, Map, InfoWindow, Marker } from "google-maps-react";
import Button from "components/CustomButtons/Button.js";

class UserInfo extends React.Component {
  constructor(props) {
    super(props);
    this.state = { userInfo: {} };
  }
  componentDidMount() {
    let { userId } = this.props;
    this.setState({ isLoading: true });
    let thenFn = res => {
      this.setState({ userInfo: (res && res.data) || {}, isLoading: false });
    };
    let errorFn = error => {
      alert("Something Went Wrong!");
      this.setState({ isLoading: false });
    };
    sendRequest(userApi.getUserInfo, {
      id: userId,
      success: { fn: thenFn },
      error: { fn: errorFn }
    });
  }
  render() {
    let { userInfo, isLoading } = this.state;
    console.log(
      userInfo &&
        userInfo.addresses &&
        userInfo.addresses[0] &&
        userInfo.addresses[0].locationCoordinates &&
        userInfo.addresses[0].locationCoordinates.lat
    );
    return (
      <div>
        {isLoading ? (
          <CircularProgress color="secondary" />
        ) : (
          <div style={{ display: "flex", flexWrap: "wrap" }}>
            <div>
              <img
                src={userInfo.profilePicUrl}
                style={{ width: "100px", height: "100px" }}
              />
              <h5>Name</h5>
              <span>{userInfo.userName}</span>
              <h5>Phone Number</h5>
              <span>{userInfo.phoneNumber}</span>
              <h5>Alternate Phone Number</h5>
              <span>{userInfo.altPhoneNumber}</span>
              <h5>Address</h5>
              <span>
                {`${userInfo.addresses &&
                  userInfo.addresses[0] &&
                  userInfo.addresses[0].address &&
                  userInfo.addresses[0].address
                    .houseNumber} ${userInfo.addresses &&
                  userInfo.addresses[0] &&
                  userInfo.addresses[0].address &&
                  userInfo.addresses[0].address
                    .apartment}\n${userInfo.addresses &&
                  userInfo.addresses[0] &&
                  userInfo.addresses[0].address &&
                  userInfo.addresses[0].address.roadNo}\n${userInfo.addresses &&
                  userInfo.addresses[0] &&
                  userInfo.addresses[0].address &&
                  userInfo.addresses[0].address.landMark}`}
              </span>
            </div>
            <div style={{ width: 400, height: 400 }}>
              <Map
                google={this.props.google}
                containerStyle={{
                  position: "relative",
                  width: "100%",
                  height: "100%"
                }}
                zoom={17}
                initialCenter={{
                  lat:
                    userInfo.addresses &&
                    userInfo.addresses[0] &&
                    userInfo.addresses[0].locationCoordinates &&
                    userInfo.addresses[0].locationCoordinates.lat,
                  lng:
                    userInfo.addresses &&
                    userInfo.addresses[0] &&
                    userInfo.addresses[0].locationCoordinates &&
                    userInfo.addresses[0].locationCoordinates.long
                }}
              >
                <Marker />
              </Map>
            </div>
            <a
              href={`https://www.google.com/maps/dir//${userInfo.addresses &&
                userInfo.addresses[0] &&
                userInfo.addresses[0].locationCoordinates &&
                userInfo.addresses[0].locationCoordinates
                  .lat},${userInfo.addresses &&
                userInfo.addresses[0] &&
                userInfo.addresses[0].locationCoordinates &&
                userInfo.addresses[0].locationCoordinates
                  .long}/@${userInfo.addresses &&
                userInfo.addresses[0] &&
                userInfo.addresses[0].locationCoordinates &&
                userInfo.addresses[0].locationCoordinates
                  .lat},${userInfo.addresses &&
                userInfo.addresses[0] &&
                userInfo.addresses[0].locationCoordinates &&
                userInfo.addresses[0].locationCoordinates.long},15z`}
              target="_blank"
            >
              <Button color="success">Find Directions</Button>
            </a>
          </div>
        )}
      </div>
    );
  }
}

export default GoogleApiWrapper({
  apiKey: process.env.REACT_APP_GOOGLE_MAP_API_KEY
})(UserInfo);
