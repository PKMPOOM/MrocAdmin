import { Editor } from "@tinymce/tinymce-react";
import { useRef } from "react";
import { Editor as TinyMCEEditor } from "tinymce";
import "./inlineEditor.css";

function InlineEditor() {
  const editorRef = useRef<TinyMCEEditor | null>(null);

  return (
    <div className="tw-z-50">
      <Editor
        onInit={(_, editor) => {
          editorRef.current = editor;
        }}
        initialValue="<p>This is the initial content of the editor.</p>"
        apiKey="o44dth4r81u4x5lddqche01e0b308mdzhu5wm3hql96iv7d3"
        toolbar="fontsizeinput | blocks | bold italic bullist numlist outdent indent | myCustomButton"
        // toolbar="undo redo | fontsizeinput | blocks | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | help"
        // plugins={["link"]}
        inline={true}
        tagName="div"
        init={{
          height: 300,
          menubar: false,
          setup: (editor) => {
            editor.ui.registry.addButton("myCustomButton", {
              text: "AI",
              onAction: () => {
                // generate AI content
                editor.insertContent("Hello World!");
              },
            });
          },
        }}
      />
    </div>
  );
}

export default InlineEditor;
