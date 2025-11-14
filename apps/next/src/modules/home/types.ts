export type HomeFilter = "all" | "sets" | "folders" | "classes";

export const HOME_FILTER_LABELS: Record<HomeFilter, string> = {
  all: "All",
  sets: "Study sets",
  folders: "Folders",
  classes: "Classes",
};

export const HOME_FILTER_ORDER: HomeFilter[] = [
  "all",
  "sets",
  "folders",
  "classes",
];
