// const gitlog = require('gitlog').default;
const path = require("path");
const simpleGit = require("simple-git");
const fg = require("fast-glob");
const ignoreFile = ["package-lock.json", "yarn.lock"];
const getEntries = () => {
  return fg.globSync([path.resolve("/Users/tyc/projects/") + "/**/.git"], {
    dot: true,
    onlyDirectories: true,
    absolute: true,
    deep: 3,
  });
};
const handleEntries = async (entries, totalObj) => {
  if (entries.length === 0) {
    console.log("统计结果：", totalObj);
    return;
  }
  const projectPath = path.resolve(entries.shift(), "../");
  console.log(`[开始处理]${projectPath}:`);
  try {
    const log = await simpleGit({
      baseDir: projectPath,
      binary: "git",
    }).log({
      "--author": `(liuxin|lvjianqiao)`,
      "--numstat": null,
      "--perl-regexp": null,
      "--invert-grep": null,
      "--since": "2024-03-20",
      "--until": "2024-03-29",
    });
    if (log.all.length > 0) {
      log.all.forEach((logItem) => {
        if (!logItem) return;
        const { diff } = logItem;
        if (!diff) return;
        const { files } = diff;
        if (!files) return;
        let changes = 0;
        let deletions = 0;
        let insertions = 0;
        console.log(` |-开始处理${logItem.hash}-${logItem.message}`);
        files.forEach((fileItem) => {
          let ignore = ignoreFile.some((ignoreFileItem) =>
            fileItem.file.includes(ignoreFileItem)
          );
          if (ignore) return;
          console.log(
            `  --file: ${fileItem.file}, changes: ${fileItem.changes}, deletions: ${fileItem.deletions}, insertions: ${fileItem.insertions}`
          );
          changes += fileItem.changes ? fileItem.changes : 0;
          deletions += fileItem.deletions ? fileItem.deletions : 0;
          insertions += fileItem.insertions ? fileItem.insertions : 0;
        });
        console.log(
          ` |-处理结束：${changes} changes, ${deletions} deletions, ${insertions} insertions`
        );
        totalObj.insertions += insertions;
        totalObj.deletions += deletions;
        totalObj.changes += changes;
      });
    }
  } catch (e) {
    console.error(`[处理失败]${projectPath}`, e.message ? e.message : e);
  }
  // console.log(log);
  handleEntries(entries, totalObj);
};
(async () => {
  const entries = getEntries();
  const totalObj = {
    insertions: 0,
    deletions: 0,
    changes: 0,
  };
  console.log(`扫描指定文件夹，发现${entries.length}个git仓库`);
  if (entries.length === 0) {
    return;
  }
  handleEntries(entries, totalObj);
})();
