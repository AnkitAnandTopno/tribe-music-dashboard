// tools.js
import Embed from "@editorjs/embed";
import Table from "@editorjs/table";
import Paragraph from "@editorjs/paragraph";
import List from "@editorjs/list";
import Warning from "@editorjs/warning";
import Code from "@editorjs/code";
import LinkTool from "@editorjs/link";
import Image from "@editorjs/image";
import Raw from "@editorjs/raw";
import Header from "@editorjs/header";
import Quote from "@editorjs/quote";
import Marker from "@editorjs/marker";
import CheckList from "@editorjs/checklist";
import Delimiter from "@editorjs/delimiter";
import InlineCode from "@editorjs/inline-code";
import SimpleImage from "@editorjs/simple-image";
import { server } from "utills/util";
import { recipeApi } from "constant/api";

export const EDITOR_JS_TOOLS = {
  // embed: Embed,
  // table: Table,
  paragraph: {
    class: Paragraph,
    inlineToolbar: false
  },
  list: List,
  // linkTool: LinkTool,
  // raw: Raw,
  image: {
    class: Image,
    config: {
      field: "file",
      endpoints: {
        byFile: `${server}/${recipeApi.uploadRecipeImage.path}`
      }
    }
  },
  header: Header,
  quote: Quote
  // marker: Marker,
  // checklist: CheckList,
  // delimiter: Delimiter,
  // inlineCode: InlineCode,
  // warning: Warning,
  // code: Code,
  // simpleImage: SimpleImage
};
