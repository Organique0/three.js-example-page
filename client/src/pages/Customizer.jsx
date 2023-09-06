import React, { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useSnapshot } from "valtio";
import config from "../config/config";
import state from "../store";
import { download } from "../assets";
import { downloadCanvasToImage, reader } from "../config/helpers";
import { EditorTabs, FilterTabs, DecalTypes } from "../config/constants";
import { fadeAnimation, slideAnimation } from "../config/motion";
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
    logoShirt: true,
    stylishShirt: false
  });

  const generateTabContent = () => {
    switch (activeEditorTab) {
      case "colorpicker":
        return <ColorPicker />;
      case "filepicker":
        return <FilePicker file={file} setFile={setFile} readFile={readFile} />;
      case "aipicker":
        return <AIPicker prompt={prompt} setPrompt={setPrompt} generatingImg={generatingImg} handleSubmit={handleSubmit}/>;
      default:
        return null;
    }
  };

  const handleSubmit = async () => {
    if(!prompt) return alert("Please enter a prompt");

    try {
      //call backend to generate image
    } catch (error) {
      console.log(error);
    } finally {
      setgeneratingImg(false);
      setActiveEditorTab("");
    }
  }

  const handleDecals = (type, data) => {
    const decalType = DecalTypes[type];
    state[decalType.stateProperty] = data;

    if (!activeFilterTab[decalType.FilterTab]) {
      handleActiveFilterTab(decalType.FilterTab);
    }
  };

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
      [filterTab]:!prevState[filterTab]
    };
  });
  };

  const readFile = (type) => {
    reader(file).then((data) => {
      handleDecals(type, data);
      setActiveEditorTab("");
    });
  };

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
            {FilterTabs.map((tab) => (
              <>
              <Tab
                key={tab.name}
                tab={tab}
                isFilterTab
                isActiveTab={activeFilterTab[tab.name]}
                handleClick={() => handleActiveFilterTab(tab.name)}
              /></>
            ))}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default Customizer;
