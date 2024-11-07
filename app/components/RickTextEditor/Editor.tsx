import {
  defineSchema,
  useEditor,
  PortableTextBlock,
  PortableTextEditor,
  PortableTextEditable,
  RenderDecoratorFunction,
  PortableTextChild,
  RenderAnnotationFunction,
  RenderBlockFunction,
  RenderStyleFunction,
  RenderChildFunction,
} from "@portabletext/editor";
import { useEffect, useState } from "react";
import schemaDefinition from "./schemaDefinition";
import Toolbar from "./Toolbar";

const renderDecorator: RenderDecoratorFunction = (props) => {
  if (props.value === "strong") {
    return <strong>{props.children}</strong>;
  }
  if (props.value === "em") {
    return <em>{props.children}</em>;
  }
  if (props.value === "underline") {
    return <u>{props.children}</u>;
  }
  return <>{props.children}</>;
};

const renderAnnotation: RenderAnnotationFunction = (props) => {
  if (props.schemaType.name === "link") {
    return (
      <span style={{ textDecoration: "underline" }}>{props.children}</span>
    );
  }

  return <>{props.children}</>;
};

const renderBlock: RenderBlockFunction = (props) => {
  if (props.schemaType.name === "image" && isImage(props.value)) {
    return (
      <div
        style={{
          border: "1px dotted grey",
          padding: "0.25em",
          marginBlockEnd: "0.25em",
        }}
      >
        IMG: {props.value.src}
      </div>
    );
  }

  return <div style={{ marginBlockEnd: "0.25em" }}>{props.children}</div>;
};

function isImage(
  props: PortableTextBlock
): props is PortableTextBlock & { src: string } {
  return "src" in props;
}

const renderStyle: RenderStyleFunction = (props) => {
  if (props.schemaType.value === "h1") {
    return <h1>{props.children}</h1>;
  }
  if (props.schemaType.value === "h2") {
    return <h2>{props.children}</h2>;
  }
  if (props.schemaType.value === "h3") {
    return <h3>{props.children}</h3>;
  }
  if (props.schemaType.value === "blockquote") {
    return <blockquote>{props.children}</blockquote>;
  }
  return <>{props.children}</>;
};

const renderChild: RenderChildFunction = (props) => {
  if (props.schemaType.name === "stock-ticker" && isStockTicker(props.value)) {
    return (
      <span
        style={{
          border: "1px dotted grey",
          padding: "0.15em",
        }}
      >
        {props.value.symbol}
      </span>
    );
  }

  return <>{props.children}</>;
};

function isStockTicker(
  props: PortableTextChild
): props is PortableTextChild & { symbol: string } {
  return "symbol" in props;
}

export default function Editor() {
  // Create an editor
  const editor = useEditor({
    schemaDefinition: schemaDefinition,
  });

  const [value, setValue] = useState<Array<PortableTextBlock> | undefined>(
    undefined
  );

  // Subscribe to editor changes
  useEffect(() => {
    const subscription = editor.on("mutation", (mutation) => {
      setValue(mutation.snapshot);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [editor]);

  return (
    <>
      <PortableTextEditor
        // Pass in the `editor` you created earlier
        editor={editor}
        // And an optional value
        value={value}
      >
        {/* Toolbar needs to be rendered inside the `PortableTextEditor` component */}
        <Toolbar />
        {/* Component that controls the actual rendering of the editor */}
        <PortableTextEditable
          style={{ border: "1px solid black", padding: "0.5em" }}
          // Control how decorators are rendered
          renderDecorator={renderDecorator}
          // Control how annotations are rendered
          renderAnnotation={renderAnnotation}
          // Required to render block objects but also to make `renderStyle` take effect
          renderBlock={renderBlock}
          // Control how styles are rendered
          renderStyle={renderStyle}
          // Control how inline objects are rendered
          renderChild={renderChild}
          // Rendering lists is harder and most likely requires a fair amount of CSS
          // However, we still need to return and render the list item's children to ensure proper rendering
          renderListItem={(props) => <>{props.children}</>}
        />
      </PortableTextEditor>
      <pre style={{ border: "1px dashed black", padding: "0.5em" }}>
        {JSON.stringify(value, null, 2)}
      </pre>
    </>
  );
}
