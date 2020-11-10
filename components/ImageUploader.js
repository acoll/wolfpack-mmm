import React from "react";
import { nanoid } from "nanoid";
import { storage } from "../lib/firebase";

// Import React FilePond
import { FilePond, registerPlugin } from "react-filepond";

// Import FilePond styles
import "filepond/dist/filepond.min.css";

import FilePondPluginImagePreview from "filepond-plugin-image-preview";
import FilePondPluginImageCrop from "filepond-plugin-image-crop";

import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css";

// Register the plugins
registerPlugin(FilePondPluginImagePreview, FilePondPluginImageCrop);

const server = {
  // this uploads the image using firebase
  process: (fieldName, file, metadata, load, error, progress, abort) => {
    console.log("FilePond.process", fieldName, file);
    const photoId = nanoid();

    // upload the image to firebase
    const task = storage.ref().child(photoId).put(file, {
      contentType: "image/jpeg",
    });

    // monitor the task to provide updates to FilePond
    task.on(
      "state_changed",
      (snap) => {
        // provide progress updates
        progress(true, snap.bytesTransferred, snap.totalBytes);
      },
      (err) => {
        // provide errors
        error(err.message);
      },
      () => {
        // the file has been uploaded
        load(photoId);
      }
    );

    return {
      abort: () => {
        task.cancel();
        abort();
      },
    };
  },

  restore: (fileId, load, error, progress, abort, headers) => {
    console.log("FilePond.restore", fileId);
    progress(true, 0, 1024);

    // fetch the download URL from firebase
    storage
      .ref()
      .child(fileId)
      .getDownloadURL()
      .then((url) => {
        // fetch the actual image using the download URL
        // and provide the blob to FilePond using the load callback
        let xhr = new XMLHttpRequest();
        xhr.responseType = "blob";
        xhr.onprogress = (event) => progress(true, event.loaded, event.total);
        xhr.onload = (event) => load(xhr.response);
        xhr.open("GET", url);
        xhr.send();
      })
      .catch((err) => {
        error(err.message);
        abort();
      });
  },

  fetch: (fileId, load, error, progress, abort, headers) => {
    console.log("FilePond.fetch", fileId);
    progress(true, 0, 1024);

    // fetch the download URL from firebase
    storage
      .ref()
      .child(fileId)
      .getDownloadURL()
      .then((url) => {
        // fetch the actual image using the download URL
        // and provide the blob to FilePond using the load callback
        let xhr = new XMLHttpRequest();
        xhr.responseType = "blob";
        xhr.onprogress = (event) => progress(true, event.loaded, event.total);
        xhr.onload = (event) => load(xhr.response);
        xhr.open("GET", url);
        xhr.send();
      })
      .catch((err) => {
        error(err.message);
        abort();
      });
  },

  // this loads an already uploaded image to firebase
  load: (fileId, load, error, progress, abort) => {
    console.log("FilePond.load", fileId);
    // reset our progress
    progress(true, 0, 1024);

    // fetch the download URL from firebase
    storage
      .ref()
      .child(fileId)
      .getDownloadURL()
      .then((url) => {
        // fetch the actual image using the download URL
        // and provide the blob to FilePond using the load callback
        let xhr = new XMLHttpRequest();
        xhr.responseType = "blob";
        xhr.onprogress = (event) => progress(true, event.loaded, event.total);
        xhr.onload = (event) => load(xhr.response);
        xhr.open("GET", url);
        xhr.send();
      })
      .catch((err) => {
        error(err.message);
        abort();
      });

    return {
      abort: () => {
        abort();
      },
    };
  },
};

// Our app
export default function ImageUploader(props) {
  const { onRequestSave, initialFiles } = props;

  const [files, setFiles] = React.useState(initialFiles || []);

  return (
    <div>
      <FilePond
        files={files}
        onupdatefiles={(files) => setFiles(files.map((f) => f.file))}
        allowMultiple={false}
        allowReplace={true}
        server={server}
        onprocessfile={(err, file) => onRequestSave(file.serverId)}
        name={"files"}
        labelIdle='<span class="filepond--label-action">Choose Guest Photo</span>'
        acceptedFileTypes={["image/x-png", "image/jpeg", "image/gif"]}
      />
    </div>
  );
}
