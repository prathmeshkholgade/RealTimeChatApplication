import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { addProject } from "../app/features/projectSlice";
import { useNavigate } from "react-router-dom";

export default function NewProject({ setIsProjectModalOpen }) {
  const [projectName, setProjectName] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const submitHandler = async (e) => {
    try {
      e.preventDefault();
      const res = await dispatch(addProject({ projectName })).unwrap();
      console.log(res);
      navigate("/");
      setProjectName("");
      setIsProjectModalOpen(false);
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <div className="bg-gray-800 bg-opacity-50 w-full   fixed inset-0 flex justify-center items-center  ">
      <div className="p-6 w-96 bg-white rounded-lg">
        <form>
          <h1 className="font-medium text-lg py-2">Enter Project Name</h1>
          <div className="flex flex-col py-2">
            <label htmlFor="projectName" className="py-2">
              Project Name
            </label>
            <input
              type="text"
              id="projectName"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              name="projectName"
              className="p-2 rounded-md border "
              placeholder="Enter your project name"
            />
          </div>
          <div className="btn flex justify-end gap-4 ">
            <button
              className="p-2 rounded-md px-4 bg-gray-200"
              onClick={() => {
                setIsProjectModalOpen(false);
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              onClick={submitHandler}
              className="p-2 rounded-md px-4 text-white bg-blue-500"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
