import React, { useEffect, useState } from "react";
import NewProject from "../modal/NewProject";
import ProjectBox from "../components/ProjectBox.jsx";
import { useDispatch, useSelector } from "react-redux";
import { getUserProjects } from "../app/features/projectSlice.js";

export default function Home() {
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const projects = useSelector((state) => state.project?.projects?.allProject);
  const dispatch = useDispatch();
  const getuserProjects = async () => {
    try {
      const response = await dispatch(getUserProjects()).unwrap();
      console.log(response);
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    getuserProjects();
  }, []);
  return (
    <div className="p-2  ">
      <div className="flex">
        <button
          className="p-4 border rounded-md text-lg w-fit"
          onClick={() => setIsProjectModalOpen(true)}
        >
          New Project<i className="ri-links-fill ml-2"></i>
        </button>
        <div className="flex flex-wrap gap-4">
          {projects &&
            projects.map((project) => <ProjectBox key={project._id} project={project} />)}
        </div>
      </div>

      {isProjectModalOpen && (
        <NewProject
          isProjectModalOpen={isProjectModalOpen}
          setIsProjectModalOpen={setIsProjectModalOpen}
        />
      )}
    </div>
  );
}
