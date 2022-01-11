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
import { categoriesApi } from "constant/api";
import AutocompleteSelectorInput from "components/CustomInput/autocompleteSelectorInput";
import AutocompleteMultiSelectorInput from "components/CustomInput/AutocompleteMultiSelectorInput";

const cookies = new Cookies();

//regex - ([S|M|K|B|Sa|E]\s)?[0-9]+
class AddOfferForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: "",
      description: "",
      imageUrl: "",
      type: "discount",
      offerValue: "",
      minimumOrder: 0,
      category: "all",
      couponCode: "",
      isActive: false,
      emptyFields: {},
      cardColor1: "#ED1E6E",
      cardColor2: "#F12532"
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
  submit = () => {
    let checkState = _.cloneDeep(this.state);
    checkState = _.omit(checkState, [
      "emptyFields",
      "isLoading",
      "items",
      "categories",
      "categoriesLoading"
    ]);
    if (
      _.filter(this.state.emptyFields, (value, key) => value.empty).length > 0
    ) {
      alert("Some Fields Seems Empty. Please Check.");
    } else {
      this.setState({ isLoading: true });
      const thenFn = res => {
        this.setState({
          title: "",
          description: "",
          imageUrl: "",
          type: "discount",
          offerValue: "",
          minimumOrder: 0,
          category: "all",
          couponCode: "",
          cardColor1: "",
          cardColor2: "",
          isActive: false,
          emptyFields: {},
          isLoading: false,
          isSalesOffer: false,
          isBanner: false
        });
      };
      const errorFn = () => {
        this.setState({ isLoading: false });
        alert("Something went wrong. Please try again later.");
      };
      sendRequest(offerApi.addOffer, {
        offer: checkState,
        success: { fn: thenFn },
        error: { fn: errorFn }
      });
    }
  };

  submitUpdate = () => {
    let { match, history } = this.props;
    let id = match && match.params && match.params.id;
    let checkState = _.cloneDeep(this.state);
    checkState = _.omit(checkState, [
      "emptyFields",
      "isLoading",
      "items",
      "categories",
      "categoriesLoading"
    ]);
    if (
      _.filter(this.state.emptyFields, (value, key) => value.empty).length > 0
    ) {
      alert("Some Fields Seems Empty. Please Check.");
    } else {
      this.setState({ isLoading: true });
      const thenFn = res => {
        this.setState({
          title: "",
          description: "",
          imageUrl: "",
          type: "discount",
          offerValue: "",
          minimumOrder: 0,
          category: "all",
          couponCode: "",
          cardColor1: "",
          cardColor2: "",
          isActive: false,
          emptyFields: {},
          isLoading: false,
          isSalesOffer: false,
          isBanner: false
        });
        history.push("/admin/offerList");
      };
      const errorFn = () => {
        this.setState({ isLoading: false });
        alert("Something went wrong. Please try again later.");
      };
      sendRequest(offerApi.updateOffer, {
        offerId: id,
        offer: checkState,
        success: { fn: thenFn },
        error: { fn: errorFn }
      });
    }
  };
  fetchCategories() {
    this.setState({ categoriesLoading: true });
    const thenFn = res => {
      let categories = res && res.data;
      categories.push({ value: "all", name: "All" });
      console.log(categories);
      this.setState({
        categories,
        categoriesLoading: false,
        items: (res && res.items) || []
      });
    };
    const errorFn = error => {
      console.log(error);
      this.setState({ categoriesLoading: false });
    };
    sendRequest(categoriesApi.getCategories, {
      success: { fn: thenFn },
      error: { fn: errorFn }
    });
  }
  componentDidMount() {
    let { match } = this.props;
    let id = match && match.params && match.params.id;
    this.fetchCategories();
    if (id) {
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
      sendRequest(offerApi.getOffer, {
        success: { fn: thenFn },
        error: { fn: errorFn },
        offerId: id
      });
    }
  }
  render() {
    const {
      imageUrls,
      emptyFields,
      isLoading,
      categoriesLoading,
      categories,
      isBanner,
      toUrl,
      items
    } = this.state;
    let { match } = this.props;
    let id = match && match.params && match.params.id;
    return (
      <div
        style={{
          padding: 10
        }}
      >
        {isLoading ? (
          <CircularProgress color="secondary" />
        ) : (
          <Form>
            <GridItem style={{ background: "white", padding: 10, margin: 10 }}>
              <div style={{ display: "flex", alignItems: "center" }}>
                <Checkbox
                  checked={this.state.isActive}
                  onClick={() => {
                    this.setState({
                      isActive: !this.state.isActive
                    });
                  }}
                />
                <span>Is Offer Active?</span>
              </div>
            </GridItem>
            <FormGroup style={{ background: "white", margin: 10, padding: 5 }}>
              <h4>App Offer/Sales Offer/Banner</h4>
              <GridContainer>
                <GridItem>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <Checkbox
                      disabled={this.state.isBanner}
                      checked={this.state.isSalesOffer}
                      onClick={() => {
                        this.setState({
                          isSalesOffer: !this.state.isSalesOffer
                        });
                      }}
                    />
                    <span>Is Offer for sales?</span>
                  </div>
                </GridItem>
                <GridItem>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <Checkbox
                      disabled={this.state.isSalesOffer}
                      checked={this.state.isBanner}
                      onClick={() => {
                        this.setState({
                          isBanner: !this.state.isBanner,
                          toUrl: false
                        });
                      }}
                    />
                    <span>Is a sponsored banner?</span>
                  </div>
                </GridItem>
              </GridContainer>
            </FormGroup>
            {isBanner ? (
              <FormGroup
                style={{ background: "white", margin: 10, padding: 5 }}
              >
                <h4>Banner Details</h4>
                <div>
                  <div style={{ padding: 10 }}>
                    <Input
                      checked={toUrl}
                      type="radio"
                      name="radioBannerTo"
                      style={{ position: "relative", marginLeft: 0 }}
                      onClick={() => {
                        this.setState({ toUrl: true });
                      }}
                    />{" "}
                    Send To Link
                  </div>
                  <div check style={{ padding: 10 }}>
                    <Input
                      checked={!toUrl}
                      type="radio"
                      name="radioBannerTo"
                      style={{ position: "relative", marginLeft: 0 }}
                      onClick={() => {
                        this.setState({ toUrl: false });
                      }}
                    />{" "}
                    Send To Product List
                  </div>
                </div>
                {toUrl ? (
                  <GridItem>
                    <CustomInput
                      labelText="URL to got to."
                      id="url"
                      formControlProps={{
                        fullWidth: true
                      }}
                      inputProps={{
                        value: this.state.urlToGo,
                        onChange: e => {
                          this.setState({
                            urlToGo: e.target.value
                          });
                        }
                      }}
                    />
                  </GridItem>
                ) : (
                  <div style={{ display: "flex", flexWrap: "wrap" }}>
                    <div>
                      Select Products
                      <AutocompleteMultiSelectorInput
                        keyExtractor={(item, index) => item._id}
                        label="Search Products"
                        objectKey="name"
                        onChange={products => {
                          console.log(products);
                          this.setState({ listOfProducts: products });
                        }}
                        value={this.state.listOfProducts}
                        multiSelect={true}
                      />
                    </div>
                    <div>
                      Selected Products
                      {_.map(this.state.listOfProducts, (item, index) => (
                        <div
                          style={{
                            margin: 10,
                            padding: 10,
                            border: "1px solid #bbb",
                            borderRadius: 10
                          }}
                        >
                          {item.name}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </FormGroup>
            ) : null}
            <FormGroup style={{ background: "white", margin: 10, padding: 5 }}>
              <h4>Offer Identity</h4>
              <GridContainer>
                <GridItem>
                  <CustomInput
                    labelText="Offer Title"
                    id="title"
                    formControlProps={{
                      fullWidth: true
                    }}
                    inputProps={{
                      value: this.state.title,
                      onChange: e => {
                        this.setState({
                          title: e.target.value
                        });
                      }
                    }}
                  />
                </GridItem>
                <GridItem>
                  <CustomInput
                    labelText="Description"
                    id="description"
                    formControlProps={{
                      fullWidth: true
                    }}
                    inputProps={{
                      placeholder: "Add a description...(required)",
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
            </FormGroup>
            <FormGroup style={{ background: "white", margin: 10, padding: 5 }}>
              <h4>Offer Content</h4>
              <GridContainer>
                <GridItem>
                  <Label>Offer Image</Label>
                  <Uploader
                    value={this.state.imageUrl}
                    onChange={link => {
                      this.setState({ imageUrl: link });
                    }}
                  />
                </GridItem>
              </GridContainer>
              <SelectorInput
                label="Offer Type"
                options={[
                  { value: "discount", name: "Discount" },
                  { value: "cashback", name: "Cashback" }
                ]}
                onChange={value => {
                  this.setState({ type: value });
                }}
                value={this.state.type}
              />
              <GridContainer>
                <GridItem>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <CustomInput
                      labelText="Offer Value"
                      id="offerValue"
                      formControlProps={{
                        fullWidth: true
                      }}
                      inputProps={{
                        type: "number",
                        value: this.state.offerValue,
                        onChange: e => {
                          this.setState({
                            offerValue: e.target.value
                          });
                        }
                      }}
                    />
                  </div>
                </GridItem>
                <GridItem>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <CustomInput
                      labelText="Minimum Order"
                      id="minimumOrder"
                      formControlProps={{
                        fullWidth: true
                      }}
                      inputProps={{
                        type: "number",
                        value: this.state.minimumOrder,
                        onChange: e => {
                          this.setState({
                            minimumOrder: e.target.value
                          });
                        }
                      }}
                    />
                  </div>
                </GridItem>
              </GridContainer>
              {categoriesLoading ? (
                <CircularProgress color="secondary" />
              ) : (
                <SelectorInput
                  label="Category"
                  options={categories}
                  onChange={value => {
                    this.setState({ category: value });
                  }}
                  value={this.state.category}
                />
              )}
              <GridContainer>
                <GridItem>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <CustomInput
                      labelText="Coupon Code"
                      id="couponCode"
                      formControlProps={{
                        fullWidth: true
                      }}
                      inputProps={{
                        value: this.state.couponCode,
                        onChange: e => {
                          this.setState({
                            couponCode: e.target.value
                          });
                        }
                      }}
                    />
                  </div>
                </GridItem>
                <GridItem>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      flexWrap: "wrap"
                    }}
                  >
                    <GradientPicker
                      labelText={"Card Color"}
                      onChange={(cardColor1, cardColor2) => {
                        this.setState({ cardColor1, cardColor2 });
                      }}
                      cardColor1={this.state.cardColor1}
                      cardColor2={this.state.cardColor2}
                    />
                  </div>
                </GridItem>
              </GridContainer>
            </FormGroup>

            <div>
              {categoriesLoading ? null : (
                <Button
                  color={"primary"}
                  onClick={() => (id ? this.submitUpdate() : this.submit())}
                >
                  {id ? "Update Offer" : "Add Offer"}
                </Button>
              )}
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
  )(AddOfferForm)
);
