/* OPERATION MK DEV — shared area/hotspot registry for the phone-search
   minigame (week1-scene-002-2). Used by both the gameplay page
   (/dev/minigame-phone/) and its area/hotspot setup page
   (/dev/minigame-phone/setup/) so the two never drift out of sync. */
const PHONE_MINIGAME_ID = 'phone-search';

const PHONE_MINIGAME_AREAS = [
  {
    id: 'bed', label: '침대',
    hotspots: [
      { id: 'bed', label: '침대' },
      { id: 'pillow', label: '베개' },
      { id: 'blanket', label: '이불' },
      { id: 'under-bed', label: '침대 밑' },
      { id: 'behind-bed', label: '침대 뒤' },
      { id: 'bedside-table', label: '협탁' },
    ],
  },
  {
    id: 'living', label: '거실',
    hotspots: [
      { id: 'sofa', label: '소파' },
      { id: 'sofa-cushion', label: '소파 쿠션' },
      { id: 'under-sofa', label: '소파 밑' },
      { id: 'behind-sofa', label: '소파 뒤' },
      { id: 'coffee-table', label: '커피 테이블' },
    ],
  },
  {
    id: 'desk', label: '책상',
    hotspots: [
      { id: 'desk', label: '책상' },
      { id: 'desk-drawer', label: '책상 서랍' },
      { id: 'tv-stand', label: 'TV장' },
      { id: 'charger-area', label: '충전 코너' },
      { id: 'bag', label: '가방' },
    ],
  },
  {
    id: 'entrance', label: '현관',
    hotspots: [
      { id: 'shoe-cabinet', label: '신발장' },
      { id: 'closet', label: '옷장' },
      { id: 'upper-shelf', label: '위쪽 선반' },
      { id: 'luggage', label: '캐리어' },
      { id: 'utility-cabinet', label: '수납장' },
    ],
  },
];

/* ===== Per-minigame area config: background photo + hotspot rectangles =====
   Stored in localStorage, not Supabase — this is just coordinate/reference
   data (which asset id, which normalized rectangle), not the images
   themselves. Rectangles are normalized (0..1 fractions of the photo's
   natural width/height) so one saved region works at any render size.
   A hotspot's rect is always an axis-aligned {x1,y1,x2,y2} box — the setup
   page's 4-point picker feeds it the min/max of whatever 4 corners were
   tapped, it never stores an arbitrary (rotated) quadrilateral. */
const MinigameAreaConfig = {
  _key(minigameId) { return `mkMinigameAreaConfig:${minigameId}`; },

  load(minigameId) {
    try {
      const raw = JSON.parse(localStorage.getItem(this._key(minigameId)));
      return (raw && raw.areas) ? raw : { areas: {} };
    } catch (e) { return { areas: {} }; }
  },

  save(minigameId, config) {
    localStorage.setItem(this._key(minigameId), JSON.stringify(config));
  },

  getArea(minigameId, areaId) {
    const cfg = this.load(minigameId);
    return cfg.areas[areaId] || { backgroundAssetId: null, hotspots: {} };
  },

  setAreaBackground(minigameId, areaId, assetId) {
    const cfg = this.load(minigameId);
    cfg.areas[areaId] = cfg.areas[areaId] || { backgroundAssetId: null, hotspots: {} };
    cfg.areas[areaId].backgroundAssetId = assetId;
    this.save(minigameId, cfg);
  },

  setHotspotRect(minigameId, areaId, hotspotId, rect) {
    const cfg = this.load(minigameId);
    cfg.areas[areaId] = cfg.areas[areaId] || { backgroundAssetId: null, hotspots: {} };
    cfg.areas[areaId].hotspots[hotspotId] = rect;
    this.save(minigameId, cfg);
  },

  clearHotspotRect(minigameId, areaId, hotspotId) {
    const cfg = this.load(minigameId);
    if (cfg.areas[areaId]) {
      delete cfg.areas[areaId].hotspots[hotspotId];
      this.save(minigameId, cfg);
    }
  },
};
