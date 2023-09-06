import React from "react";
import CustomButton from "./CustomButton";

const AIPicker = ({prompt,setPrompt,generatingImg,handleSubmit}) => {
  return ( 
  <div className="aipicker-container">
    <textarea rows={5} value={prompt} className="aipicker-textarea" placeholder="Ask ai" onChange={(e) => setPrompt(e.target.value)}/>
    <div className="flex flex-wrap gap-3">
      {generatingImg ? (
      <CustomButton type="outline" title="asking ai" customStyles="text-xs"/>
      ) 
      :(
      <>
      <CustomButton type="outline" title="ai logo" handleClick={()=>handleSubmit("logo")} customStyles="text-sx"/>
      <CustomButton type="filled" title="ai full" handleClick={()=>handleSubmit("full")} customStyles="text-sx"/>
      </>
      )}
    </div>
  </div>
  )
};

export default AIPicker;
