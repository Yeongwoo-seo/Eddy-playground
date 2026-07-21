/* MISSING KEY — shared "real play" flag.
   Set once when a player actually enters the game through /play/'s own
   install-gated start screen (see play/index.html's goToRealStart and
   its minigame picker); read by every real-play-reachable page (play/game,
   play/explore, the routed minigames) to hide dev-only chrome — the "← DEV"
   link, the POS/DEV debug buttons (asset selectors, fake-evidence
   shortcuts), and the CASE FILE menu button, none of which are meant for a
   real player. Each scene/feature/minigame's own "설정" link into its dev
   editor page (.dev-settings-link) is deliberately NOT in the hide list —
   Eddy still wants one-tap access into layout/asset tuning while doing a
   real install-and-play pass, not just from /dev/.

   sessionStorage, not localStorage: a fresh app launch (icon tap) should
   always start clean, and a developer testing through /dev/ on the same
   device shouldn't have dev chrome hidden forever after one real
   playthrough — it clears the moment the tab/app is closed. */
const RealPlayMode = {
  KEY: 'mkRealPlayModeV1',
  mark() { try { sessionStorage.setItem(this.KEY, '1'); } catch (e) {} },
  isActive() { try { return sessionStorage.getItem(this.KEY) === '1'; } catch (e) { return false; } },
  hideDevChrome() {
    if (!this.isActive()) return;
    // #transformBtn (캐릭터 높이 조정 슬라이더, play/game/index.html)은
    // 의도적으로 여기 넣지 않는다 — .dev-settings-link와 같은 이유로,
    // 실제 설치-플레이 중에도 위치/레이아웃을 바로 조정할 수 있어야 한다.
    document.querySelectorAll('a.vn-btn[href="/dev/"], #devBtn, #caseMenuMount')
      .forEach(el => { el.style.display = 'none'; });
  },
};
