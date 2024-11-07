import { defineSchema } from "@portabletext/editor";

const schemaDefinition = defineSchema({
  // Decorators are simple marks that don't hold any data
  decorators: [{ name: "strong" }, { name: "em" }, { name: "underline" }],
  // Annotations are more complex marks that can hold data
  annotations: [{ name: "link" }],
  // Styles apply to entire text blocks
  // There's always a 'normal' style that can be considered the paragraph style
  styles: [
    { name: "normal" },
    { name: "h1" },
    { name: "h2" },
    { name: "h3" },
    { name: "blockqoute" },
  ],
  // Lists apply to entire text blocks as well
  lists: [{ name: "bullet" }, { name: "number" }],
  // Inline objects hold arbitrary data that can be inserted into the text
  inlineObjects: [{ name: "stock-ticker" }],
  // Block objects hold arbitrary data that live side-by-side with text blocks
  blockObjects: [{ name: "image" }],
});

export default schemaDefinition;
