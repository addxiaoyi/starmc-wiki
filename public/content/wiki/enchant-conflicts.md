<!--
TITLE: 附魔冲突说明
CATEGORY: 玩家教程
LAST_UPDATED: 2026-04-30
PARENT: 
ICON: ⚔️
-->

# 附魔冲突说明

这页整理了 Enchantio 的附魔冲突关系。简单说，就是有些附魔不能同时装在同一件物品上。

<div class="page-hero-card">

**快速看点**

- 收录当前默认冲突策略下的全部冲突关系
- 冲突是双向的，A 冲突 B，B 也冲突 A
- 既包含自定义附魔冲突，也包含和原版附魔的冲突

</div>

### 目录
- [自定义附魔冲突](#自定义附魔冲突)
- [原版附魔冲突](#原版附魔冲突)
- [查看建议](#查看建议)

---

## 自定义附魔冲突

<div class="conflict-card-grid">

<div class="conflict-card">

### 缓翼 ↔ 安全气囊

- `enchadd:afterglide`
- `enchadd:airbag`

这两个都是鞘翅类保护思路，不能一起装。

</div>

<div class="conflict-card">

### 安全气囊 ↔ 羽护

- `enchadd:airbag`
- `enchadd:wingguard`

同样是飞行保命方向，彼此冲突。

</div>

<div class="conflict-card">

### 屏障 / 壁垒 / 借势 / 回击 / 守护

- `enchadd:barrier`
- `enchadd:bulwark`
- `enchadd:parry`
- `enchadd:riposte`
- `enchadd:ward`

这组盾牌类附魔功能太接近，不能乱叠。

</div>

<div class="conflict-card">

### 斩首 ↔ 处刑者

- `enchadd:beheading`
- `enchadd:executioner`

都是偏击杀收益的附魔，不能共存。

</div>

<div class="conflict-card">

### 束缚 ↔ 齐射

- `enchadd:bind`
- `enchadd:volley`

一个偏控制，一个偏多箭，思路冲突。

</div>

<div class="conflict-card">

### 稳架 ↔ 守护

- `enchadd:brace`
- `enchadd:ward`

都在强化盾牌手感，但不能一起装。

</div>

<div class="conflict-card">

### 壁垒 ↔ 转守 / 回击 / 守护

- `enchadd:bulwark`
- `enchadd:pivot`
- `enchadd:riposte`
- `enchadd:ward`

盾牌防守路线之间会互相抢位置。

</div>

<div class="conflict-card">

### 断首 ↔ 处刑者

- `enchadd:decapitate`
- `enchadd:executioner`

都偏向收割型输出，不能同时装备。

</div>

<div class="conflict-card">

### 闪避 ↔ 侧闪

- `enchadd:evasion`
- `enchadd:sidestep`

都是提升机动和规避，效果重叠。

</div>

<div class="conflict-card">

### 远袭 ↔ 齐射 / 多重射击

- `enchadd:farshot`
- `enchadd:volley`
- `minecraft:multishot`

远程强化路线互相冲突。

</div>

<div class="conflict-card">

### 疾行 ↔ 稳步

- `enchadd:fleetfoot`
- `enchadd:steadfast`

一个偏提速，一个偏稳重，不能同时生效。

</div>

<div class="conflict-card">

### 坚毅 ↔ 绝境

- `enchadd:fortitude`
- `enchadd:last_stand`

都属于硬扛流，位置会互相顶掉。

</div>

<div class="conflict-card">

### 霜刃 ↔ 焦灼

- `enchadd:frostbrand`
- `enchadd:immolate`

冰火路线互斥。

</div>

<div class="conflict-card">

### 固握 ↔ 转守 / 守护

- `enchadd:holdfast`
- `enchadd:pivot`
- `enchadd:ward`

盾牌强控路线之间不能并存。

</div>

<div class="conflict-card">

### 归途 ↔ 侧闪

- `enchadd:homeward`
- `enchadd:sidestep`

都是护腿机动方向，彼此排斥。

</div>

<div class="conflict-card">

### 先机 ↔ 影袭

- `enchadd:initiative`
- `enchadd:shadowstrike`

都偏向先手爆发，不能一起用。

</div>

<div class="conflict-card">

### 抢节奏型盾牌附魔互斥组

- `enchadd:parry`
- `enchadd:pivot`
- `enchadd:riposte`
- `enchadd:ward`

这一组是典型的盾牌核心冲突组。

</div>

<div class="conflict-card">

### 静止 / 定准 / 齐射

- `enchadd:steady_aim`
- `enchadd:stillness`
- `enchadd:volley`

都属于弓箭输出路线，不能一起叠。

</div>

<div class="conflict-card">

### 潮行 ↔ 深海探索者

- `enchadd:tide_runner`
- `minecraft:depth_strider`

水下移动方向会互相冲突。

</div>

<div class="conflict-card">

### 回涡 ↔ 激流

- `enchadd:undertow`
- `minecraft:riptide`

三叉戟投掷路线会互相抢效果。

</div>

</div>

## 原版附魔冲突

<div class="conflict-card-grid">

<div class="conflict-card">

### 斩首 ↔ 抢夺

- `enchadd:beheading`
- `minecraft:looting`

都是击杀收益方向，不能并存。

</div>

<div class="conflict-card">

### 束缚 ↔ 冲击

- `enchadd:bind`
- `minecraft:punch`

一个偏控制，一个偏击退。

</div>

<div class="conflict-card">

### 闪避 ↔ 弹射物保护

- `enchadd:evasion`
- `minecraft:projectile_protection`

都是对远程攻击做防护。

</div>

<div class="conflict-card">

### 霜刃 / 焦灼 ↔ 火焰附加

- `enchadd:frostbrand`
- `enchadd:immolate`
- `minecraft:fire_aspect`

冰火效果和原版火焰附加不能共存。

</div>

<div class="conflict-card">

### 血蚀 ↔ 锋利 / 亡灵杀手 / 节肢杀手

- `enchadd:hemorrhage`
- `minecraft:sharpness`
- `minecraft:smite`
- `minecraft:bane_of_arthropods`

都是近战伤害核心路线，不能叠在一起。

</div>

<div class="conflict-card">

### 致伤 ↔ 力量

- `enchadd:mortal_wound`
- `minecraft:power`

远程压制与原版弓伤害强化会互斥。

</div>

<div class="conflict-card">

### 潮行 ↔ 深海探索者

- `enchadd:tide_runner`
- `minecraft:depth_strider`

水下移动强化只能选一边。

</div>

<div class="conflict-card">

### 回涡 ↔ 激流

- `enchadd:undertow`
- `minecraft:riptide`

三叉戟玩法路线冲突。

</div>

</div>

## 查看建议

- 如果你偏 **PVP**，优先看盾牌、反击和爆发类冲突
- 如果你偏 **生存**，优先看防具、保命和工具类冲突
- 如果你偏 **远程**，先确认弓弩路线是否互斥
- 如果你要混搭装备，最好先看这页再上附魔台

---

*最后更新于: 2026-04-30*
