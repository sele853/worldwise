import React, { useContext, useReducer } from "react";
import { createContext } from "react";

const AuthContext = createContext();
const intitialState ={
    user:null,
    isAutenticated:false,
}

function reducer(state,action)
{
    switch(action.type){
        case 'login':
            return{
                ...state,
                user:action.payload,
                isAutenticated:true,
            }
        case 'logout':
            return{
                ...state,
                user:null,
                isAutenticated:false,
            }
        default:
            throw new Error('unknown action state');
        
    }
}
const FAKE_USER = {
    name: "Jack",
    email: "jack@example.com",
    password: "qwerty",
    avatar: "https://i.pravatar.cc/100?u=zz",
  };

function AuthProvider({children})
{
    const [{user,isAutenticated},dispatch] = useReducer(reducer,intitialState);

    function login(email,password){
        if(email === FAKE_USER.email && password === FAKE_USER.password)
            dispatch({type:'login',payload:FAKE_USER})
    }
    function logout(){
        dispatch({type:'logout'})
    }

    return(
        <AuthContext.Provider value={{user,isAutenticated,login,logout}}>
            {children}
        </AuthContext.Provider>
    )
}
function UseAuth(){
    const context = useContext(AuthContext);
    if(context === undefined)
        throw new Error('AuthContext is used out of the scope of AutoProvide');
    return context;
}

export {AuthProvider,UseAuth};