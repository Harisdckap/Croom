


import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link, useNavigate } from "react-router-dom";
import countryDataJSON from "../RentPageComponent/country JSON/countries+states.json";
import EmojiPicker from "emoji-picker-react";
import {
    FaBold,
    FaItalic,
    FaUnderline,
    FaAlignLeft,
    FaAlignRight,
    FaSmile,
} from "react-icons/fa";

const AddRoomForm = () => {
    const [formData, setFormData] = useState({
        user_id: localStorage.getItem("user_id"),
        title: "",
        location: {},
        price: "",
        room_type: "1RK",
        contact: "",
        looking_for_gender: "any",
        looking_for: "Roommate",
        occupancy: "Bachelar",
        photos: [],
        highlighted_features: [],
        amenities: [],
        description: "",
        listing_type: "room"
        
    });
    

    const [text, setText] = useState("");
    const [format, setFormat] = useState({
        bold: false,
        italic: false,
        underline: false,
        alignLeft: false,
        alignRight: false,
    });
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);

    const handleFormat = (type) => {
        setFormat((prevFormat) => ({
            ...prevFormat,
            [type]: !prevFormat[type],
        }));
    };

    const formatClasses = () => {
        let classes = "border p-2 w-full ";
        if (format.bold) classes += "font-bold ";
        if (format.italic) classes += "italic ";
        if (format.underline) classes += "underline ";
        if (format.alignLeft) classes += "text-left ";
        if (format.alignRight) classes += "text-right ";
        return classes;
    };

    const onEmojiClick = (emojiObject) => {
        setText((prevText) => prevText + emojiObject.emoji);
    };

    const [images, setImages] = useState([]);
    const [message, setMessage] = useState("");
    const [countryData, setcountryData] = useState("");

    const fileInputRef = useRef(null);

    const [address_1, setaddress_1] = useState("");
    const [address_2, setaddress_2] = useState("");
    const [PIN, setPIN] = useState("");
    const [state, setstate] = useState("");

    // navigate
    const navigate = useNavigate();

    const handleChangeAddress_1 = (e) => {
        setaddress_1(e.target.value.trim());
    };

    const handleChangeAddress_2 = (e) => {
        setaddress_2(e.target.value.trim());
    };

    const handleChangeCuntry = (e) => {
        setcountryData(e.target.value);
    };

    const handleChangeState = (e) => {
        setstate(e.target.value);
    };

    const handleChangePIN = (e) => {
        setPIN(e.target.value.trim());
    };

    const deleteIMG = (index) => {
        setImages((prevImages) => prevImages.filter((_, i) => i !== index));
    };


    const allHighlightedFeatures = [
        "Attached Bathroom",
        "Balcony",
        "Swimming pool",
        "Gym",
        "Parking",
    ];

    const allAmenities = [
        "WiFi",
          "Fridge",
          "Kitchen",
        "Air Condition",
        "Washing_machine",
    ];
     
 




  

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);

        if (images.length + files.length > 3) {
            setMessage('You can only upload up to 3 images in total.');
            return;
        }
        setImages((prevImages) => [...prevImages, ...files]);
    };




    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevState) => ({ ...prevState, [name]: value}));
        
    };


    const handleFeatureClick = (feature) => {
        setFormData((prevState) => {
            const highlighted_features =
                prevState.highlighted_features.includes(feature)
                    ? prevState.highlighted_features.filter(
                        (f) => f !== feature
                    )
                    : [...prevState.highlighted_features, feature];
            return { ...prevState, highlighted_features };
        });
    };


    const handleAmenityClick = (amenity) => {
        setFormData((prevState) => {
            const amenities = prevState.amenities.includes(amenity)
                ? prevState.amenities.filter((a) => a !== amenity)
                : [...prevState.amenities, amenity];
            return { ...prevState, amenities };
        });
    };
    const address_1_Value = address_1.split(",");
    const addres_2_Value = address_2.split(",");

    const doorNoValue = address_1_Value[0];
    const streetValue = address_1_Value[1];
    const areaValue = address_1_Value[2];

    // console.log(address_1_Value)
    // console.log("door no :"+ doorNoValue + " "+" streetValue :"+streetValue +" "+"area : "+areaValue)

    const cityValue = addres_2_Value[0];
    const districtValue = addres_2_Value[1];


    const showToast = (message, type = "error") => {
      
    
        // Show the toast message
        if (type === "success") {
            toast.success(message, { position: "top-center" });
              // Navigate immediately
        navigate(`/property?address=${districtValue || "chennai"}&p=0&t=r&sort=ASC&propertyType=all`);
        } else {
            toast.error(message, { position: "top-center" });
        }
    };
    
    
    


    const validateInputs = () => {
        if (!formData.title.trim()) {
            showToast("Title is required");
            return false;
        }

        if (!address_2.trim()) {
            showToast("Address_2 is required");
            return false;
        }

        if (!PIN.trim()) {
            showToast("PIN is required");
            return false;
        }

        if (!state.trim()) {
            showToast("state is required");
            return false;
        }

        if (!countryData.trim()) {
            showToast("country is required");
            return false;
        }
        if (!address_1.trim()) {
            showToast("Address_1 is required");
            return false;
        }

        if (!address_2.trim()) {
            showToast("Address_2 is required");
            return false;
        }

        if (!PIN.trim()) {
            showToast("PIN is required");
            return false;
        }

        if (!state.trim()) {
            showToast("state is required");
            return false;
        }

        if (!countryData.trim()) {
            showToast("country is required");
            return false;
        }

        if (!formData.room_type) {
            showToast("Room type is required");
            return false;
        }
        if (!formData.occupancy) {
            showToast("ocgicupancy is required");
            return false;
        }
        if (!formData.contact) {
            showToast("Contact is required");
            return false;
        }
        if (formData.highlighted_features.length == 0) {
            showToast("highlighted_features is required");
            return false;
        }
        if (formData.amenities.length == 0) {
            showToast("amenities is required");
            return false;
        }
        if (!text) {
            showToast("description is required");
            return false;
        }
        if (images.length == 0) {
            showToast("Atleast 1 image is required");
            return false;
        }
        if (images.length > 3) {
            showToast("You can upload a maximum of 3 images");
            return false;
        }

        return true;
    };
    

 
    const handleSubmit = async (e) => {

        e.preventDefault();



        // console.log("cityValue : "+cityValue +" "+"districtValue : "+districtValue)

        if (!validateInputs()) return;
        const uploadData = new FormData();
        const formattedFormData = {
            ...formData,
            description: text,
            location: JSON.stringify({
                doorNo: doorNoValue,
                street: streetValue,
                area: areaValue,
                city: cityValue,
                district: districtValue,
                pin: PIN,
                state: state,
                country: countryData,
            }),
            highlighted_features: JSON.stringify(formData.highlighted_features),
            amenities: JSON.stringify(formData.amenities),
          };
          

        Object.keys(formattedFormData).forEach((key) => {
            uploadData.append(key, formattedFormData[key]);
        });

        images.forEach((image, index) => {
            uploadData.append(`photos[${index}]`, image); // Ensure correct field name
        });

        // Log the FormData entries to verify images are being appended correctly
        for (let pair of uploadData.entries()) {
            console.log(pair[0] + ', ' + pair[1]);
        }


    
        
        try {
            const response = await axios.post(
                "http://127.0.0.1:8000/api/listings",
                uploadData,
                {
                    headers: { "Content-Type": "multipart/form-data" },
                }
            );

            showToast("Room Added Sucessfully", "success");

            setFormData({

                title: "",
                state: "",
                price: "",
                country: "",
                address_1: "",
                address_2: "",
                city: "",
                PIN:"",
                district: "",
                room_type: "",
                contact: "",
                looking_for_gender: "",
                looking_for: "",
                occupancy: "",
                photos: [],
                highlighted_features: [],
                amenities: [],
                description: "",
                listing_type: "room",
            });
            setImages([]);
            if (fileInputRef.current) fileInputRef.current.value = "";
            // Navigate to the image display route
        } catch (error) {
            console.error(
                "There was an error adding the room:",
                error.response.data
            );
            setMessage("There was an error adding the room.");
        }


    };

    return (
        
        <div className="max-w-6xl mx-auto p-8 bg-white rounded-md shadow-md mt-4">
            <div className="absolute top-6 right-[3.5rem]">
                <Link to="/PostRequirementPage">
                    <button
                        className="text-gray-900 text-center text-lg w-8 h-8 border border-gray-900 rounded-full absolute right-4"
                        aria-label="Close"
                    >
                        X
                    </button>
                </Link>
            </div>
            <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-gray-800">Add Room</h1>
            </div>
            <form onSubmit={handleSubmit} className="space-y">
                <div className="flex  justify-between">
                    <div className="">
                        <div className="flex  justify-between">
                            <div>
                                <label className="block text-sm font-medium text-black">
                                    Title
                                </label>
                                <input
                                    name="title"
                                    value={formData.title}
                                    onChange={handleChange}
                                    placeholder="Title"
                                    className="mt-1  px-3 py-2 border border-gray-300 rounded-md shadow-sm sm:text-sm"
                                />
                            </div>

                            <div className="relative">
                                <label className="block  text-sm font-medium text-black">
                                    Price
                                </label>
                                <input
                                    name="price"
                                    type="number"
                                    value={formData.price}
                                    onChange={handleChange}
                                    placeholder="Price"
                                    className="mt-1    px-3 py-2 border border-gray-400 rounded-md shadow-sm sm:text-sm"
                                ></input>
                                <span className="absolute top-8 right-8">
                                    {countryData &&
                                        countryDataJSON.find(
                                            (c) => c.name == countryData
                                        )?.currency_symbol}
                                </span>
                            </div>
                        </div>

                        <div className="mt-4">
                            <label className="block text-sm font-medium text-black">
                                Address 1
                            </label>
                            <input
                                name="address_1"
                                value={address_1}
                                style={{ width: "466px" }}
                                onChange={handleChangeAddress_1}
                                placeholder="example( door no , street , area )"
                                className="mt-1 block px-3 py-2 border border-gray-300 rounded-md shadow-sm sm:text-sm"
                            />
                        </div>

                        <div className="mt-4">
                            <label className="block text-sm font-medium text-black">
                                Address 2
                            </label>
                            <input
                                name="  address_2"
                                value={address_2}
                                style={{ width: "466px" }}
                                onChange={handleChangeAddress_2}
                                placeholder="example( city , district )"
                                className="mt-1 block px-3 w-96 py-2 border border-gray-300 rounded-md shadow-sm sm:text-sm"
                            />
                        </div>

                        <div className="flex mt-4  justify-between">
                            <div>
                                <label className="block text-sm font-medium text-black">
                                    Contact
                                </label>
                                <input
                                    name="contact"
                                    value={formData.contact}
                                    onChange={handleChange}
                                    type="tel"
                                    placeholder="Mobile Number"
                                    className="mt-1 block  px-3 py-2 border border-gray-300 rounded-md shadow-sm sm:text-sm"
                                />
                            </div>

                            <div>
                                <label className="block  text-sm font-medium text-black">
                                    PIN code
                                </label>
                                <input
                                    name="pincode"
                                    type="number"
                                    value={PIN}
                                    onChange={handleChangePIN}
                                    placeholder="PIN code"
                                    className="mt-1 block  px-3 py-2 border border-gray-300 rounded-md shadow-sm sm:text-sm"
                                />
                            </div>
                        </div>

                        <div className="flex mt-4 gap-14">
                            <div>
                                <label className="block text-sm font-medium text-black">
                                    State
                                </label>
                                <select
                                    name="state"
                                    value={state}
                                    style={{ width: "210px" }}
                                    onChange={handleChangeState}
                                    placeholder="state"
                                    className="mt-0 block px-3 py-2 border border-gray-300 rounded-md shadow-sm sm:text-sm"
                                    disabled={!countryData}
                                >
                                    <option>Select state</option>

                                    {countryData &&
                                        countryDataJSON
                                            .find(
                                                (cl) => cl.name == countryData
                                            )
                                            ?.states.map((sn) => (
                                                <option
                                                    className="block"
                                                    key={sn.name}
                                                >
                                                    {sn.name}
                                                </option>
                                            ))}
                                </select>
                            </div>

                            <div>
                                <label className="block  text-sm font-medium text-black">
                                    Country
                                </label>
                                <select
                                    name="country"
                                    value={countryData}
                                    style={{ width: "200px" }}
                                    onChange={handleChangeCuntry}
                                    placeholder="country"
                                    className="mt-0 block px-3 py-2 border border-gray-300 rounded-md shadow-sm sm:text-sm"
                                >
                                    <option>select country</option>
                                    {countryDataJSON.map((country) => (
                                        <option
                                            className="block"
                                            value={country.name}
                                            key={country.name}
                                        >
                                            {country.name + country.emoji}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="">
                        <fieldset className="border text-center w-96 p-4 rounded-md">
                            <legend className="text-base font-medium text-black">
                                Looking for gender
                            </legend>
                            <div className="mt-2 space-x-4">
                                {["Any", "Male", "Female"].map((gender) => (
                                    <button
                                        type="button"
                                        key={gender}
                                        className={`px-4 py-2 border rounded-md text-sm font-medium  ${
                                            formData.looking_for_gender ===
                                            gender.toLowerCase()
                                                ? "primary-btn text-white"
                                                : "hover:bg-gray-100"
                                        }`}
                                        onClick={() =>
                                            handleChange({
                                                target: {
                                                    name: "looking_for_gender",
                                                    value: gender.toLowerCase(),
                                                },
                                            })
                                        }
                                    >
                                        {gender}
                                    </button>
                                ))}
                            </div>
                        </fieldset>

                        <fieldset className="border mt-2 text-center w-96 p-4 rounded-md">
                            <legend className="text-base font-medium text-black">
                                Room type
                            </legend>
                            <div className="mt-2 space-x-4">
                                {["1RK", "1BHK", "2BHK", "3BHK"].map((room) => (
                                    <button
                                        type="button"
                                        key={room}
                                        className={`px-4 py-2 border rounded-md text-sm font-medium ${
                                            formData.room_type === room
                                                ? "primary-btn text-white"
                                                : "hover:bg-gray-100"
                                        }`}
                                        onClick={() =>
                                            handleChange({
                                                target: {
                                                    name: "room_type",
                                                    value: room,
                                                },
                                            })
                                        }
                                    >
                                        {room}
                                    </button>
                                ))}
                            </div>
                        </fieldset>

                        <fieldset className="border mt-2 text-center w-96 p-4 rounded-md">
                            <legend className="text-base font-medium text-black">
                                Occupancy
                            </legend>
                            <div className="mt-2 space-x-4">
                                {["Bachelar ", "Family "].map((option) => (
                                    <button
                                        type="button"
                                        key={option}
                                        className={`px-4 py-2 border rounded-md text-sm font-medium ${
                                            formData.occupancy === option
                                                ? "primary-btn"
                                                : "hover:bg-gray-100"
                                        }`}
                                        onClick={() =>
                                            handleChange({
                                                target: {
                                                    name: "occupancy",
                                                    value: option,
                                                },
                                            })
                                        }
                                    >
                                        {option}
                                    </button>
                                ))}
                            </div>
                        </fieldset>
                    </div>

                </div>

                <div className="flex gap-48">
                    <div className="w-1/2">
                        <fieldset className="border  text-center w p-4 rounded-md mt-12">
                            <legend className="text-base font-medium text-black">
                                Highlighted Features
                            </legend>
                            <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {allHighlightedFeatures.map((feature) => (
                                    <button
                                        key={feature}
                                        type="button"
                                        onClick={() =>
                                            handleFeatureClick(feature)
                                        }
                                        className={`px-4 py-2 border rounded-md text-sm font-medium${
                                            formData.highlighted_features.includes(
                                                feature
                                            )
                                                ? "primary-btn primary-btn "
                                                : "text-white"
                                        }`}
                                    >
                                        {feature}
                                    </button>
                                ))}
                            </div>
                        </fieldset>
                    </div>

                    <div className="w-1/2">
                        <fieldset className="border  text-center w p-4 rounded-md mt-12">
                            <legend className="text-base font-medium text-black">
                                Amenities
                            </legend>
                            <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {allAmenities.map((amenity) => (
                                    <button
                                        key={amenity}
                                        type="button"
                                    
                                        className={`px-4 py-2 border rounded-md text-sm font-medium${
                                            formData.amenities.includes(amenity)
                                                ? "primary-btn primary-btn "
                                                : "text-white"
                                        }`}
                                        onClick={() =>
                                            handleAmenityClick(amenity)
                                        }
                                    >
                                        {amenity}
                                    </button>
                                ))}
                            </div>
                        </fieldset>
                    </div>
                </div>

                <div className="mt-8">
                    <label className="block text-sm font-medium text-black">
                        Upload Photos (up to 3)
                    </label>

                    <label
                        htmlFor="uploadFile1"
                        className="bg-white text-gray-500 font-semibold text-base rounded max-w-sm h-52 flex flex-col items-center justify-center cursor-pointer border-2 border-gray-300 border-dashed mx-auto font-[sans-serif]"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="w-11 mb-2 fill-gray-500"
                            viewBox="0 0 32 32"
                        >
                            <path
                                d="M23.75 11.044a7.99 7.99 0 0 0-15.5-.009A8 8 0 0 0 9 27h3a1 1 0 0 0 0-2H9a6 6 0 0 1-.035-12 1.038 1.038 0 0 0 1.1-.854 5.991 5.991 0 0 1 11.862 0A1.08 1.08 0 0 0 23 13a6 6 0 0 1 0 12h-3a1 1 0 0 0 0 2h3a8 8 0 0 0 .75-15.956z"
                                data-original="#000000"
                            />
                            <path
                                d="M20.293 19.707a1 1 0 0 0 1.414-1.414l-5-5a1 1 0 0 0-1.414 0l-5 5a1 1 0 0 0 1.414 1.414L15 16.414V29a1 1 0 0 0 2 0V16.414z"
                                data-original="#000000"
                            />
                        </svg>
                        Upload file
                        <input
                            type="file"
                            id="uploadFile1"
                            accept="image/*"
                            multiple
                            onChange={handleFileChange}
                            ref={fileInputRef}
                            className="hidden"
                        />
                        <p className="text-xs font-medium text-gray-400 mt-2">
                            PNG, JPG, SVG, WEBP, and GIF are Allowed.
                        </p>
                    </label>

                    {images.length > 0 && (
                        <div className="mt-4 flex flex-wrap gap-4">
                            {images.map((image, index) => (
                                <div key={index} className="relative">
                                    <img
                                        src={URL.createObjectURL(image)}
                                        alt={`Preview ${index}`}
                                        className="w-32 h-32 object-cover rounded-md shadow-md"
                                    />
                                    <span
                                        onClick={() => deleteIMG(index)}
                                        className="absolute top-1 right-1 text-white bg-red-600 rounded-full w-6 h-6 flex items-center justify-center cursor-pointer"
                                    >
                                        X
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* <div>
                    <label className="block text-sm font-medium text-black">
                        Description
                    </label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange} 
                        placeholder="Description"
                        className="mt-1 block w-full px-3 py-2 border border-gray-400 rounded-md shadow-sm sm:text-sm"
                        rows={4}
                    />
                </div> */}

                <div className="mt-8 relative">
                    <h4 className="">Description</h4>
                    <div className="mb-2">
                        <button
                            type="button"
                            onClick={() => handleFormat("bold")}
                            className={`p-2 ${
                                format.bold ? "bg-gray-200" : ""
                            }`}
                        >
                            <FaBold />
                        </button>
                        <button
                            type="button"
                            onClick={() => handleFormat("italic")}
                            className={`p-2 ${
                                format.italic ? "bg-gray-200" : ""
                            }`}
                        >
                            <FaItalic />
                        </button>
                        <button
                            type="button"
                            onClick={() => handleFormat("underline")}
                            className={`p-2 ${
                                format.underline ? "bg-gray-200" : ""
                            }`}
                        >
                            <FaUnderline />
                        </button>
                        <button
                            type="button"
                            onClick={() => handleFormat("alignLeft")}
                            className={`p-2 ${
                                format.alignLeft ? "bg-gray-200" : ""
                            }`}
                        >
                            <FaAlignLeft />
                        </button>
                        <button
                            type="button"
                            onClick={() => handleFormat("alignRight")}
                            className={`p-2 ${
                                format.alignRight ? "bg-gray-200" : ""
                            }`}
                        >
                            <FaAlignRight />
                        </button>
                        <button
                            type="button"
                            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                            className="p-2 "
                        >
                            <FaSmile />
                        </button>
                    </div>
                    {showEmojiPicker && (
                        <div className="absolute bottom-44">
                            <EmojiPicker onEmojiClick={onEmojiClick} />
                        </div>
                    )}

                    <textarea
                        name="description"
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        className={formatClasses()}
                        placeholder="Type your text here..."
                        rows="4"
                    />
                </div>

                <div className="text-center mt-8">
                    <button
                        type="submit"
                        className=" py-3 px-6 primary-btn rounded-md  focus:outline-none"
                    >
                        Add Room
                    </button>
                </div>
            </form>
            {message && (
                <p className="text-center mt-4 text-red-600">{message}</p>
            )}
            <ToastContainer />
        </div>
        
    );
};


export default AddRoomForm;
