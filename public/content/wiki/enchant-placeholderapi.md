<!--
TITLE: PlaceholderAPI 变量
CATEGORY: 核心系统
LAST_UPDATED: 2026-04-30
PARENT: enchantments_guide
ICON: 📊
-->

# PlaceholderAPI 变量

如果你的服务器用了计分板、TAB 或其他展示插件，这些附魔变量会很有用。

<div class="page-hero-card">

**快速看点**

- 把附魔数据直接展示到计分板或 HUD
- 适合做排行榜、总览和信息面板
- 想做附魔展示页，这些变量很实用

</div>

### 快速目录
- [`%enchadd_count%`](#enchadd_count)
- [`%enchadd_top_trigger%`](#enchadd_top_trigger)
- [`%enchadd_maxlevel_<key>%`](#enchadd_maxlevel_key)
- [`%enchadd_weight_<key>%`](#enchadd_weight_key)
- [怎么用](#怎么用)

---

## `%enchadd_count%`

显示当前附魔总数。

- 适合做总览面板
- 可以让玩家一眼看到当前服务器有多少自定义附魔

## `%enchadd_top_trigger%`

显示触发最活跃、最常被统计到的附魔信息。

- 适合做排行榜或热门附魔展示
- 可以用来告诉玩家“大家现在最爱玩什么”

## `%enchadd_maxlevel_<key>%`

显示某个附魔的最高等级。

- 把 `<key>` 换成实际 key
- 例如：`%enchadd_maxlevel_telepathy%`
- 适合在说明面板里显示等级上限

## `%enchadd_weight_<key>%`

显示某个附魔的权重。

- 权重越高，通常越常见或越容易进入相关池子
- 适合给玩家做稀有度参考

## 怎么用

这些变量一般可以接到：

- 计分板
- TAB 列表
- HUD 展示
- 数据看板

如果你希望做一个“附魔百科小面板”，这些变量就很适合拿来拼图。

---

*最后更新于: 2026-04-30*
