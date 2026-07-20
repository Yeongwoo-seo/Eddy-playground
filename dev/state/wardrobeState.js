/* OPERATION MK DEV — 옷장 상태 (The Missing Key v1 §5.5/§14.3).
   Same idiom as caseFileState.js/economyState.js. Depends on shopItems.js
   (catalog, for resolveCharacterAssetKey) being loaded first. */

const WARDROBE_STATE_KEY = 'mkWardrobeState_v1';
const DEFAULT_OUTFIT_ID_WARDROBE = (typeof DEFAULT_OUTFIT_ID !== 'undefined') ? DEFAULT_OUTFIT_ID : 'outfit-default';

function defaultWardrobeState() {
  return {
    unlocked: false,
    ownedOutfitIds: [DEFAULT_OUTFIT_ID_WARDROBE],
    equippedOutfitId: DEFAULT_OUTFIT_ID_WARDROBE,
    // Restored onto equippedOutfitId once a `story_locked` forced-outfit beat
    // ends (spec §5.5 "고정 의상 연출이 끝난 뒤 플레이어가 선택한 코디로 자동
    // 복귀") — see resolveOutfitForScene's outfitMode handling in game/index.html.
    lastEquippedOutfitId: DEFAULT_OUTFIT_ID_WARDROBE,
  };
}

function loadWardrobeState() {
  try {
    const raw = JSON.parse(localStorage.getItem(WARDROBE_STATE_KEY));
    if (!raw || typeof raw !== 'object') return defaultWardrobeState();
    return Object.assign(defaultWardrobeState(), raw, {
      ownedOutfitIds: Array.isArray(raw.ownedOutfitIds) && raw.ownedOutfitIds.length ? raw.ownedOutfitIds : [DEFAULT_OUTFIT_ID_WARDROBE],
    });
  } catch (e) { return defaultWardrobeState(); }
}

let wardrobeState = loadWardrobeState();
function saveWardrobeState() { localStorage.setItem(WARDROBE_STATE_KEY, JSON.stringify(wardrobeState)); }

const WardrobeState = {
  isUnlocked() { return wardrobeState.unlocked; },
  unlockWardrobe() {
    if (wardrobeState.unlocked) return;
    wardrobeState.unlocked = true;
    saveWardrobeState();
  },

  ownOutfit(outfitId) {
    if (wardrobeState.ownedOutfitIds.includes(outfitId)) return false;
    wardrobeState.ownedOutfitIds.push(outfitId);
    saveWardrobeState();
    return true;
  },
  hasOutfit(outfitId) { return wardrobeState.ownedOutfitIds.includes(outfitId); },
  getOwnedOutfitIds() { return wardrobeState.ownedOutfitIds.slice(); },
  getOwnedOutfits() { return wardrobeState.ownedOutfitIds.map(id => shopItems[id]).filter(Boolean); },

  // Changing equipped outfit is only allowed during exploration/normal-story
  // beats (spec §5.5) — enforced by the caller (shop/wardrobe screens check
  // CaseFileState flags like 'interrogationActive'/'minigameActive' before
  // exposing the 착용 action), not here, so debug tools can still force it.
  //
  // Async: DevGameState.setSelectedOutfit is part of the server-backed
  // DevGameState API contract, so this applies the local equip optimistically
  // and rolls it back if that sync fails — callers must await and check the
  // returned `success` before showing an equip-succeeded state.
  // result: { success: true } | { success: false, reason: 'notOwned' | 'syncFailed', error? }
  async equipOutfit(outfitId) {
    if (!wardrobeState.ownedOutfitIds.includes(outfitId)) return { success: false, reason: 'notOwned' };
    const prevEquippedOutfitId = wardrobeState.equippedOutfitId;
    const prevLastEquippedOutfitId = wardrobeState.lastEquippedOutfitId;
    wardrobeState.equippedOutfitId = outfitId;
    wardrobeState.lastEquippedOutfitId = outfitId;
    saveWardrobeState();
    // vnOutfitId items reuse art already uploaded under 지수's VN outfit
    // slots (see shopItems.js) instead of a dedicated characterAssetKey —
    // syncing the same selection every other screen already reads via
    // DevGameState.getCharacterAssetId('jisoo', expression) means dialogue,
    // minigames, and the explore hub all pick up the equipped look with no
    // changes needed there. Only affects story_locked scenes that force a
    // *different* vnOutfitId-based outfit mid-scene — none exist yet (see
    // resolveOutfitForScene below).
    const def = shopItems[outfitId];
    if (def && def.vnOutfitId && typeof DevGameState !== 'undefined') {
      try {
        await DevGameState.setSelectedOutfit('jisoo', def.vnOutfitId);
      } catch (err) {
        wardrobeState.equippedOutfitId = prevEquippedOutfitId;
        wardrobeState.lastEquippedOutfitId = prevLastEquippedOutfitId;
        saveWardrobeState();
        return { success: false, reason: 'syncFailed', error: err };
      }
    }
    return { success: true };
  },
  getEquippedOutfitId() { return wardrobeState.equippedOutfitId; },
  getEquippedOutfit() { return shopItems[wardrobeState.equippedOutfitId] || null; },

  // Story-locked beats swap the display outfit without touching what the
  // player actually has equipped — callers restore via this instead of
  // re-reading equippedOutfitId, since a story-locked scene never wrote it.
  getLastEquippedOutfitId() { return wardrobeState.lastEquippedOutfitId; },

  // Resolves which uploaded-asset characterId a dialogue line's portrait
  // lookup should use, given the line's own characterId and its scene's
  // outfitMode (spec §5.5 outfitMode: 'equipped' | 'story_locked' | 'hidden').
  // Falls back to the base characterId whenever the equipped outfit has no
  // characterAssetKey for this character (i.e. it's not a 지수 outfit) — see
  // game/index.html's applyCharacterForLine for the "no upload yet" fallback,
  // which happens one layer up (AssetDB.getAsset returning null).
  resolveOutfitForScene(characterId, options) {
    const opts = options || {};
    if (opts.outfitMode === 'hidden') return { characterId: null, hidden: true };
    let outfitId;
    if (opts.outfitMode === 'story_locked' && opts.storyOutfitId) outfitId = opts.storyOutfitId;
    else outfitId = wardrobeState.equippedOutfitId;
    const def = shopItems[outfitId];
    if (def && def.characterId === characterId && def.characterAssetKey) {
      return { characterId: def.characterAssetKey, hidden: false, fallbackCharacterId: characterId };
    }
    return { characterId, hidden: false };
  },

  /* ===== 저장/불러오기 연동 (§16) ===== */
  snapshot() { return JSON.parse(JSON.stringify(wardrobeState)); },
  restore(snapshot) {
    wardrobeState = Object.assign(defaultWardrobeState(), snapshot || {}, {
      ownedOutfitIds: Array.isArray(snapshot && snapshot.ownedOutfitIds) && snapshot.ownedOutfitIds.length ? snapshot.ownedOutfitIds : [DEFAULT_OUTFIT_ID_WARDROBE],
    });
    saveWardrobeState();
  },

  /* ===== DEV debug (§24) ===== */
  resetAll() {
    wardrobeState = defaultWardrobeState();
    saveWardrobeState();
  },
  debugOwnAll() {
    wardrobeState.ownedOutfitIds = Array.from(new Set(wardrobeState.ownedOutfitIds.concat(Object.keys(shopItems))));
    saveWardrobeState();
  },
};
