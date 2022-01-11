import {
  Checkbox
} from "@material-ui/core";
import CircularProgress from "@material-ui/core/CircularProgress";
import Button from "components/CustomButtons/Button.js";
import CustomInput from "components/CustomInput/CustomInput";
import CustomValueInputEdit from "components/CustomInput/CustomValueInputEdit";
import SelectorInput from "components/CustomInput/selectorInput";
import CustomListGrouping from "components/CustomPages";
import PlaylistCard from "components/PlaylistComponent/playlistCard";
import { adminApi, constantApi, itemApi } from "constant/api";
import Fuse from "fuse.js";
import _ from "lodash";
import { addUnsavedItemUpdate, getUnsavedItemUpdate } from "modules/digitalMandi/reducer";
import React, { Component } from "react";
import { connect } from "react-redux";
import { NavLink, withRouter } from "react-router-dom";
import Cookies from "universal-cookie";
import { sendRequest } from "utills/util";
const cookies = new Cookies();
const server = process.env.REACT_APP_SERVER_DEV;
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
  fetchConstant() {
    this.setState({ constantsLoading: true });
    const thenFn = res => {
      let newConstants = res && res.data||{};
      let genres = _.union(newConstants.genre,[{name: "All", type: "all"}]);
      let languages = newConstants.language;
      this.setState({
        genres,
        languages,
        constantsLoading: false
      });
    };
    const errorFn = error => {
      console.log(error);
      this.setState({ constantsLoading: false });
    };
    sendRequest(constantApi.getConstantList, {
      success: { fn: thenFn },
      error: { fn: errorFn }
    });
  }

  componentDidMount() {
    this.fetchConstant();
    this.setState({ isLoading: true });
    sendRequest(adminApi.getPlaylist, {
      adminId: cookies.get("userId"),
      success: {
        fn: res => {
          this.setState({ isLoading: false });
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
        valueKey="type"
        nameKey="name"
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
      constantsLoading,
      genres,
      languages
    } = this.state;
    let { history, unsavedItemUpdate, addUnsavedItemUpdate } = this.props;
    return (
      <div>
        <NavLink to="/admin/addPlaylist">
          <Button color={"primary"}>Add Playlist</Button>
        </NavLink>
        {isLoading ? (
          <CircularProgress color="secondary" />
        ) : (
          <div>
            
            <div style={{ flex: "display" }}>
              <CustomInput
                labelText="Search playlist by title"
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
                    keys: ["title"]
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
            <CustomListGrouping
              itemSet={_.filter(
                (searchItems && searchItems.length) > 0 ? searchItems : items,
                (item, index) =>
                  filterBy === "all" ? true : item.genreType === filterBy
              )}
              max={10}
              renderContent={(itemSet, currentPage) => (
                <div
                  style={{
                    width: "100%",
                    display: "flex",
                    flexDirection: "row",
                    flexWrap: "wrap"
                  }}
                >
                
        {_.map(itemSet, (item, index)=>
          <div style={{width: "fit-content"}}>
          <NavLink key={item._id} to={`/admin/addPlaylist/${item._id}`}>
                <PlaylistCard
                title={item.title}
                thumbnail={item.albumArtId}
                isDeletable={false}
                onDelete={() => {}}
                onClick={() => {
                  this.setState({ activeSong: item, activeIndex: index });
                }}
              />
              </NavLink>
              </div>
              )}
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
