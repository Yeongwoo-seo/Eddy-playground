/* OPERATION MK — shared "real play" flag.
   Set once when a player actually enters the game through /play/'s own
   install-gated start screen (see play/index.html's goToRealStart and
   its minigame picker); read by every real-play-reachable page (play/game,
   play/explore, the routed minigames) to hide dev-only chrome — the "← DEV"
   link, each scene/feature/minigame's "설정" link into its dev editor
   page, the POS/DEV debug buttons, and the CASE FILE menu button, none of
   which are meant for a real player.

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
    // .dev-settings-link marks each play page's own "설정" link into its
    // dev editor page (e.g. play/minigame-fishing/'s ⚙ chip → /dev/
    // minigame-fishing/) — a shared marker class rather than matching by
    // href or visual button class, since those vary page to page.
    document.querySelectorAll('a.vn-btn[href="/dev/"], .dev-settings-link, #devBtn, #transformBtn, #caseMenuMount')
      .forEach(el => { el.style.display = 'none'; });
  },
};
