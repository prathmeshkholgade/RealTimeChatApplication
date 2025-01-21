import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllUsers } from "../app/features/userSlice";
import { addUserInProject } from "../app/features/projectSlice";
import { useNavigate, useParams } from "react-router-dom";

export default function AddCollabModal({ setCollabModal }) {
  const { id } = useParams();
  console.log(id);
  const dispatch = useDispatch();
  const users = useSelector((state) => state?.user?.allUser);
  const [selectedUser, setSelectedUser] = useState(new Set());
  const getUser = async () => {
    try {
      const res = await dispatch(getAllUsers()).unwrap();
      console.log(res);
    } catch (err) {
      console.log(err);
    }
  };
  const navigate = useNavigate();
  const addCollaborators = async () => {
    try {
      console.log(selectedUser);
      const user = Array.from(selectedUser);
      const res = await dispatch(
        addUserInProject({ projectId: id, user })
      ).unwrap();
      console.log(res);
      navigate(`/project/${id}`);
      setCollabModal(false);
    } catch (err) {
      console.log(err);
    }
  };

  const handleUserClick = (id) => {
    console.log(selectedUser);
    setSelectedUser((preUser) => {
      const newSet = new Set(preUser);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  useEffect(() => {
    getUser();
  }, []);
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-4 rounded-md w-96 max-w-full relative">
        <header className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Select User</h2>
          <button onClick={() => setCollabModal(false)} className="p-2">
            <i className="ri-close-fill"></i>
          </button>
        </header>
        <div className="users-list flex flex-col gap-2 mb-16 max-h-96 overflow-auto">
          {users &&
            users.map((user) => (
              <div
                key={user._id}
                className={`cursor-pointer hover:bg-slate-200 p-2 flex gap-2 items-center ${
                  selectedUser.has(user._id) && "bg-gray-500"
                } `}
                onClick={() => handleUserClick(user._id)}
              >
                <h3 className="font-semibold text-lg">{user.email}</h3>
              </div>
            ))}
        </div>
        <button
          onClick={addCollaborators}
          className="absolute bottom-4 left-1/2 transform -translate-x-1/2 px-4 py-2 bg-blue-600 text-white rounded-md"
        >
          Add Collaborators
        </button>
      </div>
    </div>
  );
}
