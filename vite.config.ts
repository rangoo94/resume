import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { UserConfig } from "vite";
import { createHtmlPlugin } from "vite-plugin-html";
import { buildTechnologyWordsCloud } from "./src/precompile/words-cloud";
import eslintPlugin from "vite-plugin-eslint";
import { formatWithOptions, intervalToDuration } from "date-fns/fp";
import { formatDuration, addDays, set as setTime } from "date-fns";
import person from "./config/person.json";
import projects from "./config/projects.json";
import oss from "./config/oss.json";
import talks from "./config/talks.json";

const loadFile = (path: string) =>
  readFileSync(createRequire(import.meta.url).resolve(path), "utf8");
const loadIcon = (name: string) =>
  loadFile(`@fortawesome/fontawesome-free/svgs/${name}.svg`).replace(
    "<svg ",
    '<svg class="icon" ',
  );

const truncateWorkDate = (time: Date | number): Date =>
  setTime(time, { hours: 0, minutes: 0, seconds: 0, milliseconds: 0 });

const formatWorkDate = formatWithOptions({}, "MMMM yyyy");
const formatWorkPeriod = (start: string, end: string | null): string => {
  const period = {
    start: truncateWorkDate(Date.parse(start)),
    end: addDays(
      truncateWorkDate(end == null ? Date.now() : Date.parse(end)),
      1,
    ),
  };
  return formatDuration(intervalToDuration(period), {
    format: ["years", "months"],
  });
};

const data = {
  technologiesWordCloud: await buildTechnologyWordsCloud(),
  projects: projects,
  oss: oss,
  talks: talks,
  person: person,
  linkedinUrl: person.sameAs.find((x) => x.includes("linkedin")),
  githubUrl: person.sameAs.find((x) => x.includes("github")),
  icons: {
    githubAlt: loadIcon("brands/github-alt"),
    github: loadIcon("brands/github"),
    linkedinIn: loadIcon("brands/linkedin-in"),
    linkedin: loadIcon("brands/linkedin"),
    fileWaveform: loadIcon("solid/file-waveform"),
    link: loadIcon("solid/link"),
    envelope: loadIcon("solid/envelope"),
    phone: loadIcon("solid/phone"),
  },

  formatWorkDate,
  formatWorkPeriod,
};

export default {
  plugins: [
    eslintPlugin(),
    createHtmlPlugin({
      minify: true,
      pages: [
        {
          entry: "src/main.ts",
          template: "index.html",
          filename: "<root>/index.html",
          injectOptions: {
            data,
            ejsOptions: { async: false },
          },
        },
        {
          entry: "src/resume.ts",
          template: "resume.html",
          filename: "<root>/resume.html",
          injectOptions: {
            data,
            ejsOptions: { async: false },
          },
        },
      ],
    }),
  ],
  base: "",
  build: {
    rollupOptions: {
      input: {
        index: "<root>/index.html",
      },
    },
  },
} satisfies UserConfig;
