import React, { useRef } from "react";

import { DiffEditor, Monaco } from "@monaco-editor/react";
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api';

export default function DiffEditorComp() {
  const diffEditorRef = useRef<any>(null);

  function handleEditorDidMount(editor: monaco.editor.IStandaloneDiffEditor, monaco: Monaco) {
    diffEditorRef.current = editor;
  }

  function showOriginalValue() {
    alert(diffEditorRef.current.getOriginalEditor().getValue());
  }

  function showModifiedValue() {
    alert(diffEditorRef.current.getModifiedEditor().getValue());
  }

  return (
    <>
      <button onClick={showOriginalValue}>show original value</button>
      <button onClick={showModifiedValue}>show modified value</button>
      <DiffEditor
        height="90vh"
        language="javascript"
        original="// the original code"
        modified="// the modified code"
        onMount={handleEditorDidMount}
      />
    </>
  );
}