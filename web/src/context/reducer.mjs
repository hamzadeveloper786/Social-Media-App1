export const reducer = (state, action) => {
  
    switch (action.type) {
      case "USER_LOGIN": {
        if(action.payload?.firstName && action.payload?.lastName && action.payload?.email){
          const role = (action.payload.isAdmin) ? "admin" : "user";
          const user = {
            _id: action.payload?._id,
            firstName: action.payload?.firstName,
            lastName: action.payload?.lastName,
            email: action.payload?.email,
          }
          return { ...state, user, role, isLogin: true }
        }}
    case "USER_LOGOUT": {
        return { ...state, isLogin: false, user: {}, role: null } 
      }
      default: {
       return state
      }
    }
  }