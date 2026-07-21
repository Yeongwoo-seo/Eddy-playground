/* MISSING KEY DEV — 탐색 허브 상태 (The Missing Key v1 §7/§14.5).
   Same idiom as caseFileState.js/economyState.js. Depends on
   dev/data/locationDefs.js + dev/data/interactionDefs.js (content) and
   caseFileState.js (CaseFileState — evidence/facts/flags drive unlock and
   "재오픈" conditions) all being loaded first.

   Design note (spec §7.4 핵심 규칙): a topic's state is *computed*, not just
   stored — completedInteractionIds + interactionOverrides (explicit
   setInteractionState calls) combine with each interactionDef's own
   unlockConditions/updatedVariants so that "새 증거 획득 → 이전에 끝난 대화가
   updated로 재오픈" falls out of re-evaluating state, not a special case. */

const EXPLORATION_STATE_KEY = 'mkExplorationState_v1';

function defaultExplorationState() {
  return {
    currentWeek: 2,
    currentPhase: null,
    currentLocationId: null,
    unlockedLocationIds: [],
    visitedLocationIds: [],
    completedInteractionIds: [],
    // Explicit state overrides written by setInteractionState/refreshInteractionsByFact
    // — e.g. forcing 'updated' after a fact is added, or 'in_progress' mid a
    // multi-round testimony. Cleared for an id once the player completes it
    // again (falls back to the computed default for its def).
    interactionOverrides: {},
    // { week, phase, locationId } — what CASE FILE/상점 등을 열었다 닫을 때
    // 돌아갈 자리 (spec §6.2 메뉴 상태 보존). Distinct from currentLocationId
    // so a debug jump can change "current" without disturbing the hub the
    // player actually left from mid-menu.
    lastHubSnapshot: null,
  };
}

function loadExplorationState() {
  try {
    const raw = JSON.parse(localStorage.getItem(EXPLORATION_STATE_KEY));
    if (!raw || typeof raw !== 'object') return defaultExplorationState();
    return Object.assign(defaultExplorationState(), raw, {
      unlockedLocationIds: Array.isArray(raw.unlockedLocationIds) ? raw.unlockedLocationIds : [],
      visitedLocationIds: Array.isArray(raw.visitedLocationIds) ? raw.visitedLocationIds : [],
      completedInteractionIds: Array.isArray(raw.completedInteractionIds) ? raw.completedInteractionIds : [],
      interactionOverrides: Object.assign({}, raw.interactionOverrides || {}),
    });
  } catch (e) { return defaultExplorationState(); }
}

let explorationState = loadExplorationState();
function saveExplorationState() { localStorage.setItem(EXPLORATION_STATE_KEY, JSON.stringify(explorationState)); }

// Shared with shopState.js's evaluator in spirit but kept separate (small,
// self-contained, no cross-file coupling) — covers what interactionDefs.js
// actually authors: hasEvidence/hasFact/flags/flagEquals. Extend here if a
// future interactionDef needs a new condition type.
function evaluateInteractionCondition(cond) {
  if (!cond) return true;
  if (cond.type === 'hasEvidence') return (cond.ids || [cond.id]).every(id => CaseFileState.getEvidence().some(e => e.id === id));
  if (cond.type === 'hasFact') return (cond.ids || [cond.id]).every(id => CaseFileState.getFacts().some(f => f.id === id));
  if (cond.type === 'flags') return (cond.keys || []).every(k => CaseFileState.hasFlag(k));
  if (cond.type === 'flagEquals') return CaseFileState.getFlag(cond.key) === cond.value;
  return true;
}
function evaluateAllConditions(conds) { return !conds || !conds.length || conds.every(evaluateInteractionCondition); }

const ExplorationState = {
  /* ===== 단계/장소 이동 ===== */
  enterExplorationPhase(phaseId, startLocationId) {
    explorationState.currentPhase = phaseId;
    if (startLocationId) {
      this.unlockLocation(startLocationId);
      this.moveToLocation(startLocationId);
    } else {
      saveExplorationState();
    }
  },
  getCurrentPhase() { return explorationState.currentPhase; },
  getCurrentWeek() { return explorationState.currentWeek; },
  setCurrentWeek(week) { explorationState.currentWeek = week; saveExplorationState(); },

  unlockLocation(locationId) {
    if (explorationState.unlockedLocationIds.includes(locationId)) return;
    explorationState.unlockedLocationIds.push(locationId);
    saveExplorationState();
  },
  isLocationUnlocked(locationId) { return explorationState.unlockedLocationIds.includes(locationId); },

  moveToLocation(locationId) {
    explorationState.currentLocationId = locationId;
    this.markLocationVisited(locationId);
    saveExplorationState();
  },
  getCurrentLocationId() { return explorationState.currentLocationId; },

  markLocationVisited(locationId) {
    if (!locationId || explorationState.visitedLocationIds.includes(locationId)) return;
    explorationState.visitedLocationIds.push(locationId);
    saveExplorationState();
  },
  isLocationVisited(locationId) { return explorationState.visitedLocationIds.includes(locationId); },

  // Decorated location info a map screen needs directly (spec §7.2 장소 카드).
  getLocationState(locationId) {
    const def = locationDefs[locationId];
    if (!def) return null;
    const unlocked = this.isLocationUnlocked(locationId) || (def.phases || []).includes(explorationState.currentPhase);
    const newInteractionCount = this.getInteractionsForLocation(locationId).filter(i => ['new', 'updated'].includes(i.state)).length;
    return Object.assign({}, def, {
      unlocked,
      visited: this.isLocationVisited(locationId),
      current: explorationState.currentLocationId === locationId,
      newInteractionCount,
    });
  },
  getAllLocationStates() { return Object.keys(locationDefs).map(id => this.getLocationState(id)); },

  /* ===== 상호작용 상태 =====
     computeInteractionState — spec §7.4's 7-state vocabulary, derived from
     (unlockConditions, completedInteractionIds, updatedVariants) unless an
     explicit override says otherwise. */
  computeInteractionState(id) {
    const def = interactionDefs[id];
    if (!def) return 'locked';
    if (explorationState.interactionOverrides[id]) return explorationState.interactionOverrides[id];
    if (!evaluateAllConditions(def.unlockConditions)) return 'locked';
    const completed = explorationState.completedInteractionIds.includes(id);
    if (!completed) return 'new';
    const activeVariant = (def.updatedVariants || []).find(v => evaluateAllConditions(v.conditions));
    if (activeVariant && !explorationState.completedInteractionIds.includes(id + '::' + activeVariant.dialogueId)) return 'updated';
    return def.type === 'testimony' ? 'resolved' : 'exhausted';
  },
  getInteractionState(id) { return this.computeInteractionState(id); },

  // Explicit override — a scene/interaction handler calls this for states the
  // computed default can't express on its own (e.g. 'in_progress' mid a
  // multi-round testimony). Passing null clears the override and falls back
  // to the computed default again.
  setInteractionState(id, state) {
    if (state === null || state === undefined) delete explorationState.interactionOverrides[id];
    else explorationState.interactionOverrides[id] = state;
    saveExplorationState();
  },

  // Marks an interaction "done for now" — clears any override so future reads
  // fall through to computeInteractionState (which will correctly report
  // 'exhausted', or 'updated' again the moment a relevant fact lands). If the
  // interaction just showed an 'updated' variant, records that specific
  // variant as seen so the same fact doesn't re-trigger 'updated' forever.
  completeInteraction(id) {
    if (!explorationState.completedInteractionIds.includes(id)) explorationState.completedInteractionIds.push(id);
    const def = interactionDefs[id];
    const activeVariant = def && (def.updatedVariants || []).find(v => evaluateAllConditions(v.conditions));
    if (activeVariant) {
      const seenKey = id + '::' + activeVariant.dialogueId;
      if (!explorationState.completedInteractionIds.includes(seenKey)) explorationState.completedInteractionIds.push(seenKey);
    }
    delete explorationState.interactionOverrides[id];
    saveExplorationState();
  },

  // The Missing Key v1 §7.4 핵심 규칙 — "새 증거·사실로 재오픈". Re-evaluates
  // every interaction whose def references this fact/evidence id in an
  // updatedVariant condition; anything that computes to 'updated' as a
  // result gets its override cleared (so the fresh computed 'updated' shows)
  // instead of staying stuck on a stale 'exhausted' override.
  refreshInteractionsByFact(factId) {
    Object.keys(interactionDefs).forEach(id => {
      const def = interactionDefs[id];
      const touchesFact = (def.updatedVariants || []).some(v => (v.conditions || []).some(c => (c.type === 'hasFact') && (c.ids || [c.id]).includes(factId)));
      if (!touchesFact) return;
      if (explorationState.interactionOverrides[id] && this.computeInteractionState(id) !== explorationState.interactionOverrides[id]) {
        delete explorationState.interactionOverrides[id];
      }
    });
    saveExplorationState();
  },

  getInteractionsForLocation(locationId) {
    return Object.values(interactionDefs)
      .filter(def => (def.locationIds || []).includes(locationId) && (!def.phases || !def.phases.length || def.phases.includes(explorationState.currentPhase)))
      .map(def => Object.assign({ state: this.computeInteractionState(def.id) }, def));
  },
  getInteractionsForCharacter(characterId, locationId) {
    return this.getInteractionsForLocation(locationId).filter(i => i.characterId === characterId);
  },

  // Required-investigation gate (spec §10.2/§10.4) — a phaseDef (locationDefs
  // or a small phaseGoals table, see interactionDefs.js) lists requiredFactIds;
  // this just checks how many are in hand so a hub screen can render
  // "필수 조사 목표 n/m" without duplicating the logic per screen.
  checkPhaseCompletion(requiredFactIds) {
    const have = (requiredFactIds || []).filter(id => CaseFileState.getFacts().some(f => f.id === id));
    return { done: have.length, total: (requiredFactIds || []).length, complete: have.length === (requiredFactIds || []).length };
  },

  /* ===== 메뉴 상태 보존 (§6.2) ===== */
  saveHubSnapshot(extra) {
    explorationState.lastHubSnapshot = Object.assign({
      locationId: explorationState.currentLocationId,
      phase: explorationState.currentPhase,
    }, extra);
    saveExplorationState();
  },
  resumeLastHubState() { return explorationState.lastHubSnapshot; },

  /* ===== 저장/불러오기 연동 (§16) ===== */
  snapshot() { return JSON.parse(JSON.stringify(explorationState)); },
  restore(snapshot) {
    explorationState = Object.assign(defaultExplorationState(), snapshot || {}, {
      unlockedLocationIds: Array.isArray(snapshot && snapshot.unlockedLocationIds) ? snapshot.unlockedLocationIds : [],
      visitedLocationIds: Array.isArray(snapshot && snapshot.visitedLocationIds) ? snapshot.visitedLocationIds : [],
      completedInteractionIds: Array.isArray(snapshot && snapshot.completedInteractionIds) ? snapshot.completedInteractionIds : [],
      interactionOverrides: Object.assign({}, (snapshot && snapshot.interactionOverrides) || {}),
    });
    saveExplorationState();
  },

  /* ===== DEV debug (§24) ===== */
  resetAll() {
    explorationState = defaultExplorationState();
    saveExplorationState();
  },
  debugUnlockAllLocations() {
    explorationState.unlockedLocationIds = Object.keys(locationDefs);
    saveExplorationState();
  },
  debugMarkAllInteractionsNew() {
    explorationState.completedInteractionIds = [];
    explorationState.interactionOverrides = {};
    saveExplorationState();
  },
};
