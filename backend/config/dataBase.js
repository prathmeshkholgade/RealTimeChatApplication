import mongoose from "mongoose";

async function connectToDb() {
  await mongoose.connect("mongodb://127.0.0.1:27017/chat");
}
connectToDb()
  .then((res) => {
    console.log("dataBase connected succssfuly");
  })
  .catch((err) => console.log(err));

export default connectToDb;
