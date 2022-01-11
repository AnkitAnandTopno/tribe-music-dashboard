import React from "react";
import { connect } from "react-redux";
import _ from "lodash";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import InputLabel from "@material-ui/core/InputLabel";
import { NavLink } from "react-router-dom";
// core components
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import CustomInput from "components/CustomInput/CustomInput.js";
import Uploader from "components/CustomInput/uploader.js";
import Button from "components/CustomButtons/Button.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardAvatar from "components/Card/CardAvatar.js";
import CardBody from "components/Card/CardBody.js";
import CardIcon from "components/Card/CardIcon.js";
import CardFooter from "components/Card/CardFooter.js";
import Settings from "@material-ui/icons/Settings";

import avatar from "assets/img/faces/marc.jpg";
import { getEvents } from "modules/events/reducer";
import { addEvent } from "modules/events/reducer";
import EditorComponent from "./editorComponent";
import { eventsApi } from "constant/api";
import { sendRequest } from "utills/util";
import { setEvents } from "modules/events/reducer";
import { getArticles } from "modules/articles/reducer";
import { recipeApi } from "constant/api";
import { setArticles } from "modules/articles/reducer";
import ListCard from "components/Card/ListCard";

const styles = {
  cardCategoryWhite: {
    color: "rgba(255,255,255,.62)",
    margin: "0",
    fontSize: "14px",
    marginTop: "0",
    marginBottom: "0"
  },
  cardTitleWhite: {
    color: "#FFFFFF",
    marginTop: "0px",
    minHeight: "auto",
    fontWeight: "300",
    fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
    marginBottom: "3px",
    textDecoration: "none"
  }
};

const useStyles = makeStyles(styles);

function Articles(props) {
  const classes = useStyles();
  const { articles, setArticle } = props;
  console.log(articles);
  return (
    <div>
      <GridContainer>
        <EditorComponent classes={classes} />
        <GridItem xs={12} sm={12} md={4}>
          <div
            style={{
              height: "80%",
              overflow: "auto",
              overflowX: "hidden",
              position: "fixed"
            }}
          >
            {_.map(articles, (item, index) => (
              <ListCard
                headerColor="info"
                item={item}
                itemTitle={item.title}
                itemImage={item.imageUrl}
                onDelete={toggleDelete => {
                  if (
                    window.confirm(
                      "Are you sure you want to delete this article?"
                    )
                  ) {
                    toggleDelete(true);
                    const thenFn = res => {
                      // console.log(res);
                      toggleDelete(false);
                      setArticle(res && res.data);
                    };
                    const errorFn = () => {
                      toggleDelete(false);
                      alert("error");
                    };

                    sendRequest(recipeApi.deleteRecipe, {
                      id: item._id,
                      success: { fn: thenFn },
                      error: { fn: errorFn }
                    });
                  }
                }}
                onEdit={() => (
                  <NavLink to={`/admin/articles/preview/${item._id}`}>
                    Edit
                  </NavLink>
                )}
                style={{ cursor: "pointer" }}
              />
            ))}
          </div>
        </GridItem>
      </GridContainer>
    </div>
  );
}
const mapStateToProps = state => {
  return {
    articles: getArticles(state)
  };
};
const mapDispatchToProps = dispatch => {
  return {
    setArticle: payload => dispatch(setArticles(payload))
  };
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Articles);
