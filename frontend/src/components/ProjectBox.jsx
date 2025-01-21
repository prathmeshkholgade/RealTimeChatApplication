import React from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function ProjectBox({ project }) {
  const navigate = useNavigate();
  return (
    <div
      onClick={() => {
        navigate(`/project/${project._id}`);
      }}
      className="border ml-2 p-4 w-64 hover:bg-slate-200 rounded-lg"
    >
      {/* <h2>{project.name}</h2> */}
      <h2 className="font-medium text-lg ">{project.name}</h2>
      <p className="text-sm">
        <i className="ri-user-line"></i> Collborators {project.users.length}
      </p>
    </div>
  );
}
