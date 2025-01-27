import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { getSingleProjectDetaies } from "../app/features/projectSlice";
import UserModal from "../modal/UserModal";
import AddCollabModal from "../modal/AddCollabModal";
import Markdown from "markdown-to-jsx";
import { getWebContainer } from "../config/webContainer";
import { connectSocket, receiveMessage, sendMessage } from "../config/socketIo";

export default function ProjectDetails() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const [userModal, setUserModal] = useState(false);
  const [collabModal, setCollabModal] = useState(false);
  const [message, setMessage] = useState("");
  const [openFiles, setOpenFiles] = useState([]);
  const [currentFile, setCurrentFile] = useState(null);
  const [webContainer, setWebContainer] = useState(null);
  const user = useSelector((state) => state?.user?.user?.user);
  const users = useSelector((state) => state?.project?.project?.users);
  const [messages, setMessages] = useState([]);
  const [iframeUrl, setIframeUrl] = useState(null);
  const [fileTree, setFileTree] = useState({
    //"app.js": {
    //content: `const=require("express")`,
    //},
    //"package.json": {
    //content:`{"name":"temp-server"}`,
    // },
  });

  const messageBox = useRef();

  function SyntaxHighlightedCode(props) {
    const ref = useRef(null);

    React.useEffect(() => {
      if (ref.current && props.className?.includes("lang-") && window.hljs) {
        window.hljs.highlightElement(ref.current);

        // hljs won't reprocess the element unless this attribute is removed
        ref.current.removeAttribute("data-highlighted");
      }
    }, [props.className, props.children]);

    return <code {...props} ref={ref} />;
  }
  const getProject = async () => {
    try {
      const res = await dispatch(getSingleProjectDetaies(id)).unwrap();
      console.log(res);
    } catch (err) {
      console.log(err);
    }
  };

  const send = () => {
    try {
      console.log(message);
      sendMessage("project-message", { message, sender: user });
      // appendOutGoingMessage({ message, sender: user });
      setMessages((prev) => [...prev, { sender: user, message }]);
      setMessage("");
    } catch (err) {
      console.log(err);
    }
  };
  const scrollToBottom = () => {
    if (messageBox.current) {
      messageBox.current.scrollTop = messageBox.current.scrollHeight;
    }
  };
  function WriteAiMessage(message) {
    console.log("ai message", message);
    const messageObject = JSON.parse(message);
    return (
      <div className="overflow-auto bg-slate-950 text-white rounded-sm p-2">
        <Markdown
          children={messageObject.text}
          // options={{
          //   overrides: {
          //     code: SyntaxHighlightedCode,
          //   },
          // }}
        />
      </div>
    );
  }

  useEffect(() => {
    connectSocket(id);
    if (!webContainer) {
      getWebContainer().then((container) => {
        setWebContainer(container);
        console.log(container);
        console.log("container started");
      });
    }

    receiveMessage("project-message", (data) => {
      const message = JSON.parse(data.message);
      if (message.fileTree) {
        console.log(message.fileTree);
        webContainer?.mount(message.fileTree);
        setFileTree(message.fileTree);
        console.log("this is file tree");
        console.log(fileTree);
      }
      setMessages((prevMessages) => [...prevMessages, data]);
    });
    getProject();
    scrollToBottom();
  }, []);

  return (
    <div className="h-screen flex ">
      <div className="w-96 bg-slate-300 h-full flex flex-col  relative">
        <header className="p-4 bg-slate-200">
          <div className="flex justify-between">
            <button onClick={() => setCollabModal(true)}>
              {" "}
              <i className="ri-user-add-line mr-2"></i>
              Add Collaborator
            </button>
            <button className=" p-2" onClick={() => setUserModal(true)}>
              <i className="ri-group-fill"></i>
            </button>
          </div>
        </header>

        <div
          ref={messageBox}
          className="conversation-area flex-grow  p-2 overflow-y-auto"
        >
          conversation area
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`${
                msg.sender.email === "AI"
                  ? "w-[90%] bg-slate-800 text-white px-2"
                  : "max-w-52"
              } ${
                msg.sender.email === user.email && "ml-auto "
              } incoming   msg mt-1 flex flex-col p-2 bg-slate-50 w-fit rounded-md overflow-auto`}
            >
              <small className="opacity-65 text-xs">{msg.sender.email}</small>
              {msg.sender.email === "AI" ? (
                WriteAiMessage(msg.message)
              ) : (
                <p className="text-sm">{msg.message}</p>
              )}
            </div>
          ))}
          {/* <div className="incoming max-w-56 msg flex flex-col p-2 bg-slate-50 w-fit rounded-md ">
            <small className="opacity-65 text-xs">example@gmail.com</small>
            <p className="text-sm">
              {" "}
              Lorem ipsum dolor sit amet.lorem10 Lorem ipsum dolor sit amet,
              consectetur adipisicing elit. Amet, molestiae.
            </p>
          </div>
          <div className="ml-auto mt-2 incoming max-w-56 msg flex flex-col p-2 bg-slate-50 w-fit rounded-md ">
            <small className="opacity-65 text-xs">example@gmail.com</small>
            <p className="text-sm">
              {" "}
              Lorem ipsum dolor sit amet.lorem10 Lorem ipsum dolor sit amet,
              consectetur adipisicing elit. Amet, molestiae.
            </p>
          </div> */}
        </div>
        <div className=" input-box">
          <div className="flex">
            <input
              type="text"
              value={message}
              onChange={(e) => {
                setMessage(e.target.value);
              }}
              className="p-2 px-4 border-none outline-none flex-grow"
              placeholder="Enter message"
            />
            <button
              onClick={send}
              className="send px-5 bg-slate-950 text-white"
            >
              <i className="ri-send-plane-fill"></i>
            </button>
          </div>
        </div>

        {userModal && <UserModal setUserModal={setUserModal} users={users} />}
      </div>
      <div className="right-section h-full flex flex-grow bg-red-50">
        <div className="explorer  h-full max-w-64 min-w-52 bg-slate-200">
          <div className="file-tree w-full">
            {Object.keys(fileTree).map((file, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setCurrentFile(file),
                    setOpenFiles([...new Set([...openFiles, file])]);
                }}
                className="tree-element cursor-pointer p-2 px-4 flex items-center gap-2 bg-slate-300 w-full rounded-md"
              >
                <p className=" font-semibold text-lg ">{file}</p>
              </button>
            ))}
          </div>
        </div>

        {currentFile && (
          <div className="code-editor flex flex-col flex-grow h-full">
            <div className="top flex justify-between  w-full">
              <div className="files flex ">
                {openFiles.map((file) => (
                  <button
                    onClick={() => setCurrentFile(file)}
                    className={`open-file cursor-pointer p-2 px-4 flex items-center w-fit gap-2 bg-slate-300 ${
                      currentFile === file ? "bg-slate-400" : ""
                    }`}
                  >
                    {file}
                  </button>
                ))}
              </div>
              <div className="actions">
                <button
                  onClick={async () => {
                    await webContainer.mount(fileTree);
                    const installProcess = await webContainer?.spawn("npm", [
                      "install",
                    ]);
                    installProcess.output.pipeTo(
                      new WritableStream({
                        write(chunk) {
                          console.log(chunk);
                        },
                      })
                    );
                    const runProcess = await webContainer?.spawn("npm", [
                      "start",
                    ]);
                    runProcess.output.pipeTo(
                      new WritableStream({
                        write(chunk) {
                          console.log(chunk);
                        },
                      })
                    );
                    webContainer.on("server-ready", (port, url) => {
                      console.log(port, url);
                      setIframeUrl(url);
                    });
                    // await webContainer?.mount(fileTree);
                    // lsProcess.output.pipeTo(
                    //   new WritableStream({
                    //     write(chunk) {
                    //       console.log(chunk);
                    //     },
                    //   })
                    // );
                  }}
                  className="p-2 bg-green-300 text-white"
                >
                  Run
                </button>
              </div>
            </div>
            <div className="bottom flex flex-grow  max-w-full bg-red-200">
              {fileTree[currentFile] && (
                <textarea
                  className="w-full outline-none p-2 bg-zinc-800 text-white"
                  value={fileTree[currentFile].file.contents}
                  onChange={(e) => {
                    setFileTree({
                      ...fileTree,
                      [currentFile]: { content: e.target.value },
                    });
                  }}
                />
              )}
            </div>{" "}
          </div>
        )}
        {iframeUrl && webContainer && (
          <div className="flex min-w-96 flex-col h-full">
            <div className="address-bar">
              <input
                type="text"
                value={iframeUrl}
                className="w-full p-2"
                onChange={() => setIframeUrl(e.target.value)}
              />
            </div>
            <iframe src={iframeUrl} className="h-full w-full"></iframe>
          </div>
        )}
      </div>
      {collabModal && <AddCollabModal setCollabModal={setCollabModal} />}
    </div>
  );
}
