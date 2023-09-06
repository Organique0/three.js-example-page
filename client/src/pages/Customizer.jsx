import React, { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useSnapshot } from "valtio";
import config from "../config/config";
import state from "../store";
import { download } from "../assets";
import { downloadCanvasToImage, reader } from "../config/helpers";
import { EditorTabs, FilterTabs, DecalTypes } from "../config/constants";
import { fadeAnimation, slideAnimation } from "../config/motion";
import selectedConfig from "../config/config";

import {
  AIPicker,
  ColorPicker,
  CustomButton,
  FilePicker,
  Tab
} from "../components";

const Customizer = () => {
  
  const stateRef = useSnapshot(state);
  const [file, setFile] = useState("");
  const [prompt, setprompt] = useState("");
  const [generatingImg, setgeneratingImg] = useState(false);
  const [activeEditorTab, setActiveEditorTab] = useState("");
  const [activeFilterTab, setActiveFilterTab] = useState({
    logoShirt: state.isLogoTexture,
    stylishShirt: state.isFullTexture
  });

  const generateTabContent = () => {
    switch (activeEditorTab) {
      case "colorpicker":
        return <ColorPicker />;
      case "filepicker":
        return <FilePicker file={file} setFile={setFile} readFile={readFile} />;
      case "aipicker":
        return <AIPicker prompt={prompt} setPrompt={setprompt} generatingImg={generatingImg} handleSubmit={handleSubmit}/>;
      default:
        return null;
    }
  };

  const handleSubmit = async (type) => {
    if(!prompt) return alert("Please enter a prompt");

    try {
      setgeneratingImg(true);
      const response = await fetch(selectedConfig,{
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          prompt: prompt
        })
      });
      const data = await response.json();
      handleDecals(type, `data:image/png;base64,${data.photo}`)
    } catch (error) {
      console.log(error);
    } finally {
      setgeneratingImg(false);
      setActiveEditorTab("");
    }
  }

  //save the image to state
  const handleDecals = (type, data) => {
    const decalType = DecalTypes[type];
    state[decalType.stateProperty] = data;

    if (!activeFilterTab[decalType.FilterTab]) {
      handleActiveFilterTab(decalType.FilterTab);
    }
  };

  //toggle the active filter tab
  const handleActiveFilterTab = (filterTab) => {
    switch (filterTab) {
      case "logoShirt":
        state.isLogoTexture = !activeFilterTab[filterTab];
        break;
      case "stylishShirt":
        state.isFullTexture = !activeFilterTab[filterTab];
        break;
      default:
        state.isFullTexture = false;
        state.isLogoTexture = true;
        break;
    }
    setActiveFilterTab((prevState) => {
    return {
      ...prevState,
      [filterTab]:!prevState[filterTab]
    };
  });
  };

  //read the image from local storage and save it to state
  const readFile = (type) => {
    reader(file).then((data) => {
      handleDecals(type, data);
      setActiveEditorTab("");
    });
  };

  //copyright: Chat GPT
  //the image from the server is in base64 format so we need to decode it first then download it
function downloadBase64Image(type) {
  const decalType = DecalTypes[type];
  const base64Img = state[decalType.stateProperty];
  const base64DataWithoutPrefix = base64Img.replace(/^data:image\/\w+;base64,/, '');
  const blob = new Blob([Uint8Array.from(atob(base64DataWithoutPrefix), c => c.charCodeAt(0))], { type: "image/jpeg" })
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `Shirt-${type}`;
  a.click();
  window.URL.revokeObjectURL(url);

}

  return (
    <AnimatePresence>

      {!stateRef.intro && (
        <>
        
          <motion.div
            key="custom"
            className="absolute top-0 left-0 z-10"
            {...slideAnimation("left")}
          >
            <div className="flex items-center min-h-screen">
              <div className="editortabs-container tabs">
                {EditorTabs.map((tab) => (
                  <Tab
                    key={tab.name}
                    tab={tab}
                    active={stateRef.editorTab === tab.name}
                    handleClick={() => {
                      setActiveEditorTab(tab.name);
                    }}
                  />
                ))}
                {generateTabContent()}
              </div>
            </div>
          </motion.div>
          <motion.div
            className="absolute z-10 top-5 right-5"
            {...fadeAnimation}
          >
            <CustomButton
              type="filled"
              title="go back"
              handleClick={() => (state.intro = true)}
              customStyles="w-fit px-4 py-2.5 font-bold text-sm"
            />
          </motion.div>
          <motion.div
            className="filtertabs-container"
            {...slideAnimation("up")}
          >
            {//do not show if the image is stock
            state["logoDecal"] != "./threejs.png" && (
              <CustomButton type="outline" title="download logo" customStyles="max-w-[12em]" handleClick={() => downloadBase64Image("logo")}>
                Download logo
            </CustomButton>
            )}
            {FilterTabs.map((tab) => (
              <>
              <Tab
                key={tab.name}
                tab={tab}
                isFilterTab
                isActiveTab={activeFilterTab[tab.name]}
                handleClick={() => handleActiveFilterTab(tab.name)}
              />
            </>
            ))}
            
            {state["fullDecal"] != "./threejs.png" && (
              <CustomButton type="outline" title="download texture" customStyles="max-w-[12em]" handleClick={()=>downloadBase64Image("full")}>
                Download texture
            </CustomButton>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default Customizer;
