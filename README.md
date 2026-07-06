# personality-star

一个轻量的单页静态网站：星空主题的性格测试（纯前端，Vanilla JS + Canvas）。

本次改进（已提交）：

- 把原来的单文件 index.html 拆分为 index.html、styles.css、script.js，便于维护和扩展。
- 修复了结果映射的问题：显式地把五个维度 (O, C, E, A, N) 映射到 personalities 数组，避免未处理的情况导致默认回退。
- 选项从不可聚焦的 div 改为 button，增加了键盘可访问性（Enter / Space 触发）。
- 题目现在包含每个选项的分值数组（s），更容易定制权重。
- 在结果中把最后一次测验结果保存到 localStorage（键：personality-star:last）。
- 添加 README，说明如何本地运行。

如何运行：

克隆仓库并在本地启动静态服务器：

```bash
git clone https://github.com/hehexiong776/personality-star.git
cd personality-star
python -m http.server 8000
# 在浏览器打开 http://localhost:8000
```

或直接把仓库启用 GitHub Pages（仓库根目录或 gh-pages 分支）。

如果你希望，我可以：
- 把题库拆成 questions.json 并用 fetch 异步加载；
- 创建一个独立的 gh-pages 分支并启用 Pages（需要你的确认）；
- 根据你的偏好调整 trait -> personality 的映射或分值规则（现在在 script.js 的 traitToIndex 和 questions.s 中）。
