import React, { useEffect } from "react";
import { ServerCheck } from "../../Api/Apifun";

const Testing = () => {
  const tester = async () => {
    const val = await ServerCheck();
    console.log("valus is ", val.data);
  };
  useEffect(() => {
    tester();
  }, []);
  return <div>Testing components start here </div>;
};

export default Testing;
