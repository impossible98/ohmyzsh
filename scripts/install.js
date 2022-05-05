#!/usr/bin/env node
// @ts-check
const childProcess = require("child_process");
const fs = require("fs");
const os = require("os");

/**
 * @param {fs.PathLike} dirPath
 */
function existsDir(dirPath) {
  if (fs.existsSync(dirPath)) {
    console.log("已存在 oh-my-zsh 文件夹");
    fs.rmSync(dirPath, {
      force: true,
      recursive: true,
    });
    console.log("已删除 oh-my-zsh 文件夹");
  }
}

function packageManager() {
  if (process.platform === "darwin") {
    return "brew";
  } else if (process.platform === "linux") {
    return "apt-get";
  }
}

/**
 * @param {string} cmd
 */
function cmdExists(cmd) {
  try {
    childProcess.execSync(
      os.platform() === "win32"
        ? `cmd /c "(help ${cmd} > nul || exit 0) && where ${cmd} > nul 2> nul"`
        : `command -v ${cmd}`,
    );
    return true;
  } catch {
    return false;
  }
}

function updatePackage() {
  const pkg = packageManager();

  console.log("开始更新包");

  if (pkg === "brew") {
    childProcess.execSync(`${pkg} update`);
  } else if (pkg === "apt-get") {
    childProcess.execSync(`${pkg} update`);
  }
  console.log("更新包成功");
}

function installGit() {
  const pkg = packageManager();

  console.log("开始安装 git");

  if (!cmdExists("git")) {
    if (pkg === "brew") {
      childProcess.execSync(`${pkg} install git`);
    } else if (pkg === "apt-get") {
      childProcess.execSync(`${pkg} install --no-install-recommends --yes git`);
    }
  }
  console.log("安装 git 成功");
}

function installZsh() {
  const pkg = packageManager();
  console.log("开始安装 zsh");

  if (!cmdExists("zsh")) {
    if (pkg === "brew") {
      childProcess.execSync(`${pkg} install zsh`);
    } else if (pkg === "apt-get") {
      childProcess.execSync(`${pkg} install --no-install-recommends --yes zsh`);
    }
  }
  console.log("安装 zsh 成功");
}

function clone() {
  console.log("开始下载oh-my-zsh");
  childProcess.execSync("git clone --depth 1 https://github.com/impossible98/ohmyzsh.git ~/.oh-my-zsh");
  console.log("已下载oh-my-zsh");
}

function installOhMyZsh() {
  const dirPath = os.homedir + "/.oh-my-zsh";

  updatePackage();
  installGit();
  installZsh();
  console.log("开始安装oh-my-zsh");
  existsDir(dirPath);
  clone();
  //   复制文件
  fs.copyFileSync(
    os.homedir + "/.oh-my-zsh/templates/zshrc.zsh-template",
    os.homedir + "/.zshrc",
  );
  childProcess.execSync("chsh -s $(which zsh)");
  console.log("安装ohmyzsh成功");
  console.log("请执行命令：");
  console.log("  zsh");
  console.log("开始使用ohmyzsh");
}

function main() {
  console.clear();
  try {
    installOhMyZsh();
  } catch (error) {
    console.log(error);
  }
}

main();
