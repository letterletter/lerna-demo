import React, { useRef } from 'react';

import Editor, { Monaco, EditorProps, OnChange } from '@monaco-editor/react';
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api';

export default function SimpleEditor() {
  const editorRef = useRef<any>(null);
  function handleEditorMount(editor: monaco.editor.IStandaloneCodeEditor, monaco: Monaco) {
    editorRef.current = editor;
  }

  function handleEditorWillMount(monaco: Monaco) {
    // here is the monaco instance
    // do something before editor is mounted
    monaco.languages.typescript.javascriptDefaults.setEagerModelSync(true);
  }

  function showValue() {
    alert(editorRef?.current?.getValue())
  }
  function handleEditorChange(value: string | undefined, event: monaco.editor.IModelContentChangedEvent) {
    console.log("here is the current model value:", value);
  }
  return (
    <>
      <button onClick={showValue}>Show Value</button>
      <Editor
        height={"90vh"}
        defaultLanguage="javascript"
        defaultValue='// Hello'
        onMount={handleEditorMount}
        onChange={handleEditorChange}
        beforeMount={handleEditorWillMount}

      />
    </>
  )
}
