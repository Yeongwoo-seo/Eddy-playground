/* MISSING KEY DEV — per-week asset preloader.
   /play/game plays one week's scenes as a chain of full page navigations
   (see game/index.html's nextSceneId handoff), each of which used to show
   LoadingOverlay's spinner while re-fetching that scene's background/
   portrait/dialogue-override/BGM data on its own — even for assets already
   shown two scenes ago, because a fresh page load starts every AssetDB
   cache empty. That's both a stutter (spinner on every tap-through) and a
   data cost (the same photo re-downloaded/re-decoded scene after scene).

   WeekPreloader instead front-loads everything a whole week's scenes could
   need — in a handful of batched requests — the moment a week is first
   entered, behind a single progress-bar screen (with a random Sydney trip
   tip, not a spinner). AssetDB's own sessionStorage-backed cache (see
   assetDb.js) then carries that data across every later scene's full page
   reload for the rest of the week, so game/index.html's per-scene init no
   longer needs a loading screen of its own at all. */
const WeekPreloader = (() => {
  const READY_SESSION_KEY = 'mkWeekPreloadReadyWeek';
  const OVERRIDES_SESSION_PREFIX = 'mkWeekPreloadOverrides:';
  const SOUNDS_SESSION_KEY = 'mkWeekPreloadSounds';
  const SCENE_LOCATIONS_SESSION_KEY = 'mkWeekPreloadSceneLocations';

  function weekIdOf(sceneId) {
    const m = /^(week\d+)-/.exec(sceneId || '');
    return m ? m[1] : null;
  }

  function isReady(weekId) {
    try { return !!weekId && sessionStorage.getItem(READY_SESSION_KEY) === weekId; }
    catch (e) { return false; }
  }

  // Replays a previously-finished week's bulk dialogue-override/sound fetch
  // into this fresh page's AssetDB module (see AssetDB.primeDialogueOverrides/
  // primeSounds) so game/index.html's applyDialogueOverrides/applyBgm never
  // hit the network on any scene after the first in a week.
  function primeFromCache(weekId, sceneIds) {
    try {
      const soundsRaw = sessionStorage.getItem(SOUNDS_SESSION_KEY);
      if (soundsRaw) AssetDB.primeSounds(JSON.parse(soundsRaw));
    } catch (e) { /* fall back to a normal network fetch */ }
    try {
      const locationsRaw = sessionStorage.getItem(SCENE_LOCATIONS_SESSION_KEY);
      if (locationsRaw) AssetDB.primeSceneLocationMap(JSON.parse(locationsRaw));
    } catch (e) { /* fall back to a normal network fetch */ }
    (sceneIds || []).forEach(sceneId => {
      try {
        const raw = sessionStorage.getItem(OVERRIDES_SESSION_PREFIX + sceneId);
        if (raw) AssetDB.primeDialogueOverrides(sceneId, JSON.parse(raw));
      } catch (e) { /* fall back to a normal network fetch for this scene */ }
    });
  }

  /* ===== Progress-bar loading screen ===== */
  let el = null;
  let fillEl = null;
  let pctEl = null;
  let tipEl = null;

  function ensure() {
    if (el) return el;
    el = document.createElement('div');
    el.id = 'mkWeekPreloadOverlay';
    el.innerHTML = `
      <style>
        #mkWeekPreloadOverlay{position:fixed;inset:0;z-index:10000;background:#050607;display:flex;align-items:center;justify-content:center;transition:opacity .35s ease}
        #mkWeekPreloadOverlay.hide{opacity:0;pointer-events:none}
        #mkWeekPreloadOverlay .mk-wp-inner{width:min(320px,80vw);display:flex;flex-direction:column;align-items:center;gap:18px}
        #mkWeekPreloadOverlay .mk-wp-tip{font-family:'Pretendard',-apple-system,BlinkMacSystemFont,sans-serif;font-size:14px;line-height:1.6;color:#EDF1F4;text-align:center;min-height:44px}
        #mkWeekPreloadOverlay .mk-wp-tip::before{content:'TRAVEL TIP';display:block;font-family:'IBM Plex Mono',ui-monospace,monospace;font-size:10px;letter-spacing:.16em;color:#59B8C8;margin-bottom:8px}
        #mkWeekPreloadOverlay .mk-wp-track{width:100%;height:6px;border-radius:3px;background:rgba(255,255,255,.12);overflow:hidden}
        #mkWeekPreloadOverlay .mk-wp-fill{height:100%;width:0%;border-radius:3px;background:linear-gradient(90deg,#59B8C8,#8FE0EC);transition:width .25s ease}
        #mkWeekPreloadOverlay .mk-wp-pct{font-family:'IBM Plex Mono',ui-monospace,monospace;font-size:11px;letter-spacing:.1em;color:#929BA5}
      </style>
      <div class="mk-wp-inner">
        <div class="mk-wp-tip"></div>
        <div class="mk-wp-track"><div class="mk-wp-fill"></div></div>
        <div class="mk-wp-pct">0%</div>
      </div>
    `;
    document.body.appendChild(el);
    tipEl = el.querySelector('.mk-wp-tip');
    fillEl = el.querySelector('.mk-wp-fill');
    pctEl = el.querySelector('.mk-wp-pct');
    return el;
  }

  function show() {
    ensure();
    tipEl.textContent = (typeof TravelTips !== 'undefined') ? TravelTips.getRandom() : '';
    setProgress(0, 1);
    el.classList.remove('hide');
  }

  function setProgress(done, total) {
    const pct = total > 0 ? Math.min(100, Math.round((done / total) * 100)) : 100;
    fillEl.style.width = pct + '%';
    pctEl.textContent = pct + '%';
  }

  function hide() {
    if (el) el.classList.add('hide');
  }

  /* ===== Asset-need collection ===== */

  // Every background slot key a week's scenes reference — a plain scene id
  // for scenes with no `locations` (applyBackground's own default), or each
  // location-segment key otherwise (see game/index.html's applyBackground).
  function collectBackgroundKeys(weekScenes) {
    const keys = new Set();
    weekScenes.forEach(s => {
      if (s.locations && s.locations.length) s.locations.forEach(l => keys.add(l.key));
      else keys.add(s.id);
    });
    return [...keys];
  }

  // Every (characterId, expression) portrait a week's lines could show,
  // resolved the same way applyCharacterForLine does: try the scene's
  // currently-equipped/story-locked outfit's asset key first, then the
  // base characterId as a fallback — preloading both is cheap insurance
  // against under-preloading, unlike a network round trip mid-scene.
  // DevGameState.getCharacterAssetId is a server-backed (async) lookup, so
  // every pair is queried in parallel and settled independently — one
  // line's failed lookup must not stop the rest of the week from preloading.
  async function collectCharacterAssetIds(weekScenes) {
    const lookups = [];
    weekScenes.forEach(s => {
      (s.lines || []).forEach(line => {
        if (!line.characterId) return;
        const expression = line.expression || 'neutral';
        let resolvedCharacterId = line.characterId;
        if (typeof WardrobeState !== 'undefined') {
          try {
            const resolution = WardrobeState.resolveOutfitForScene(line.characterId, {
              outfitMode: s.outfitMode, storyOutfitId: s.storyOutfitId,
            });
            if (resolution.hidden) return;
            if (resolution.characterId) resolvedCharacterId = resolution.characterId;
          } catch (e) { /* fall back to the base characterId below */ }
        }
        lookups.push((async () => DevGameState.getCharacterAssetId(resolvedCharacterId, expression))());
        lookups.push((async () => DevGameState.getCharacterAssetId(line.characterId, expression))());
      });
    });
    const results = await Promise.allSettled(lookups);
    return [...new Set(
      results
        .filter(r => r.status === 'fulfilled' && r.value)
        .map(r => r.value)
    )];
  }

  /* ===== Main entry point ===== */

  // Resolves once the given week's data is warm in AssetDB's cache and
  // ready to render every scene with no further network calls. Shows the
  // progress-bar/tip screen only the first time a week is entered this
  // session; every later call for an already-ready week just re-primes the
  // per-scene dialogue-override/sound caches (cheap, synchronous-ish) and
  // resolves immediately with no visible screen at all.
  async function ensureWeekLoaded(weekId, weekScenes) {
    if (!weekId || !weekScenes || !weekScenes.length) return;
    const sceneIds = weekScenes.map(s => s.id);

    if (isReady(weekId)) {
      primeFromCache(weekId, sceneIds);
      return;
    }

    show();
    try {
      // Fetched once up front (rather than left for the first
      // DevGameState.getBackgroundId call to trigger lazily) so the
      // Promise.all below doesn't fire off several concurrent duplicate
      // fetches of the same map, and so it's available to persist for
      // every later scene in this week.
      let sceneLocationMap = {};
      try { sceneLocationMap = await AssetDB.getSceneLocationMap(); } catch (e) { /* best-effort */ }

      const backgroundKeys = collectBackgroundKeys(weekScenes);
      const backgroundIds = (await Promise.all(
        backgroundKeys.map(key => DevGameState.getBackgroundId(key).catch(() => null))
      )).filter(Boolean);
      const characterIds = await collectCharacterAssetIds(weekScenes);
      const assetIds = [...new Set([...backgroundIds, ...characterIds])];

      // total steps: 1 scene-location map fetch + 1 batched asset-metadata
      // fetch + 1 image decode per asset + 1 dialogue-override fetch per
      // scene + 1 sound-catalog fetch
      const total = 1 + 1 + assetIds.length + sceneIds.length + 1;
      let done = 1; // the scene-location map fetch above already happened
      setProgress(done, total);
      try { sessionStorage.setItem(SCENE_LOCATIONS_SESSION_KEY, JSON.stringify(sceneLocationMap)); }
      catch (e) { /* storage full/unavailable — this session just re-fetches per scene */ }

      const assets = assetIds.length ? await AssetDB.getAssetsByIds(assetIds) : [];
      const assetById = new Map(assets.map(a => [a.id, a]));
      done += 1;
      setProgress(done, total);

      // Iterates assetIds (not just the assets that actually resolved) so
      // an id with no matching row (upload deleted, never assigned, etc.)
      // still advances the bar instead of stalling it short of 100%.
      await Promise.all(assetIds.map(async (id) => {
        const asset = assetById.get(id);
        if (asset && asset.dataUrl) await AssetDB.preloadImage(asset.dataUrl);
        done += 1;
        setProgress(done, total);
      }));

      const overridesEntries = await Promise.all(sceneIds.map(async (sceneId) => {
        let map = {};
        try { map = await AssetDB.getDialogueOverrides(sceneId); } catch (e) { /* best-effort */ }
        done += 1;
        setProgress(done, total);
        return [sceneId, map];
      }));
      overridesEntries.forEach(([sceneId, map]) => {
        try { sessionStorage.setItem(OVERRIDES_SESSION_PREFIX + sceneId, JSON.stringify(map)); }
        catch (e) { /* storage full/unavailable — this session just re-fetches per scene */ }
      });

      let sounds = {};
      try { sounds = await AssetDB.getSounds(); } catch (e) { /* best-effort */ }
      done += 1;
      setProgress(done, total);
      try { sessionStorage.setItem(SOUNDS_SESSION_KEY, JSON.stringify(sounds)); } catch (e) { /* ditto */ }

      try { sessionStorage.setItem(READY_SESSION_KEY, weekId); } catch (e) { /* ditto */ }
    } finally {
      hide();
    }
  }

  return { weekIdOf, isReady, ensureWeekLoaded };
})();
