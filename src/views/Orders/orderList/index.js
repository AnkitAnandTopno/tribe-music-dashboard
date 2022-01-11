import {
  Card,
  Checkbox,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow
} from "@material-ui/core";
import Backdrop from "@material-ui/core/Backdrop";
import CircularProgress from "@material-ui/core/CircularProgress";
import Modal from "@material-ui/core/Modal";
import Button from "components/CustomButtons/Button.js";
import SelectorInput from "components/CustomInput/selectorInput";
import CustomListGrouping from "components/CustomPages";
import { itemApi, orderApi } from "constant/api";
import _ from "lodash";
import moment from "moment";
import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import Cookies from "universal-cookie";
import { sendRequest } from "utills/util";
import ItemList from "./itemList";
import UserInfo from "./userInfo";
import DeliveryConfirm from "./deliveryConfirm";
import CustomDatePicker from "components/CustomInput/CustomDatePicker";

const cookies = new Cookies();

class OrderListComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      orders: [],
      filterBy: "all",
      dateFrom: moment()
        .subtract(30, "days")
        .format("YYYY-MM-DD"),
      dateTo: moment().format("YYYY-MM-DD")
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
    };
    let errorFn = error => {
      items[index].isLoading = false;
      this.setState({ items });
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
  fetchOrders() {
    let { dateFrom, dateTo } = this.state;
    this.setState({ isLoading: true });
    sendRequest(orderApi.getOrders, {
      dateFrom,
      dateTo,
      success: {
        fn: res => {
          this.setState({ isLoading: false });
          console.log(res);
          this.setState({
            orders: res.data || []
          });
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
  componentDidMount() {
    this.fetchOrders();
  }
  handleUserInfoVisible(openUserInfo) {
    this.setState({ openUserInfo });
  }
  handleItemListVisible(openItemList) {
    this.setState({ openItemList });
  }
  render() {
    let {
      orders,
      isLoading,
      openUserInfo,
      openDelivery,
      openItemList,
      activeItemList,
      activeUserId,
      activeOrderId,
      activeOrder,
      activeOffer,
      filterBy,
      dateFrom,
      dateTo
    } = this.state;
    let { history } = this.props;
    return (
      <div>
        <Modal
          aria-labelledby="transition-modal-title"
          aria-describedby="transition-modal-description"
          open={openDelivery}
          onClose={() => this.setState({ openDelivery: false })}
          closeAfterTransition
          BackdropComponent={Backdrop}
          BackdropProps={{
            timeout: 500
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: "100%",
              width: "100%"
            }}
          >
            <Card style={{ width: "fit-content", padding: 20 }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center"
                }}
              >
                <DeliveryConfirm
                  orderId={activeOrderId}
                  onConfirm={() => {
                    window.location.reload();
                  }}
                  onClose={()=>{this.setState({
                    openDelivery: false,
                    activeOrderId: undefined
                  });}}
                />
              </div>
            </Card>
          </div>
        </Modal>
        <Modal
          aria-labelledby="transition-modal-title"
          aria-describedby="transition-modal-description"
          open={openUserInfo}
          onClose={() => this.handleUserInfoVisible(false)}
          closeAfterTransition
          BackdropComponent={Backdrop}
          BackdropProps={{
            timeout: 500
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: "100%",
              width: "100%"
            }}
          >
            <Card
              style={{
                width: "80%",
                height: "80%",
                overflow: "auto",
                padding: 20
              }}
            >
              <UserInfo userId={activeUserId} />
              <Button
                onClick={() => {
                  this.handleUserInfoVisible(false);
                }}
                color="primary"
              >
                OK
              </Button>
            </Card>
          </div>
        </Modal>
        <Modal
          aria-labelledby="transition-modal-title"
          aria-describedby="transition-modal-description"
          open={openItemList}
          onClose={() => this.handleItemListVisible(false)}
          closeAfterTransition
          BackdropComponent={Backdrop}
          BackdropProps={{
            timeout: 500
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: "100%",
              width: "100%"
            }}
          >
            <Card
              style={{
                width: "80%",
                height: "80%",
                overflow: "auto",
                padding: 20
              }}
            >
              <ItemList itemList={activeItemList} orderId={activeOrderId} offer={activeOffer} deliveryCharges={activeOrder&&activeOrder.deliveryCharges}/>

              <Button
                onClick={() => {
                  this.handleItemListVisible(false);
                }}
                color="primary"
              >
                OK
              </Button>
            </Card>
          </div>
        </Modal>
        {isLoading ? (
          <CircularProgress color="secondary" />
        ) : (
          <div>
            <div style={{ display: "flex", flexWrap: "wrap" }}>
              <SelectorInput
                label="Filter By"
                options={[
                  { value: "all", name: "All" },
                  { value: "isAssigned", name: "Is Delivery Boy Assigned?" },
                  { value: "isDelivered", name: "Is Delivered?" },
                  { value: "isCancelled", name: "Is Order Cancelled?" },
                  { value: "isPacked", name: "Is Order Packed?" },
                  { value: "isPaid", name: "Is Order Paid?" },
                  { value: "isOrderConfirm", name: "Is Order Confirmed?" }
                ]}
                onChange={value => {
                  this.setState({ filterBy: value });
                }}
                value={this.state.filterBy}
              />
              <CustomDatePicker
                onChange={dateFromNew => {
                  this.setState({ dateFrom: dateFromNew });
                }}
                label="Date From"
                value={dateFrom}
              />
              <CustomDatePicker
                onChange={dateToNew => {
                  this.setState({ dateTo: dateToNew });
                }}
                label="Date To"
                value={dateTo}
              />
              <Button
                color="primary"
                onClick={() => {
                  this.fetchOrders();
                }}
              >
                Fetch Order
              </Button>
            </div>
            <CustomListGrouping
              itemSet={_.filter(orders, (item, index) => {
                if (filterBy !== "all") {
                  console.log(item[filterBy]);
                  return item[filterBy];
                } else {
                  return true;
                }
              })}
              max={10}
              renderContent={currentOrderSet => (
                <div
                  style={{
                    overflowX: "auto",
                    width: "100%",
                    height: (window.innerHeight * 70) / 100
                  }}
                >
                  <div style={{ display: "table" }}>
                    <Table>
                      <TableHead>
                        <TableCell>Order Number</TableCell>
                        <TableCell>Date</TableCell>
                        <TableCell>Is Delivered?</TableCell>
                        <TableCell>Is Delivery Boy Assigned?</TableCell>
                        <TableCell>Is Cancelled?</TableCell>
                        <TableCell>User Info</TableCell>
                        <TableCell>Item List</TableCell>
                      </TableHead>
                      <TableBody>
                        {_.map(currentOrderSet, (item, index) => (
                          <TableRow>
                            <TableCell>{item.orderNumber}</TableCell>
                            <TableCell>
                              {moment(item.date, "YYYY-MM-DD").format(
                                "DD/MM/YYYY"
                              )}
                            </TableCell>
                            <TableCell>
                              {item.isDelivered ? (
                                <span style={{ color: "green" }}>
                                  Delivered
                                </span>
                              ) : (
                                <Button
                                  onClick={() => {
                                    this.setState({
                                      openDelivery: true,
                                      activeOrderId: item._id
                                    });
                                  }}
                                  color="primary"
                                >
                                  Confirm Delivery
                                </Button>
                              )}
                            </TableCell>
                            <TableCell>
                              <Checkbox checked={item.isAssigned} />
                            </TableCell>
                            <TableCell>
                              <Checkbox checked={item.isCancelled} />
                            </TableCell>
                            <TableCell>
                              <Button
                                onClick={() => {
                                  this.setState(
                                    { activeUserId: item.userId },
                                    () => {
                                      this.handleUserInfoVisible(true);
                                    }
                                  );
                                }}
                                color="primary"
                              >
                                See User Info
                              </Button>
                            </TableCell>
                            <TableCell>
                              <Button
                                onClick={() => {
                                  this.setState(
                                    {
                                      activeItemList: item.itemList,
                                      activeOrderId: item.orderId,
                                      activeOffer:item.offer,
                                      activeOrder: item
                                    },
                                    () => {
                                      this.handleItemListVisible(true);
                                    }
                                  );
                                }}
                                color="primary"
                              >
                                See Item List
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
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
  return {};
};
const mapDispatchToProps = dispatch => {
  return {};
};
export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(OrderListComponent)
);
