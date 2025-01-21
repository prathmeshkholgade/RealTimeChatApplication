import React from "react";

export default function UserModal({ setUserModal, users }) {
  return (
    <div className="absolute inset-0 bg-slate-300">
      <header className="p-2 w-full  bg-red-200">
        <div className="flex justify-between ">
          <p className="text-lg">Collaborators</p>
          <i
            onClick={() => setUserModal(false)}
            className="ri-close-fill text-lg"
          ></i>
        </div>
      </header>
      <div className="users p-2">
        {users &&
          users.map((user) => (
            <div className="py-2 hover:bg-gray-400">
              <p>{user.email}</p>
            </div>
          ))}
      </div>
    </div>
  );
}
