/* OPERATION MK DEV — hardcoded test dialogue for /dev/game.
   Not real game content; used only to validate the VN dialogue UX. */

const dialogueCharacters = [
  { id: 'jisoo', name: '지수' },
  { id: 'youngwoo', name: '영우' }
];

const dialogueTest = [
  {
    id: 'line-001',
    speaker: '지수',
    text: '이 사진, 다시 한번 봐줄래? 이 시간에 여기 있었다는 게 말이 안 되잖아.',
    characterId: 'jisoo'
  },
  {
    id: 'line-002',
    speaker: '영우',
    text: '저도 그렇게 생각했어요. CCTV 기록이랑 시간이 안 맞아요.',
    characterId: 'youngwoo'
  },
  {
    id: 'line-003',
    speaker: '',
    text: '두 사람은 한동안 말없이 사진을 들여다봤다.',
    characterId: null
  },
  {
    id: 'line-004',
    speaker: '지수',
    text: '좋아, 처음부터 다시 정리해보자.',
    characterId: 'jisoo'
  }
];
