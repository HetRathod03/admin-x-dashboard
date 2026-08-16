import { useEffect, useRef, useState } from "react";
import "./Profile.css";
import toast from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCamera,
  faTrash,
  faFloppyDisk,
  faUserShield,
  faCalendarDays,
} from "@fortawesome/free-solid-svg-icons";

const Profile = () => {
  const { user, updateUser } = useAuth();

  const fileInputRef = useRef(null);

  const [profile, setProfile] = useState({
    name: `${user?.firstName || ""} ${user?.lastName || ""}`,
    email: user?.email || "",
    phone: user?.phone || "",
    role: user?.role || "Administrator",
    location: user?.location || "",
    website: user?.website || "",
    bio: user?.bio || "",
    joined: user?.joined || "January 2026",
  });

  useEffect(() => {
    if (!user) return;

    setProfile({
      name: `${user.firstName || ""} ${user.lastName || ""}`,
      email: user.email || "",
      phone: user.phone || "",
      role: user.role || "Administrator",
      location: user.location || "",
      website: user.website || "",
      bio: user.bio || "",
      joined: user.joined || "January 2026",
    });
  }, [user]);
  const handleChange = (e) => {
    setProfile({
      ...profile,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const names = profile.name.trim().split(" ");

    const updatedUser = {
      ...user,
      firstName: names[0] || "",
      lastName: names.slice(1).join(" "),
      email: profile.email,
      phone: profile.phone,
      location: profile.location,
      website: profile.website,
      bio: profile.bio,
      joined: profile.joined,
    };

    updateUser(updatedUser);
    localStorage.setItem(`profileData_${user.id}`, JSON.stringify(updatedUser));

    toast.success("Profile Updated Successfully");
  };

  const handleImage = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onloadend = () => {
      const updatedUser = {
        ...user,
        image: reader.result,
      };

      updateUser(updatedUser);

      localStorage.setItem(
        `profileData_${user.id}`,
        JSON.stringify(updatedUser),
      );

      toast.success("Profile Photo Updated");
    };

    reader.readAsDataURL(file);
  };

  const removePhoto = () => {
    const updatedUser = {
      ...user,
      image: "",
    };

    updateUser(updatedUser);

    localStorage.setItem(`profileData_${user.id}`, JSON.stringify(updatedUser));

    toast.success("Profile Photo Removed");
  };
  return (
    <div className="profile-page">
      <h2>My Profile</h2>

      <div className="profile-container">
        {/* Left Card */}

        <div className="profile-card">
          <div className="profile-avatar">
            {user?.image ? (
              <img src={user.image} alt="Profile" className="profile-image" />
            ) : (
              user?.firstName?.charAt(0)
            )}
          </div>

          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            style={{ display: "none" }}
            onChange={handleImage}
          />

          <button
            type="button"
            className="photo-btn"
            onClick={() => fileInputRef.current.click()}
          >
            <FontAwesomeIcon icon={faCamera} />
            Change Photo
          </button>

          {user?.image && (
            <button
              type="button"
              className="remove-photo-btn"
              onClick={removePhoto}
            >
              <FontAwesomeIcon icon={faTrash} />
              Remove Photo
            </button>
          )}

          <h3>{profile.name}</h3>

          <p>
            <FontAwesomeIcon icon={faUserShield} />
            {profile.role}
          </p>

          <span>
            <FontAwesomeIcon icon={faCalendarDays} />
            Joined : {profile.joined}
          </span>
        </div>

        {/* Right Card */}

        <div className="profile-form-card">
          <form onSubmit={handleSubmit}>
            <div className="form-grid">
              <div className="form-group">
                <label>Full Name</label>

                <input
                  type="text"
                  name="name"
                  value={profile.name}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>Email</label>

                <input
                  type="email"
                  name="email"
                  value={profile.email}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>Phone</label>

                <input
                  type="text"
                  name="phone"
                  value={profile.phone}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>Role</label>

                <input type="text" value={profile.role} disabled />
              </div>

              <div className="form-group">
                <label>Location</label>

                <input
                  type="text"
                  name="location"
                  value={profile.location}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>Website</label>

                <input
                  type="text"
                  name="website"
                  value={profile.website}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="form-group">
              <label>Bio</label>

              <textarea
                rows="5"
                name="bio"
                value={profile.bio}
                onChange={handleChange}
              />
            </div>

            <button type="submit" className="save-btn">
              <FontAwesomeIcon icon={faFloppyDisk} />
              Save Changes
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;
