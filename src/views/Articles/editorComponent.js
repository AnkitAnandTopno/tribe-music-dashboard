import React, { Component } from "react";
import { connect } from "react-redux";
import _ from "lodash";
import moment from "moment";
import { withRouter } from "react-router-dom";
import CustomInput from "components/CustomInput/CustomInput.js";
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import Uploader from "components/CustomInput/uploader.js";
import Button from "components/CustomButtons/Button.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardAvatar from "components/Card/CardAvatar.js";
import CardBody from "components/Card/CardBody.js";
import CardIcon from "components/Card/CardIcon.js";
import CardFooter from "components/Card/CardFooter.js";
import Settings from "@material-ui/icons/Settings";
import { addEvent } from "modules/events/reducer.js";
import { getEvents } from "modules/events/reducer.js";
import { sendRequest } from "utills/util";
import { setEvents } from "modules/events/reducer";

import EditorJs from "react-editor-js";
import { EDITOR_JS_TOOLS } from "./tools";
import { getArticles } from "modules/articles/reducer";
import { addArticles } from "modules/articles/reducer";
import { setArticles } from "modules/articles/reducer";
import { CircularProgress } from "@material-ui/core";
import { recipeApi } from "constant/api";

class EditorComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      article: {
        title: "",
        imageUrl: "",
        content: {
          time: 1556098174501,
          blocks: [
            {
              type: "header",
              data: {
                text: "Click To Edit.",
                level: 2
              }
            }
          ],
          version: "2.12.4"
        },
        date: ""
      }
    };
  }

  saveArticleUp() {
    let { article } = this.state;
    let { setArticle, history } = this.props;

    this.editorInstance
      .save()
      .then(od => {
        let newArticle = _.cloneDeep(article);
        newArticle.content = od;
        newArticle.date = moment().format("YYYY-MM-DD");
        console.log(od);
        this.setState({ isLoading: true });
        const thenFn = res => {
          // setEvents({res});
          setArticle(res && res.data);
          console.log(res.data);
          this.setState({
            article: {
              title: "",
              imageUrl: undefined,
              content: {},
              date: ""
            },
            isLoading: false
          });

          history.push("/admin/articles/");
        };
        const errorFn = () => {
          this.setState({ isLoading: false });
          alert("error");
        };
        sendRequest(recipeApi.addRecipe, {
          article: newArticle,
          success: { fn: thenFn },
          error: { fn: errorFn }
        });
      })
      .catch(er => {
        console.log(er);
        alert(er);
      });
  }
  componentDidMount() {
    let { setArticle } = this.props;
    const thenFn = res => {
      console.log(res);
      setArticle(res.data);
    };
    const errorFn = () => {
      alert("error");
    };

    sendRequest(recipeApi.getRecipe, {
      success: { fn: thenFn },
      error: { fn: errorFn }
    });
  }
  render() {
    let { article, isLoading } = this.state;
    let { classes } = this.props;
    return (
      <GridItem xs={12} sm={12} md={8}>
        {isLoading ? (
          <CircularProgress color="secondary" />
        ) : (
          <GridContainer>
            <Card>
              <CardHeader color="info">
                <h4 className={classes.cardTitleWhite}>Add Article</h4>
              </CardHeader>
              <CardBody>
                <GridContainer>
                  <GridItem xs={12} sm={12} md={5}>
                    <CustomInput
                      labelText="Title"
                      id="title"
                      formControlProps={{
                        fullWidth: true
                      }}
                      inputProps={{
                        onChange: e => {
                          let newArticle = _.cloneDeep(article);
                          newArticle.title = e.target.value;
                          this.setState({ article: newArticle });
                        },
                        value: article.title
                      }}
                    />
                  </GridItem>
                </GridContainer>

                <GridContainer>
                  <GridItem>
                    <h5>Title Image</h5>
                    <Uploader
                      onChange={link => {
                        let newArticle = _.cloneDeep(article);
                        newArticle.imageUrl = link;
                        this.setState({ article: newArticle });
                      }}
                    />
                  </GridItem>
                </GridContainer>
              </CardBody>
            </Card>
            <Card>
              <CardBody>
                <GridContainer>
                  <GridItem xs={12} sm={12} md={8}>
                    <h3>Content</h3>
                    <EditorJs
                      data={article.content}
                      tools={EDITOR_JS_TOOLS}
                      instanceRef={instance => (this.editorInstance = instance)}
                    />
                  </GridItem>
                </GridContainer>
              </CardBody>
              <CardFooter>
                <Button
                  color="info"
                  onClick={() => {
                    this.saveArticleUp();
                  }}
                >
                  Save Article
                </Button>
              </CardFooter>
            </Card>
          </GridContainer>
        )}
      </GridItem>
    );
  }
}
const mapStateToProps = state => {
  return {
    articles: getArticles(state)
  };
};
const mapDispatchToProps = dispatch => {
  return {
    addArticle: payload => dispatch(addArticles(payload)),
    setArticle: payload => dispatch(setArticles(payload))
  };
};
export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(EditorComponent)
);
