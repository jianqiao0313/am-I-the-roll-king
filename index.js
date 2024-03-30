#!/usr/bin/env node
const path = require("path");
const simpleGit = require("simple-git");
const fg = require("fast-glob");
const ignoreFile = ["package-lock.json", "yarn.lock"];
const { Command } = require("commander");
const program = new Command();
const moment = require("moment");
const clear = require("clear");
const chalk = require("chalk");
const figlet = require("figlet");
clear();
console.log(
  chalk.yellow(
    figlet.textSync("Am-I-The-Roll-King", {
      horizontalLayout: "default",
      width: 100,
    })
  )
);
program
  .name("am-I-the-roll-king")
  .description("我是卷王吗？")
  .option(
    "-p, --path <string>",
    "扫描的文件夹路径，如：/user/projects，默认是当前目录",
    process.cwd()
  )
  .option("-s, --since <date>", "开始时间(YYYY-MM-DD)，默认是当天", moment().subtract(1,'days').format("YYYY-MM-DD"))
  .option("-u, --until <date>", "结束时间(YYYY-MM-DD)，默认是当天", moment().format("YYYY-MM-DD"))
  .option("-d, --deep <number>", "扫描文件夹深度，默认扫描3层", 3)
  .option(
    "-a, --author <string>",
    "作者，会取git config中的user.name，如果想匹配多个作者，可以用逗号分隔，如zhangesan,lisi"
  )
  .option(
    "-i, --ignoreFile <string>",
    "忽略统计的文件，会忽略文件名中包含指定字符串的文件，多个字符串用逗号分隔，如yarn.lock,package-lock.json，默认不统计package-lock.json,yarn.lock",
    "package-lock.json,yarn.lock"
  )
  .version("1.0.3", "-v, --version", "版本号")
  .helpOption("-h, --help", "帮助文档");
program.addHelpText(
  "after",
  `
示例:
    $ am-I-the-roll-king //统计当前用户，当前文件夹下，当天的代码提交情况，忽略package-lock.json,yarn.lock文件，扫描文件夹深度是3
    $ am-I-the-roll-king -s 2024-01-01 -u 2024-12-29 //统计当前用户，当前文件夹下，2024年1月1日到2024年12月29日的代码提交情况，忽略package-lock.json,yarn.lock文件，扫描文件夹深度是3
    $ am-I-the-roll-king -p "/user/project" //统计当前用户，/user/project文件夹下，2024年1月1日到2024年12月29日的代码提交情况，忽略package-lock.json,yarn.lock文件，扫描文件夹深度是3
    $ am-I-the-roll-king -d 5 //统计当前用户，当前文件夹下，当天的代码提交情况，忽略package-lock.json,yarn.lock文件，扫描文件夹深度是5
    $ am-I-the-roll-king -a "zhangsan,lisi" //统计zhangsan,lisi用户，当前文件夹下，当天的代码提交情况，忽略package-lock.json,yarn.lock文件，扫描文件夹深度是3
    $ am-I-the-roll-king -i "yarn.lock,package-lock.json,aaa.js" //统计当前用户，当前文件夹下，当天的代码提交情况，忽略yarn.lock,package-lock.json,aaa.js文件，扫描文件夹深度是3
    $ am-I-the-roll-king -s 2024-01-01 -u 2024-12-29 -p "/user/project" -d 5 -a "zhangsan,lisi" -i "yarn.lock,package-lock.json,aaa.js" //统计zhangsan,lisi用户，/user/project文件夹下，2024年1月1日到2024年12月29日的代码提交情况，忽略yarn.lock,package-lock.json,aaa.js文件，扫描文件夹深度是5
`
);
program.parse();
const options = program.opts();
const gitShellOptions = {
  "--numstat": null,
  "--perl-regexp": null,
  "--invert-grep": null,
};

const getEntries = () => {
  return fg.globSync([path.resolve(options.path) + "/**/.git"], {
    dot: true,
    onlyDirectories: true,
    absolute: true,
    deep: 3,
  });
};
const getAuthor = async () => {
  return await new simpleGit().getConfig("user.name");
};
const handleOptions = (author) => {
  if (options.author) {
    gitShellOptions["--author"] = `(${options.author.split(",").join("|")})`;
  } else {
    gitShellOptions["--author"] = `(${author})`;
  }
  if (options.since) {
    gitShellOptions["--since"] = options.since;
  }
  if (options.until) {
    gitShellOptions["--until"] = options.until;
  }
};
const handleEntries = async (entries, totalObj) => {
  if (entries.length === 0) {
    printResult(totalObj);
    return;
  }
  const projectPath = path.resolve(entries.shift(), "../");
  console.log(chalk.bold.underline.blue(`[开始处理]${projectPath}项目`));
  try {
    const log = await simpleGit({
      baseDir: projectPath,
      binary: "git",
    }).log(gitShellOptions);
    console.log(chalk.bold.green(`共${log.all.length}次提交`));
    if (log.all.length > 0) {
      log.all.forEach((logItem, index) => {
        if (!logItem) return;
        const { diff } = logItem;
        if (!diff) return;
        const { files } = diff;
        if (!files) return;
        let changes = 0;
        let deletions = 0;
        let insertions = 0;
        console.log(
          chalk.green(
            ` |-第${index + 1}次提交，hash：${logItem.hash}，message：${
              logItem.message
            }`
          )
        );
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
          chalk.yellow(
            ` |-第${
              index + 1
            }次提交处理结束：${changes} changes, ${deletions} deletions, ${insertions} insertions`
          )
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
const printResult = (totalObj) => {
  console.log(
    chalk.black.bgYellow.bold(
      `统计结果：insertions: ${totalObj.insertions}, deletions: ${totalObj.deletions}, changes: ${totalObj.changes}`
    )
  );
  let begin = moment(
    options.since ? options.since : moment().format("YYYY-MM-DD")
  );
  let end = moment(
    options.until ? options.until : moment().format("YYYY-MM-DD")
  );
  let countDays = end.diff(begin, "days") ? end.diff(begin, "days") : 1;
  let perDayChange = totalObj.changes / countDays;
  console.log(
    chalk.black.bgYellow.bold(
      `共${countDays}天，平均insertions: ${
      (totalObj.insertions / countDays).toFixed(2)
      }, 平均deletions: ${(totalObj.deletions / countDays).toFixed(2)}, 平均changes: ${
        (totalObj.changes / countDays).toFixed(2)
      }`
    )
  );
  if (perDayChange > 1000) {
    console.log(chalk.red.bold(`回家吧！卷王！`));
    return;
  }
  if (perDayChange > 500) {
    console.log(chalk.yellow.bold(`你离卷王越来越近了！`));
    return;
  }
  if (perDayChange > 100) {
    console.log(chalk.green.bold(`还可以~`));
    return;
  }
  if (perDayChange < 100) {
    console.log(chalk.red.bold(`自己提交多少心里没数吗？赶紧卷起来！`));
    return;
  }
};
(async () => {
  chalk.reset();
  const entries = getEntries();
  const totalObj = {
    insertions: 0,
    deletions: 0,
    changes: 0,
  };
  const { value: author } = await getAuthor();
  handleOptions(author);
  console.log(`扫描指定文件夹，发现${entries.length}个git仓库`);
  if (entries.length === 0) {
    return;
  }
  handleEntries(entries, totalObj);
})();
