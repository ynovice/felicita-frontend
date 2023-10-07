import withHeaderAndFooter from "../hoc/withHeaderAndFooter";
import requiresUser from "../hoc/requiresUser";
import "../css/SaveArticlePage.css";
import React, {useContext, useEffect, useMemo, useRef, useState} from "react";
import EditorJS from '@editorjs/editorjs';
import edjsHtml from "editorjs-html";
import InvalidEntityException from "../exception/InvalidEntityException";
import {useSearchParams} from "react-router-dom";
import adminAccessOnly from "../hoc/adminAccessOnly";
import Button from "../components/Button";
import {UpdatedUserContext} from "../contexts/UserContext";
import {formattedDate} from "../constants";
import articleApi from "../apis/ArticleApi";
import imageApi from "../apis/ImageApi";

function SaveArticlePage() {

    const [searchParams] = useSearchParams();

    const [name, setName] = useState("");
    const [nameAreaRef] = useState(React.createRef());

    const [articleAuthor, setArticleAuthor] = useState("");
    const [articleDatePresentation, setArticleDatePresentation] = useState("");

    useEffect(() => {
        nameAreaRef.current.style.height = "5px";
        nameAreaRef.current.style.height = (nameAreaRef.current.scrollHeight) + "px";
    }, [nameAreaRef, name])

    const {user} = useContext(UpdatedUserContext);

    const DOMPurify = useMemo(() => require("dompurify")(window), []);
    const [editor, setEditor] = useState(null);

    useEffect(() => {

        const abortController = new AbortController();

        const tools = {
            header: require('@editorjs/header'),
            image: {
                class: require("@editorjs/image"),
                config: {
                    uploader: {
                        uploadByFile(file) {
                            return imageApi.uploadImage(file).then((imageDto) => {
                                return {
                                    success: 1,
                                    file: {
                                        url: imageApi.getImageUrlByImageId(imageDto["id"])
                                    }
                                }
                            });
                        },
                        uploadByUrl(url) {
                            return new Promise((resolve) => {
                                resolve ({
                                    success: 1,
                                    file: {
                                        url
                                    }
                                });
                            });
                        }
                    }
                }

            }
        }

        setEditor(currentEditor => {

            if(currentEditor) {

                const editedArticleId = searchParams.get("id");
                if(editedArticleId) {
                    articleApi.getById(Number(editedArticleId), abortController.signal)
                        .then(article => {

                            setName(article["name"]);
                            setArticleAuthor(article["author"])
                            setArticleDatePresentation(article["createdAtPresentation"]);
                            setUploadedImageId(article["preview"]["id"]);

                            (function loopedEditorUpdater() {
                                setTimeout(function () {
                                    if(!currentEditor.blocks) {
                                        loopedEditorUpdater();
                                    } else {
                                        currentEditor.blocks.renderFromHTML(article["content"]);
                                    }
                                    console.log("exec")
                                }, 100);
                            })();
                        })
                        .catch((e) => {
                            console.log(e)
                            alert("Произошла ошибка при попытке загрузить редактируемую статью");
                        });
                } else {
                    setArticleAuthor(user["username"]);
                    setArticleDatePresentation(formattedDate());
                }

                return currentEditor;
            }

            return new EditorJS({
                holder: "editor",
                placeholder: "Нажмите, чтобы начать писать статью",
                minHeight: 50,
                tools
            });
        });

        return () => abortController.abort();
    }, [searchParams, user]);

    const [fieldErrors, setFieldErrors] = useState([]);
    const handleSaveClick = () => {

        editor.save().then((outputData) => {

            const edjsParser = edjsHtml();
            let html = edjsParser.parse(outputData);

            if(searchParams.get("id")) {
                const requestDto = {
                    id: Number(searchParams.get("id")),
                    name: name,
                    content: DOMPurify.sanitize(html.join("")),
                    previewId: uploadedImageId
                };

                articleApi.update(requestDto)
                    .then(articleDto => {
                        window.location.href = "/article/" + articleDto["id"];
                    })
                    .catch(e => {
                        if(e instanceof InvalidEntityException) {
                            setFieldErrors(e.validationResult.fieldErrors);
                        }
                    });
            } else {
                const requestDto = {
                    name: name,
                    content: DOMPurify.sanitize(html.join("")),
                    previewId: uploadedImageId
                };

                articleApi.create(requestDto)
                    .then(articleDto => {
                        window.location.href = "/article/" + articleDto["id"];
                    })
                    .catch(e => {
                        if(e instanceof InvalidEntityException) {
                            setFieldErrors(e.validationResult.fieldErrors);
                        }
                    });
            }

        }).catch((error) => {
            console.log('Saving failed: ', error)
        });
    }

    const [uploadedImageId, setUploadedImageId] = useState(null);
    const [previewFileInputRef] = useState(useRef());

    const handleImageUpload = (e) => {
        e.preventDefault();

        const image = e.target.files[0];

        if(!image) return;

        imageApi.uploadImage(image)
            .then((newUploadedImage) => {
                setUploadedImageId(newUploadedImage["id"])
            })
            .catch(() => alert("Что-то пошло не так при загрузке изображения."));
    }

    const handleChooseAnotherPreviewClick = () => {
        previewFileInputRef.current.click();
    }

    const imageUrl = uploadedImageId ?
        imageApi.getImageUrlByImageId(uploadedImageId) :
        "/ui/placeholders/article-placeholder.png";

    return (
        <div className="SaveArticlePage">

            <div className="article-content-heading">
                <div className="article-preview-container">
                    <input type="file"
                           id="file-uploader"
                           ref={previewFileInputRef}
                           onChange={(e) => handleImageUpload(e)}/>
                    <img src={imageUrl}
                         onClick={() => handleChooseAnotherPreviewClick()}
                         className="article-preview"
                         alt="Choose preview"/>
                    <p>Click to choose preview</p>
                </div>
                <div className="article-heading-text">
                    <textarea ref={nameAreaRef}
                              onChange={(e) => setName(e.target.value)}
                              value={name}
                              placeholder="Article title"
                              className="article-title"
                              cols="30"
                              rows="10">

                    </textarea>

                    <div className="article-date">Author: {articleAuthor}</div>
                    <div className="article-date">Written on {articleDatePresentation}</div>
                </div>
            </div>

            <div id="editor" className="article-content"></div>

            <Button value="Save" onClick={() => handleSaveClick()}/>

            <div className="errors-container">
                {fieldErrors.map(fieldError => {
                    return <p key={fieldError.errorCode}>{fieldError.errorMessage}</p>
                })}
            </div>

        </div>
    );
}

export default withHeaderAndFooter(adminAccessOnly(requiresUser(
    SaveArticlePage,
    "Чтобы просмотреть эту страницу, нужно войти в аккаунт администратора."
)));