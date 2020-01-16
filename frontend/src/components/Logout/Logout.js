import React, { useEffect } from "react";
import { Redirect } from "react-router-dom";
import { useDispatch } from "react-redux";
import { userLogOut } from '../../redux/actions/userLogOut'

const Logout = props => {
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(userLogOut())
  }, [dispatch]);

  return <Redirect to="/" />;
};

export default Logout;
