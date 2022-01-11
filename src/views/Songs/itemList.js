import React, { Component } from "react";
import { connect } from "react-redux";
import _ from "lodash";
import CircularProgress from "@material-ui/core/CircularProgress";
import {
  TableBody,
  Table,
  TableHead,
  TableFooter,
  TableRow,
  TableCell,
  Checkbox,
  Menu,
  MenuItem
} from "@material-ui/core";
import { NavLink, withRouter } from "react-router-dom";
import Button from "components/CustomButtons/Button.js";
import { sendRequest } from "utills/util";
import { itemApi } from "constant/api";
import SimpleIcon from "components/simpleIcon/simpleIcon";
import { SimpleMenu } from "components/Menus";
import Cookies from "universal-cookie";
import CustomListGrouping from "components/CustomPages";
import SelectorInput from "components/CustomInput/selectorInput";
import CustomInput from "components/CustomInput/CustomInput";
import { editDistance } from "utills/util";
import Fuse from "fuse.js";
import { addUnsavedItemUpdate } from "modules/digitalMandi/reducer";
import { getUnsavedItemUpdate } from "modules/digitalMandi/reducer";
import { categoriesApi } from "constant/api";
import CustomValueInputEdit from "components/CustomInput/CustomValueInputEdit";
const cookies = new Cookies();
const server = process.env.REACT_APP_SERVER_DEV;
const distributorId = cookies.get("distributorId");
class ItemListComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      items: [],
      searchItems: [],
      filterBy: "all",
      categories: []
    };
  }
  deleteItem(id, index) {
    let { items } = _.cloneDeep(this.state);
    items[index].isLoading = true;
    this.setState({ items });
    let thenFn = res => {
      items[index].isLoading = false;
      this.setState({ items }, () => {
        this.setState({ items: res && res.data });
      });
      // console.log(res);
    };
    let errorFn = error => {
      items[index].isLoading = false;
      this.setState({ items });
      console.log(error);
    };
    sendRequest(itemApi.deleteItem, {
      id,
      success: { fn: thenFn },
      error: { fn: errorFn }
    });
  }
  handleMenuVisible(isMenuOpen, index) {
    let newItems = this.state.items;
    newItems[index].isMenuOpen = isMenuOpen;
    this.setState({ items: newItems });
  }
  fetchCategories() {
    this.setState({ categoryLoading: true });
    const thenFn = res => {
      let newCategories = res && res.data;
      newCategories.push({ name: "All", value: "all" });
      this.setState({
        categories: newCategories,
        categoryLoading: false
      });
    };
    const errorFn = error => {
      console.log(error);
      this.setState({ categoryLoading: false });
    };
    sendRequest(categoriesApi.getCategories, {
      noParentItems: true,
      success: { fn: thenFn },
      error: { fn: errorFn }
    });
  }

  componentDidMount() {
    this.fetchCategories();
    this.setState({ isLoading: true });
    sendRequest(itemApi.getItems, {
      userId: cookies.get("userId"),
      success: {
        fn: res => {
          this.setState({ isLoading: false });
          // console.log(res);
          this.setState({ items: res.data });
        }
      },
      error: {
        fn: error => {
          this.setState({ isLoading: false });
          console.log(error);
        }
      }
    });
  }
  renderFeaturedCheckBox(item) {
    let { unsavedItemUpdate, addUnsavedItemUpdate } = this.props;
    let unsavedItemUpdateItem = _.find(
      unsavedItemUpdate,
      itemUnsaved => item._id == itemUnsaved._id
    );
    return (
      <Checkbox
        checked={
          unsavedItemUpdateItem
            ? unsavedItemUpdateItem.isFeatured
            : item.isFeatured
        }
        onClick={() => {
          let newItem;
          if (unsavedItemUpdateItem) {
            newItem = unsavedItemUpdateItem;
            newItem.isFeatured = !unsavedItemUpdateItem.isFeatured;
          } else {
            newItem = item;
            newItem.isFeatured = !item.isFeatured;
          }
          addUnsavedItemUpdate(newItem);
        }}
      />
    );
  }
  renderDropdownEditable(item, key, options) {
    let { unsavedItemUpdate, addUnsavedItemUpdate } = this.props;
    let unsavedItemUpdateItem = _.find(
      unsavedItemUpdate,
      itemUnsaved => item._id == itemUnsaved._id
    );
    return (options || []).length > 0 ? (
      <SelectorInput
        label=""
        options={options}
        onChange={value => {
          let newItem;
          if (unsavedItemUpdateItem) {
            newItem = unsavedItemUpdateItem;
          } else {
            newItem = item;
          }
          newItem[key] = value;
          addUnsavedItemUpdate(newItem);
        }}
        value={unsavedItemUpdateItem ? unsavedItemUpdateItem[key] : item[key]}
      />
    ) : null;
  }
  renderInputEditable(item, key, type, postfix) {
    let { unsavedItemUpdate, addUnsavedItemUpdate } = this.props;
    let unsavedItemUpdateItem = _.find(
      unsavedItemUpdate,
      itemUnsaved => item._id == itemUnsaved._id
    );
    return (
      <CustomValueInputEdit
        id={item._id}
        type={type}
        postfix={postfix}
        value={unsavedItemUpdateItem ? unsavedItemUpdateItem[key] : item[key]}
        onChange={value => {
          let newItem;
          if (unsavedItemUpdateItem) {
            newItem = unsavedItemUpdateItem;
          } else {
            newItem = item;
          }
          newItem[key] = value;
          addUnsavedItemUpdate(newItem);
        }}
      />
    );
  }
  render() {
    let {
      items,
      isLoading,
      filterBy,
      searchInput,
      searchItems,
      categories,
      categoryLoading
    } = this.state;
    let { history, unsavedItemUpdate, addUnsavedItemUpdate } = this.props;
    return (
      <div>
        <NavLink to="/admin/addItem">
          <Button color={"primary"}>Add Item</Button>
        </NavLink>
        {isLoading ? (
          <CircularProgress color="secondary" />
        ) : (
          <div>
            {categoryLoading ? (
              <CircularProgress color="secondary" />
            ) : (
              <SelectorInput
                label="Filter By Category"
                options={categories}
                onChange={value => {
                  this.setState({ filterBy: value });
                }}
                value={this.state.filterBy}
              />
            )}
            <div style={{ flex: "display" }}>
              <CustomInput
                labelText="Search Item By Name"
                id="searchInput"
                formControlProps={{
                  fullWidth: true
                }}
                inputProps={{
                  onChange: e => {
                    this.setState({ searchInput: e.target.value });
                  },
                  onKeyPress: e => {
                    if (e.key === "Enter") {
                      let fuse = new Fuse(items, {
                        includeScore: true,
                        keys: ["name"]
                      });
                      let searchList = _.map(
                        fuse.search(searchInput),
                        (item, index) => {
                          let newItem = item.item;
                          return { ...newItem, score: item.score };
                        }
                      );
                      this.setState({
                        searchItems: searchList
                      });
                    }
                  },
                  value: searchInput
                }}
              />
              <Button
                color="primary"
                onClick={() => {
                  let fuse = new Fuse(items, {
                    includeScore: true,
                    keys: ["name"]
                  });
                  let searchList = _.map(
                    fuse.search(searchInput),
                    (item, index) => {
                      let newItem = item.item;
                      return { ...newItem, score: item.score };
                    }
                  );
                  this.setState({
                    searchItems: searchList
                  });
                }}
              >
                Search
              </Button>
            </div>
            <a
              target="_blank"
              href={`${server}/item/Book2?distributorid=${distributorId}`}
            >
              <Button color="primary" onClick={() => {}}>
                <SimpleIcon iconName="mdi-file-download" />
                Download Excel FIle
              </Button>
            </a>
            <CustomListGrouping
              itemSet={_.filter(
                (searchItems && searchItems.length) > 0 ? searchItems : items,
                (item, index) =>
                  filterBy === "all" ? true : item.category === filterBy
              )}
              max={10}
              renderContent={(itemSet, currentPage) => (
                <div
                  style={{
                    overflowX: "auto"
                  }}
                >
                  <Table>
                    <TableHead>
                      <TableCell>Index</TableCell>
                      <TableCell>Thumbnail</TableCell>
                      <TableCell>Name</TableCell>
                      <TableCell>Category</TableCell>
                      <TableCell>Sub-Category</TableCell>
                      <TableCell>Unit</TableCell>
                      <TableCell>Price(₹)</TableCell>
                      <TableCell>discount(%)</TableCell>
                      <TableCell>tax(%)</TableCell>
                      <TableCell>Inventory</TableCell>
                      <TableCell>Is Featured?</TableCell>
                      <TableCell>Options</TableCell>
                    </TableHead>
                    <TableBody>
                      {_.map(itemSet, (item, index) => (
                        <TableRow>
                          <TableCell>{index + 1 + currentPage * 10}</TableCell>
                          <TableCell>
                            <img
                              src={item.imageUrls[0]}
                              style={{ width: "100px", height: "100px" }}
                            />
                          </TableCell>
                          <TableCell>{item.name}</TableCell>
                          <TableCell>
                            {this.renderDropdownEditable(
                              item,
                              "category",
                              categories
                            )}
                          </TableCell>
                          <TableCell>
                            {this.renderDropdownEditable(
                              item,
                              "subCategory",
                              (
                                _.find(
                                  categories,
                                  itemCat => itemCat.value == item.category
                                ) || {}
                              ).subCategories || []
                            )}
                          </TableCell>
                          <TableCell>{item.unit}</TableCell>
                          <TableCell>
                            {this.renderInputEditable(item, "price", "number")}
                          </TableCell>
                          <TableCell>
                            {this.renderInputEditable(
                              item,
                              "discount",
                              "number",
                              "%"
                            )}
                          </TableCell>
                          <TableCell>
                            {this.renderInputEditable(
                              item,
                              "tax",
                              "number",
                              "%"
                            )}
                          </TableCell>
                          <TableCell>
                            {this.renderInputEditable(
                              item,
                              "inventory",
                              "number"
                            )}
                          </TableCell>
                          <TableCell>
                            {this.renderFeaturedCheckBox(item)}
                          </TableCell>
                          <TableCell>
                            {item.isLoading ? (
                              <CircularProgress color="secondary" />
                            ) : (
                              <SimpleMenu
                                items={[
                                  {
                                    label: "Edit Details",
                                    onClick: () => {
                                      history.push(
                                        `/admin/addItem/${item._id}`
                                      );
                                    }
                                  },
                                  {
                                    label: "Delete",
                                    onClick: () => {
                                      this.deleteItem(item._id, index);
                                    }
                                  }
                                ]}
                              />
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            />
          </div>
        )}
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    unsavedItemUpdate: getUnsavedItemUpdate(state) || []
  };
};
const mapDispatchToProps = dispatch => {
  return {
    addUnsavedItemUpdate: payload => dispatch(addUnsavedItemUpdate(payload))
  };
};
export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(ItemListComponent)
);
