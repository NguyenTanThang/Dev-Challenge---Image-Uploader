import React, { Component } from 'react';
import {app, firebaseStorage} from "../config/base";
import image from "../images/image.svg";
import {dropAreaJSCode} from "../utils/utils";
import firebase from "firebase";

const storage = firebaseStorage;
var storageRef = storage.ref();

export default class HomePage extends Component {

    state = {
        loading: false,
        isCompleted: false,
        downloadURL: ""
    }
    
    componentDidMount() {
        dropAreaJSCode();
    }

    onCopyLink = () => {
        const {downloadURL} = this.state;

        navigator.clipboard.writeText(downloadURL).then(() => {
            alert('Copying to clipboard was successful!');
          }, function(err) {
            alert('Could not copy text: ', err.message);
        });
    }
    
    uploadFile = (file) => {
        var uploadTask = storageRef.child('image-uploader/' + file.name).put(file);

        // Listen for state changes, errors, and completion of the upload.
        uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED, // or 'state_changed'
        (snapshot) => {
            // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
            var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log(progress);
            console.log('Upload is ' + progress + '% done');
            this.setState({
                loading: true
            })
            switch (snapshot.state) {
            case firebase.storage.TaskState.PAUSED: // or 'paused'
                console.log('Upload is paused');
                break;
            case firebase.storage.TaskState.RUNNING: // or 'running'
                console.log('Upload is running');
                break;
            default:
                break;
            }
        }, (error) => {

        // A full list of error codes is available at
        // https://firebase.google.com/docs/storage/web/handle-errors
        switch (error.code) {
            case 'storage/unauthorized':
            // User doesn't have permission to access the object
            break;
            case 'storage/canceled':
            // User canceled the upload
            break;
            case 'storage/unknown':
            // Unknown error occurred, inspect error.serverResponse
            break;
            default:
                console.log(error);
                break;
        }
        }, () => {
            // Upload completed successfully, now we can get the download URL
            uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
                console.log('File available at', downloadURL);
                this.setState({
                    downloadURL,
                    loading: false,
                    isCompleted: true
                })
            });
        });
    }

    handleDrop = (ev) => {
        console.log('File(s) dropped');

        // Prevent default behavior (Prevent file from being opened)
        ev.preventDefault();
        const {uploadFile} = this;

        if (ev.dataTransfer.items) {
            // Use DataTransferItemList interface to access the file(s)
            for (let i = 0; i < 1; i++) {
                // If dropped items aren't files, reject them
                if (ev.dataTransfer.items[i].kind === 'file') {
                    let file = ev.dataTransfer.items[i].getAsFile();
                    console.log('... file[' + i + '].name = ' + file.name);
                    uploadFile(file)
                }
            }
        } else {
            // Use DataTransfer interface to access the file(s)
            for (let i = 0; i < 1; i++) {
                let file = ev.dataTransfer.files[i];
                console.log('... file[' + i + '].name = ' + file.name);
                uploadFile(file)
            }
        }
          
        //uploadFile(file)
    }

    handleFileChange = (e) => {
        e.preventDefault();
        const {uploadFile} = this;

        const fileElem = document.querySelector("#fileElem");
        var file = fileElem.files[0];

        console.log(file);

        uploadFile(file)
    }

    render() {
        const {handleFileChange, handleDrop, onCopyLink} = this;
        const {
            loading,
            isCompleted,
            downloadURL
        } = this.state;

        if (isCompleted && downloadURL) {
            return (
                <div className="home">
                    <div className="home__wrapper home__wrapper--complete">
    
                        <div className="complete-icon">
                            <span className="material-icons">
                                check
                            </span>
                        </div>

                        <h4>Uploaded Successfully!</h4>
                        
                        <div className="home-wrapper__demo">
                            <img src={downloadURL} alt={"Demo"} className="img-fluid"/>
                        </div>

                        <div className="home-wrapper__copy">
                            <p>{downloadURL}</p>
                            <button className="btn btn-primary" onClick={onCopyLink}>Copy Link</button>
                        </div>
    
                    </div>
                </div>
            )
        }

        if (!isCompleted && loading) {
            return (
                <div className="home">
                    <div className="home__wrapper home__wrapper--loading">
    
                        <h4>Uploading...</h4>
                        
                        <div className="progress">
                            <div className="progress-bar"></div>
                        </div>
    
                    </div>
                </div>
            )
        }

        return (
            <div className="home">
                <div className="home__wrapper home__wrapper--upload">

                    <h4>Upload your image</h4>
                    <h5>File should be Jpeg, Png,...</h5>

                    <form className="home__upload-form" id="image-upload-form">
                        <div className="home-upload-form__drop-area" id="drop-area" onDrop={handleDrop}>
                            <input type="file" id="fileElem" accept="image/*" onChange={handleFileChange}/>
                            <div className="upload-form__image">
                                <img src={image} alt={"upload"} className="img-fluid"/>
                            </div>
                            <h6>Drag & Drop your image here</h6>
                        </div>
                        <p>or</p>
                        <label className="btn btn-primary" htmlFor="fileElem">Choose a file</label>
                    </form>

                </div>
            </div>
        )
    }
}
