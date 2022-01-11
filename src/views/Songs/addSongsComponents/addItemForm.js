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
import { NavLink, withRouter } from "react-router-dom";
import Button from "components/CustomButtons/Button.js";
import SimpleIcon from "components/simpleIcon/simpleIcon.js";
import SelectorInput from "components/CustomInput/selectorInput.js";
import AutoCompleteInput from "components/CustomInput/autocompleteSelectorInput.js";
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
import { categoriesApi } from "constant/api";

const cookies = new Cookies();

//regex - ([S|M|K|B|Sa|E]\s)?[0-9]+
class AddItemForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      altName: undefined,
      inventory: 0,
      imageUrls: [""],
      name: undefined,
      category: "fruit",
      isFeatured: false,
      price: 0,
      unit: "1 kg",
      description: "",
      discount: 0, //percentage
      tax: 0,
      isVariant: false,
      emptyFields: {
        name: { empty: true, prestine: true },
        imageUrls: { empty: true, prestine: true }
      },
      categories: [
        { value: "fruit", name: "Fruit" },
        { value: "veggies", name: "Veggies" },
        { value: "cooking", name: "Cooking" },
        { value: "healthcare", name: "Healthcare" },
        { value: "homecare", name: "Homecare" },
        { value: "kids", name: "Kids" },
        { value: "others", name: "Others" }
      ],
      items: []
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
      "categories",
      "items",
      "categoryLoading"
    ]);
    if (
      _.filter(this.state.emptyFields, (value, key) => value.empty).length > 0
    ) {
      alert("Some Fields Seems Empty. Please Check.");
    } else {
      this.setState({ isLoading: true });
      const thenFn = res => {
        this.setState({
          altName: undefined,
          inventory: 0,
          imageUrls: [""],
          name: undefined,
          category: "fruit",
          isFeatured: false,
          description: "",
          price: 0,
          unit: "1 kg",
          discount: 0, //percentage
          tax: 0, //percentage
          isVariant: false,
          parentItem: {},
          emptyFields: {
            name: { empty: true, prestine: true },
            imageUrls: { empty: true, prestine: true }
          },
          isLoading: false
        });
      };
      const errorFn = () => {
        this.setState({ isLoading: false });
        alert("Something went wrong. Please try again later.");
      };
      sendRequest(itemApi.addItem, {
        item: checkState,
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
      "categories",
      "items",
      "categoryLoading"
    ]);
    if (
      _.filter(this.state.emptyFields, (value, key) => value.empty).length > 0
    ) {
      alert("Some Fields Seems Empty. Please Check.");
    } else {
      this.setState({ isLoading: true });
      const thenFn = res => {
        this.setState({
          altName: undefined,
          inventory: 0,
          imageUrls: [""],
          name: undefined,
          category: "fruit",
          isFeatured: false,
          price: 0,
          unit: "1 kg",
          description: "",
          discount: 0, //percentage
          isVariant: false,
          parentItem: {},
          emptyFields: {
            altName: { empty: true, prestine: true },
            name: { empty: true, prestine: true },
            imageUrls: { empty: true, prestine: true }
          },
          isLoading: false
        });
        history.push("/admin/itemList");
      };
      const errorFn = () => {
        this.setState({ isLoading: false });
        alert("Something went wrong. Please try again later.");
      };
      sendRequest(itemApi.updateItem, {
        id,
        item: checkState,
        success: { fn: thenFn },
        error: { fn: errorFn }
      });
    }
  };
  fetchCategories() {
    this.setState({ categoriesLoading: true });
    const thenFn = res => {
      this.setState({
        categories: res && res.data,
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
  fetchItemDetails(id) {
    this.setState({ isLoading: true });
    const thenFn = res => {
      let { isVariant } = this.state;
      let { data } = res;
      let newData = data;
      if (isVariant) {
        //don't change if isVariant true
        newData = _.omit(newData, ["isVariant", "item"]);
      }
      this.setState({
        ...newData,
        isLoading: false,
        emptyFields: {
          name: { empty: false, prestine: true },
          imageUrls: { empty: false, prestine: true }
        }
      });
    };
    const errorFn = error => {
      this.setState({ isLoading: false });
      alert("Something went wrong. Please try again later.");
    };
    sendRequest(itemApi.getItems, {
      success: { fn: thenFn },
      error: { fn: errorFn },
      id,
      distributorId: cookies.get("distributorId")
    });
  }
  componentDidMount() {
    this.fetchCategories(); //also fetch parent items for variant
    let { match } = this.props;
    let id = match && match.params && match.params.id;
    if (id) {
      this.fetchItemDetails(id);
    }
  }
  render() {
    const {
      imageUrls,
      emptyFields,
      isLoading,
      categories,
      categoriesLoading,
      isVariant,
      parentItem,
      items
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
        {isLoading ? (
          <CircularProgress color="secondary" />
        ) : (
          <Form>
            <FormGroup>
              <GridContainer>
                <GridItem>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <Checkbox
                      checked={this.state.isFeatured}
                      onClick={() => {
                        this.setState({
                          isFeatured: !this.state.isFeatured
                        });
                      }}
                    />
                    <span>To be Featured on App Homescreen?</span>
                  </div>
                </GridItem>
              </GridContainer>
            </FormGroup>
            <FormGroup>
              {categoriesLoading ? (
                <CircularProgress color="secondary" />
              ) : (
                _.filter(
                  items,
                  item => item.parentItem && item.parentItem._id === id
                ) || []
              ).length == 0 ? (
                <GridContainer>
                  <GridItem>
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <Checkbox
                        checked={this.state.isVariant}
                        onClick={() => {
                          this.setState({
                            isVariant: !this.state.isVariant
                          });
                        }}
                      />
                      <span>Is It A Product Variant?</span>
                    </div>
                  </GridItem>
                  {isVariant ? (
                    <GridItem style={{display: "flex"}}>
                    <div>
                      <AutoCompleteInput
                      keyExtractor={(item, index)=>item._id}
                        label="Variant Parent Item"
                        options={_.filter(items, item =>
                          item.isVariant ? false : true&&item._id!==id
                        )}
                        objectKey="name"
                        onChange={option => {
                          this.setState({ parentItem: option });
                        }}
                        value={this.state.parentItem}
                      />
                      <Button
                        color="primary"
                        disabled={parentItem && parentItem._id ? false : true}
                        onClick={() => {
                          this.fetchItemDetails(parentItem && parentItem._id);
                        }}
                      >
                        Copy Parent Details
                      </Button>
                      </div>
                      <div>
                     {parentItem? <NavLink to={`/admin/addItem/${parentItem && parentItem._id}`} target="_blank">
                          
                            <span style={{fontSize: 12, textAlign: "center"}}>Go To Parent Details</span>
                          </NavLink>: null}
                      </div>
                    </GridItem>
                  ) : null}
                </GridContainer>
              ) : (
                <GridContainer>
                  <GridItem>
                    <span>Variants</span>
                    <div style={{ display: "flex", flexWrap: "wrap" }}>
                      {_.map(
                        _.filter(
                          items,
                          item => item.parentItem && item.parentItem._id === id
                        ),
                        (item, index) => (
                          <NavLink
                          key={item._id} to={`/admin/addItem/${item._id}`} target="_blank">
                          <div
                            style={{
                              width: 150,
                              margin: 10,
                              display: "flex",
                              flexDirection: "column",
                              alignItems: "center"
                            }}
                          >
                            <img
                              src={item.imageUrls[0]}
                              style={{ width: 100, height: 100 }}
                            />
                            <span style={{fontSize: 12, textAlign: "center"}}>{item.name}</span>
                          </div></NavLink>
                        )
                      )}
                    </div>
                  </GridItem>
                </GridContainer>
              )}
            </FormGroup>
            <FormGroup>
              <GridContainer>
                <GridItem>
                  <CustomInput
                    labelText="Item Name"
                    id="itemName"
                    formControlProps={{
                      fullWidth: true
                    }}
                    inputProps={{
                      value: this.state.name,
                      onChange: e => {
                        this.setState({
                          name: e.target.value
                        });
                        this.isEmpty("string", "name", e.target.value);
                      }
                    }}
                    error={!emptyFields.name.prestine && emptyFields.name.empty}
                  />
                </GridItem>
                <GridItem>
                  <CustomInput
                    labelText="Alternative Item Name"
                    id="altItemName"
                    formControlProps={{
                      fullWidth: true
                    }}
                    inputProps={{
                      value: this.state.altName,
                      onChange: e => {
                        this.setState({
                          altName: e.target.value
                        });
                      }
                    }}
                  />
                </GridItem>
              </GridContainer>
            </FormGroup>

            <FormGroup>
              <GridContainer>
                <GridItem>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <SimpleIcon iconName="mdi-currency-inr" iconColor="gray" />
                    <CustomInput
                      labelText="Price Per Unit"
                      id="price"
                      formControlProps={{
                        fullWidth: true
                      }}
                      inputProps={{
                        type: "number",
                        value: this.state.price,
                        onChange: e => {
                          this.setState({
                            price: e.target.value
                          });
                        }
                      }}
                    />
                  </div>
                </GridItem>
                <GridItem>
                  <Label>Unit</Label>
                  <UnitInput
                    formControlProps={{
                      fullWidth: true
                    }}
                    values={{
                      value:
                        this.state.unit &&
                        this.state.unit.split(" ") &&
                        this.state.unit.split(" ")[0],
                      type:
                        this.state.unit &&
                        this.state.unit.split(" ") &&
                        this.state.unit.split(" ")[1]
                    }}
                    onChange={value => {
                      this.setState({ unit: value });
                    }}
                  />
                </GridItem>
              </GridContainer>
            </FormGroup>
            <FormGroup>
              <GridContainer>
                <GridItem>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <CustomInput
                      labelText="Discount(in %)"
                      id="discount"
                      formControlProps={{
                        fullWidth: true
                      }}
                      inputProps={{
                        type: "number",
                        value: this.state.discount,
                        onChange: e => {
                          this.setState({
                            discount: e.target.value
                          });
                        }
                      }}
                    />
                    <SimpleIcon iconName="mdi-percent" iconColor="gray" />
                  </div>
                </GridItem>
                <GridItem>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <CustomInput
                      labelText="Tax(in %)"
                      id="tax"
                      formControlProps={{
                        fullWidth: true
                      }}
                      inputProps={{
                        type: "number",
                        value: this.state.tax,
                        onChange: e => {
                          this.setState({
                            tax: e.target.value
                          });
                        }
                      }}
                    />
                    <SimpleIcon iconName="mdi-percent" iconColor="gray" />
                  </div>
                </GridItem>
              </GridContainer>
            </FormGroup>
            <FormGroup>
              <GridContainer>
                <GridItem>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <CustomInput
                      labelText="Number of Units We have."
                      id="inventory"
                      formControlProps={{
                        fullWidth: true
                      }}
                      inputProps={{
                        type: "number",
                        value: this.state.inventory,
                        onChange: e => {
                          this.setState({
                            inventory: e.target.value
                          });
                        }
                      }}
                    />
                  </div>
                </GridItem>
              </GridContainer>
            </FormGroup>
            <FormGroup>
            
            <GridContainer>
                <GridItem>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <CustomInput
                      labelText="Item Description."
                      id="description"
                      formControlProps={{
                        fullWidth: true
                      }}
                      inputProps={{
                        type: "text",
                        multiline: true,
                        rows: 6,
                        value: this.state.description,
                        onChange: e => {
                          this.setState({
                            description: e.target.value
                          });
                        }
                      }}
                    />
                  </div>
                </GridItem>
              </GridContainer>
            </FormGroup>
            <FormGroup>
              {categoriesLoading ? (
                <CircularProgress color="secondary" />
              ) : (
                <SelectorInput
                  label="Category"
                  options={categories}
                  onChange={value => {
                    if (
                      (
                        (
                          _.find(categories, (item, index) => {
                            return this.state.category === item.value;
                          }) || {}
                        ).subCategories || []
                      ).length <= 0
                    ) {
                      this.setState({ subCategory: undefined });
                    }
                    this.setState({ category: value });
                  }}
                  value={this.state.category}
                />
              )}
              {categoriesLoading ? (
                <CircularProgress color="secondary" />
              ) : (
                  (
                    _.find(categories, (item, index) => {
                      return this.state.category === item.value;
                    }) || {}
                  ).subCategories || []
                ).length <= 0 ? null : (
                <SelectorInput
                  label="Sub-Category"
                  options={
                    (
                      _.find(categories, (item, index) => {
                        return this.state.category === item.value;
                      }) || {}
                    ).subCategories || []
                  }
                  onChange={value => {
                    this.setState({ subCategory: value });
                  }}
                  value={this.state.subCategory}
                />
              )}
            </FormGroup>
            <FormGroup>
              <Label>Images</Label>
              {!emptyFields.imageUrls.prestine &&
              emptyFields.imageUrls.empty ? (
                <span style={{ color: "red" }}>
                  First Image cannot be empty
                </span>
              ) : null}
              {_.map(imageUrls, (item, index) => (
                <div
                  key={"key" + index}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    border: "1px solid #ddd",
                    padding: 10
                  }}
                >
                  <Uploader
                    value={item}
                    onChange={link => {
                      let newImageUrls = _.cloneDeep(imageUrls);
                      newImageUrls[index] = link;
                      // console.log("link", link);
                      if (link && link === "") {
                      } else {
                        if (index == imageUrls.length - 1)
                          newImageUrls.push("");
                      }
                      this.setState({ imageUrls: newImageUrls });
                      this.isEmpty("array", "imageUrls", newImageUrls);
                    }}
                  />
                </div>
              ))}
            </FormGroup>

            <div>
              <Button
                color={"primary"}
                onClick={() => (id ? this.submitUpdate() : this.submit())}
                disabled={isLoading||categoriesLoading}
              >
                {id ? "Update Item" : "Add Item"}
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
  )(AddItemForm)
);
