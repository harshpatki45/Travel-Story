import React, { useState, useEffect } from 'react'
import Navbar from '../../components/Navbar'
import { useNavigate } from 'react-router-dom'
import axiosInstance from '../../utilis/axiosinstance';
import TravelStoryCard from '../../components/TravelStoryCard';
import { ToastContainer, toast } from 'react-toastify';
import { MdAdd } from "react-icons/md";
import Modal from "react-modal";
import AddEditTravelStory from './AddEditTravelStory';
import ViewTravelStory from './ViewTravelStory';
import EmptyCard from '../../components/EmptyCard';
import { DayPicker } from 'react-day-picker';
import moment from 'moment';
import FilterInfoTitle from '../../components/FilterInfoTitle';

const Home = () => {

  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [allStories, setAllStories] = useState([])
  const [openAddEditModal, setOpenAddEditModal] = useState({
    isShown: false,
    type: "add",
    data: null,
  })
  const [filterType, setFilterType] = useState('')
  const [dateRange, setDateRange] = useState({from:null, to:null})
  const [openViewModal, setOpenViewModal] = useState({
    isShown: false,
    data: null,
  })

  // get user info
  const getUserInfo = async () => {
    try {
      const response = await axiosInstance.get("/get-user");
      console.log("API Response:", response.data);
      if (response.data && response.data.user) {
        setUserInfo(response.data.user);
      }
    } catch (error) {
      if (error.response.status === 401) {
        // clear storage if unauthorized
        localStorage.clear();
        navigate("/login"); //redirect to login
      }
    }
  }

  // get all stories
  const getAllStories = async () => {
    try {
      const response = await axiosInstance.get("/get-all-stories")
      if (response.data && response.data.stories) {
        setAllStories(response.data.stories);
      }
    } catch (error) {
      console.log("An unexpected error has occured. Please try again.")
    }
  }

  // Handle Edit Story Click 
  const handleEdit = (data) => {
    setOpenAddEditModal({ isShown: true, type: "edit", data: data })
  }

  // handle travel story click
  const handleViewStory = (data) => {
    setOpenViewModal({ isShown: true, data })
  }

  // handle update favourite
  const updateIsFavourite = async (storyData) => {
    const storyId = storyData._id;
    try {
      const response = await axiosInstance.put(
        "/update-is-favourite/" + storyId,
        {
          isFavourite: !storyData.isFavourite,
        }
      );

      if (response.data && response.data.story) {
        toast.success("Story updated successfully!");
        getAllStories();
      }
    } catch (error) {
      console.log("An unexpected error has occured. Please try again.")
    }
  }

  const deleteTravelStory = async (data) => {
    const storyId = data._id;

    try {
      const response = await axiosInstance.delete("/delete-story/" + storyId)

      if (response.data && !response.data.error) {
        toast.error("Story Deleted Successfully");
        setOpenViewModal((prevState) => ({ ...prevState, isShown: false }));
        getAllStories();
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

  // Search Story
  const onSeachStory = async(query) => {
    try {
      const response = await axiosInstance.get("/search", {
        params: {
          query
        }
      })

      if (response.data && response.data.stories) {
        setFilterType("search")
        setAllStories(response.data.stories)
      }
    } catch (error) {
      console.log("An unexpected error has occured", error)
    }
  }

  const handleClearSearch = () => {
    setFilterType("");
    getAllStories();
  }

  // Handle filter travel by date range
  const filterStoriesByDate =async(day) => {
    try {
      const startDate = day.from ? moment(day.from).valueOf(): null;
      const endDate = day.to ? moment(day.to).valueOf(): null;

      if(startDate && endDate) {
        const response = await axiosInstance.get("/travel-stories/filter", {
          params:{ startDate, endDate},
        });

        if(response.data && response.data.stories){
          setFilterType("date");
          setAllStories(response.data.stories)
        }
      }
    } catch (error) {
      console.log("An unexpected Error has occured", error)
    }
  };

  //Handle Date Range Select
  const handleDayClick =(day) => {
    setDateRange(day);
    filterStoriesByDate(day);
  }

  const resetFilter=() => {
    setDateRange({ from:null, to:null })
    setFilterType("");
    getAllStories();
  }

  useEffect(() => {
    getAllStories();
    getUserInfo();

    return () => { };
  }, []);

  return (
    <>
      <Navbar userInfo={userInfo} searchQuery={searchQuery} setSearchQuery={setSearchQuery} onSearchNote={onSeachStory} handleClearSearch={handleClearSearch} />
      {/* {JSON.stringify(userInfo)} */}

      <div className='container mx-auto py-10'>

        <FilterInfoTitle
        filterType={filterType}
        filterDates={dateRange}
        onClear={()=> {
          resetFilter();
        }}
         />

        <div className='flex gap-7'>
          <div className='flex-1'>
            {allStories.length > 0 ? (
              <div className='grid grid-cols-2 gap-4'>
                {allStories.map((item) => {
                  return (
                    <TravelStoryCard
                      key={item._id}
                      imageUrl={item.imageUrl}
                      title={item.title}
                      story={item.story}
                      date={item.visitedDate}
                      visitedLocation={item.visitedLocation}
                      isFavourite={item.isFavourite}
                      // onEdit={()=> handleEdit(item)}
                      onClick={() => handleViewStory(item)}
                      onFavouriteClick={() => updateIsFavourite(item)}
                    />
                  );
                })}
              </div>
            ) : (
              <EmptyCard message={`Start creating you firstTravel Story! Click the 'Add button to join down
                your thoughts, ideas, and memories. Let's get started!`} />
            )}
          </div>

          <div className='w-[350px]'>
            <div className='bg-white border border-slate-200 shadow-lg shadow-slate-200/60 rounded-lg'>
            <div className='p-3'>
              <DayPicker
              captionLayout = 'dropdown-buttons'
              mode="range"
              selected={dateRange}
              onSelect={handleDayClick}
              pageNavigation
               />
            </div>
            </div>
          </div>
        </div>

      </div>

      {/* Add & Edit Modal */}

      <Modal
        isOpen={openAddEditModal.isShown}
        onRequestClose={() => {
          setOpenAddEditModal({ isShown: false, type: "add", data: null });
        }}
        style={{
          overlay: {
            backgroundColor: "rgba(0,0,0,0.2)",
            zIndex: 999
          },
        }}
        appElement={document.getElementById("root")}
        className="w-[80vw] md:w-[40%] h-[80vh] bg-white rounded-lg mx-auto mt-14 p-5 overflow-y-scroll scrollbar z-50"
      >
        <AddEditTravelStory
          type={openAddEditModal.type}
          storyInfo={openAddEditModal.data}
          onClose={() => {
            setOpenAddEditModal({ isShown: false, type: "add", data: null });
          }}
          // getAllStories={getAllStories}

          onSuccess={async () => {
            await getAllStories();
            setOpenAddEditModal({ isShown: false, type: "add", data: null })
          }}
        />
      </Modal>

      <Modal
        isOpen={openViewModal.isShown}
        onRequestClose={() => { }}
        style={{
          overlay: {
            backgroundColor: "rgba(0,0,0,0.2)",
            zIndex: 999
          },
        }}
        appElement={document.getElementById("root")}
        className="w-[80vw] md:w-[40%] h-[80vh] bg-white rounded-lg mx-auto mt-14 p-5 overflow-y-scroll scrollbar z-50"
      >
        <ViewTravelStory
          storyInfo={openViewModal.data || null}
          onClose={() => {
            setOpenViewModal((prevState) => ({ ...prevState, isShown: false }))
          }}
          onEditClick={() => {
            setOpenViewModal((prevState) => ({ ...prevState, isShown: false }))
            handleEdit(openViewModal.data || null)
          }}
          onDeleteClick={() => {
            deleteTravelStory(openViewModal.data || null)
          }}
        />
      </Modal>

      <button
        className='w-16 h-16 mr-3 flex items-center justify-center rounded-full bg-cyan-600 hover:bg-cyan-400 fixed right-10 bottom-10 '
        onClick={() => {
          setOpenAddEditModal({ isShown: true, type: "add", data: null })
        }}
      >
        <MdAdd className='text-[32px] text-white' />
      </button>
      <ToastContainer />
    </>
  )
}

export default Home
