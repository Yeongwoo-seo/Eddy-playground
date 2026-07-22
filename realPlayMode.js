/* MISSING KEY — shared "real play" flag.
   Set once when a player actually enters the game through /play/'s own
   install-gated start screen (see play/index.html's goToRealStart and
   its minigame picker); read by every real-play-reachable page (play/game,
   play/explore, the routed minigames) to hide dev-only chrome for a real
   player: the "← DEV" link, the DEV debug buttons (asset selectors,
   fake-evidence shortcuts), the CASE FILE menu button, the "다음"(skip)
   button, each scene/minigame's "설정" link into its dev editor page
   (.dev-settings-link), and the layout/position tuning sliders
   (play/game's 캐릭터 높이 조정 패널, play/minigame-fishing's 배치 편집 패널).

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
    document.querySelectorAll(
      'a.vn-btn[href="/dev/"], #devBtn, #caseMenuMount, #skipBtn, .skip-next, ' +
      '.dev-settings-link, #transformBtn, #charPosPanel, #layoutEditBtn, #layoutEditPanel'
    ).forEach(el => { el.style.display = 'none'; });
  },
};
