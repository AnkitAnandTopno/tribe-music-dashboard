import React, { Component } from "react";
import {
  Col,
  Row,
  Form,
  FormGroup,
  Label,
  Input,
  Modal,
  Progress
} from "reactstrap";
import moment from "moment";
import { connect } from "react-redux";
import _ from "lodash";
import { withRouter } from "react-router-dom";
import Button from "components/CustomButtons/Button.js";
import SimpleIcon from "components/simpleIcon/simpleIcon.js";
import SelectorInput from "components/CustomInput/selectorInput.js";
import Uploader from "components/CustomInput/uploader";
import CustomInput from "components/CustomInput/CustomInput";
import GridContainer from "components/Grid/GridContainer";
import GridItem from "components/Grid/GridItem";
import CustomCheckbox from "components/CustomInput/CustomCheckbox";
import { Checkbox, CircularProgress } from "@material-ui/core";
import { sendRequest } from "utills/util";
import { itemApi } from "constant/api";
import Cookies from "universal-cookie";
import UnitInput from "components/CustomInput/unitInput";
import { offerApi } from "constant/api";
import GradientPicker from "components/CustomInput/GradientPicker";
import { GoogleApiWrapper, Map, InfoWindow, Marker } from "google-maps-react";
import { authApi } from "constant/api";
import ToFromTimeInput from "components/CustomInput/toFromTimeInput";

const cookies = new Cookies();

//regex - ([S|M|K|B|Sa|E]\s)?[0-9]+
class AddDistributorForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      adminName: "",
      address: "",
      location: {
        lat: "",
        long: ""
      },
      deliveryTime: [
        {
          to: moment("09:30", "HH:mm").format(),
          from: moment("07:30", "HH:mm").format()
        }
      ],
      deliveryRange: 10,
      deliveryCharges: 0,
      isActive: false
    };
  }
  isEmpty(type, id, value) {
    let newEmptyFields = _.cloneDeep(this.state.emptyFields);
    newEmptyFields[id].prestine = false;
    switch (type) {
      case "array":
        if (value[0] === "") {
          newEmptyFields[id].empty = true;
        } else {
          newEmptyFields[id].empty = false;
        }
        break;
      case "string":
        if (value === "") {
          newEmptyFields[id].empty = true;
        } else {
          newEmptyFields[id].empty = false;
        }
        break;
    }

    this.setState({ emptyFields: newEmptyFields });
  }
  submitUpdate = () => {
    let { match, history } = this.props;
    let id = match && match.params && match.params.id;
    let checkState = _.cloneDeep(this.state);
    checkState = _.omit(checkState, ["emptyFields", "isLoading", "isVendor"]);
    if (
      _.filter(this.state.emptyFields, (value, key) => value.empty).length > 0
    ) {
      alert("Some Fields Seems Empty. Please Check.");
    } else {
      this.setState({ isLoading: true });
      const thenFn = res => {
        this.setState({ isLoading: false });
        // history.reload();
      };
      const errorFn = () => {
        this.setState({ isLoading: false });
        alert("Something went wrong. Please try again later.");
      };
      sendRequest(authApi.updateAccount, {
        distributor: checkState,
        success: { fn: thenFn },
        error: { fn: errorFn }
      });
    }
  };
  componentDidMount() {
    let isVendor = cookies.get("isVendor");
    this.setState({ isVendor: isVendor != "undefined" ? true : false });
    navigator.geolocation.getCurrentPosition(position => {
      let location = {
        lat: position.coords.latitude,
        long: position.coords.longitude
      };
      this.setState({ location });
    });
    this.setState({ isLoading: true });
    const thenFn = res => {
      let { data } = res;
      this.setState({
        ...data,
        isLoading: false,
        emptyFields: {}
      });
    };
    const errorFn = error => {
      this.setState({ isLoading: false });
      alert("Something went wrong. Please try again later.");
    };
    sendRequest(authApi.getAccount, {
      success: { fn: thenFn },
      error: { fn: errorFn }
    });
  }
  render() {
    const {
      imageUrls,
      emptyFields,
      isLoading,
      location,
      isVendor
    } = this.state;
    let { match } = this.props;
    let id = match && match.params && match.params.id;
    return (
      <div
        style={{
          background: "#fff",
          padding: 10
        }}
      >
        {!isLoading ? (
          <CircularProgress color="secondary" />
        ) : (
          <Form>
            <FormGroup>
              <GridContainer>
                <GridItem>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <Checkbox
                      checked={this.state.isActive}
                      onClick={() => {
                        this.setState({
                          isActive: !this.state.isActive
                        });
                      }}
                    />
                    <span>Is Taking Order?</span>
                  </div>
                </GridItem>
              </GridContainer>
            </FormGroup>
            {!isVendor ? null : (
              <FormGroup>
                <GridContainer>
                  <GridItem>
                    <CustomInput
                      labelText="Vendor Company Name"
                      id="companyName"
                      formControlProps={{
                        fullWidth: true
                      }}
                      inputProps={{
                        value: this.state.companyName,
                        onChange: e => {
                          this.setState({
                            companyName: e.target.value
                          });
                        }
                      }}
                    />
                  </GridItem>
                  <GridItem>
                    <CustomInput
                      labelText="Phone Number"
                      id="phoneNumber"
                      formControlProps={{
                        fullWidth: true
                      }}
                      inputProps={{
                        value: this.state.contactNumber,
                        onChange: e => {
                          this.setState({
                            contactNumber: e.target.value
                          });
                        }
                      }}
                    />
                  </GridItem>
                </GridContainer>
                <GridContainer>
                  <GridItem>
                    <CustomInput
                      labelText="Description"
                      id="description"
                      formControlProps={{
                        fullWidth: true
                      }}
                      inputProps={{
                        placeholder: "Add Description...",
                        multiline: true,
                        rows: 5,
                        value: this.state.description,
                        onChange: e => {
                          this.setState({
                            description: e.target.value
                          });
                        }
                      }}
                    />
                  </GridItem>
                </GridContainer>
                <GridContainer>
                  <GridItem>
                    <Label>Logo</Label>
                    <div style={{ border: "1px solid #eee", padding: 10 }}>
                      <Uploader
                        value={this.state.logo}
                        onChange={link => {
                          this.setState({ logo: link });
                        }}
                        imageStyle={{ width: 100, height: 100 }}
                      />
                    </div>
                  </GridItem>
                </GridContainer>
                <GridContainer>
                  <GridItem>
                    <Label>Cover Image</Label>
                    <div style={{ border: "1px solid #eee", padding: 10 }}>
                      <Uploader
                        value={this.state.coverImage}
                        onChange={link => {
                          this.setState({ coverImage: link });
                        }}
                      />
                    </div>
                  </GridItem>
                </GridContainer>
              </FormGroup>
            )}
            <FormGroup>
              <GridContainer>
                <GridItem>
                  <CustomInput
                    labelText="Administrator Name"
                    id="adminName"
                    formControlProps={{
                      fullWidth: true
                    }}
                    inputProps={{
                      value: this.state.adminName,
                      onChange: e => {
                        this.setState({
                          adminName: e.target.value
                        });
                      }
                    }}
                  />
                </GridItem>
              </GridContainer>
              <GridContainer>
                <GridItem>
                  <CustomInput
                    labelText="Address"
                    id="address"
                    formControlProps={{
                      fullWidth: true
                    }}
                    inputProps={{
                      placeholder: "Add An Address...(required)",
                      multiline: true,
                      rows: 5,
                      value: this.state.address,
                      onChange: e => {
                        this.setState({
                          address: e.target.value
                        });
                      }
                    }}
                  />
                </GridItem>
                <GridItem>
                  <CustomInput
                    labelText="Delivery Range(in KM)"
                    id="deliveryRange"
                    formControlProps={{
                      fullWidth: true
                    }}
                    inputProps={{
                      type: "number",
                      value: this.state.deliveryRange,
                      onChange: e => {
                        this.setState({
                          deliveryRange: e.target.value
                        });
                      }
                    }}
                  />
                </GridItem>
              </GridContainer>
              <GridContainer>
                <GridItem>
                  <CustomInput
                    labelText="Delivery Charges(in Rs.)"
                    id="deliveryCharges"
                    formControlProps={{
                      fullWidth: true
                    }}
                    inputProps={{
                      type: "number",
                      value: this.state.deliveryCharges,
                      onChange: e => {
                        this.setState({
                          deliveryCharges: e.target.value
                        });
                      }
                    }}
                  />
                </GridItem>
              </GridContainer>
              <GridContainer>
              <GridItem>
                <Label>Delivery Time(s)</Label>
                {_.map(this.state.deliveryTime || [], (itemDT, indexDT) => {
                  return (
                    <div style={{ display: "flex" }}>
                      <ToFromTimeInput
                        toFromTime={itemDT}
                        onChange={deliveryTimeOne => {
                          let { deliveryTime } = _.cloneDeep(this.state);
                          deliveryTime[indexDT] = deliveryTimeOne;
                          this.setState({ deliveryTime });
                        }}
                      />
                      {(this.state.deliveryTime || []).length ==
                      indexDT + 1 ? (
                        <SimpleIcon
                          onClick={() => {
                            let { deliveryTime } = _.cloneDeep(this.state);
                            deliveryTime.pop();
                            this.setState({ deliveryTime });
                          }}
                          iconName="mdi-close"
                          iconColor="gray"
                        />
                      ) : null}
                    </div>
                  );
                })}
                  <SimpleIcon iconName="mdi-plus" iconColor="gray" onClick={() => {
                    let { deliveryTime } = _.cloneDeep(this.state);
                    deliveryTime = deliveryTime || [];
                    deliveryTime.push({
                      to: moment("09:30", "HH:mm").format(),
                      from: moment("07:30", "HH:mm").format()
                    });
                    this.setState({ deliveryTime });
                  }} />
              </GridItem>
            </GridContainer>
            </FormGroup>
            <FormGroup>
              <GridContainer>
                <GridItem>
                  {" "}
                  <div
                    className="disabledScrollBar"
                    style={{
                      width: 400,
                      height: 400,
                      overflow: "scroll",
                      msOverflowStyle: "none",
                      scrollbarWidth: "none"
                    }}
                  >
                    <div style={{ width: 401, height: 401 }}>
                      <Map
                        google={this.props.google}
                        containerStyle={{
                          position: "relative",
                          width: "100%",
                          height: "100%"
                        }}
                        zoom={17}
                        initialCenter={{
                          lat: location.lat,
                          lng: location.long
                        }}
                        onClick={(mapProps, map, clickEvent) => {
                          this.setState({
                            location: {
                              lat:
                                clickEvent &&
                                clickEvent.latLng &&
                                clickEvent.latLng.lat(),
                              long:
                                clickEvent &&
                                clickEvent.latLng &&
                                clickEvent.latLng.lng()
                            }
                          });
                        }}
                      >
                        <Marker
                          position={{ lat: location.lat, lng: location.long }}
                        />
                      </Map>
                    </div>
                  </div>
                </GridItem>
              </GridContainer>
            </FormGroup>

            <div>
              <Button color={"primary"} onClick={() => this.submitUpdate()}>
                {"Save Settings"}
              </Button>
            </div>
          </Form>
        )}
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {};
};
const mapDispatchToProps = dispatch => {
  return {};
};
export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(
    GoogleApiWrapper({
      apiKey: process.env.GOOGLE_MAP_API_KEY
    })(AddDistributorForm)
  )
);
