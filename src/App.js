import { useEffect, useRef, useState } from "react";
import Message from "./components/Message";

const CHARS_PER_STROKE = 5;

function App() {
  const [sourceCode, setSourceCode] = useState("");
  const [content, setContent] = useState("");
  const [messageType, setMessageType] = useState("denied");

  const scrollToRef = useRef();

  // let startIndex = 0;
  // let currentIndex = 0;

  const [currentIndex, setCurrentIndex] = useState(0);

  const [isLocked, setIsLocked] = useState(false);
  useEffect(() => {
    fetch("code.txt")
      .then((r) => r.text())
      .then((text) => {
        setSourceCode(text);
      });
  }, []);

  const handleKeyDown = (event) => {
    if (event.key !== "Escape") runScript();
    else removeMessage();
  };

  const removeMessage = (params) => {
    setIsLocked(false);
  };

  const runScript = () => {
    if (!isLocked) {
      // get more text and update the cursor
      setCurrentIndex(currentIndex + CHARS_PER_STROKE);
      setContent(sourceCode.substring(0, currentIndex));

      scrollToRef.current.scrollIntoView();
      // update access message
      if (currentIndex !== 0 && currentIndex % 300 === 0) {
        setIsLocked(true);
        setMessageType("denied");
      }
      if (currentIndex !== 0 && currentIndex % 900 === 0) {
        setIsLocked(true);
        setMessageType("success");
      }
    }
  };

  return (
    <>
      <div
        id="container"
        onKeyDown={handleKeyDown}
        tabIndex={0}
        className={isLocked ? "blurred" : ""}
      >
        <div id="source">{content}</div>
        <p ref={scrollToRef}></p>
      </div>
      {isLocked && <Message type={messageType} />}
    </>
  );
}

export default App;
