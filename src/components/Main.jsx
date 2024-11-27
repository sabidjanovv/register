import React, { useEffect, useRef, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { PatternFormat } from "react-number-format";
import { COUNTRIES } from "../static/countries";
import { RxAvatar } from "react-icons/rx";

const countries = COUNTRIES;

const Main = () => {
  const [username, setUsername] = useState("");
  const [birthdate, setBirthdate] = useState("");
  const [gender, setGender] = useState("Male");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [selectedCountry, setSelectedCountry] = useState(countries[0].code);
  const [avatar, setAvatar] = useState(null);
  const [preview, setPreview] = useState(null);

  const fname = useRef(null);
  const lname = useRef(null);
  const password = useRef(null);

  const [data, setData] = useState(
    JSON.parse(localStorage.getItem("data")) || []
  );
  const [edit, setEdit] = useState(null);

  const [fnameError, setFnameError] = useState("");
  const [lnameError, setLnameError] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [phoneError, setPhoneError] = useState("");

  useEffect(() => {
    if (data.length) {
      localStorage.setItem("data", JSON.stringify(data));
    }
  }, [data]);

  useEffect(() => {
    if (avatar) {
      const objectUrl = URL.createObjectURL(avatar);
      setPreview(objectUrl);

      return () => URL.revokeObjectURL(objectUrl);
    } else {
      setPreview(null);
    }
  }, [avatar]);

  const validatePhoneNumber = (phone) => {
    const uzbekPhoneRegex = /^\+998 \(\d{2}\) \d{3} \d{2} \d{2}$/;
    return uzbekPhoneRegex.test(phone);
  };

  const validateInputs = () => {
    let isValid = true;

    if (!fname.current.value) {
      setFnameError("First name is required");
      isValid = false;
    } else {
      setFnameError("");
    }

    if (!lname.current.value) {
      setLnameError("Last name is required");
      isValid = false;
    } else {
      setLnameError("");
    }

    if (!username) {
      setUsernameError("Username is required");
      isValid = false;
    } else if (
      data.some(
        (item) => item.username === username && item.id !== (edit?.id || "")
      )
    ) {
      setUsernameError("Username already exists");
      isValid = false;
    } else {
      setUsernameError("");
    }

    if (!password.current.value || password.current.value.length < 6) {
      setPasswordError("Password must be at least 6 characters");
      isValid = false;
    } else {
      setPasswordError("");
    }

    if (!validatePhoneNumber(phoneNumber)) {
      setPhoneError("Invalid phone number format! Use +998 (XX) XXX XX XX");
      isValid = false;
    } else if (
      data.some(
        (item) =>
          item.phoneNumber === phoneNumber && item.id !== (edit?.id || "")
      )
    ) {
      setPhoneError("Phone number already exists");
      isValid = false;
    } else {
      setPhoneError("");
    }

    return isValid;
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!validateInputs()) return;

    const newUser = {
      id: edit ? edit.id : uuidv4(),
      fname: fname.current.value,
      lname: lname.current.value,
      username,
      password: password.current.value,
      birthdate,
      gender,
      phoneNumber,
      country: countries.find((c) => c.code === selectedCountry)?.country,
      avatar: preview || null,
    };

    if (edit) {
      setData((prev) =>
        prev.map((item) => (item.id === edit.id ? newUser : item))
      );
      setEdit(null);
    } else {
      setData((prev) => [...prev, newUser]);
    }

    setUsername("");
    setBirthdate("");
    setGender("Male");
    setPhoneNumber("");
    setSelectedCountry(countries[0].code);
    setAvatar(null);
    password.current.value = "";
    fname.current.value = "";
    lname.current.value = "";
  };

  const handleAvatarUpload = (e) => {
    const file = e.target.files[0];
    if (file) setAvatar(file);
  };

  const handleDelete = (id) => {
    if (confirm("Are you sure?")) {
      setData((prev) => prev.filter((item) => item.id !== id));
    }
  };

  const handleEdit = (item) => {
    fname.current.value = item.fname;
    lname.current.value = item.lname;
    setUsername(item.username);
    password.current.value = item.password;
    setBirthdate(item.birthdate);
    setGender(item.gender);
    setPhoneNumber(item.phoneNumber);
    setSelectedCountry(
      countries.find((country) => country.country === item.country)?.code ||
        countries[0].code
    );
    setAvatar(null);
    setEdit(item);
  };

  return (
    <div className="flex gap-5">
      <form
        onSubmit={handleSubmit}
        className="w-80 p-5 bg-[#caf0f8] h-screen border border-[#90e0ef] rounded-lg"
      >
        <input
          ref={fname}
          className="w-full h-10 px-3 mb-1 outline-none border border-[#00b4d8] rounded"
          type="text"
          placeholder="First Name"
        />
        {fnameError && <p className="text-red-500 text-[12px]">{fnameError}</p>}

        <input
          ref={lname}
          className="w-full h-10 px-3 mb-1 outline-none border border-[#00b4d8] rounded"
          type="text"
          placeholder="Last Name"
        />
        {lnameError && <p className="text-red-500 text-[12px]">{lnameError}</p>}

        <input
          value={username}
          onChange={(event) => setUsername(event.target.value)}
          className="w-full h-10 px-3 mb-1 outline-none border border-[#00b4d8] rounded"
          type="text"
          placeholder="Username"
        />
        {usernameError && (
          <p className="text-red-500 text-[12px]">{usernameError}</p>
        )}

        <input
          ref={password}
          className="w-full h-10 px-3 mb-1 outline-none border border-[#00b4d8] rounded"
          type="password"
          placeholder="Password"
        />
        {passwordError && (
          <p className="text-red-500 text-[12px]">{passwordError}</p>
        )}

        <PatternFormat
          format="+998 (##) ### ## ##"
          allowEmptyFormatting
          mask="_"
          value={phoneNumber}
          onValueChange={(values) => setPhoneNumber(values.formattedValue)}
          placeholder="Phone Number (+998 (XX) XXX XX XX)"
          className="w-full h-10 px-3 mb-1 outline-none border border-[#00b4d8] rounded"
        />
        {phoneError && <p className="text-red-500 text-[12px]">{phoneError}</p>}

        <input
          type="date"
          value={birthdate}
          onChange={(event) => setBirthdate(event.target.value)}
          className="w-full h-10 px-3 mb-1 outline-none border border-[#00b4d8] rounded"
          required
        />
        <select
          value={selectedCountry}
          onChange={(event) => setSelectedCountry(event.target.value)}
          className="w-full h-10 px-3 mb-3 outline-none border border-[#00b4d8] rounded"
        >
          {countries.map((country) => (
            <option key={country.id} value={country.code}>
              {country.country}
            </option>
          ))}
        </select>
        <div className="flex justify-around mb-3">
          <label className="flex items-center">
            <input
              type="radio"
              name="gender"
              value="Male"
              checked={gender === "Male"}
              onChange={() => setGender("Male")}
              className="mr-2"
            />
            Male
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              name="gender"
              value="Female"
              checked={gender === "Female"}
              onChange={() => setGender("Female")}
              className="mr-2"
            />
            Female
          </label>
        </div>
        <button className="w-full h-10 px-3 mb-3 bg-[#0077b6] text-white rounded hover:bg-[#023e8a] transition-all">
          {edit ? "Update" : "Submit"}
        </button>
      </form>

      <div className="flex-1 flex gap-3 flex-wrap items-start content-start py-5">
        {data.map((item) => (
          <div
            key={item.id}
            className="w-72 p-3 shadow text-center flex flex-col gap-2 border border-[#90e0ef] bg-[#ade8f4] rounded-lg"
          >
            <div className="w-20 h-20 bg-[#caf0f8] rounded-full mx-auto overflow-hidden">
              {item.avatar ? (
                <img
                  src={item.avatar}
                  alt="User Avatar"
                  className="w-full h-full object-cover"
                />
              ) : (
                <RxAvatar className="text-6xl w-full h-full text-[#0077b6]" />
              )}
            </div>
            <h3 className="text-[#03045e] font-semibold">
              {item.fname + " " + item.lname}
            </h3>
            <p className="text-[#023e8a]">@{item.username}</p>
            <p className="text-[#023e8a]">{item.phoneNumber}</p>
            <p className="text-[#023e8a]">{item.country}</p>
            <p className="text-[#023e8a]">{item.birthdate}</p>
            <p className="text-[#023e8a]">{item.gender}</p>
            <div className="flex gap-2 justify-center">
              <button
                onClick={() => handleEdit(item)}
                className="px-3 py-1 bg-[#0077b6] text-white rounded hover:bg-[#023e8a] transition-all"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(item.id)}
                className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-700 transition-all"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Main;
