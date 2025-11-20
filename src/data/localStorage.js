export const saveUserToLocalStorage = (user) => {
  localStorage.setItem("user", JSON.stringify(user));
};

export const getUserFromLocalStorage = () => {
  const user = localStorage.getItem("user");
  return user ? JSON.parse(user) : null;
};

export const removeUserFromLocalStorage = () => {
  localStorage.removeItem("user");
};

export const getUserIdFromLocalStorage = () => {
  const user = getUserFromLocalStorage();
  return user ? user.user_id : null;
};

// //  Save Gateway
// export const saveGatewaysToLocalStorage = (gateways) => {
//   localStorage.setItem("gateways", JSON.stringify(gateways));
// };

// // Get Saved Gateways
// export const getGatewaysFromLocalStorage = () => {
//   const data = localStorage.getItem("gateways");
//   return data ? JSON.parse(data) : [];
// };



