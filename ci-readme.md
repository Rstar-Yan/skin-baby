# 肤小宝 · GitHub Actions 自动上传指南

## 你只需要做一次的事

### 1. 把项目推到 GitHub

```bash
cd ~/Documents/project/肤小宝
git init
git add .
git commit -m "肤小宝 MVP"
git remote add origin https://github.com/你的用户名/肤小宝.git
git push -u origin main
```

### 2. 获取微信小程序上传密钥

去 [微信小程序后台](https://mp.weixin.qq.com/) → 开发管理 → 开发设置 → 小程序代码上传：

- 点「生成」获取上传密钥，下载 `.key` 文件
- 用文本编辑器打开 `.key` 文件，复制全部内容

### 3. 在 GitHub 配置 Secrets

GitHub 仓库 → Settings → Secrets and variables → Actions → New repository secret：

| Name | Value |
|------|-------|
| `WX_APPID` | 你的小程序 AppID（在微信后台「开发管理」里） |
| `WX_PRIVATE_KEY` | 第 2 步复制的 `.key` 文件全部内容 |

### 4. 修改 project.config.json 里的 appid

把 `miniprogram/project.config.json` 中的 `"touristappid"` 改成你的真实 AppID。

---

## 用起来之后

每次 `git push` 到 main 分支，GitHub Actions 自动编译并上传到微信后台。

你也可以手动触发：
- GitHub 仓库 → Actions → 肤小宝 · 微信小程序自动上传 → Run workflow
- 手动触发时可以自定义版本号和版本描述

---

## 流程全景

```
Cloud Studio / 本地编辑器 写代码
           ↓ git push
    GitHub Actions 自动触发
           ↓ miniprogram-ci
    微信小程序后台（体验版）
           ↓ 你在网页后台手动操作
    提交审核 → 审核通过 → 发布上线
```

最后一步提审必须手动，这是微信平台政策。

---

## 如果以后加其他平台

支付宝小程序：加 `minidev` 命令，配 `ALIPAY_APPID` / `ALIPAY_PRIVATE_KEY` secrets。
抖音小程序：加 `tt-ide-cli`，配对应 secrets。

在 `.github/workflows/deploy.yml` 里追加对应 job 即可。