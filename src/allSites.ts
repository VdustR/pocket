import github from "./github";
import sites from "./sites";

const allSites = [...sites];
github.forEach((repo) => {
  const siteIndex = allSites.findIndex(
    (site) =>
      site.github &&
      site.github.name === repo.name &&
      site.github.owner === repo.owner
  );
  if (siteIndex === -1) {
    allSites.push({
      url: `https://github.com/${repo.owner}/${repo.name}`,
      title: `${repo.owner}/${repo.name}`,
      description: repo.description,
      tags: repo.tags,
    });
    return;
  }
  const site = allSites[siteIndex];
  allSites[siteIndex] = {
    ...site,
    description: site.description || repo.description,
    tags: [...new Set([...(site.tags ? site.tags : []), ...repo.tags])].sort(
      (a, b) => a.localeCompare(b)
    ),
  };
});

export default allSites;
