import mongoose from "mongoose";
const Schema = mongoose.Schema;

const projectSchema = new Schema({
  name: {
    type: String,
    lowercase: true,
    required: true,
    trim: true,
    unique: [true, "Project name must be unique"],
  },

  users: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
  ],
  //   fileTree: {
  //     type: Object,
  //     default: {},
  //   },
});

const Project = mongoose.model("project", projectSchema);

export default Project;
