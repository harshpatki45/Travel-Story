import React, { useState } from "react";
import {
  MdAdd,
  MdDeleteOutline,
  MdUpdate,
  MdClose,
  MdCloudDone,
} from "react-icons/md";
import DateSelector from "../../components/DateSelector";
import ImageSelector from "../../components/ImageSelector";
import TagInput from "../../components/TagInput";
import axiosInstance from '../../utilis/axiosinstance';
import moment from "moment";
import uploadImage from "../../utilis/uploadImage";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


const AddEditTravelStory = ({ storyInfo, type, onClose, getAllStories }) => {

  const [visitedDate, setVisitedDate] = useState(storyInfo?.visitedDate || null)
  const [title, setTitle] = useState(storyInfo?.title || "");
  const [storyImg, setStoryImg] = useState(storyInfo?.imageUrl || null)
  const [story, setStory] = useState(storyInfo?.story || "");
  const [visitedLocation, setVisitedLocation] = useState(storyInfo?.visitedLocation || [])
  const [error, setError] = useState("")

  // Add Travel Story 
  const addNewTravelStory = async () => {
    try {
      let imageUrl = "";

      if (storyImg) {
        const imageUploadRes = await uploadImage(storyImg);
        imageUrl = imageUploadRes.imageUrl || "";
      }

      const response = await axiosInstance.post("/add-travel-story", {
        title,
        story,
        imageUrl: imageUrl || "",
        visitedLocation,
        visitedDate: visitedDate ? moment(visitedDate).valueOf() : moment().valueOf(),
      });

      if (response.data && response.data.story) {
        toast.success("Story Added Successfully");
        // Refresh 
        //  await getAllStories();
        //   onClose();
        onSuccess()
      }
    } catch (error) {
      if (
        error.response && error.response.data && error.response.data.message
      ) {
        setError(error.response.data.message)
      } else {
        setError("An unexpected error has occured")
      }
    }
  }

  // Update Travel Story 
  const updateTravelStory = async () => {

    const storyId = storyInfo._id;

    try {
      let imageUrl = "";

      let postData = {
        title,
        story,
        imageUrl: storyInfo.imageUrl || "",
        visitedLocation,
        visitedDate: visitedDate ? moment(visitedDate).valueOf() : moment().valueOf(),
      }

      if (typeof storyImg === "object") {
        const imageUploadRes = await uploadImage(storyImg);
        imageUrl = imageUploadRes.imageUrl || "";

        postData = {
          ...postData,
          imageUrl: imageUrl
        }
      }

      // if(storyImg) {
      //   const imageUploadRes = await uploadImage(storyImg);
      //   imageUrl = imageUploadRes.imageUrl || "";
      // }

      const response = await axiosInstance.post("/edit-story/" + storyId, {
        title,
        story,
        imageUrl: imageUrl || "",
        visitedLocation,
        visitedDate: visitedDate ? moment(visitedDate).valueOf() : moment().valueOf(),
      });

      if (response.data && response.data.story) {
        toast.success("Story Updated Successfully");
        // Refresh 
        //  await getAllStories();
        onClose();
        onSuccess()
      }
    } catch (error) {
      if (
        error.response && error.response.data && error.response.data.message
      ) {
        setError(error.response.data.message)
      } else {
        setError("An unexpected error has occured")
      }
    }
  }

  const handleAddOrEditClick = () => {
    console.log("Input Data:", { title, storyImg, story, visitedLocation, visitedDate });

    if (!title) {
      setError("Please enter the title");
      return;
    }

    if (!story) {
      setError("Please enter the story");
      return;
    }

    if (type === "edit") {
      updateTravelStory();
    } else {
      addNewTravelStory();
    }
  };

  // Delete story image and update story
  const handleDeleteStoryImg = async () => {
    const deleteImgRes = await axiosInstance.delete("/delete-image", {
      params: {
        imageUrl: storyInfo.imageUrl,
      }
    })

    if (deleteImgRes) {
      const storyId = storyInfo._id;

      const postData = {
        title,
        story,
        visitedLocation,
        visitedDate: moment().valueOf(),
        imageUrl: "",
      }

      // Updating story
      const response = await axiosInstance.put(
        "/edit-story/" + storyId,
        postData
      );
      setStoryImg(null);
    }
  }


  return (
    <div className="relative">
      <div className="flex items-center justify-between">
        <h5 className="text-xl font-medium text-slate-700">
          {type === "add" ? "Add Story" : "Update Story"}
        </h5>

        <div>
          <div className="flex items-center gap-3 bg-cyan-50/50 p-2 rounded-l-lg">
            {type === "add" ? (
              <button
                className="flex items-center gap-1 text-xs font-medium bg-cyan-50 text-cyan-600 shadow-cyan-100/0 border border-cyan-100 hover:bg-cyan-600 hover:text-white rounded px-3 py-[3px] cursor-pointer"
                onClick={handleAddOrEditClick}
              >
                <MdAdd className="text-lg" /> ADD STORY
              </button>
            ) : (
              <>
                <button
                  className="flex items-center gap-1 text-xs font-medium bg-cyan-50 text-cyan-600 shadow-cyan-100/0 border border-cyan-100 hover:bg-cyan-600 hover:text-white rounded px-3 py-[3px] cursor-pointer"
                  onClick={handleAddOrEditClick}
                >
                  <MdUpdate className="text-lg" /> UPDATE STORY
                </button>

                <button
                  className="flex items-center gap-1 text-xs font-medium bg-cyan-50 text-rose-500 shadow-rose-100/0 border border-rose-100 hover:bg-rose-600 hover:text-white rounded px-3 py-[3px] cursor-pointer"
                  onClick={onClose}
                >
                  <MdDeleteOutline className="text-lg" /> DELETE
                </button>
              </>
            )}

            <button className="" onClick={onClose}>
              <MdClose className="text-xl text-slate-400" />
            </button>
          </div>

          {error && (
            <p className="text-red-500 text-xs pt-2 text-right">{error}</p>
          )}
        </div>
      </div>

      <div>
        <div className="flex-1 flex flex-col gap-2 pt-4">
          <label className="text-xs text-slate-400">TITLE</label>
          <input
            type="text"
            className="text-2xl text-slate-950 outline-none"
            placeholder="A Dat at the Taj Mahal"
            value={title}
            onChange={({ target }) => setTitle(target.value)}
          />
          <div className="my-3">
            <DateSelector date={visitedDate} setDate={setVisitedDate} />
          </div>

          <ImageSelector image={storyImg} setImage={setStoryImg} handleDeleteImg={handleDeleteStoryImg} />

          <div className="flex flex-col gap-2 mt-4">
            <label className="text-xs text-slate-400">STORY</label>
            <textarea
              type="text"
              className="text-sm text-slate-950 outline-none bg-slate-50 p-2 rounded"
              placeholder="Your Story"
              rows={10}
              value={story}
              onChange={({ target }) => setStory(target.value)}
            />
          </div>

          <div className="pt-3">
            <label className="text-xs text-slate-400">VISITED LOCATIONS</label>
            <TagInput tags={visitedLocation} setTags={setVisitedLocation} />
          </div>
        </div>

      </div>
    </div>
  );
};

export default AddEditTravelStory;
