import { createContext, useContext, useState } from "react";
import { useAuth } from "./AuthContext";

const ProfileContext = createContext();

const ProfileProvider = ({ children }) => {
  const { user, updateUser } = useAuth();

  const [profile, setProfile] = useState({
    name: `${user?.firstName || ""} ${user?.lastName || ""}`,
    email: user?.email || "",
    phone: user?.phone || "",
    role: user?.role || "Administrator",
    location: user?.address?.city || "",
    website: "",
    bio: "",
    joined: "January 2026",
    image: user?.image || "",
  });

  const updateProfile = (data) => {
    setProfile(data);

    updateUser({
      ...user,
      image: data.image,
    });
  };

  return (
    <ProfileContext.Provider
      value={{
        profile,
        setProfile,
        updateProfile,
      }}
    >
      {children}
    </ProfileContext.Provider>
  );
};

export default ProfileProvider;

export const useProfile = () => useContext(ProfileContext);
