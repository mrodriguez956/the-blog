---
layout: ../../layouts/MarkdownPostLayout.astro
title: 'Back to the 90s in Dead by Daylight'
pubDate: 7-04-2025
description: "My journey creating the 90s Perk Pack Creator"
author: "Michael Rodriguez"
image:
  url: "/the-blog/images/scary-react.jpg"
  alt: "The Astro logo on a dark background with a pink glow."
tags: ["gaming", "blogging", "learning in public"]
---

Dead by Daylight is one of my most played games of all time since its release in 2016. As a fan of the horror genre across all mediums, with a longing for a return to the 90s aesthetic, Dead by Daylight serves as a melting pot of horror icons that has shaped my love for the simplicity of 90s horror. So naturally, in 2018, I was inspired to take the horror themes of the game and merge them with the neon flair the 90s are most known for. Thus, the 90s Perk Pack was born.

Starting off as a personal project during my time as a full-time student, I only had one type of icon theme at the time, so there wasn’t much need to optimize or streamline my workflow. If new icons were released, I would open Photoshop and get to work. However, with each screenshot I shared among friends and later on social media, my icons quickly gained the attention of hundreds of others who are just as nostalgic. Over 2,000 upvotes on Reddit, 10,000 visitors on Steam Community pages, and over 5,000 (documented since 2023) downloads later, it was clear that this pack was more than just my own. Even more so, with comments, friend requests, and messages still coming in asking for "moar icons" or the next update, this pack had taken on a life of its own—one I simply could not easily maintain with my current workflow as time went on.

## The Vision

It was time for a solution—one that would prove useful even if it was only just for me. As someone with a constant itch for a new web dev project, my vision from the start was to make a tool available on the web that would take blank images from Dead by Daylight and apply the same bells and whistles I handcrafted in Photoshop, but in a matter of seconds.

## Getting Started

The starting point for my stack was **Bun, React, TypeScript, JSZip, and Tailwind CSS**. My first order of business was establishing a method for retrieving files from the end-user. Since Dead by Daylight often adds multiple new icons at a time, it’s important for users to be able to upload all of them at once to minimize repetition. The simple `multiple` attribute on a file input does the trick:

```html
<input type="file" multiple />
```

Dead by Daylight icons are strictly `.png` files, so preventing other file types is a must. The `accept` attribute handles this perfectly:

```html
<input type="file" multiple accept="image/png" />
```

When files are uploaded, we need to store specific information for each file in an array:

- The file name (without the extension)
    
- The image data as a Data URL
    

This is where our `uploadFiles()` function comes in. It iterates through each selected file, performs a quick check to ensure it's a PNG (though the `accept` attribute helps here!), then reads the file as a Data URL and adds it to our `fileData` React state variable—effectively creating an array of objects, each representing an uploaded image.

Here’s a simplified version of the code:

```tsx
const [fileData, setFileData] = useState([]);

function uploadFiles(event) {
  const files = event.target.files;
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    if (!file.type.startsWith("image/png")) continue;
    const fileName = file.name.replace(/\.png$/, "");
    const reader = new FileReader();
    reader.onload = (e) => {
      setFileData(prev => [
        ...prev,
        { name: fileName, data: e.target.result }
      ]);
    };
    reader.readAsDataURL(file);
  }
}
```

**Why use a Data URL?** A Data URL encodes the image as a string, making it easy to display in the browser or pass to image manipulation libraries—no need to upload the file to a server or worry about file paths.

**What does `fileData` look like?**

```tsx
[
  { name: "perk1", data: "data:image/png;base64,..." },
  { name: "perk2", data: "data:image/png;base64,..." },
  // ...
]
```

This array will be passed to the image manipulation part of the app (coming soon!), where each icon will get the 90s treatment.

## The Difficult Part

Establishing the flow of this program would be for nothing if there wasn't an end result. Which brings me to the most painful (but rewarding!!) part of this project: the image manipulation. On paper, the goal is quite simple. There are a ton of programs with varying levels of complexity that have already established the concept of layers, clipping, gradients, and adding stroke outlines. But automating that magic in a browser to work with any compatible image the end user desires? There were many times I hit a brick wall.

That first wall was deciding on a library to simplify this process. The HTML5 `<canvas>` element provides a powerful API for rendering custom graphics and animations directly in the browser. However, I did not want to reinvent the wheel if I didn't have to. To my surprise, there were two very popular libraries that make canvas much easier to work with: **Konva.js** and **Fabric.js**. Both of these libraries achieved just about everything I needed and more, but one particular difference ultimately brought me to Fabric.js... the documentation.

For my use-case, I needed to use the uploaded image as a **clipping mask** for a predefined gradient image, and then apply a stroke to that masked image. A casual scroll through the Konva.js documentation might suggest that clipping is straightforward—however, this taught me a very important lesson in thorough research. While Konva.js supports clipping, it **does not natively support using images as clipping masks**. The only definitive answers I found were buried in the comments section of their official website. It's safe to say this was a significant time sink. Although an active moderator of the Konva webpage mentioned a workaround, I wasn't interested in diving deeper into a less direct solution.

I moved on to Fabric.js, and my first stop was looking at the demos using the library. There was a [clipping and masking demo!](https://fabricjs.com/demos/clipping/ "null") This was great news, so I immediately went to the latest version of the documentation to get started and... the `clipPath` documentation is very barebones and from older versions of Fabric. After many struggles, here’s the Fabric.js code I used to achieve this effect—using the uploaded icon image as a clipping mask for a gradient background:

```tsx
const fabricImage = new FabricImage(gradImage, {
  clipPath: new FabricImage(iconImage, {
    left: 0,
    top: 0,
    width: 256,
    height: 256,
    originX: "center",
    originY: "center",
  }),
  left: 0,
  top: 0,
  width: 256,
  height: 256,
  selectable: false,
});
```

**How does this work?**

- `gradImage` is your gradient or background image.
    
- `iconImage` is the user-uploaded icon.
    
- The `clipPath` property takes another Fabric image (in this case, the icon) and uses it as a mask. Only the parts of the gradient that overlap with the icon shape will be visible.
    
- All positioning and sizing is handled in the options objects.
    

## Stroke Outline Nightmare

At long last, clipping works and the headaches and confusion are behind me... right? You might want to take a seat for this one.

My method of applying stroke outlines in Photoshop is simple: click the effects button, stroke outline, change color and width. Done. It never occurred to me how complex that task could be under the hood until this project.

CSS wouldn't work here, as its `border` property applies to the bounding box of an HTML element, not directly to the pixels of an image on a `<canvas>` element. In other words, it wouldn't respect the image's transparency, meaning it would outline the rectangular image area rather than the actual shape of the icon. Fabric.js does have a `stroke` property, but it's primarily designed for vector shapes (like rectangles, circles, or paths) and doesn't offer the same bitmap-based outlining capabilities as Photoshop. This signaled to me that we needed to dig for one more library that could apply stroke.

I won't elaborate on the painstaking process of searching for a library that functioned exactly the way I needed. Instead, I'll jump straight to the repository that saved my sanity and this project. This repo tells the story for me with its 42 stars... it works flawlessly: [https://liajoy.github.io/image-stroke/](https://liajoy.github.io/image-stroke/ "null")

With this Image-Stroke library imported, here’s exactly how I use it in my project:

```tsx
htmlImage.onload = () => {
  const imageStroke = new ImageStroke();
  imageStroke.use(rotate);

  const resultIcon = imageStroke.make(htmlImage, {
    thickness: 2,
    color: "black",
  });

  const fabricImage = new FabricImage(resultIcon, {
    left: 0,
    top: 0,
    width: 256,
    height: 256,
    selectable: false,
  });

  canvas.add(fabricImage);
  canvas.renderAll();

  const canvasURL = canvas.toDataURL();
  setDownloadURL(canvasURL);
  handleAddNewURL(name, canvasURL);

  canvas.remove(fabricImage);
};
```

This ensures the image is fully loaded before applying the stroke and adding it to the canvas. It’s the closest thing to a “Photoshop stroke” I’ve found for the web, and it simply works!

## Packaging It All Up: The Download

With all the icons processed, the last step is to make it easy for users to download everything at once. For this, I use [JSZip](https://stuk.github.io/jszip/ "null"), a handy library that lets you create zip files in the browser.

The process is simple:

- Create a new zip archive.
    
- Add each processed icon as a PNG file.
    
- Generate the zip and trigger a download.
    

Here’s a taste of that code:

```tsx
import JSZip from "jszip";
import { useRef } from "react";

export function DownloadZip({ files }) {
  const downloadRef = useRef(null);
  const zip = new JSZip();

  async function handleZip() {
    if (!files || files.length === 0) {
      alert('No files to download');
      return;
    }

    for (let i = 0; i < files.length; i++) {
      const response = await fetch(files[i].data);
      const blob = await response.blob();
      zip.file(`${files[i].name}.png`, blob);

      if (i === files.length - 1) {
        const content = await zip.generateAsync({ type: 'blob' });
        const url = URL.createObjectURL(content);

        if (downloadRef.current) {
          downloadRef.current.href = url;
          downloadRef.current.download = "icons.zip";
          downloadRef.current.click();
          setTimeout(() => URL.revokeObjectURL(url), 100);
        }
      }
    }
  }

  return (
    <>
      <button onClick={handleZip}>Click to Download</button>
      <a ref={downloadRef} style={{ display: 'none' }}></a>
    </>
  );
}
```


  
## Debugging

After creating the zip file, it’s easy to think we can just call it a day and deploy. But I knew better, and put my program through intense testing. This testing was performed at every forward progress made as new functionality was added, so there wasn’t anything too serious.

BUT there were some unique issues that appeared. Most of which came from uploading multiple files at once. If you are familiar with the asynchronous nature of websites, you might know where this is headed.

Our recurring issue: Random files would be excluded

- Multiple icons would be added to the same image, stacking on top of each other.
    
- Sometimes, not all uploaded files would be processed, or the output would be inconsistent.
    

The main culprit was the asynchronous loading of images and the way browser events fire when handling multiple files. If you don’t carefully coordinate when your code proceeds, you can end up:

- Processing images before they’re fully loaded,
    
- Running the same processing logic multiple times,
    
- Or missing files entirely due to race conditions.
    

### The Fix: Robust Asynchronous Handling

Here’s how I solved these issues:

#### 1. Ensuring All Images Are Loaded Before Processing

I used `onload` handlers and flags for each image. The processing function only runs when all images are ready:

```tsx
let iconLoaded = false;
let gradLoaded = false;
let bgLoaded = false;
let isProcessing = false;

function processAfterLoad() {
  if (isProcessing || !iconLoaded || !gradLoaded || !bgLoaded) return;
  isProcessing = true;
  // ...proceed with processing...
}

iconImage.onload = () => {
  iconLoaded = true;
  processAfterLoad();
};

gradImage.onload = () => {
  gradLoaded = true;
  processAfterLoad();
};

bgImage.onload = () => {
  bgLoaded = true;
  processAfterLoad();
};
```

#### 2. Preventing Duplicate or Stacked Images

To avoid adding the same image multiple times or stacking icons, I checked for duplicates before adding to the output:

```tsx
const handleAddNewURL = (name: string, data: string) => {
  setCanvasURLs((prev) => {
    const exists = prev.some(item => item.name === name);
    if (exists) {
      return prev.map(item =>
        item.name === name ? { ...item, data } : item
      );
    }
    return [...prev, { name, data, id: prev.length }];
  });
};
```

And in my uploader, I used a processing flag to prevent duplicate uploads:


```tsx
setIsProcessing(true); // Prevent duplicate uploads
// ...
setIsProcessing(false); // After all files are processed
```


## The Road Ahead

With just a few clicks, users can upload their blank icons, preview the themed icons, and download a zip file packed with sweet nostalgia, no Photoshop needed.

I am confident in sharing the progress I have made so far with the public for use, however the project is far from over. I have a few changes planned to make the UI more engaging and authentic, and make the background processes more efficient. At the time of writing this, I am not even sure when I will ever be truly done with this project. It is fueled by passion, and as long as that's the case you can expect to see many changes in the future. 