import React from "react";
import { PersonAddOutlined, PersonRemoveOutlined } from "@mui/icons-material";
import { Box, IconButton, Typography, useTheme } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setFriends } from "../state/index";
import FlexBetween from "./FlexBetween";
import UserImage from "./UserImage";

function Friend({ friendId, name, subtitle, userPicturePath }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { _id } = useSelector((state) => state.user);
  const token = useSelector((state) => state.token);

  // Ensure friends is always an array, even if undefined
  const friends = useSelector((state) => state.user?.friends || []);

  const { palette } = useTheme();
  const primaryLight = palette.primary.light;
  const primaryDark = palette.primary.dark;
  const main = palette.neutral.main;
  const medium = palette.neutral.medium;

  // Safe check for isFriend
  const isFriend = Array.isArray(friends)
    ? friends.some((friend) => friend._id === friendId)
    : false;

  const patchFriend = async () => {
    // Validate friendId and _id before making the request
    if (!friendId || !_id) {
      console.error("Missing friendId or userId");
      return;
    }

    try {
      console.log("Attempting to update friend:", {
        userId: _id,
        friendId: friendId,
      });

      const response = await fetch(
        `http://localhost:3001/users/${_id}/${friendId}`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      // Log the full response for debugging
      console.log("Response status:", response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Error response:", errorText);
        throw new Error(`Failed to update friend status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Friend update response:", data);

      dispatch(setFriends({ friends: data }));
    } catch (error) {
      console.error("Detailed error updating friend:", {
        message: error.message,
        friendId,
        userId: _id,
      });

      // Optionally show a user-friendly error message
      // You might want to use a toast or snackbar for this
      alert(`Failed to update friend: ${error.message}`);
    }
  };

  return (
    <FlexBetween>
      <FlexBetween gap="1rem">
        <UserImage image={userPicturePath} size="55px" />
        <Box
          onClick={() => {
            navigate(`/profile/${friendId}`);
            navigate(0);
          }}
        >
          <Typography
            color={main}
            variant="h5"
            fontWeight="500"
            sx={{
              "&:hover": {
                color: palette.primary.light,
                cursor: "pointer",
              },
            }}
          >
            {name}
          </Typography>
          <Typography color={medium} fontSize="0.75rem">
            {subtitle}
          </Typography>
        </Box>
      </FlexBetween>
      <IconButton
        onClick={patchFriend}
        sx={{ backgroundColor: primaryLight, p: "0.6rem" }}
      >
        {isFriend ? (
          <PersonRemoveOutlined sx={{ color: primaryDark }} />
        ) : (
          <PersonAddOutlined sx={{ color: primaryDark }} />
        )}
      </IconButton>
    </FlexBetween>
  );
}

export default Friend;