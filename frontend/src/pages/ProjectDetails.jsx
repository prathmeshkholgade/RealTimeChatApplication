import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { getSingleProjectDetaies } from "../app/features/projectSlice";
import UserModal from "../modal/UserModal";
import AddCollabModal from "../modal/AddCollabModal";
import Markdown from "markdown-to-jsx";
import { connectSocket, receiveMessage, sendMessage } from "../config/socketIo";
export default function ProjectDetails() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const [userModal, setUserModal] = useState(false);
  const [collabModal, setCollabModal] = useState(false);
  const [message, setMessage] = useState("");
  const user = useSelector((state) => state?.user?.user?.user);
  const users = useSelector((state) => state?.project?.project?.users);
  const messageBox = useRef();
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
      appendOutGoingMessage({ message, sender: user });
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

  const appendIncomingMessage = (msgObj) => {
    const msgbox = document.querySelector(".conversation-area");
    const msg = document.createElement("div");
    msg.classList.add(
      "incoming",
      "max-w-56",
      "msg",
      "mt-1",
      "flex",
      "flex-col",
      "p-2",
      "bg-slate-50",
      "w-fit",
      "rounded-md"
    );
    console.log(msgObj);
    if (msgObj.sender._id === "ai") {
      console.log("mark down msg printing");
      const markDown = <Markdown>{msgObj.message}</Markdown>;
      msg.innerHTML = `
      <small class="opacity-65 text-xs">${msgObj?.sender?.email}</small>
      <p className="text-sm">${markDown} </p>
    `;
    } else {
      msg.innerHTML = `
      <small class="opacity-65 text-xs">${msgObj?.sender?.email}</small>
      <p class="text-sm">${msgObj.message}</p>
    `;
    }

    msgbox.appendChild(msg);
    scrollToBottom();
  };

  const appendOutGoingMessage = (msgObj) => {
    const msgbox = document.querySelector(".conversation-area");
    const msg = document.createElement("div");
    msg.classList.add(
      "incoming",
      "ml-auto",
      "mt-1",
      "max-w-56",
      "msg",
      "flex",
      "flex-col",
      "p-2",
      "bg-slate-50",
      "w-fit",
      "rounded-md"
    );
    msg.innerHTML = `
      <small class="opacity-65 text-xs">${msgObj.sender.email}</small>
      <p class="text-sm">${msgObj.message}</p>
    `;

    msgbox.appendChild(msg);
    scrollToBottom();
  };
  useEffect(() => {
    connectSocket(id);
    receiveMessage("project-message", (data) => {
      console.log(data);
      appendIncomingMessage(data);
    });
    getProject();
    scrollToBottom();
  }, []);

  return (
    <div className="h-screen  ">
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
          className="conversation-area flex-grow h-full p-2 overflow-y-auto"
        >
          conversation area
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
      {collabModal && <AddCollabModal setCollabModal={setCollabModal} />}
    </div>
  );
}
