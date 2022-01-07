export type Site = {
  title: string;
  description?: string;
  url: string;
  tags?: string[];
  github?: {
    owner: string;
    name: string;
  };
};

const originData: Record<string, Omit<Site, "url">> = {
  "https://about.gitlab.com": {
    title: "Iterate faster, innovate together | GitLab",
    description:
      "GitLab's DevOps platform is a single application for unparalleled collaboration, visibility, and development velocity. Learn more here!",
  },
  "https://clrs.cc": {
    title: "Colors - A nicer color palette for the web.",
    description: "Colors.css - A nicer color palette for the web.",
  },
  "https://code.visualstudio.com": {
    title: "Visual Studio Code - Code Editing. Redefined",
    description:
      "Visual Studio Code is a code editor redefined and optimized for building and debugging modern web and cloud applications. Visual Studio Code is free and available on your favorite platform - Linux, macOS, and Windows.",
  },
  "https://codepen.io": {
    title: "CodePen: Online Code Editor and Front End Web Developer Community",
    description:
      "An online code editor, learning environment, and community for front-end web development using HTML, CSS and JavaScript code snippets, projects, and web applications.",
  },
  "https://coding-fonts.css-tricks.com": {
    title: "Coding Fonts — Anonymous Pro on CSS-Tricks",
    description:
      "Information about coding fonts: designers, character charts, features, and more.",
  },
  "https://colorhunt.co": {
    title: "Color Palettes for Designers and Artists - Color Hunt",
    description:
      "Discover the newest hand-picked color palettes of Color Hunt. Get color inspiration for your design and art projects.",
  },
  "https://fakeimg.pl": {
    title: "Fake images please?",
    description:
      "Fakeimg.pl is a little tool that generates images with an URL. Choose the size, the colors, even the text. Oh… and it’s free.",
  },
  "https://fishshell.com": {
    title: "fish shell",
    description: "A smart and user-friendly command line shell",
  },
  "https://fonts.adobe.com": {
    title: "Adobe Fonts | Explore unlimited fonts",
    description:
      "Adobe Fonts partners with the world’s leading type foundries to bring thousands of beautiful fonts to designers every day. No need to worry about licensing, and you can use fonts from Adobe Fonts on the web or in desktop applications.",
  },
  "https://fonts.google.com": {
    title: "Browse Fonts - Google Fonts",
    description:
      "Making the web more beautiful, fast, and open through great typography",
  },
  "https://github.com": {
    title: "GitHub",
    description:
      "GitHub is where people build software. More than 73 million people use GitHub to discover, fork, and contribute to over 200 million projects.",
  },
  "https://krita.org": {
    title: "Krita | Digital Painting. Creative Freedom.",
    description:
      "Krita is a professional FREE and open source painting program. It is made by artists that want to see affordable art tools for everyone.",
  },
  "https://lingojam.com/FancyTextGenerator": {
    title: "Fancy Text Generator (𝓬𝓸𝓹𝔂 𝖆𝖓𝖉 𝓹𝓪𝓼𝓽𝓮) ― LingoJam",
  },
  "https://markdown-here.com": {
    title: "Markdown Here",
    description:
      "Markdown Here is an extension for Chrome, Firefox, and Thunderbird that allows you to write email in Markdown",
  },
  "https://owncloud.com": {
    title: "ownCloud - share files and folders, easy and secure",
    description:
      "ownCloud, your file platform. The most essential business tool for enterprise-grade file sync and share.",
  },
  "https://passwordsgenerator.net": {
    title: "Strong Random Password Generator",
    description:
      "Strong Password Generator to create secure passwords that are impossible to crack on your device without sending them across the Internet, and learn over 40 tricks to keep your passwords, accounts and documents safe.",
  },
  "https://rocket.chat": {
    title: "Explore Rocket.Chat communication platform",
    description:
      "Explore Rocket.Chat, where we put data privacy into every conversation and enable teams to collaborate seamlessly.",
  },
  "https://www.color-hex.com": {
    title: "Color Hex Color Codes",
    description:
      "Color hex is a easy to use tool to get the color codes information including color models (RGB,HSL,HSV and CMYK), css and html color codes.",
  },
  "https://www.colourlovers.com": {
    title: "Color Trends + Palettes :: COLOURlovers",
    description:
      "COLOURlovers is a creative community where people from around the world create and share colors, palettes and patterns, discuss the latest trends and explore colorful articles... All in the spirit of love",
  },
  "https://www.fakenamegenerator.com": {
    title: "Generate a Random Name - Fake Name Generator",
    description:
      "The most advanced fake name generator. Generate random names, addresses, usernames, passwords, email addresses, and more. Use for software testing, social media, or anything else.",
  },
  "https://www.lipsum.com": {
    title: "Lorem Ipsum - All the facts - Lipsum generator",
    description:
      "Reference site about Lorem Ipsum, giving information on its origins, as well as a random Lipsum generator.",
  },
  "https://www.supremo.co.uk/typeterms/": {
    title: "Type Terms",
    description: "The animated typographic cheat sheet.",
  },
};

const sites: Site[] = Object.entries(originData).map(([url, site]) => ({
  ...site,
  url,
}));

export default sites;
