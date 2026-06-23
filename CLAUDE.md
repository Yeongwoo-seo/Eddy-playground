# FrameCad Custom Maker - Design System

## Design Reference
Rankly 앱 디자인 시스템 기반 (모바일 우선, 한국어 UI)

## Color Palette

### Primary Colors
- **Primary Orange**: `#E8741E` (메인 액센트, CTA 버튼, 하이라이트)
- **Primary Orange Hover**: `#D4681A`
- **Primary Orange Light**: `#FFF3EB` (배지 배경, 태그 배경)
- **Primary Orange Gradient**: `linear-gradient(135deg, #E8741E 0%, #F5943A 100%)`

### Neutral Colors
- **White**: `#FFFFFF` (카드 배경, 콘텐츠 영역)
- **Background**: `#F5F5F5` (페이지 배경)
- **Grey 50**: `#FAFAFA`
- **Grey 100**: `#F2F4F6` (구분선 배경, 비활성 영역)
- **Grey 200**: `#E5E8EB`
- **Grey 300**: `#D1D6DB` (테두리, 구분선)
- **Grey 500**: `#8B95A1` (보조 텍스트)
- **Grey 700**: `#4E5968` (부제목)
- **Black**: `#191F28` (본문, 제목)

### Semantic Colors
- **Success Green**: `#1DB847` (영업 중 등 상태 표시)
- **Info Blue**: `#3182F6` (링크, 정보 강조)

## Typography

### Font Family
- `'Pretendard', -apple-system, BlinkMacSystemFont, sans-serif`

### Font Weights
- **ExtraBold (800)**: 페이지 제목, 로고
- **Bold (700)**: 섹션 제목, 버튼 텍스트, 강조 숫자
- **SemiBold (600)**: 서브 제목, 탭, 레이블
- **Medium (500)**: 본문, 설명 텍스트
- **Regular (400)**: 보조 텍스트

### Font Sizes
- **Hero Title**: `28px` (weight: 800)
- **Page Title**: `22px` (weight: 700)
- **Section Title**: `18px` (weight: 700)
- **Body Large**: `16px` (weight: 500)
- **Body**: `14px` (weight: 500)
- **Caption**: `13px` (weight: 500)
- **Small**: `12px` (weight: 400)

### Text Highlight Rule
- 핵심 키워드에 Primary Orange 색상 적용 (예: "찐 맛집", "탐험", "점심 식사")

## Spacing & Layout

### Border Radius
- **Card**: `24px`
- **Button Large**: `16px`
- **Button Small / Tag**: `12px`
- **Input Field**: `14px`
- **Badge / Chip**: `20px`
- **Modal**: `28px`

### Padding
- **Page Horizontal**: `16px`
- **Card Internal**: `20px - 24px`
- **Section Gap**: `20px - 24px`
- **Button Large**: `16px - 18px` (vertical)

### Shadow
- **Card Shadow**: `0 2px 12px rgba(0, 0, 0, 0.06)`
- **Elevated Shadow**: `0 4px 20px rgba(0, 0, 0, 0.08)`
- **Modal Shadow**: `0 8px 32px rgba(0, 0, 0, 0.12)`

## Components

### Buttons
- **Primary (CTA)**: Orange background, white text, 16px radius, full-width
- **Secondary**: Grey-100 background, Grey-700 text, 12px radius
- **Active Tab**: Orange background, white text
- **Inactive Tab**: Grey-100 background, Grey-500 text

### Cards
- White background, 24px border-radius, card shadow
- Internal padding 20-24px

### Input Fields
- 밑줄(underline) 스타일 또는 회색 배경 rounded 스타일
- Focus 시 Primary Orange 밑줄/테두리
- 라벨은 Grey-500 색상, 13px

### Modal
- 28px border-radius
- White background
- 반투명 오버레이: `rgba(0, 0, 0, 0.5)`
- Scale 트랜지션 애니메이션

### Tags / Badges
- Orange Light 배경 + Primary Orange 텍스트
- 20px border-radius
- 12-13px font size, 600 weight

### Bottom Navigation (참고용)
- 5개 탭 구조
- 아이콘 + 텍스트
- 활성: Primary Orange
- 비활성: Grey-500

## Animation & Transition
- **Default transition**: `0.3s cubic-bezier(0.2, 0.8, 0.2, 1)`
- **Modal scale**: `0.9 -> 1.0`
- **Button press**: `opacity 0.8` on active
- **SVG elements**: `0.4s cubic-bezier(0.25, 0.8, 0.25, 1)`

## Mobile-First Responsive
- Max-width: `500px` (center-aligned on desktop)
- Touch-friendly: minimum tap target `44px`
- `-webkit-tap-highlight-color: transparent`
- `user-scalable=no` viewport setting
