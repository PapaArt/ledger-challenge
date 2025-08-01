import React from "react";
interface ContainerProps{
  children: React.ReactNode;
}

function Container({ children }:ContainerProps){
  return (
    <div className="container-component">
      {children}
    </div>
  );
}

export default Container;