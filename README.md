# A Little Corner ♡

A responsive, scrapbook-inspired static website for personalised greetings, photos, letters, optional background music, and friend replies. Built with plain HTML, CSS and JavaScript for GitHub Pages.

## 1. Add friends

Open `friends.js`. Replace the sample friend with your real friends. Copy the object for each additional friend and make each `slug` unique.

Example personal link after deployment:

`https://sarang-004.github.io/REPOSITORY-NAME/#/letter/aryan`

The `slug` is the final part (`aryan`). Keep it lowercase and URL-friendly. The name search and personal links both use this data file.

## 2. Add photos

Put photos in the `images/` folder, then reference them in `friends.js`, for example:

```js
photos: [
  { src: "images/aryan-1.jpg", caption: "the day we got lost", style: "portrait" },
  { src: "images/aryan-2.jpg", caption: "one for the memory book", style: "landscape" }
]
```

Use `style: "portrait"` or `style: "landscape"`. Leave `src` blank if you want a placeholder while setting up.

## 3. Add music (optional)

Put an MP3 file at `audio/background.mp3`. Music only plays when someone presses the soundtrack button. Browsers usually block autoplay, so this site does not autoplay it.

## 4. Publish with GitHub Pages

1. Create a new repository on GitHub. A repository name such as `our-little-corner` is fine. For the easiest setup, make it **Public**.
2. Upload the contents of this folder to the repository's root. Upload `index.html`, `style.css`, `script.js`, `friends.js`, and the `images/` and `audio/` folders. Do not upload the ZIP file itself as the website content.
3. In the repository, open **Settings → Pages**.
4. Under **Build and deployment**, choose **Deploy from a branch**.
5. Choose branch **main** and folder **/(root)**, then save.
6. Wait a few minutes. GitHub will show the published URL on the Pages settings screen.

With username `sarang-004` and repository `our-little-corner`, the URL should be:
`https://sarang-004.github.io/our-little-corner/`

## Important privacy note

This is a static website. Anyone who knows a friend's link can open it, and the names, photos and letters stored in `friends.js` and `images/` are not private. A personal URL is convenient, but it is **not** password protection or access control. Only add content you are comfortable putting in the repository. For a private site, you would need a backend and real authentication.

## Local preview

You can open `index.html` directly for a quick visual check. For the most reliable local preview, use VS Code's Live Server extension. Before publishing, replace the sample friend and test each photo and link.
