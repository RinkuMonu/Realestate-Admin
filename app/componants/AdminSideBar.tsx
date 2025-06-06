"use client";
import Link from "next/link";
import { HiHomeModern } from "react-icons/hi2";
import { RiSlideshowFill } from "react-icons/ri";
import { FaUserAlt } from "react-icons/fa";
import { FaUserFriends } from "react-icons/fa";
import { SiMainwp } from "react-icons/si";
import { MdConnectWithoutContact } from "react-icons/md";
import { FaMicroblog, FaImages } from "react-icons/fa";
import { VscGitPullRequestNewChanges } from "react-icons/vsc";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import logo from '@/public/real-estate-logo.jpg'
import { useDispatch, useSelector } from "react-redux";
import { login, logout } from "@/redux/reducer/AdminSlice";
import { MdLogout } from "react-icons/md";
import { IoIosArrowDown } from "react-icons/io";
import { useContext, useRef, useState } from "react";
import { MainContext } from "../context/context";
import axios from "axios";

export default function AdminSideBar() {
  const { BASE_URL, tostymsg } = useContext(MainContext);
  const admin = useSelector(state => state.admin.data);
  const mailValue = useRef()

  const pathname = usePathname();
  const router = useRouter()
  const dispatch = useDispatch();
  const [showSettings, setShowSettings] = useState(false);
  const [showPasword, setShowPasword] = useState(false);
  const [showOtp, setShowOtp] = useState(false);
  const [otpValue, setOtpValue] = useState('');
  const [otpPass, setOtpPass] = useState(false);

  const sideBarValue = [
    {
      name: "Dashboard",
      icon: <RiSlideshowFill size={18} />,
      slug: "",
    },
    {
      name: "Banner Image",
      icon: <FaImages size={18} />,
      slug: "banner-image",
    },
    {
      name: "Users",
      icon: <FaUserFriends size={18} />,
      slug: "users",
    },
    {
      name: "Property",
      icon: <HiHomeModern size={18} />,
      slug: "property",
    },
    {
      name: "Agents",
      icon: <SiMainwp size={18} />,
      slug: "agents",
    },
    {
      name: "Requests",
      icon: <VscGitPullRequestNewChanges size={18} />,
      slug: "request",
    },
    {
      name: "Blogs",
      icon: <FaMicroblog size={18} />,
      slug: "blog",
    },
    {
      name: "Contact Request",
      icon: <MdConnectWithoutContact size={18} />,
      slug: "contactRequest"
    }
  ];

  const logoutHendler = () => {
    router.push('/login')
    dispatch(logout());
  }

  const [showAdmin, setShowAdmin] = useState(false);
  const [showEditBtn, setShowEditBtn] = useState(false);
  const [selectImg, setSelectImg] = useState(false);
  const showAdminDetails = () => {
    setShowAdmin(true)
  }

  // edit admin part
  const editAdminHendler = (e) => {
    e.preventDefault();

    const formData = new FormData();
    if (e.target.old_password && e.target.new_password) {
      formData.append('old_password', e.target.old_password.value);
      formData.append('new_password', e.target.new_password.value);
    } else if (e.target.new_password) {
      formData.append('new_password', e.target.new_password.value);
    } else {
      formData.append('adminProfile', e.target.adminProfile.files[0] ?? null)
      formData.append('phone', e.target.phone.value)
      formData.append('email', e.target.email.value)
      formData.append('location', e.target.location.value);
    }

    axios.patch(BASE_URL + `/user/user-update/${admin._id}`, formData, {
      headers: {
        Authorization: `${localStorage.getItem("adminToken")}`
      }
    }).then(
      (success) => {
        console.log(success.data);

        if (success.data.status == 1) {
          dispatch(login({
            admin: success.data.user
          }))
          setShowPasword(false);
          setShowEditBtn(false);
        }
        tostymsg(success.data.msg, success.data.status);
      }
    ).catch(
      (error) => {
        console.log(error);
      }
    )
  }
  const isActive = (slug: string) => {
    if (slug == "") return pathname == "/";
    if (slug == "/live-chat") return pathname == "/live-chat";
    return pathname == `/${slug}` || pathname.startsWith(`/${slug}/`);
  };

  // email part
  const emailOtpGen = () => {
    const Email = admin.email
    setShowOtp(true)
    axios.post(BASE_URL + `/mail/otp-send`, { Email }).then(
      (success) => {
        if (success.data.status == 1) {
          tostymsg(success.data.msg, success.data.status);
        }
      }
    ).catch(
      (error) => {
        console.log(error);
      }
    )
  }

  // otp part
  const otpHendler = () => {
    axios.post(BASE_URL + `/mail/verify`, { otpValue }).then(
      (success) => {
        console.log(success);
        tostymsg(success.data.msg, success.data.status);
        if (success.data.status == 1) {
          setShowOtp(false)
          setOtpPass(true)
        }
      }
    ).catch(
      (error) => {
        console.log(error);
      }
    )
  }

  return (
    <div className="h-[100vh] bg-gradient-to-b from-gray-100 to-gray-200 text-gray-800 px-3 shadow-lg sticky top-0 left-0 border-r border-gray-200 w-64 flex flex-col justify-between">
      {/* side bar nav part */}
      <div>
        <div className="flex justify-center w-40 mb-2 pt-3">
          <Image
            src={logo || 'logo'}
            alt="logo"
            width={200}
            height={80}
            className="object-cover"
          />
        </div>

        <div className="space-y-1 mt-6">
          {sideBarValue.map((value, index) => (
            <Link
              key={index}
              href={`/${value.slug}`}
              className={`flex items-center gap-3 px-4 py-3 rounded-sm transition-all duration-200 ${isActive(value.slug)
                ? 'bg-blue-50 text-orange-600 font-medium border-l-4 border-orange-500'
                : 'hover:bg-gray-100 hover:text-gray-900'
                }`}
            >
              <span
                className={`${isActive(value.slug) ? 'text-orange-500' : 'text-gray-500'
                  }`}
              >
                {value.icon}
              </span>
              <span className="text-sm">{value.name}</span>
            </Link>
          ))}

          {/* Settings Dropdown */}
          {/* <div className="relative cursor-pointer">
            <div
              onClick={() => setShowSettings(!showSettings)}
              className={`flex items-center gap-3 px-4 py-3 rounded-sm transition-all duration-200 ${isActive(pathname)
                ? 'bg-blue-50 text-orange-600 font-medium border-l-4 border-orange-500'
                : 'hover:bg-gray-100 hover:text-gray-900'
                }`}
            >
              <span className="text-gray-500">
                <IoMdSettings size={18} />
              </span>
              <span className="text-sm pr-3">Settings</span>
              <IoIosArrowDown
                className={`transform transition-transform duration-200 ${showSettings ? 'rotate-180' : 'rotate-0'
                  }`}
              />
            </div>

            {showSettings && (
              <div className="ml-8 mt-1 bg-white rounded-md shadow-md border text-sm w-40 z-10 absolute">
                <Link href="/live-chat" className="block px-4 py-2 hover:bg-gray-100">
                  Live Chat
                </Link>
              </div>
            )}
          </div> */}
        </div>
      </div>

      {/* admin details part */}
      <div className="flex items-center gap-6">
        <div
          className="flex items-center w-full mb-2 p-2 cursor-pointer bg-orange-200 hover:text-black transition-all duration-200 ease-in-out rounded-lg"
          onClick={showAdminDetails}
        >
          {/* Avatar Section */}
          <div className="relative w-12 h-10 text-white rounded-full overflow-hidden">
            {
              admin?.profile_Photo ? (
                <Image
                  src={admin?.profile_Photo || 'profile phot'}
                  alt={`${admin?.name} profile photo`}
                  width={64}
                  height={64}
                  className="object-cover w-full h-full"
                />
              ) : (
                <div className="flex items-center justify-center w-full h-full bg-gray-200">
                  <FaUserAlt className="text-xl text-blue-500" />
                </div>
              )
            }
          </div>

          <div className="ml-4 flex justify-between w-full">
            <span className="text-md text-gray-700">{admin?.name}</span>
            <span className="text-lg font-semibold text-red-400  hover:text-red-700" onClick={logoutHendler}><MdLogout /></span>
          </div>

        </div>

        {/* View Admin Details */}
        <div className={`fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center w-full min-h-full ${showAdmin ? 'block' : 'hidden'}`}>
          <div className="bg-white rounded-lg shadow-xl w-1/3 p-6 relative">
            <button
              onClick={() => (setShowAdmin(false), setShowEditBtn(false), setShowPasword(false), setOtpPass(false), setShowOtp(false))}
              className="absolute top-3 right-3 text-gray-500 hover:text-red-500 text-2xl"
            >
              ×
            </button>
            {
              showEditBtn
                ?
                <form onSubmit={editAdminHendler}
                  className="max-w-md mx-auto p-6 bg-white text-gray-700 rounded-md shadow-md space-y-6"
                >
                  <h2 className="text-2xl font-semibold text-gray-700">Edit</h2>
                  {
                    showPasword ?
                      showOtp ?
                        <div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700">Enter Otp</label>
                            <input
                              required
                              type="text"
                              onKeyUp={(e) => setOtpValue(e.target.value)}
                              placeholder="Enter your OTP"
                              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-300"
                            />
                          </div>
                        </div> :
                        otpPass ?
                          <div>
                            <label className="block text-sm font-medium text-gray-700">New Password</label>
                            <input
                              type="password"
                              name="new_password"
                              placeholder="Enter your new password"
                              required
                              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-300"
                            />
                          </div>
                          :
                          <div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700">Old Password</label>
                              <input
                                type="password"
                                name="old_password"
                                placeholder="Enter your old password"
                                required
                                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-300"
                              />
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700">New Password</label>
                              <input
                                type="password"
                                name="new_password"
                                placeholder="Enter your new password"
                                required
                                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-300"
                              />
                            </div>
                          </div> :
                      <>
                        <div className="flex flex-col items-center">
                          <input
                            type="file"
                            id="adminProfile"
                            name="adminProfile"
                            accept="image/*"
                            onChange={(e) => setSelectImg(URL.createObjectURL(e.target.files[0]))}
                            className="mt-1 w-full text-sm text-gray-500 hidden"
                          />
                          <label htmlFor="adminProfile" className="relative text-center">
                            <img src={selectImg ? selectImg : admin?.profile_Photo} alt="Photo" className="w-28 h-28 cursor-pointer rounded-full object-cover border" />
                            <span className="absolute top-0 left-0 bg-black w-full min-h-full text-white opacity-0 hover:opacity-45 rounded-full duration-300 cursor-pointer flex justify-center items-center font-bold">Edit</span>
                          </label>
                          {/* <span className="text-red-400 hover:text-red-500 mt-2 cursor-pointer">remove</span> */}
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Name</label>
                          <input
                            type="text"
                            name="name"
                            defaultValue={admin?.name}
                            required
                            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-300"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700">Phone</label>
                          <input
                            type="tel"
                            name="phone"
                            defaultValue={admin?.phone}
                            required
                            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-300"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700">Email</label>
                          <input
                            type="email"
                            name="email"
                            defaultValue={admin?.email}
                            required
                            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-300"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700">Location</label>
                          <input
                            type="text"
                            name="location"
                            defaultValue={admin?.location}
                            required
                            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-300"
                          />
                        </div>
                      </>
                  }

                  <div className="flex justify-between items-center gap-3">
                    {
                      !showPasword ?
                        <button type="button" className="text-sm text-blue-400 hover:text-blue-500" onClick={() => setShowPasword(true)}>Change Password</button>
                        :
                        showOtp ?
                          <button type="button" className="text-sm text-blue-400 hover:text-blue-500" onClick={emailOtpGen}>Reset otp</button>
                          :
                          <button type="button" className="text-sm text-blue-400 hover:text-blue-500" onClick={emailOtpGen}>With Email</button>
                    }
                    <div>
                      <button
                        type="button"
                        onClick={() => ((setShowEditBtn(false), setShowPasword(false), setOtpPass(false), setShowOtp(false)))}
                        className="px-4 py-2 mr-2 bg-gray-200 rounded hover:bg-gray-300"
                      >
                        Cancel
                      </button>
                      {
                        !showOtp ?
                          // update part
                          <button
                            type="submit"
                            className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600"
                          >
                            Save
                          </button>
                          :
                          // otp part
                          <button
                            type="button"
                            onClick={otpHendler}
                            className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600"
                          >
                            Next
                          </button>
                      }

                    </div>
                  </div>
                </form>
                :
                <div className="flex flex-col items-center text-center bg-white p-6 rounded-xl w-full max-w-md mx-auto space-y-4 transition-all">
                  <div className="w-28 h-28 relative">
                    <Image
                      src={admin?.profile_Photo || 'profile phot'}
                      alt="Admin profile"
                      fill
                      className="rounded-full object-cover shadow-md"
                    />
                  </div>
                  <h2 className="text-2xl font-semibold text-gray-800">{admin.name}</h2>
                  <div className="text-sm text-gray-600 w-full text-left space-y-2">
                    <p><span className="font-semibold text-gray-700">📧 Email:</span> {admin.email}</p>
                    <p><span className="font-semibold text-gray-700">📞 Phone:</span> {admin.phone}</p>
                    <p><span className="font-semibold text-gray-700">📍 Location:</span> {admin.location}</p>
                  </div>
                  <button onClick={() => setShowEditBtn(true)} className="mt-4 bg-orange-500 hover:bg-orange-600 text-white py-2 px-6 rounded-md font-semibold transition-all shadow hover:shadow-lg">
                    ✏️ Edit Profile
                  </button>
                </div>
            }

          </div>
        </div>
      </div>
    </div>

  );
}