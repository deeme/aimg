import React, { useState, useEffect } from "react";
import "./App.css";
import { DisplayImages } from "./Images";
import ImageDownloader from "./ImagesDownload";

function App() {
  const [requestErrorMessage, setRequestErrorMessage] = useState(null);
  const [requestError, setRequestError] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [placeholder, setPlaceholder] = useState("Search Bears with Paint Brushes the Starry Night, painted by Vincent Van Gogh...");
  const [quantity, setQuantity] = useState(5);
  const [model, setModel] = useState("dalle-3");
  const [maxQuantity, setMaxQuantity] = useState(5);
  const [imageSize, setImageSize] = useState("1024x1024");

  const generateImage = async () => {
    setRequestError(false);
    setImageSize(imageSize);
    setPlaceholder(`Search ${prompt}...`);
    setPrompt(prompt);
    setLoading(true);

    const apiUrl = `${import.meta.env.VITE_OPEN_AI_BASE}/v1/images/generations`;
    const openaiApiKey = import.meta.env.VITE_OPEN_AI_KEY;
    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${openaiApiKey}`,
        },
        body: JSON.stringify({
          model: model,
          prompt: prompt,
          n: quantity,
          size: imageSize,
        }),
      });

      if (!response.ok) {
        setRequestError(true);
        const errorMessage = await response.json();
        setRequestErrorMessage(await errorMessage.error.message);
      }

      const data = await response.json();

      setLoading(false);

      const existingLinks = JSON.parse(localStorage.getItem("imageLinks")) || [];

      const newLinks = data.data.map((image) => image.url);
      const allLinks = [...newLinks, ...existingLinks];

      localStorage.setItem("imageLinks", JSON.stringify(allLinks));
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  const handleModelSelect = (e) => {
    setModel(e.target.value);
    const modelMaxImages = {
      "kandinsky-v2.2": 10,
      "kandinsky-v2": 10,
      sdxl: 5,
      "stable-diffusion-v2.1": 10,
      "stable-diffusion-v1.5": 10,
      "deepfloyd-if": 4,
      "dalle-3": 10,
			"openjourney-xl": 4,
			"openjourney-v4": 4,
			"dreamshaper": 4,
			"majicmixsombre": 4,
			"pastelMixAnime": 4,
			"absoluteReality": 4,
			"anything": 4,
			"meinamix": 4,
			"deliberate": 4,
			"revAnimated": 4,
			"realisticVision": 4,
    };
    setQuantity(Math.min(quantity, modelMaxImages[e.target.value]));
    setMaxQuantity(modelMaxImages[e.target.value]);
  };

  return (
    <div className="app-main">
      {loading ? (
        <>
          <h2>正在为您打造个性化图片... 请耐心等待!</h2>
          <div className="lds-ripple">
            <div></div>
            <div></div>
          </div>
          <br />
          <DisplayImages />
        </>
      ) : (
        <>
          {requestError ? <div className="alert">{requestErrorMessage}</div> : null}

          <h2>利用多种人工智能模型创建图片</h2>
          <div className="select-container">
            <select value={model} onChange={handleModelSelect}>
              <option value="kandinsky-v2.2">Kandinsky 2.2</option>
              <option value="kandinsky-v2">Kandinsky 2</option>
              <option value="sdxl">SDXL</option>
              <option value="stable-diffusion-v2.1">Stable Diffusion 2.1</option>
              <option value="stable-diffusion-v1.5">Stable Diffusion 1.5</option>
              <option value="deepfloyd-if">Deepfloyd IF</option>
              <option value="dalle-3">DALL-E</option>
              <option value="openjourney-xl">openjourney-xl</option>
              <option value="openjourney-v4">openjourney-v4</option>
              <option value="dreamshaper">dreamshaper</option>
              <option value="majicmixsombre">majicmixsombre</option>
              <option value="pastelMixAnime">pastelMixAnime</option>
              <option value="absoluteReality">absoluteReality</option>
              <option value="anything">anything</option>
              <option value="meinamix">meinamix</option>
              <option value="deliberate">deliberate</option>
              <option value="revAnimated">revAnimated</option>
              <option value="realisticVision">realisticVision</option>
            </select>

            <ImageDownloader />
          </div>

          <textarea
            className="app-input"
            placeholder={placeholder}
            onChange={(e) => setPrompt(e.target.value)}
            rows="10"
            cols="40"
            autoFocus
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                document.getElementById("generate").click();
              }
            }}
          />
          <label htmlFor="quantity">图片数量:</label>
          <input id="quantity" type="range" min="1" max={maxQuantity} value={quantity} onChange={(e) => setQuantity(parseInt(e.target.value))} />
          <span>{quantity}</span>

          <br />
          <button onClick={generateImage} id="generate">
            生成图像
          </button>
          <DisplayImages />
        </>
      )}
    </div>
  );
}

export default App;
