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

