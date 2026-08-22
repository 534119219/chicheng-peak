window.__ModuleLoader__.load({
  id: "chicheng-peak",
  factory: (require) => {
    var module = { exports: {} };
    var exports = module.exports;
    Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
    var React = require("react");
    var primitives = require("@deepseek-ai/dsh-client-ui-primitives");

    var createElement = React.createElement;
    var useState = React.useState;
    var useEffect = React.useEffect;
    var useCallback = React.useCallback;
    var useMemo = React.useMemo;
    var useRef = React.useRef;

    var Button = primitives.Button;
    var StateDot = primitives.StateDot;
    var IconRefreshOutline16 = primitives.IconRefreshOutline16;

    var NS = "chicheng-peak";

    var zh = {
      nav: "峰谷提醒",
      title: "峰谷提醒",
      intro: "依据 DeepSeek 官方峰谷定价时段自动判定当前处于高峰期还是低峰期：高峰（09:00–12:00、14:00–18:00）在页面边缘显示橙色呼吸边框，低峰期显示蓝色；还可在转折前通过消息推送渠道发送提醒。",
      statusTitle: "当前状态",
      statusDesc: "实时阶段、下一次转折时间与手动覆盖。",
      loading: "加载中…",
      loadFail: "加载失败，请重试",
      nowPeak: "当前：高峰期",
      nowValley: "当前：低峰期",
      nextTransition: "下一转折",
      nextPeak: "→ 高峰期",
      nextValley: "→ 低峰期",
      soon: "即将",
      overrideAuto: "自动判定",
      overridePeak: "强制高峰",
      overrideValley: "强制低峰",
      overrideDesc: "临时覆盖自动判定，用于预览效果。",
      windowsTitle: "高峰时段设置",
      windowsDesc: "默认采用官方时段（2026-08-17 起生效）。可自由增删改，其余时间自动视为低峰期。",
      timezone: "时区",
      addWindow: "添加高峰时段",
      windowStart: "开始",
      windowEnd: "结束",
      remove: "移除",
      restoreOfficial: "恢复官方默认",
      invalidWindow: "结束时间必须晚于开始时间，已忽略无效时段",
      edgeTitle: "边框外观",
      edgeDesc: "页面边缘呼吸边框：高峰橙、低峰蓝。颜色、宽度、呼吸与流光均可调节，改动即时生效。",
      edgeEnabled: "启用边框效果",
      peakColor: "高峰期颜色",
      valleyColor: "低峰期颜色",
      width: "边框宽度",
      glow: "光晕强度",
      opacity: "不透明度",
      animation: "呼吸动画",
      animBreathing: "呼吸",
      animSolid: "常亮",
      animOff: "无动画",
      breathingSpeed: "呼吸频率（秒/周期）",
      edgeGlowDir: "光效方向（页面边缘）",
      glowIn: "向内",
      glowOut: "向外",
      composerBorder: "输入框边框效果",
      composerBorderHelp: "输入框同样显示高峰/低峰颜色边框与呼吸、流光光效（颜色、宽度、动画与页面边缘一致）",
      composerGlowDir: "光效方向（输入框）",
      flow: "流光效果",
      flowSpeed: "流光速度（秒/圈）",
      badge: "显示状态角标",
      preview: "预览",
      notifyTitle: "本地通知",
      notifyDesc: "浏览器系统通知：页面打开时，转折或提醒触发时弹窗提醒。",
      notifyEnabled: "启用本地通知",
      notifyTransition: "阶段转折时通知",
      notifyReminder: "托管提醒触发时通知",
      requestPermission: "请求通知权限",
      permissionGranted: "已授权",
      permissionDenied: "已被拒绝，请在浏览器站点设置中开启",
      permissionDefault: "尚未授权",
      testNotify: "发送测试通知",
      reminderTitle: "消息推送提醒",
      reminderDesc: "到达高峰/低峰前（或到达时），通过推送渠道发送自定义标题与内容的提醒。托管调度由服务端执行，页面关闭也能送达。",
      peakReminder: "高峰期提醒",
      valleyReminder: "低峰期提醒",
      reminderEnabled: "启用提醒",
      lead: "提前提醒",
      lead0: "准时（到达时）",
      leadN: "提前 {n} 分钟",
      channel: "推送渠道",
      channelAll: "全部渠道",
      titleLabel: "标题模板",
      contentLabel: "内容模板",
      extraTimes: "额外固定时间（可选）",
      extraTimesHint: "HH:MM，多个用逗号分隔；仅在该阶段进行中触发",
      templateHint: "可用变量：{phase} 阶段、{start} 开始、{end} 结束、{time} 当前时间、{date} 日期、{hour} 时、{minute} 分",
      testSend: "发送测试",
      testing: "发送中…",
      testOk: "发送成功",
      testFail: "发送失败",
      fireNow: "立即触发一次",
      lastResult: "最近结果",
      pushed: "已推送",
      notEnabled: "未启用",
      saveOk: "已保存",
      saveFail: "保存失败",
      resetEdge: "恢复默认外观",
      resetWindows: "恢复官方时段",
      resetNotify: "恢复默认",
      resetReminders: "恢复默认",
      aboutTitle: "关于",
      aboutDesc: "官方时段（北京时间）：高峰 09:00–12:00、14:00–18:00；其余为低峰（空闲）时段，API 价格为高峰约一半（2026-08-17 生效）。插件按此时段自动判定并驱动边框与提醒。配置存储于 $DSH_HOME/peakvalley/。",
      refetch: "刷新",
      saving: "保存中…",
    };

    var en = {
      nav: "Peak / Valley",
      title: "Peak / Valley Reminder",
      intro: "Tracks DeepSeek official peak/valley pricing windows (peak 09:00–12:00 & 14:00–18:00): an orange breathing border wraps the page during peak hours, blue during valley hours. Optional push-channel reminders fire before each transition.",
      statusTitle: "Current Status",
      statusDesc: "Live phase, next transition and manual override.",
      loading: "Loading…",
      loadFail: "Failed to load, retry",
      nowPeak: "Now: Peak hours",
      nowValley: "Now: Valley hours",
      nextTransition: "Next transition",
      nextPeak: "→ Peak",
      nextValley: "→ Valley",
      soon: "soon",
      overrideAuto: "Auto",
      overridePeak: "Force peak",
      overrideValley: "Force valley",
      overrideDesc: "Temporarily override detection to preview the effect.",
      windowsTitle: "Peak Windows",
      windowsDesc: "Defaults to the official schedule (effective 2026-08-17). Everything else counts as valley.",
      timezone: "Time zone",
      addWindow: "Add peak window",
      windowStart: "Start",
      windowEnd: "End",
      remove: "Remove",
      restoreOfficial: "Restore official",
      invalidWindow: "End must be later than start; invalid rows were ignored",
      edgeTitle: "Border Appearance",
      edgeDesc: "Edge breathing border: orange on peak, blue on valley. All knobs apply live.",
      edgeEnabled: "Enable border",
      peakColor: "Peak color",
      valleyColor: "Valley color",
      width: "Border width",
      glow: "Glow strength",
      opacity: "Opacity",
      animation: "Breathing",
      animBreathing: "Breathing",
      animSolid: "Solid",
      animOff: "None",
      breathingSpeed: "Breath period (s)",
      edgeGlowDir: "Glow direction (page edge)",
      glowIn: "Inward",
      glowOut: "Outward",
      composerBorder: "Composer border",
      composerBorderHelp: "The input box wears the same phase-colored border with breathing/flow glow (colors, width and animation follow the page edge).",
      composerGlowDir: "Glow direction (composer)",
      flow: "Flowing light",
      flowSpeed: "Flow speed (s/rev)",
      badge: "Corner status badge",
      preview: "Preview",
      notifyTitle: "Local Notifications",
      notifyDesc: "Browser notifications while the page is open.",
      notifyEnabled: "Enable local notifications",
      notifyTransition: "Notify on phase transition",
      notifyReminder: "Notify when a managed reminder fires",
      requestPermission: "Grant permission",
      permissionGranted: "Granted",
      permissionDenied: "Denied — enable in the browser site settings",
      permissionDefault: "Not granted yet",
      testNotify: "Send test notification",
      reminderTitle: "Push Reminders",
      reminderDesc: "Send a reminder before (or exactly at) each transition through push channels / messaging platforms. Scheduling runs server-side; it fires even with the page closed.",
      peakReminder: "Peak reminder",
      valleyReminder: "Valley reminder",
      reminderEnabled: "Enable",
      lead: "Lead time",
      lead0: "At the transition",
      leadN: "{n} minutes before",
      channel: "Channel",
      channelAll: "All channels",
      titleLabel: "Title template",
      contentLabel: "Content template",
      extraTimes: "Extra daily times (optional)",
      extraTimesHint: "HH:MM, comma separated; fires only while that phase is active",
      templateHint: "Variables: {phase} phase, {start} start, {end} end, {time} now, {date} date, {hour} hour, {minute} minute",
      testSend: "Send test",
      testing: "Sending…",
      testOk: "Sent",
      testFail: "Failed",
      fireNow: "Fire now",
      lastResult: "Last result",
      pushed: "Pushed",
      notEnabled: "Not enabled",
      saveOk: "Saved",
      saveFail: "Save failed",
      resetEdge: "Reset appearance",
      resetWindows: "Restore official",
      resetNotify: "Reset",
      resetReminders: "Reset",
      aboutTitle: "About",
      aboutDesc: "Official windows (Beijing time): peak 09:00–12:00 & 14:00–18:00; the rest is valley (off-peak, roughly half price) — effective 2026-08-17. Config lives in $DSH_HOME/peakvalley/.",
      refetch: "Refresh",
      saving: "Saving…",
    };

    // ============================================================ api helper

    function api(method, payload) {
      return fetch("/peakvalley/api/" + method, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload || {}),
        credentials: "same-origin",
      }).then(function (res) { return res.json(); }).then(function (body) {
        if (!body || body.ok !== true) {
          var msg = body && body.error && body.error.message ? body.error.message : "api error";
          var err = new Error(msg);
          err.code = body && body.error && body.error.code ? body.error.code : "api-error";
          throw err;
        }
        return body.value;
      });
    }

    // ============================================================ styles
    // (token-driven, same vocabulary as the settings shell — adapts to theme)

    var sectionStyle = { flexDirection: "column", gap: "14px", width: "100%", display: "flex" };
    var headStyle = { display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "12px", padding: "2px 2px 0" };
    var titleStyle = { fontSize: 16, fontWeight: 600, color: "var(--dsw-alias-label-primary)", lineHeight: 1.4 };
    var introStyle = { fontSize: 13, color: "var(--dsw-alias-label-secondary)", lineHeight: 1.6, marginTop: "4px", maxWidth: "760px" };
    var cardStyle = { boxSizing: "border-box", border: "1px solid var(--dsw-alias-border-l2)", background: "var(--dsw-alias-bg-layer-3)", borderRadius: "14px", flexDirection: "column", gap: "10px", padding: "14px 16px", display: "flex" };
    var cardTitleStyle = { fontSize: 14, fontWeight: 600, color: "var(--dsw-alias-label-primary)", lineHeight: 1.4 };
    var cardDescStyle = { fontSize: 12, color: "var(--dsw-alias-label-secondary)", lineHeight: 1.55 };
    var rowStyle = { display: "flex", alignItems: "center", gap: "10px", padding: "4px 0" };
    var labelStyle = { display: "flex", flexDirection: "column", gap: "2px", flex: 1, minWidth: 0 };
    var nameStyle = { fontWeight: 500, color: "var(--dsw-alias-label-primary)", fontSize: 13, lineHeight: 1.4 };
    var helpStyle = { fontSize: 12, color: "var(--dsw-alias-label-tertiary)", lineHeight: 1.5 };
    var textInputStyle = { width: "100%", boxSizing: "border-box", padding: "7px 10px", borderRadius: "8px", border: "1px solid var(--dsw-alias-border-l2)", background: "var(--dsw-alias-bg-layer-2)", color: "var(--dsw-alias-label-primary)", fontSize: "13px", outline: "none", fontFamily: "inherit" };
    var textareaStyle = Object.assign({}, textInputStyle, { minHeight: "72px", resize: "vertical" });
    var selectStyle = Object.assign({}, textInputStyle, { cursor: "pointer" });
    var checkboxStyle = { width: 16, height: 16, cursor: "pointer", accentColor: "var(--dsw-alias-brand-primary)", flex: "none" };
    var msgOkStyle = { fontSize: 12, color: "var(--dsw-alias-state-success-primary)", lineHeight: 1.5, wordBreak: "break-all" };
    var msgErrStyle = { fontSize: 12, color: "var(--dsw-alias-state-error-primary)", lineHeight: 1.5, wordBreak: "break-all" };
    var msgMutedStyle = { fontSize: 12, color: "var(--dsw-alias-label-tertiary)", lineHeight: 1.5, wordBreak: "break-all" };
    var pillStyle = { display: "inline-flex", alignItems: "center", gap: "6px", borderRadius: "999px", padding: "3px 10px", fontSize: 13, fontWeight: 600, lineHeight: 1.6 };
    var rangeStyle = { flex: "none", width: 220, accentColor: "var(--dsw-alias-brand-primary)", cursor: "pointer" };
    var valueTagStyle = { flex: "none", minWidth: 52, textAlign: "right", fontSize: 12, color: "var(--dsw-alias-label-secondary)", fontVariantNumeric: "tabular-nums" };

    // ============================================================ runtime + overlay engine

    var OVERLAY_ID = "dsh-pv-overlay";
    var STYLE_ID = "dsh-pv-overlay-style";

    var runtime = {
      status: null,
      listeners: [],
      timer: null,
      lastPhase: null,
      lastPeakFired: null,
      lastValleyFired: null,
      subscribe: function (fn) {
        runtime.listeners.push(fn);
        return function () {
          runtime.listeners = runtime.listeners.filter(function (f) { return f !== fn; });
        };
      },
      publish: function () {
        var fns = runtime.listeners.slice();
        for (var i = 0; i < fns.length; i += 1) {
          try { fns[i](runtime.status); } catch (e) { /* listener must not break the loop */ }
        }
      },
      poll: function () {
        api("status").then(function (s) {
          runtime.status = s;
          applyOverlay(s);
          runtime.detectLocalNotifications(s, true);
          runtime.publish();
          try { console.info("[chicheng-peak] status:", s.phase, s.edge && s.edge.enabled ? "edge-on" : "edge-off"); } catch (e) { /* ignore */ }
        }).catch(function () {
          hideOverlay();
          try { console.warn("[chicheng-peak] status fetch failed"); } catch (e) { /* ignore */ }
        });
      },
      refreshNow: function () { runtime.poll(); },
      start: function () {
        if (runtime.timer !== null) return;
        runtime.poll();
        var tick = function () {
          var secs = (runtime.status && runtime.status.pollSeconds) || 15;
          runtime.refreshNow();
          runtime.timer = setTimeout(tick, Math.max(5, Math.min(120, secs)) * 1000);
        };
        runtime.timer = setTimeout(tick, 15000);
        var onVis = function () {
          if (document.visibilityState === "visible") runtime.refreshNow();
        };
        document.addEventListener("visibilitychange", onVis);
        runtime._visHandler = onVis;
        var onResize = function () {
          repositionDynamic();
        };
        window.addEventListener("resize", onResize);
        runtime._resizeHandler = onResize;
        var onScroll = function () {
          repositionDynamic();
        };
        window.addEventListener("scroll", onScroll, true);
        document.addEventListener("scroll", onScroll, true);
        runtime._scrollHandler = onScroll;
        var onInput = function () {
          repositionDynamic();
        };
        document.addEventListener("input", onInput, true);
        runtime._inputHandler = onInput;
        // Re-place the badge when the mobile keyboard opens/closes: the
        // visualViewport resizes/scrolls and the composer gains/loses focus.
        var onFocusChange = function () {
          repositionDynamic();
        };
        document.addEventListener("focusin", onFocusChange);
        document.addEventListener("focusout", onFocusChange);
        runtime._focusHandler = onFocusChange;
        var vv = window.visualViewport || null;
        if (vv) {
          vv.addEventListener("resize", onResize);
          vv.addEventListener("scroll", onResize);
        }
        runtime._vv = vv;
        runtime._vvHandler = onResize;
      },
      stop: function () {
        if (runtime.timer !== null) { clearTimeout(runtime.timer); runtime.timer = null; }
        if (runtime._visHandler) { document.removeEventListener("visibilitychange", runtime._visHandler); runtime._visHandler = null; }
        if (runtime._resizeHandler) { window.removeEventListener("resize", runtime._resizeHandler); runtime._resizeHandler = null; }
        if (runtime._scrollHandler) {
          window.removeEventListener("scroll", runtime._scrollHandler, true);
          document.removeEventListener("scroll", runtime._scrollHandler, true);
          runtime._scrollHandler = null;
        }
        if (runtime._inputHandler) {
          document.removeEventListener("input", runtime._inputHandler, true);
          runtime._inputHandler = null;
        }
        if (runtime._composerRO) {
          try { runtime._composerRO.disconnect(); } catch (e2) { /* ignore */ }
          runtime._composerRO = null;
          runtime._composerObserved = null;
        }
        if (runtime._focusHandler) {
          document.removeEventListener("focusin", runtime._focusHandler);
          document.removeEventListener("focusout", runtime._focusHandler);
          runtime._focusHandler = null;
        }
        if (runtime._vv && runtime._vvHandler) {
          runtime._vv.removeEventListener("resize", runtime._vvHandler);
          runtime._vv.removeEventListener("scroll", runtime._vvHandler);
          runtime._vv = null;
          runtime._vvHandler = null;
        }
        hideOverlay(true);
        runtime.status = null;
        runtime.listeners = [];
      },
      /** Apply edge settings locally (live preview while tuning). */
      previewEdge: function (edge, phase) {
        var s = runtime.status;
        if (!s) return;
        applyOverlay({ ...s, edge: edge, phase: phase || s.phase }, true);
      },
      detectLocalNotifications: function (s, fromPoll) {
        if (!s.localNotify || !s.localNotify.enabled) return;
        var title = "";
        var body = "";
        if (s.localNotify.onTransition !== false && s.phase && runtime.lastPhase !== null && s.phase !== runtime.lastPhase) {
          var isPeakNow = s.phase === "peak";
          title = isPeakNow ? "DeepSeek 高峰期开始" : "DeepSeek 低峰期开始";
          body = isPeakNow ? "当前为高峰期（09:00–12:00 / 14:00–18:00）" : "当前为低峰期（空闲时段）";
          if (!fromPoll) {
            // forced poll after saving/opening settings — still notify
          }
        } else if (s.localNotify.onReminder === true) {
          var pk = s.reminders && s.reminders.peak ? s.reminders.peak.lastFiredAt : null;
          var vl = s.reminders && s.reminders.valley ? s.reminders.valley.lastFiredAt : null;
          if (pk && pk !== runtime.lastPeakFired) {
            title = (s.reminders.peak.title || "高峰期提醒");
            body = "已通过推送渠道发送高峰期提醒";
          } else if (vl && vl !== runtime.lastValleyFired) {
            title = (s.reminders.valley.title || "低峰期提醒");
            body = "已通过推送渠道发送低峰期提醒";
          }
        }
        runtime.lastPhase = s.phase;
        runtime.lastPeakFired = s.reminders && s.reminders.peak ? s.reminders.peak.lastFiredAt : null;
        runtime.lastValleyFired = s.reminders && s.reminders.valley ? s.reminders.valley.lastFiredAt : null;
        if (title !== "") sendLocalNotification(title, body);
      },
    };

    function localNotificationSupported() {
      return typeof window !== "undefined" && "Notification" in window;
    }

    function sendLocalNotification(title, body) {
      if (!localNotificationSupported()) return;
      if (Notification.permission !== "granted") return;
      try {
        new Notification(String(title), { body: String(body), tag: "chicheng-peak", silent: false });
      } catch (e) { /* ignore */ }
    }

    // ---- overlay DOM

    var overlayEls = null;

    function overlayElements() {
      if (overlayEls && document.getElementById(OVERLAY_ID)) return overlayEls;
      var root = document.createElement("div");
      root.id = OVERLAY_ID;
      root.setAttribute("aria-hidden", "true");
      root.style.cssText = "position:fixed;inset:0;pointer-events:none;z-index:30;opacity:0;transition:opacity .3s ease;visibility:hidden;";
      var ring = document.createElement("div");
      ring.id = "dsh-pv-ring";
      ring.style.cssText = "position:absolute;inset:0;border-radius:0;box-sizing:border-box;";
      var comet1 = document.createElement("div");
      comet1.id = "dsh-pv-comet-1";
      comet1.style.cssText = "position:absolute;width:26px;height:26px;border-radius:999px;pointer-events:none;offset-path:inset(0px round 2px);offset-rotate:0deg;";
      var comet2 = document.createElement("div");
      comet2.id = "dsh-pv-comet-2";
      comet2.style.cssText = "position:absolute;width:20px;height:20px;border-radius:999px;pointer-events:none;offset-path:inset(0px round 2px);offset-rotate:0deg;";
      var badge = document.createElement("div");
      badge.id = "dsh-pv-badge";
      // positioning/visibility live in the injected stylesheet so the mobile
      // media query can move it above the composer (see ensureStyleEl)
      var cring = document.createElement("div");
      cring.id = "dsh-pv-composer-ring";
      cring.style.cssText = "position:fixed;pointer-events:none;box-sizing:border-box;visibility:hidden;z-index:30;";
      var ccomet1 = document.createElement("div");
      ccomet1.id = "dsh-pv-composer-comet-1";
      ccomet1.style.cssText = "position:absolute;inset:0;width:22px;height:22px;border-radius:999px;pointer-events:none;offset-rotate:0deg;visibility:hidden;";
      var ccomet2 = document.createElement("div");
      ccomet2.id = "dsh-pv-composer-comet-2";
      ccomet2.style.cssText = "position:absolute;inset:0;width:16px;height:16px;border-radius:999px;pointer-events:none;offset-rotate:0deg;visibility:hidden;";
      cring.appendChild(ccomet1);
      cring.appendChild(ccomet2);
      root.appendChild(ring);
      root.appendChild(comet1);
      root.appendChild(comet2);
      document.documentElement.appendChild(root);
      document.documentElement.appendChild(badge);
      document.documentElement.appendChild(cring);
      overlayEls = { root: root, ring: ring, comet1: comet1, comet2: comet2, badge: badge, cring: cring, ccomet1: ccomet1, ccomet2: ccomet2, styleEl: null };
      return overlayEls;
    }

    function ensureStyleEl() {
      var existing = document.getElementById(STYLE_ID);
      if (existing) return existing;
      var style = document.createElement("style");
      style.id = STYLE_ID;
      style.textContent = [
        "@keyframes dsh-pv-breathe-in{0%,100%{box-shadow:inset 0 0 var(--dsh-pv-glow-lo,10px) var(--dsh-pv-color,#f97316)}50%{box-shadow:inset 0 0 var(--dsh-pv-glow,22px) var(--dsh-pv-color,#f97316)}}",
        "@keyframes dsh-pv-breathe-out{0%,100%{box-shadow:0 0 var(--dsh-pv-glow-lo,10px) var(--dsh-pv-color,#f97316)}50%{box-shadow:0 0 var(--dsh-pv-glow,22px) var(--dsh-pv-color,#f97316)}}",
        "@keyframes dsh-pv-orbit{from{offset-distance:0%}to{offset-distance:100%}}",
        "#dsh-pv-comet-1,#dsh-pv-comet-2{visibility:hidden}",
        "#dsh-pv-badge{position:fixed;right:18px;bottom:18px;display:inline-flex;align-items:center;gap:6px;border-radius:999px;padding:5px 12px;font-size:12px;font-weight:600;line-height:1.5;box-shadow:0 2px 12px rgba(0,0,0,.25);backdrop-filter:blur(6px);z-index:30;visibility:hidden}",
        "@media (max-width:768px),(hover:none) and (pointer:coarse){#dsh-pv-badge{right:12px;bottom:calc(env(safe-area-inset-bottom,0px) + 96px)}}",
      ].join("\n");
      document.head.appendChild(style);
      return style;
    }

    function hideOverlay(force) {
      var el = document.getElementById(OVERLAY_ID);
      if (el) {
        el.style.opacity = "0";
        el.style.visibility = "hidden";
      }
      var badge = document.getElementById("dsh-pv-badge");
      if (badge) { badge.style.opacity = "0"; badge.style.visibility = "hidden"; }
      var cring = document.getElementById("dsh-pv-composer-ring");
      if (cring) { cring.style.opacity = "0"; cring.style.visibility = "hidden"; }
      runtime._previewing = false;
    }

    /** True on phones/tablets (narrow viewport or coarse pointer). */
    function isMobileish() {
      try {
        if (typeof window.matchMedia !== "function") return false;
        return window.matchMedia("(max-width: 768px)").matches ||
          window.matchMedia("(hover: none) and (pointer: coarse)").matches;
      } catch (e) {
        return false;
      }
    }

    /** Find the chat composer input. `preferActive` (badge) prefers the focused
     *  input; the border overlay must follow the composer regardless of focus,
     *  so it picks the lowest visible input-like element. */
    function findComposer(preferActive) {
      try {
        var vv = window.visualViewport || null;
        var vh = vv ? vv.height : window.innerHeight;
        var active = document.activeElement;
        if (preferActive !== false && active && (active.tagName === "TEXTAREA" || active.tagName === "INPUT" || active.isContentEditable)) {
          var ar = active.getBoundingClientRect();
          if (ar && ar.width >= 40 && ar.height >= 16 && ar.top >= 0 && ar.bottom <= vh) {
            return active;
          }
        }
        var nodes = document.querySelectorAll('main textarea, main input[type="text"], main [contenteditable="true"], textarea');
        var best = null;
        for (var i = 0; i < nodes.length; i += 1) {
          var n = nodes[i];
          var r = n.getBoundingClientRect();
          if (!r || r.width < 40 || r.height < 16) continue;
          if (r.top < 0 || r.bottom > vh) continue; // must be fully visible
          var score = n.tagName === "TEXTAREA" ? 2 : n.tagName === "INPUT" ? 1 : 0;
          if (best === null || score > best.score || (score === best.score && r.bottom > best.bottom)) {
            best = { el: n, bottom: r.bottom, score: score };
          }
        }
        return best ? best.el : null;
      } catch (e) {
        return null;
      }
    }

    /** Climb from the textarea to the composer CONTAINER — the rounded control
     *  that holds the input plus the toolbar/send row. Candidates must fully
     *  contain the textarea; selection uses the ABSOLUTE extra height over the
     *  input (stable while the textarea auto-grows, unlike a height ratio):
     *   1. keyword hit (word-boundary composer/input/askbar/command/sendbar/
     *      chat-input/message-input/toolbar — "sidebar" never matches) adding
     *      ≥ 14px;
     *   2. any ancestor adding ≥ 26px (a toolbar/send row) — no keyword needed;
     *   3. any wrapper adding ≥ 8px;
     *   oversized ancestors (>320px extra) are rejected; otherwise null and
     *   callers fall back to the input itself. */
    function findComposerBox(input) {
      if (!input || !input.parentElement) return null;
      var tR = input.getBoundingClientRect();
      if (!tR || tR.height <= 0) return null;
      var candidates = [];
      var node = input.parentElement;
      for (var hops = 0; node && hops < 10; hops += 1) {
        if (node === document.body || node === document.documentElement) break;
        var r = node.getBoundingClientRect();
        if (!r || r.width <= 0 || r.height <= 0) { node = node.parentElement; continue; }
        var contains = r.left <= tR.left + 4 && r.right >= tR.right - 4 &&
          r.top <= tR.top + 4 && r.bottom >= tR.bottom - 4;
        if (!contains) { node = node.parentElement; continue; }
        var name = "";
        try {
          name = ((node.getAttribute && (node.getAttribute("data-testid") || node.getAttribute("data-role") || node.getAttribute("aria-label"))) || "") + " " +
            (typeof node.className === "string" ? node.className : "") + " " + (node.id || "");
        } catch (e) { name = ""; }
        var kw = /\b(composer|input|askbar|ask-bar|command|sendbar|send-box|chat-input|message-input|toolbar)\b/i.test(name);
        candidates.push({ node: node, extraH: r.height - tR.height, kw: kw });
        node = node.parentElement;
      }
      var MAX_EXTRA = 320;
      for (var i = 0; i < candidates.length; i += 1) {
        var c = candidates[i];
        if (c.kw && c.extraH >= 14 && c.extraH <= MAX_EXTRA) return c.node;
      }
      for (var j = 0; j < candidates.length; j += 1) {
        var c2 = candidates[j];
        if (c2.extraH >= 26 && c2.extraH <= MAX_EXTRA) return c2.node;
      }
      for (var k = 0; k < candidates.length; k += 1) {
        var c3 = candidates[k];
        if (c3.extraH >= 8 && c3.extraH <= MAX_EXTRA) return c3.node;
      }
      return null;
    }

    /**
     * Mobile: pin the badge to the composer's TOP-RIGHT corner — right edge
     * flush with the input's right edge, sitting a gap above its top. Runs on
     * every poll and on keyboard/viewport/focus events, so it tracks the input
     * when the IME pops up or collapses.
     */
    function placeBadgeAboveComposer(badge) {
      if (!badge) return;
      if (!isMobileish()) {
        badge.style.bottom = "";
        badge.style.right = "";
        return;
      }
      try {
        var el = findComposer(true);
        if (!el) { badge.style.bottom = ""; badge.style.right = ""; return; }
        var box = findComposerBox(el) || el;
        var r = box.getBoundingClientRect();
        if (!r || r.height <= 0) { badge.style.bottom = ""; badge.style.right = ""; return; }
        var GAP = 16;
        // position:fixed offsets are relative to the LAYOUT viewport, so use
        // window.innerWidth/Height directly (visual-viewport terms cancel).
        badge.style.bottom = Math.max(10, Math.round(window.innerHeight - r.top + GAP)) + "px";
        badge.style.right = Math.max(4, Math.round(window.innerWidth - r.right)) + "px";
      } catch (e) { /* ignore */ }
    }

    /**
     * Composer border: the composer CONTROL (input box incl. its toolbar/send
     * row) wears the same phase-colored breathing border as the page edge,
     * with its own glow direction. Re-positioned on every poll and on
     * scroll/resize/focus events so it hugs the control even while the mobile
     * keyboard animates.
     */
    function updateComposerRing(s, edge, color, glow, opacity, speed, w) {
      try {
        var els = overlayEls;
        if (!els || !els.cring) return;
        var cring = els.cring;
        var on = s && s.enabled && edge && edge.enabled !== false &&
          (edge.composer === undefined || edge.composer.enabled !== false);
        if (!on) {
          cring.style.visibility = "hidden";
          return;
        }
        var el = findComposer(false);
        if (!el) {
          cring.style.visibility = "hidden";
          return;
        }
        keepComposerObserved(el);
        var box = findComposerBox(el) || el;
        var r = box.getBoundingClientRect();
        if (!r || r.width < 40 || r.height < 16 || r.height <= 0) {
          cring.style.visibility = "hidden";
          return;
        }
        var radius = "12px";
        try {
          var cs = window.getComputedStyle ? window.getComputedStyle(box).borderRadius : "";
          if (cs && cs !== "0px" && cs !== "") radius = cs;
        } catch (e2) { /* keep default */ }
        var radiusPx = parseFloat(radius) || 12;

        cring.style.visibility = "visible";
        cring.style.left = Math.round(r.left) + "px";
        cring.style.top = Math.round(r.top) + "px";
        cring.style.width = Math.round(r.width) + "px";
        cring.style.height = Math.round(r.height) + "px";
        cring.style.borderRadius = radius;
        cring.style.border = w + "px solid " + color;
        cring.style.opacity = String(opacity);
        cring.style.setProperty("--dsh-pv-color", color);
        cring.style.setProperty("--dsh-pv-glow", glow + "px");
        cring.style.setProperty("--dsh-pv-glow-lo", Math.max(2, Math.round(glow * 0.45)) + "px");

        var compDir = edge.composer && edge.composer.glowDirection === "out" ? "out" : "in";
        if (edge.animation === "breathing") {
          cring.style.animation = "dsh-pv-breathe-" + compDir + " " + speed + "s ease-in-out infinite";
        } else {
          cring.style.animation = "none";
          cring.style.boxShadow = edge.animation === "solid"
            ? (compDir === "out" ? "0 0 " : "inset 0 0 ") + glow + "px " + color
            : "none";
        }

        var cc1 = els.ccomet1;
        var cc2 = els.ccomet2;
        if (edge.flow === true) {
          var fs = Number(edge.flowSpeed) || 6;
          var path = "inset(0px round " + radiusPx + "px)";
          cc1.style.visibility = "visible";
          cc1.style.offsetPath = path;
          cc1.style.animation = "dsh-pv-orbit " + fs + "s linear infinite";
          cc1.style.background = "radial-gradient(circle, rgba(255,255,255,.95) 0%, " + color + " 32%, transparent 68%)";
          cc1.style.boxShadow = "0 0 10px " + color;
          cc2.style.visibility = "visible";
          cc2.style.offsetPath = path;
          cc2.style.animation = "dsh-pv-orbit " + fs + "s linear infinite";
          cc2.style.animationDelay = "-" + (fs / 2) + "s";
          cc2.style.background = "radial-gradient(circle, rgba(255,255,255,.8) 0%, " + color + "88 30%, transparent 62%)";
          cc2.style.boxShadow = "0 0 8px " + color + "aa";
        } else {
          cc1.style.visibility = "hidden";
          cc2.style.visibility = "hidden";
          cc1.style.animation = "none";
          cc2.style.animation = "none";
        }
      } catch (e) {
        try { if (overlayEls && overlayEls.cring) overlayEls.cring.style.visibility = "hidden"; } catch (e3) { /* ignore */ }
      }
    }

    /** Track the input element so auto-growing textareas re-measure the ring. */
    function keepComposerObserved(el) {
      try {
        if (typeof ResizeObserver === "undefined") return;
        if (!runtime._composerRO) {
          runtime._composerRO = new ResizeObserver(function () { repositionDynamic(); });
        }
        if (runtime._composerObserved === el) return;
        runtime._composerRO.disconnect();
        runtime._composerRO.observe(el);
        runtime._composerObserved = el;
      } catch (e) { /* ignore */ }
    }

    /** Re-position everything that follows the composer (badge + border ring)
     *  from the last known status. Called on scroll/resize/focus events. */
    function repositionDynamic() {
      var s = runtime.status;
      if (!s || !overlayEls) return;
      try {
        placeBadgeAboveComposer(overlayEls.badge);
        if (s.edge) {
          var edge = s.edge;
          var color = s.phase === "peak" ? edge.peakColor : edge.valleyColor;
          updateComposerRing(s, edge, color,
            Math.max(0, Number(edge.glow) || 0),
            Math.min(1, Math.max(0.2, Number(edge.opacity) || 0.95)),
            Number(edge.breathingSpeed) || 2.6,
            Math.min(14, Math.max(1, Number(edge.width) || 3)));
        }
      } catch (e) { /* ignore */ }
    }

    function applyOverlay(s, isPreview) {
      if (!s || !s.enabled || !s.edge || !s.edge.enabled) {
        hideOverlay();
        return;
      }
      try {
        var els = overlayElements();
        var styleEl = ensureStyleEl();
        var edge = s.edge;
        var color = s.phase === "peak" ? edge.peakColor : edge.valleyColor;
        var glow = Math.max(0, Number(edge.glow) || 0);
        var opacity = Math.min(1, Math.max(0.2, Number(edge.opacity) || 0.95));
        var speed = Number(edge.breathingSpeed) || 2.6;
        var w = Math.min(14, Math.max(1, Number(edge.width) || 3));

        els.root.style.visibility = "visible";
        els.root.style.opacity = "1";
        els.root.style.setProperty("--dsh-pv-color", color);
        els.root.style.setProperty("--dsh-pv-glow", glow + "px");
        els.root.style.setProperty("--dsh-pv-glow-lo", Math.max(2, Math.round(glow * 0.45)) + "px");
        els.root.style.setProperty("--dsh-pv-op-hi", String(opacity));
        els.root.style.setProperty("--dsh-pv-op-lo", String(Math.max(0.15, opacity * 0.5).toFixed(2)));

        var ring = els.ring;
        ring.style.border = w + "px solid " + color;
        ring.style.opacity = String(opacity);
        var glowDir = edge.glowDirection === "out" ? "out" : "in";
        if (edge.animation === "breathing") {
          // breathing glow breathes on the inner (or outer) edge of the border
          ring.style.animation = "dsh-pv-breathe-" + glowDir + " " + speed + "s ease-in-out infinite";
        } else {
          ring.style.animation = "none";
          ring.style.boxShadow = edge.animation === "solid"
            ? (glowDir === "out" ? "0 0 " : "inset 0 0 ") + glow + "px " + color
            : "none";
        }

        var flowOn = edge.flow === true;
        var comet1 = els.comet1;
        var comet2 = els.comet2;
        if (flowOn) {
          var fs = Number(edge.flowSpeed) || 6;
          // comet sweep (offset-path follows the border inset)
          comet1.style.visibility = "visible";
          comet1.style.animation = "dsh-pv-orbit " + fs + "s linear infinite";
          comet1.style.background = "radial-gradient(circle, rgba(255,255,255,.95) 0%, " + color + " 32%, transparent 68%)";
          comet1.style.boxShadow = "0 0 10px " + color;
          comet2.style.visibility = "visible";
          comet2.style.animation = "dsh-pv-orbit " + fs + "s linear infinite";
          comet2.style.animationDelay = "-" + (fs / 2) + "s";
          comet2.style.background = "radial-gradient(circle, rgba(255,255,255,.8) 0%, " + color + "88 30%, transparent 62%)";
          comet2.style.boxShadow = "0 0 8px " + color + "aa";
        } else {
          comet1.style.visibility = "hidden";
          comet2.style.visibility = "hidden";
          comet1.style.animation = "none";
          comet2.style.animation = "none";
        }

        var badge = els.badge;
        if (edge.badge === true) {
          var phaseText = s.phase === "peak" ? (runtime.status && runtime.status.phaseText ? runtime.status.phaseText.zh : "高峰期") : (runtime.status && runtime.status.phaseText ? runtime.status.phaseText.zh : "低峰期");
          badge.style.visibility = "visible";
          badge.style.opacity = "1";
          badge.style.color = "#fff";
          badge.style.background = color;
          if (badge.childNodes.length === 0 || badge.getAttribute("data-phase") !== s.phase) {
            badge.textContent = "";
            var dot = document.createElement("span");
            dot.style.cssText = "width:7px;height:7px;border-radius:999px;background:rgba(255,255,255,.9);flex:none;";
            var txt = document.createElement("span");
            txt.style.cssText = "color:#fff;text-shadow:0 1px 3px rgba(0,0,0,.35);";
            txt.textContent = phaseText;
            badge.appendChild(dot);
            badge.appendChild(txt);
            badge.setAttribute("data-phase", s.phase);
          }
          placeBadgeAboveComposer(badge);
        } else {
          badge.style.visibility = "hidden";
          badge.style.opacity = "0";
        }
        updateComposerRing(s, edge, color, glow, opacity, speed, w);
        runtime._previewing = !!isPreview;
      } catch (e) {
        hideOverlay();
      }
    }

    // ============================================================ small form components

    function Card(props) {
      return createElement("div", { style: cardStyle },
        createElement("div", { style: { display: "flex", flexDirection: "column", gap: "2px" } },
          createElement("div", { style: cardTitleStyle }, props.title),
          props.desc ? createElement("div", { style: cardDescStyle }, props.desc) : null
        ),
        props.children
      );
    }

    function ToggleRow(props) {
      return createElement("div", { style: rowStyle },
        createElement("div", { style: labelStyle },
          createElement("span", { style: nameStyle }, props.label),
          props.help ? createElement("span", { style: helpStyle }, props.help) : null
        ),
        createElement("input", {
          type: "checkbox",
          checked: !!props.checked,
          onChange: function (e) { props.onChange(e.target.checked); },
          style: checkboxStyle,
        })
      );
    }

    function SliderRow(props) {
      return createElement("div", { style: rowStyle },
        createElement("div", { style: labelStyle },
          createElement("span", { style: nameStyle }, props.label)
        ),
        createElement("input", {
          type: "range",
          min: props.min,
          max: props.max,
          step: props.step || 1,
          value: props.value,
          onChange: function (e) { props.onChange(Number(e.target.value)); },
          style: rangeStyle,
        }),
        createElement("span", { style: valueTagStyle }, (props.format || function (v) { return String(v); })(props.value))
      );
    }

    function ColorRow(props) {
      var swatches = props.swatches || [];
      return createElement("div", { style: rowStyle },
        createElement("div", { style: labelStyle },
          createElement("span", { style: nameStyle }, props.label)
        ),
        createElement("div", { style: { display: "flex", alignItems: "center", gap: "6px", flex: "none" } },
          swatches.map(function (c) {
            return createElement("button", {
              key: c,
              type: "button",
              onClick: function () { props.onChange(c); },
              style: {
                width: 20, height: 20, borderRadius: 6, background: c, border: "1px solid var(--dsw-alias-border-l2)",
                cursor: "pointer", flex: "none", boxShadow: props.value === c ? "0 0 0 2px var(--dsw-alias-bg-layer-3), 0 0 0 3.5px var(--dsw-alias-brand-primary)" : "none",
                padding: 0,
              },
              title: c,
            });
          }),
          createElement("input", {
            type: "color",
            value: props.value,
            onChange: function (e) { props.onChange(e.target.value); },
            style: { width: 34, height: 26, border: "1px solid var(--dsw-alias-border-l2)", borderRadius: 6, background: "var(--dsw-alias-bg-layer-2)", cursor: "pointer", padding: 0 },
          })
        )
      );
    }

    function SelectRow(props) {
      return createElement("div", { style: rowStyle },
        createElement("div", { style: labelStyle },
          createElement("span", { style: nameStyle }, props.label),
          props.help ? createElement("span", { style: helpStyle }, props.help) : null
        ),
        createElement("select", {
          value: props.value,
          onChange: function (e) { props.onChange(e.target.value); },
          style: Object.assign({}, selectStyle, { width: "auto", minWidth: 200 }),
        }, (props.options || []).map(function (opt) {
          var v = typeof opt === "object" ? opt.value : opt;
          var l = typeof opt === "object" ? opt.label : String(opt);
          return createElement("option", { key: String(v), value: String(v) }, l);
        }))
      );
    }

    function TextRow(props) {
      return createElement("div", { style: { display: "flex", flexDirection: "column", gap: "5px" } },
        createElement("span", { style: nameStyle }, props.label),
        createElement("input", {
          type: props.type || "text",
          value: props.value,
          placeholder: props.placeholder || "",
          onChange: function (e) { props.onChange(e.target.value); },
          style: textInputStyle,
        }),
        props.help ? createElement("span", { style: helpStyle }, props.help) : null
      );
    }

    function TextAreaRow(props) {
      return createElement("div", { style: { display: "flex", flexDirection: "column", gap: "5px" } },
        createElement("span", { style: nameStyle }, props.label),
        createElement("textarea", {
          value: props.value,
          placeholder: props.placeholder || "",
          rows: props.rows || 3,
          onChange: function (e) { props.onChange(e.target.value); },
          style: textareaStyle,
        }),
        props.help ? createElement("span", { style: helpStyle }, props.help) : null
      );
    }

    // ============================================================ main section

    function PeakValleySection(props) {
      var t = props.t;

      var statusState = useState(null);
      var status = statusState[0];
      var setStatus = statusState[1];

      var draftState = useState(null);
      var draft = draftState[0];
      var setDraft = draftState[1];

      var channelsState = useState([]);
      var channels = channelsState[0];
      var setChannels = channelsState[1];

      var channelsInfoState = useState(null);
      var channelsInfo = channelsInfoState[0];
      var setChannelsInfo = channelsInfoState[1];

      var loadState = useState(true);
      var loading = loadState[0];
      var setLoading = loadState[1];

      var loadErrState = useState(false);
      var loadErr = loadErrState[0];
      var setLoadErr = loadErrState[1];

      var noticeState = useState("");
      var notice = noticeState[0];
      var setNotice = noticeState[1];

      var savingState = useState(false);
      var saving = savingState[0];
      var setSaving = savingState[1];

      var testsState = useState({});
      var tests = testsState[0];
      var setTests = testsState[1];

      var nowTickState = useState(Date.now());
      var nowTick = nowTickState[0];
      var setNowTick = nowTickState[1];

      var draftRef = useRef(draft);
      draftRef.current = draft;
      var saveTimerRef = useRef(null);

      // ---- actions

      var persist = useCallback(function (next) {
        if (!next) return;
        if (saveTimerRef.current) { clearTimeout(saveTimerRef.current); }
        saveTimerRef.current = setTimeout(function () {
          setSaving(true);
          api("save", { config: draftRef.current }).then(function () {
            setNotice(t("saveOk"));
            runtime.refreshNow();
          }).catch(function (err) {
            setNotice(t("saveFail") + ": " + ((err && err.message) || ""));
            api("config").then(function (value) {
              setDraft(value);
              runtime.refreshNow();
            }).catch(function () {});
          }).finally(function () {
            setSaving(false);
          });
        }, 320);
      }, [t]);

      var update = useCallback(function (patch) {
        setDraft(function (prev) {
          if (!prev) return prev;
          var next = Object.assign({}, prev, patch);
          if (patch.edge && runtime.status) {
            runtime.previewEdge(next.edge, runtime.status.phase);
          }
          persist(next);
          return next;
        });
      }, [persist]);

      var resetSection = useCallback(function (section) {
        api("reset", { section: section }).then(function () {
          return api("config");
        }).then(function (value) {
          setDraft(value);
          runtime.refreshNow();
          setNotice(t("saveOk"));
        }).catch(function (err) {
          setNotice(t("saveFail") + ": " + ((err && err.message) || ""));
        });
      }, [t]);

      var refresh = useCallback(function () {
        setLoading(true);
        setLoadErr(false);
        Promise.all([api("config"), api("status"), api("pushChannels")]).then(function (values) {
          setDraft(values[0]);
          setStatus(values[1]);
          setChannels(values[2].channels || []);
          setChannelsInfo(values[2]);
          runtime.refreshNow();
        }).catch(function () {
          setLoadErr(true);
        }).finally(function () {
          setLoading(false);
        });
      }, []);

      useEffect(function () {
        refresh();
        var unsub = runtime.subscribe(function (s) {
          setStatus(s);
          if (s && s.reminders) {
            setDraft(function (prev) {
              if (!prev) return prev;
              var nextRem = {};
              ["peak", "valley"].forEach(function (ph) {
                var src = s.reminders[ph] || {};
                nextRem[ph] = Object.assign({}, prev.reminders?.[ph] || {}, {
                  lastFiredAt: src.lastFiredAt || null,
                  lastResult: src.lastResult || null,
                });
              });
              return Object.assign({}, prev, { reminders: nextRem });
            });
          }
        });
        var ticker = setInterval(function () { setNowTick(Date.now()); }, 1000);
        return function () {
          unsub();
          clearInterval(ticker);
          if (saveTimerRef.current) { clearTimeout(saveTimerRef.current); }
        };
      }, [refresh]);

      // ---- derived

      var phase = status ? status.phase : null;
      var phaseColor = phase === "peak" ? (draft && draft.edge ? draft.edge.peakColor : "#f97316") : (draft && draft.edge ? draft.edge.valleyColor : "#38bdf8");
      var nextInfo = null;
      if (status && status.nextTransitionAt) {
        var msLeft = new Date(status.nextTransitionAt).getTime() - nowTick;
        nextInfo = { phase: status.nextPhase, msLeft: Math.max(0, msLeft) };
      }
      var nextText = "";
      if (nextInfo) {
        var mm = Math.floor(nextInfo.msLeft / 60000);
        var ss = Math.floor((nextInfo.msLeft % 60000) / 1000);
        nextText = (nextInfo.phase === "peak" ? t("nextPeak") : t("nextValley")) + " · " + mm + ":" + String(ss).padStart(2, "0");
      }

      var channelOptions = [{ value: "all", label: t("channelAll") }];
      var pushItems = channels.filter(function (c) { return c.source !== "messaging"; });
      var msgItems = channels.filter(function (c) { return c.source === "messaging"; });
      if (pushItems.length > 0) {
        pushItems.forEach(function (c) {
          channelOptions.push({ value: c.id, label: (c.name || c.id) + (c.type ? " · " + c.type : "") });
        });
      }
      if (msgItems.length > 0) {
        msgItems.forEach(function (c) {
          channelOptions.push({ value: c.id, label: (c.name || c.id) + "（消息平台）" });
        });
      }

      var testRun = function (kind, phaseKey) {
        var r = draft && draft.reminders ? draft.reminders[phaseKey] : null;
        setTests(function (prev) { return Object.assign({}, prev, { [phaseKey]: "busy" }); });
        api("test", {
          kind: kind,
          channel: r ? r.channel : "all",
          title: r ? r.title : "",
          content: r ? r.content : "",
        }).then(function (value) {
          var result = value.result || {};
          setTests(function (prev) {
            var next = Object.assign({}, prev);
            if (result.ok === true) { next[phaseKey] = { ok: true, text: t("testOk") + (result.sent ? " · " + result.sent + "/" + result.total : ""), full: result }; }
            else { next[phaseKey] = { ok: false, text: t("testFail") + ": " + (result.error || ""), full: result }; }
            return next;
          });
        }).catch(function (err) {
          setTests(function (prev) { return Object.assign({}, prev, { [phaseKey]: { ok: false, text: t("testFail") + ": " + (err && err.message || "") } }); });
        });
      };

      var fireNow = function (phaseKey) {
        setTests(function (prev) { return Object.assign({}, prev, { ["fire:" + phaseKey]: "busy" }); });
        api("fireNow", { phase: phaseKey }).then(function (value) {
          if (value.skipped) {
            setTests(function (prev) { return Object.assign({}, prev, { ["fire:" + phaseKey]: { ok: false, text: t("notEnabled") } }); });
            return;
          }
          var result = value.result || {};
          setTests(function (prev) { return Object.assign({}, prev, { ["fire:" + phaseKey]: { ok: result.ok === true, text: result.ok === true ? t("pushed") : t("testFail") + ": " + (result.error || "") } }); });
          runtime.refreshNow();
        }).catch(function (err) {
          setTests(function (prev) { return Object.assign({}, prev, { ["fire:" + phaseKey]: { ok: false, text: t("testFail") + ": " + (err && err.message || "") } }); });
        });
      };

      var requestNotifyPermission = function () {
        if (!localNotificationSupported()) return;
        Notification.requestPermission().then(function () {
          setStatus(function (prev) { return prev ? Object.assign({}, prev, { _permTick: Date.now() }) : prev; });
        });
      };

      var permissionState = localNotificationSupported()
        ? (typeof Notification !== "undefined" ? Notification.permission : "default")
        : "unsupported";

      // ---- render

      if (loading && !draft) {
        return createElement("div", { style: sectionStyle },
          createElement("div", { style: headStyle },
            createElement("div", { style: { flex: 1, minWidth: 0 } },
              createElement("div", { style: titleStyle }, t("title")),
              createElement("div", { style: introStyle }, t("intro"))
            )
          ),
          createElement("div", { style: { padding: "18px 2px", fontSize: 13, color: "var(--dsw-alias-label-tertiary)" } }, t("loading"))
        );
      }

      if (loadErr && !draft) {
        return createElement("div", { style: sectionStyle },
          createElement("div", { style: headStyle },
            createElement("div", { style: { flex: 1, minWidth: 0 } },
              createElement("div", { style: titleStyle }, t("title")),
              createElement("div", { style: introStyle }, t("intro"))
            )
          ),
          createElement("div", { style: { padding: "18px 2px", fontSize: 13, color: "var(--dsw-alias-state-error-primary)" } }, t("loadFail")),
          createElement("div", { style: { display: "flex", gap: "8px" } },
            createElement(Button, { size: "md", variant: "outline", onClick: refresh }, t("refetch"))
          )
        );
      }

      var d = draft || {};
      var edge = d.edge || {};
      var remindersDraft = d.reminders || { peak: {}, valley: {} };

      var updateEdge = function (patch) {
        update({ edge: Object.assign({}, edge, patch) });
      };

      var updateReminder = function (phaseKey, patch) {
        var next = Object.assign({}, remindersDraft, {
          [phaseKey]: Object.assign({}, remindersDraft[phaseKey] || {}, patch),
        });
        update({ reminders: next });
      };

      var windowRows = (d.windows || []).map(function (w, i) {
        return createElement("div", { key: i, style: { display: "flex", alignItems: "center", gap: "8px" } },
          createElement("div", { style: { flex: 1, minWidth: 0, display: "flex", gap: "8px", alignItems: "center" } },
            createElement("span", { style: { fontSize: 12, color: "var(--dsw-alias-label-tertiary)", flex: "none" } }, t("windowStart")),
            createElement("input", {
              type: "time",
              value: w.start,
              onChange: function (e) {
                var rows = (d.windows || []).slice();
                rows[i] = Object.assign({}, rows[i], { start: e.target.value });
                update({ windows: rows });
              },
              style: Object.assign({}, textInputStyle, { width: 110 }),
            }),
            createElement("span", { style: { fontSize: 12, color: "var(--dsw-alias-label-tertiary)", flex: "none" } }, t("windowEnd")),
            createElement("input", {
              type: "time",
              value: w.end,
              onChange: function (e) {
                var rows = (d.windows || []).slice();
                rows[i] = Object.assign({}, rows[i], { end: e.target.value });
                update({ windows: rows });
              },
              style: Object.assign({}, textInputStyle, { width: 110 }),
            })
          ),
          createElement(Button, {
            size: "sm",
            variant: "ghost",
            onClick: function () {
              var rows = (d.windows || []).filter(function (_, idx) { return idx !== i; });
              if (rows.length === 0) { setNotice(t("invalidWindow")); return; }
              update({ windows: rows });
            },
          }, t("remove"))
        );
      });

      var reminderPanel = function (phaseKey, titleText) {
        var r = remindersDraft[phaseKey] || {};
        var test = tests[phaseKey] || tests["fire:" + phaseKey] || null;
        var busy = tests[phaseKey] === "busy" || tests["fire:" + phaseKey] === "busy";
        var leadOptions = [0, 5, 10, 15, 30, 60].map(function (n) {
          return { value: n, label: n === 0 ? t("lead0") : t("leadN").replace("{n}", String(n)) };
        });
        var lastResultText = "";
        if (r.lastFiredAt) {
          lastResultText = (r.lastResult && r.lastResult.ok === true)
            ? t("pushed") + " · " + new Date(r.lastFiredAt).toLocaleTimeString()
            : (r.lastResult ? t("testFail") + " · " + new Date(r.lastFiredAt).toLocaleTimeString() : "");
        }
        return createElement("div", { key: phaseKey, style: Object.assign({}, cardStyle, { background: "var(--dsw-alias-bg-layer-2)", borderColor: "var(--dsw-alias-border-l2)" }) },
          createElement("div", { style: { display: "flex", alignItems: "center", justifyContent: "space-between", gap: "10px" } },
            createElement("span", { style: cardTitleStyle }, titleText),
            createElement("label", { style: { display: "flex", alignItems: "center", gap: "6px", flex: "none", cursor: "pointer", fontSize: 13, color: "var(--dsw-alias-label-primary)" } },
              createElement("input", {
                type: "checkbox",
                checked: r.enabled === true,
                onChange: function (e) { updateReminder(phaseKey, { enabled: e.target.checked }); },
                style: checkboxStyle,
              }),
              t("reminderEnabled")
            )
          ),
          createElement(SelectRow, {
            label: t("lead"),
            value: Number(r.leadMinutes) || 0,
            onChange: function (v) { updateReminder(phaseKey, { leadMinutes: Number(v) }); },
            options: leadOptions,
          }),
          createElement(TextRow, {
            label: t("titleLabel"),
            value: r.title || "",
            onChange: function (v) { updateReminder(phaseKey, { title: v }); },
          }),
          createElement(TextAreaRow, {
            label: t("contentLabel"),
            value: r.content || "",
            rows: 3,
            onChange: function (v) { updateReminder(phaseKey, { content: v }); },
            help: t("templateHint"),
          }),
          createElement(TextRow, {
            label: t("extraTimes"),
            value: r.times || "",
            placeholder: "08:00, 20:30",
            onChange: function (v) { updateReminder(phaseKey, { times: v }); },
            help: t("extraTimesHint"),
          }),
          createElement(SelectRow, {
            label: t("channel"),
            value: r.channel || "all",
            onChange: function (v) { updateReminder(phaseKey, { channel: v }); },
            options: channelOptions,
            help: channelsInfo && !channelsInfo.available ? "（未检测到推送渠道，请先安装配置 chicheng-push）" : undefined,
          }),
          test && typeof test === "object"
            ? createElement("div", { style: test.ok === true ? msgOkStyle : msgErrStyle }, test.text)
            : null,
          lastResultText
            ? createElement("div", { style: msgMutedStyle }, t("lastResult") + ": " + lastResultText)
            : null,
          createElement("div", { style: { display: "flex", gap: "8px", flexWrap: "wrap" } },
            createElement(Button, { size: "sm", variant: "outline", disabled: busy, onClick: function () { testRun(phaseKey, phaseKey); } },
              busy ? t("testing") : t("testSend")),
            createElement(Button, { size: "sm", variant: "ghost", disabled: busy, onClick: function () { fireNow(phaseKey); } }, t("fireNow"))
          )
        );
      };

      var edgePreview = createElement("div", { style: { display: "flex", flexDirection: "column", gap: "6px", flex: "none", width: 120 } },
        createElement("span", { style: { fontSize: 12, color: "var(--dsw-alias-label-tertiary)" } }, t("preview")),
        createElement("div", {
          style: {
            width: 120, height: 64, borderRadius: 8, boxSizing: "border-box",
            border: edge.width + "px solid " + (phase === "peak" ? edge.peakColor : edge.valleyColor),
            boxShadow: "inset 0 0 " + (edge.glow || 0) + "px " + (phase === "peak" ? edge.peakColor : edge.valleyColor),
            background: "var(--dsw-alias-bg-layer-4)",
          },
        })
      );

      return createElement("div", { style: sectionStyle },
        createElement("div", { style: headStyle },
          createElement("div", { style: { flex: 1, minWidth: 0 } },
            createElement("div", { style: titleStyle }, t("title")),
            createElement("div", { style: introStyle }, t("intro"))
          ),
          createElement("div", { style: { display: "flex", gap: "8px", alignItems: "center" } },
            saving ? createElement("span", { style: { fontSize: 12, color: "var(--dsw-alias-label-tertiary)" } }, t("saving")) : null,
            createElement(Button, { size: "md", variant: "outline", onClick: refresh, icon: createElement(IconRefreshOutline16, { size: 14 }) }, t("refetch"))
          )
        ),

        // ---- 状态总览
        createElement(Card, { title: t("statusTitle"), desc: t("statusDesc") },
          createElement("div", { style: { display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" } },
            createElement("span", {
              style: Object.assign({}, pillStyle, {
                color: "#fff",
                background: phase ? phaseColor : "var(--dsw-alias-label-tertiary)",
                boxShadow: "0 0 0 0 " + phaseColor,
              }),
            },
              phase === "peak" ? t("nowPeak") : phase === "valley" ? t("nowValley") : "…"
            ),
            nextText !== ""
              ? createElement("span", { style: { fontSize: 13, color: "var(--dsw-alias-label-secondary)", fontVariantNumeric: "tabular-nums" } },
                  t("nextTransition") + ": " + nextText)
              : createElement("span", { style: { fontSize: 13, color: "var(--dsw-alias-label-tertiary)" } }, "—")
          ),
          createElement(SelectRow, {
            label: t("overrideAuto") + " / " + t("overridePeak") + " / " + t("overrideValley"),
            value: d.override || "auto",
            onChange: function (v) { update({ override: v }); },
            options: [
              { value: "auto", label: t("overrideAuto") },
              { value: "peak", label: t("overridePeak") },
              { value: "valley", label: t("overrideValley") },
            ],
            help: t("overrideDesc"),
          })
        ),

        // ---- 高峰时段设置
        createElement(Card, { title: t("windowsTitle"), desc: t("windowsDesc") },
          windowRows,
          createElement("div", { style: { display: "flex", gap: "8px", flexWrap: "wrap" } },
            createElement(Button, {
              size: "sm",
              variant: "primary",
              onClick: function () {
                update({ windows: (d.windows || []).concat([{ start: "09:00", end: "12:00" }]) });
              },
            }, t("addWindow")),
            createElement(Button, { size: "sm", variant: "ghost", onClick: function () { resetSection("windows"); } }, t("restoreOfficial"))
          ),
          createElement(SelectRow, {
            label: t("timezone"),
            value: d.timezone || "Asia/Shanghai",
            onChange: function (v) { update({ timezone: v }); },
            options: [
              "Asia/Shanghai", "Asia/Hong_Kong", "Asia/Tokyo", "Asia/Singapore", "Asia/Seoul",
              "UTC", "Europe/London", "Europe/Paris", "America/New_York", "America/Los_Angeles",
            ],
          })
        ),

        // ---- 边框外观
        createElement(Card, { title: t("edgeTitle"), desc: t("edgeDesc") },
          createElement("div", { style: { display: "flex", gap: "16px", flexWrap: "wrap" } },
            createElement("div", { style: { flex: "1 1 260px", minWidth: 0, display: "flex", flexDirection: "column", gap: "2px" } },
              createElement(ToggleRow, { label: t("edgeEnabled"), checked: edge.enabled !== false, onChange: function (v) { updateEdge({ enabled: v }); } }),
              createElement(ColorRow, {
                label: t("peakColor"),
                value: edge.peakColor || "#f97316",
                onChange: function (v) { updateEdge({ peakColor: v }); },
                swatches: ["#f97316", "#ea580c", "#f59e0b", "#ef4444", "#fb7185"],
              }),
              createElement(ColorRow, {
                label: t("valleyColor"),
                value: edge.valleyColor || "#38bdf8",
                onChange: function (v) { updateEdge({ valleyColor: v }); },
                swatches: ["#38bdf8", "#3b82f6", "#22d3ee", "#34d399", "#a78bfa"],
              }),
              createElement(SliderRow, {
                label: t("width") + " (px)",
                value: edge.width || 3,
                min: 1, max: 14,
                onChange: function (v) { updateEdge({ width: v }); },
              }),
              createElement(SliderRow, {
                label: t("glow"),
                value: edge.glow || 0,
                min: 0, max: 80,
                onChange: function (v) { updateEdge({ glow: v }); },
              }),
              createElement(SliderRow, {
                label: t("opacity"),
                value: Math.round((edge.opacity || 0.95) * 100),
                min: 20, max: 100,
                format: function (v) { return v + "%"; },
                onChange: function (v) { updateEdge({ opacity: v / 100 }); },
              }),
              createElement(SelectRow, {
                label: t("animation"),
                value: edge.animation || "breathing",
                onChange: function (v) { updateEdge({ animation: v }); },
                options: [
                  { value: "breathing", label: t("animBreathing") },
                  { value: "solid", label: t("animSolid") },
                  { value: "off", label: t("animOff") },
                ],
              }),
              createElement(SelectRow, {
                label: t("edgeGlowDir"),
                value: edge.glowDirection || "in",
                onChange: function (v) { updateEdge({ glowDirection: v }); },
                options: [
                  { value: "in", label: t("glowIn") },
                  { value: "out", label: t("glowOut") },
                ],
              }),
              createElement(SliderRow, {
                label: t("breathingSpeed"),
                value: edge.breathingSpeed || 2.6,
                min: 0.5, max: 10, step: 0.1,
                format: function (v) { return v.toFixed(1) + "s"; },
                onChange: function (v) { updateEdge({ breathingSpeed: v }); },
              }),
              createElement(ToggleRow, { label: t("flow"), checked: edge.flow === true, onChange: function (v) { updateEdge({ flow: v }); } }),
              createElement(SliderRow, {
                label: t("flowSpeed"),
                value: edge.flowSpeed || 6,
                min: 2, max: 24, step: 0.5,
                format: function (v) { return v.toFixed(1) + "s"; },
                onChange: function (v) { updateEdge({ flowSpeed: v }); },
              }),
              createElement(ToggleRow, { label: t("badge"), checked: edge.badge === true, onChange: function (v) { updateEdge({ badge: v }); } }),
              createElement(ToggleRow, {
                label: t("composerBorder"),
                checked: (edge.composer && edge.composer.enabled) !== false,
                help: t("composerBorderHelp"),
                onChange: function (v) { updateEdge({ composer: Object.assign({}, edge.composer || {}, { enabled: v }) }); },
              }),
              createElement(SelectRow, {
                label: t("composerGlowDir"),
                value: (edge.composer && edge.composer.glowDirection) || "in",
                onChange: function (v) { updateEdge({ composer: Object.assign({}, edge.composer || {}, { glowDirection: v }) }); },
                options: [
                  { value: "in", label: t("glowIn") },
                  { value: "out", label: t("glowOut") },
                ],
              })
            ),
            edgePreview
          ),
          createElement("div", { style: { display: "flex", gap: "8px" } },
            createElement(Button, { size: "sm", variant: "ghost", onClick: function () { resetSection("edge"); } }, t("resetEdge"))
          )
        ),

        // ---- 本地通知
        createElement(Card, { title: t("notifyTitle"), desc: t("notifyDesc") },
          createElement(ToggleRow, {
            label: t("notifyEnabled"),
            checked: (d.localNotify && d.localNotify.enabled) === true,
            onChange: function (v) { update({ localNotify: Object.assign({}, d.localNotify || {}, { enabled: v }) }); },
          }),
          createElement(ToggleRow, {
            label: t("notifyTransition"),
            checked: (d.localNotify && d.localNotify.onTransition) !== false,
            onChange: function (v) { update({ localNotify: Object.assign({}, d.localNotify || {}, { onTransition: v }) }); },
          }),
          createElement(ToggleRow, {
            label: t("notifyReminder"),
            checked: (d.localNotify && d.localNotify.onReminder) === true,
            onChange: function (v) { update({ localNotify: Object.assign({}, d.localNotify || {}, { onReminder: v }) }); },
          }),
          createElement("div", { style: { display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" } },
            createElement("span", { style: { fontSize: 13, color: "var(--dsw-alias-label-secondary)" } },
              permissionState === "granted" ? t("permissionGranted")
                : permissionState === "denied" ? t("permissionDenied")
                  : permissionState === "unsupported" ? "—" : t("permissionDefault")),
            permissionState !== "granted" && permissionState !== "unsupported"
              ? createElement(Button, { size: "sm", variant: "outline", onClick: requestNotifyPermission }, t("requestPermission"))
              : null,
            permissionState === "granted"
              ? createElement(Button, {
                  size: "sm",
                  variant: "ghost",
                  onClick: function () { sendLocalNotification("DeepSeek 峰谷提醒", "这是一条测试通知（高峰期 / 低峰期提醒预览）"); },
                }, t("testNotify"))
              : null
          )
        ),

        // ---- 消息推送提醒
        createElement(Card, { title: t("reminderTitle"), desc: t("reminderDesc") },
          reminderPanel("peak", t("peakReminder")),
          reminderPanel("valley", t("valleyReminder"))
        ),

        // ---- 关于
        createElement(Card, { title: t("aboutTitle") },
          createElement("div", { style: { fontSize: 12, color: "var(--dsw-alias-label-secondary)", lineHeight: 1.7 } }, t("aboutDesc"))
        ),

        notice
          ? createElement("div", { style: { fontSize: 12, color: "var(--dsw-alias-label-tertiary)", padding: "0 2px" } }, notice)
          : null
      );
    }

    // ============================================================ plugin surface

    var inject = ["slots", "locale"];

    function apply(ctx) {
      ctx.effect(function () {
        return ctx.locale.register(NS, { zh: zh, en: en });
      }, "chicheng-peak: locale");
      var t = ctx.locale.bind(NS);

      ctx.effect(function () {
        runtime.start();
        try { console.info("[chicheng-peak] overlay engine started"); } catch (e) { /* ignore */ }
        return function () {
          runtime.stop();
          try { console.info("[chicheng-peak] overlay engine stopped"); } catch (e) { /* ignore */ }
        };
      }, "chicheng-peak: overlay engine");

      ctx.slots.inject("settings.section", function () {
        return ctx.slots.register({
          name: "settings.section",
          id: "chicheng-peak",
          order: 40,
          label: function () { return t("nav"); },
          locale: NS,
          inject: function () { return { t: t }; },
        }, PeakValleySection);
      });
    }

    exports.apply = apply;
    exports.inject = inject;
    return module.exports;
  }
});