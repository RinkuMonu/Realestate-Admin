"use client";
import { MainContext } from "@/app/context/context";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { use, useContext, useEffect, useState } from "react";
import Select from "react-select";

export default function EditProperty({ params }) {
  const { id } = use(params);
  const { BASE_URL, tostymsg, propertyShow, readProperty, users, allUser } =
    useContext(MainContext);
  const [showImg, setShowImg] = useState("");
  const router = useRouter();
  console.log(readProperty);

  // updateForm part
  const updateForm = (event) => {
    event.preventDefault();

    const formData = new FormData();

    if (event.target.otherImage.files.length == 1) {
      formData.append("maltipleImage", event.target.otherImage.files[0]);
    } else {
      for (var img of event.target.otherImage.files) {
        formData.append("maltipleImage", img);
      }
    }
    formData.append("title", event.target.title.value);
    formData.append(
      "user_Id",
      event.target.user_Id.value || readProperty?.user._id
    );
    if (event.target.image.files[0]) {
      formData.append("mainImage", event.target.image.files[0]);
    }
    if (event.target.video.files.length > 0) {
      formData.append("video", event.target.video.files[0]);
    }
    if (event.target.document.files.length > 0) {
      formData.append("document", event.target.document.files[0]);
    }
    formData.append("category", event.target.category.value);
    formData.append("propertyType", event.target.elements.propertyType.value);
    formData.append("area", event.target.area.value);
    formData.append("price", event.target.price.value);
    formData.append("address", event.target.address.value);
    formData.append("city", event.target.city.value);
    formData.append("state", event.target.state.value);
    formData.append("short_description", event.target.short_description.value);
    formData.append("long_description", event.target.long_description.value);

    axios
      .put(BASE_URL + `/property/edit-property/${id}`, formData)
      .then((success) => {
        tostymsg(success.data.msg, success.data.status);
        if (success.data.status == 1) {
          router.push("/property");
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const deleteOtherImg = (url) => {
    axios
      .patch(BASE_URL + `/property/edit-property/${id}`, { url })
      .then((success) => {
        tostymsg(success.data.msg, success.data.status);
        propertyShow("", "", id);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  useEffect(() => {
    allUser();
  }, []);

  useEffect(() => {
    propertyShow("", "", id);
  }, [id]);
  return (
    <>
      <form
        action=""
        className="bg-gray-200 w-2/3 mx-auto p-6 rounded shadow"
        onSubmit={updateForm}
      >
        <button>
          <Link
            href="/property"
            className="flex items-center gap-2 hover:underline py-3"
          >
            ← Back
          </Link>
        </button>
        <h2 className="text-2xl font-semibold mb-6">Edit Property</h2>

        <div className="mb-4">
          <label className="mb-1 font-medium" htmlFor="title">
            Title
          </label>

          <div className="flex gap-2">
            <input
              type="text"
              defaultValue={readProperty?.title}
              id="title"
              name="title"
              className="border-2 rounded px-3 py-2"
              placeholder="Enter title"
            />
            <Select
              name="user_Id"
              options={users?.map((data, index) => {
                return { value: data._id, label: data.name };
              })}
            />
          </div>
        </div>

        <div className="mb-4">
          <label className="mb-1 font-medium" htmlFor="image">
            Image
          </label>
          <input
            onChange={(e) => setShowImg(URL.createObjectURL(e.target.files[0]))}
            type="file"
            id="image"
            name="image"
            className="w-full border-2 rounded px-3 py-2"
          />
          {showImg ? (
            <img src={showImg} alt="main image" className="p-2" />
          ) : (
            <img
              src={readProperty?.mainImage}
              alt="main image"
              className="p-2"
            />
          )}
        </div>

        <div className="mb-4">
          <label className="mb-1 font-medium" htmlFor="otherImage">
            Other Images
          </label>
          <input
            type="file"
            id="otherImage"
            multiple
            name="otherImage"
            className="w-full border-2 rounded px-3 py-2"
          />

          <div className="flex gap-2 flex-wrap justify-between">
            {readProperty?.maltipleImage?.map((url, index) => {
              console.log(url);

              return (
                <div className="relative" key={index}>
                  <img src={url} alt="other image" className="w-40 p-2" />
                  <span
                    onClick={() => deleteOtherImg(url)}
                    className="absolute top-0 right-0 bg-white font-bold rounded-full py-0.5 px-2 cursor-pointer"
                  >
                    x
                  </span>
                </div>
              );
            })}
          </div>
        </div>
        <div className="grid md:grid-cols-2 gap-6 p-4 bg-white shadow-md rounded-lg">
          <div>
            <label
              htmlFor="video"
              className="block mb-2 text-sm font-medium text-gray-700"
            >
              🎥 Video Tour
            </label>
            <input
              type="file"
              id="video"
              name="video"
              className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none"
            />
          </div>

          <div>
            <label
              htmlFor="document"
              className="block mb-2 text-sm font-medium text-gray-700"
            >
              📄 Property Documents
            </label>
            <input
              type="file"
              id="document"
              name="document"
              className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none"
            />
          </div>
        </div>

        <div className="mb-4">
          <label className="mb-1 font-medium" htmlFor="category">
            Category
          </label>

          <div className="flex gap-2">
            <input
              type="text"
              defaultValue={readProperty?.category}
              id="category"
              name="category"
              className="w-full border-2 rounded px-3 py-2"
            />
            <select
              name="propertyType"
              defaultValue={readProperty?.propertyType}
              className="w-full md:w-48 px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <option value={readProperty?.propertyType}>--</option>
              <option value="buy">Buy</option>
              <option value="sell">Sell</option>
              <option value="rent">Rent</option>
            </select>
          </div>
        </div>

        <div className="mb-4">
          <label className="mb-1 font-medium" htmlFor="area">
            Area
          </label>
          <input
            type="text"
            id="area"
            defaultValue={readProperty?.area}
            name="area"
            className="w-full border-2 rounded px-3 py-2"
            placeholder="Enter area"
          />
        </div>
        <div className="mb-4">
          <label className="mb-1 font-medium" htmlFor="price">
            Price
          </label>
          <input
            type="text"
            id="price"
            defaultValue={readProperty?.price}
            name="price"
            className="w-full border-2 rounded px-3 py-2"
            placeholder="Enter price"
          />
        </div>

        <div className="mb-6">
          <label className="mb-1 font-medium" htmlFor="location">
            Location
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              id="address"
              defaultValue={readProperty?.address}
              name="address"
              className="border-2 rounded px-3 py-2"
              placeholder="Enter address"
            />
            <input
              type="text"
              id="city"
              defaultValue={readProperty?.city}
              name="city"
              className="border-2 rounded px-3 py-2"
              placeholder="Enter city"
            />
            <input
              type="text"
              id="state"
              defaultValue={readProperty?.state}
              name="state"
              className="border-2 rounded px-3 py-2"
              placeholder="Enter state"
            />
          </div>
        </div>

        <div className="mb-6">
          <label className="mb-1 font-medium" htmlFor="short_description">
            Short description
          </label>
          <input
            type="text"
            id="short_description"
            defaultValue={readProperty?.short_description}
            name="short_description"
            className="w-full border-2 rounded px-3 py-2"
            placeholder="Enter short_description"
          />
        </div>
        <div className="mb-6">
          <label className="mb-1 font-medium" htmlFor="long_description">
            Long description
          </label>
          <input
            type="text"
            id="long_description"
            defaultValue={readProperty?.long_description}
            name="long_description"
            className="w-full border-2 rounded px-3 py-2"
            placeholder="Enter long_description"
          />
        </div>
        <div className="text-center">
          <button
            type="submit"
            className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 transition"
          >
            Save
          </button>
        </div>
      </form>
    </>
  );
}
// This should be at the bottom of your file
export async function generateStaticParams() {
  // Replace this with dynamic fetch from your API or database if needed
  // Sample hardcoded IDs for now:
  return [{ id: "101" }, { id: "102" }, { id: "103" }];
}
